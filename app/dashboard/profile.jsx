"use client";
import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FiEdit } from "react-icons/fi";

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const user_id = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
    const router = useRouter();

    useEffect(() => {
        if (user_id) {
            fetchUserProfile();
        }
    }, [user_id]);

    const fetchUserProfile = async () => {
        try {
            const res = await getUserProfile(user_id);
            setUser(res.data.user);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", user.name);
        formData.append("address", user.address);
        formData.append("telephone", user.telephone);
        if (file) formData.append("profile_picture", file);

        try {
            await updateUserProfile(user_id, formData);
            toast.success("Profile updated successfully!");
            fetchUserProfile();
            setEditing(false);
        } catch (error) {
            toast.error("Error updating profile.");
        }
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <div className="">
            {editing ? (
                <form onSubmit={handleSubmit} className="mt-4 space-y-5">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Edit Profile</h2>

                    {/* Profile Picture */}
                    <div className="flex flex-col items-center">
                        <img
                            src={file ? URL.createObjectURL(file) : user.profile_picture ? `http://localhost:5000${user.profile_picture}` : "https://github.com/shadcn.png"}
                            alt="Profile"
                            className="w-32 h-32 rounded-full shadow-md border-2 border-gray-300"
                        />
                        <input type="file" onChange={handleFileChange} accept="image/*" className="mt-3 text-sm text-gray-500" />
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-gray-700 font-medium">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name || ""}
                            onChange={handleInputChange}
                            className="w-full text-gray-500 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-gray-700 font-medium">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={user.address || ""}
                            onChange={handleInputChange}
                            className="w-full text-gray-500 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Telephone */}
                    <div>
                        <label className="block text-gray-700 font-medium">Telephone</label>
                        <input
                            type="tel"
                            name="telephone"
                            value={user.telephone || ""}
                            onChange={handleInputChange}
                            className="text-gray-500 w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                            Save Changes
                        </button>
                        <button type="button" onClick={() => setEditing(false)} className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="relative">
                        <h2 className="text-2xl font-bold text-gray-800"></h2>

                        <button
                            onClick={() => setEditing(true)}
                            className="absolute top-0 right-0 bg-blue-100 hover:bg-blue-300 p-2 rounded-full transition"
                            title="Edit Profile"
                        >
                            <FiEdit className="text-blue-500 text-xl" />
                        </button>

                        <div className="flex flex-col items-center mt-6">
                            <img
                                src={user?.profile_picture ? `http://localhost:5000${user.profile_picture}` : "https://github.com/shadcn.png"}
                                alt="Profile"
                                className="w-32 h-32 rounded-full shadow-md border-2 border-gray-300"
                            />
                            <p className="text-lg font-semibold mt-3 text-gray-800">{user?.name || "Not Available"}</p>
                            <p className="text-gray-600">{user?.email || "Not Available"}</p>
                        </div>

                        <div className="mt-4 text-center text-gray-600">
                            <p><strong>Address:</strong> {user?.address || "Not Provided"}</p>
                            <p><strong>Telephone:</strong> {user?.telephone || "Not Provided"}</p>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}
