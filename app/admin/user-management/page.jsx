"use client";

import { useEffect, useState } from "react";
import {
    getAllUsers,
    addUser,
    updateUser,
    updateUserRole,
    activeUser
} from "@/lib/api";
import toast from "react-hot-toast";
import { FaEdit, FaPen, FaTrash } from "react-icons/fa";

import { motion } from "framer-motion";
import useTitle from "@/utils/useTitle";
import useProtectedRoute from "@/lib/protectedRoutes";
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [token, setToken] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        role: "user",
        password: "",
        email_verified: 0,
        active: 0
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const perPage = 8;

    useEffect(() => {
        if (typeof window !== "undefined") setToken(localStorage.getItem("token"));
    }, []);

    useEffect(() => {
        if (token) fetchUsers();
    }, [token]);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, activeTab, page]);

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers(token);
            setUsers(res.data);
        } catch (err) {
            toast.error("Failed to fetch users");
        }
    };

    const filterUsers = () => {
        let filtered = users;

        // Filter by search term (name or email)
        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by active status (Active, Inactive)
        if (activeTab === "Active") {
            filtered = filtered.filter((user) => user.active === 1);
        } else if (activeTab === "Inactive") {
            filtered = filtered.filter((user) => user.active === 0);
        }

        // Filter by verification status (Verified, Not Verified)
        if (activeTab === "Verified") {
            filtered = filtered.filter((user) => user.email_verified === 1);
        } else if (activeTab === "Not Verified") {
            filtered = filtered.filter((user) => user.email_verified === 0);
        }

        // Filter by role (if activeTab is a role)
        if (activeTab !== "All" && activeTab !== "Verified" && activeTab !== "Not Verified" && activeTab !== "Active" && activeTab !== "Inactive") {
            filtered = filtered.filter((user) => user.role.toLowerCase() === activeTab.toLowerCase());
        }

        // Pagination
        setTotalPages(Math.ceil(filtered.length / perPage));
        const paginatedData = filtered.slice((page - 1) * perPage, page * perPage);
        setFilteredUsers(paginatedData);
    };


    const validateForm = () => {
        const { name, email, password } = userData;
        if (!name || !email) {
            toast.error("Please fill in all required fields");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Invalid email format");
            return false;
        }
        if (!editUser && (!password || password.length < 6)) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        const existingUser = users.find(
            (user) => user.email === email && user.id !== editUser?.id
        );
        if (existingUser) {
            toast.error("A user with this email already exists");
            return false;
        }
        return true;
    };

    const handleAddEditUser = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            if (editUser) {
                await updateUser(editUser.id, userData, token);
                toast.success("User updated successfully");
            } else {
                await addUser(userData, token);
                toast.success("User added successfully");
            }
            fetchUsers();
            closeModal();
        } catch {
            toast.error("Failed to save user");
        } finally {
            setLoading(false);
        }
    };

    // const handleDelete = async (id, name, email) => {
    //     toast(
    //         (t) => (
    //             <div>
    //                 <p className="text-sm">
    //                     Are you sure you want to delete <strong>{name}</strong> (<em>{email}</em>)?
    //                 </p>
    //                 <div className="mt-2 flex justify-end gap-2">
    //                     <button
    //                         className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
    //                         onClick={async () => {
    //                             toast.dismiss(t.id);
    //                             try {
    //                                 await deleteUser(id, token);
    //                                 setUsers((prevUsers) =>
    //                                     prevUsers.filter((user) => user.id !== id)
    //                                 );
    //                                 toast.success(
    //                                     `User ${name} (${email}) deleted successfully!`
    //                                 );
    //                             } catch (error) {
    //                                 toast.error("Error deleting user.");
    //                                 console.error("Error deleting user:", error);
    //                             }
    //                         }}
    //                     >
    //                         ✅ Yes, Delete
    //                     </button>
    //                     <button
    //                         className="bg-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-400"
    //                         onClick={() => toast.dismiss(t.id)}
    //                     >
    //                         ❌ Cancel
    //                     </button>
    //                 </div>
    //             </div>
    //         ),
    //         { duration: 7000 }
    //     );
    // };

    const handleRoleChange = async (id, role) => {
        try {
            await updateUserRole(id, role, token);
            toast.success("User role updated");
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === id ? { ...user, role } : user))
            );
        } catch {
            toast.error("Failed to update role");
        }
    };
    const updateUserState = async (id, active) => {
        try {
            // Update active status in the backend
            await activeUser(id, active, token);

            // Update local state to reflect the change immediately
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === id ? { ...user, active: active } : user
                )
            );

            // Show a success toast
            toast.success("User active status updated successfully!");

            // Call filter function to ensure filtered data is in sync with updated user data
            filterUsers();
        } catch (err) {
            // Log the error for debugging
            console.error("Error updating active status:", err);
            toast.error("Failed to update active status");
        }
    };
    useTitle("User Management | Appointment Booking");
    useProtectedRoute(["admin"]);

    const openModal = (user = null) => {
        setEditUser(user);
        setUserData(
            user
                ? { name: user.name, email: user.email, role: user.role, email_verified: user.email_verified }
                : { name: "", email: "", password: "", role: "user", email_verified: 0 }
        );
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditUser(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-yellow-400 mb-8">User Management</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-4 py-2 ml-3 rounded hover:bg-blue-700"
                >
                    + Add User
                </button>
            </div>

            {/* Search and Tabs */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-1/2 p-2 border rounded"
                />
                <div className="flex gap-2">
                    {["All", "Admin", "User", "Verified", "Not Verified", "Active", "Inactive"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setPage(1);
                            }}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === tab
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* User Table */}
            <table className=" border-collapse rounded-lg shadow-lg overflow-hidden bg-white/15">
                <thead>
                    <tr className="bg-sky-500/35 text-white text-sm uppercase tracking-wider">
                        <th className="py-3 px-6 text-left ">Name</th>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-left">Role</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                        <th className="py-3 px-6 text-center">Status</th>
                        <th className="py-3 px-6 text-center">email verified</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                            <tr
                                key={user.id}
                                className={`border-t ${index % 2 === 0 ? "bg-white/90" : "bg-gray-50/90"
                                    } hover:bg-gray-100 transition-colors duration-200`}
                            >
                                <td className="py-3 px-6 text-gray-800 font-medium" >{user.name}</td>
                                <td className="py-3 px-6 text-gray-600">{user.email}</td>
                                <td className="py-3 px-6">
                                    <select
                                        value={user.role}
                                        onChange={(e) =>
                                            handleRoleChange(user.id, e.target.value)
                                        }
                                        className="border text-gray-500 border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="py-3 px-6 flex justify-center gap-3">
                                    <button
                                        onClick={() => openModal(user)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition duration-150 ease-in-out shadow-md hover:shadow-lg"
                                        title="Edit user Detail"
                                    >
                                        <FaPen />
                                    </button>
                                    {/* <button
                                        onClick={() =>
                                            handleDelete(user.id, user.name, user.email)
                                        }
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition duration-150 ease-in-out shadow-md hover:shadow-lg"
                                        title="Delete user Detail">
                                        <FaTrash />
                                    </button> */}
                                </td>
                                <td className="py-3 px-6">
                                    <select
                                        value={user.active ? 1 : 0}
                                        onChange={(e) => updateUserState(user.id, e.target.value === '1' ? 1 : 0)} // Correct conversion of value
                                        className="border text-gray-500 border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    >
                                        <option value={1}>Active</option>
                                        <option value={0}>Inactive</option>
                                    </select>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    {user.email_verified === 0 ? (
                                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-800 bg-yellow-200 rounded-full">
                                            Not Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full">
                                            Verified
                                        </span>
                                    )}
                                </td>


                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-8 text-gray-500">
                                🚫 No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center gap-3 mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className={`px-4 py-2 rounded-md ${page === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    Previous
                </button>
                <span className="text-gray-600 font-semibold">Page {page} of {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className={`px-4 py-2 rounded-md ${page === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    Next
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl text-gray-500 font-semibold mb-4">
                            {editUser ? "Edit User" : "Add New User"}
                        </h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={userData.name}
                            onChange={(e) =>
                                setUserData({ ...userData, name: e.target.value })
                            }
                            className="w-full p-2 mb-3 border rounded text-gray-400"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={userData.email}
                            onChange={(e) =>
                                setUserData({ ...userData, email: e.target.value })
                            }
                            className="w-full p-2 mb-3 border  text-gray-400 rounded"
                        />
                        {!editUser && (
                            <input
                                type="password"
                                placeholder="Password"
                                value={userData.password}
                                onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full p-2 mb-3 border rounded  text-gray-400"
                            />
                        )}
                        <select
                            value={userData.role}
                            onChange={(e) =>
                                setUserData({ ...userData, role: e.target.value })
                            }
                            className="w-full p-2 mb-4 border rounded  text-gray-400"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeModal}
                                className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddEditUser}
                                disabled={loading}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                            >
                                {loading
                                    ? editUser
                                        ? "Updating..."
                                        : "Adding..."
                                    : editUser
                                        ? "Update"
                                        : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default UserManagement;