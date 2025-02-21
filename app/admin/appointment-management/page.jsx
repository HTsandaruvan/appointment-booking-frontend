"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllAppointments, cancelAppointmentAdmin, updateAppointmentStatus } from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { IoCalendarClearOutline, IoSearch, IoTrashOutline, IoCheckmarkCircleOutline, IoArrowBack } from "react-icons/io5";
import useTitle from "@/utils/useTitle";
import useProtectedRoute from "@/lib/protectedRoutes";

export default function AdminAppointmentManagement() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: "All", email: "", name: "", date: "" });
    const [cancelId, setCancelId] = useState(null);
    const [updateId, setUpdateId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("Pending");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState("upcoming"); // State to manage active tab
    const router = useRouter();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        if (token) fetchAppointments();
    }, [token, filters, page, activeTab]); // Add activeTab to dependency

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await getAllAppointments(filters, token);
            const allAppointments = res.data.appointments || [];

            // Filter appointments based on selected tab (upcoming or old)
            const now = new Date();
            const filteredAppointments = activeTab === "upcoming"
                ? allAppointments.filter((appointment) => new Date(appointment.date) > now)
                : allAppointments.filter((appointment) => new Date(appointment.date) <= now);
            filteredAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Pagination Logic
            const perPage = 5;
            setTotalPages(Math.ceil(filteredAppointments.length / perPage));

            const paginatedData = filteredAppointments.slice((page - 1) * perPage, page * perPage);
            setAppointments(paginatedData);
        } catch (error) {
            toast.error("Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!cancelId) return;
        try {
            await cancelAppointmentAdmin(cancelId, token);
            toast.success("Appointment canceled successfully!");
            setCancelId(null);
            fetchAppointments();
        } catch (error) {
            toast.error("Error canceling appointment");
        }
    };

    const handleStatusUpdate = async () => {
        if (!updateId) return;
        try {
            await updateAppointmentStatus(updateId, selectedStatus, token);
            toast.success("Appointment status updated successfully!");
            setUpdateId(null);
            fetchAppointments();
        } catch (error) {
            toast.error("Error updating appointment status");
        }
    };

    const resetFilters = () => {
        setFilters({ status: "All", email: "", name: "", date: "" });
        setPage(1);
    };

    useTitle("Appointment Management | Appointment Booking");
    useProtectedRoute(["admin"]);

    return (
        <div className="flex flex-col items-center min-h-screen p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sm:p-6 w-full max-w-4xl"
            >
                <h1 className="text-3xl font-bold text-yellow-400 mb-8">Appointment Management</h1>

                {/* Tabs */}
                <div className="flex flex-col sm:flex-row justify-center mb-6">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`px-4 py-2 text-lg font-semibold ${activeTab === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"} sm:rounded-l-md sm:rounded-r-none rounded-t-md sm:w-auto w-full`}
                    >
                        Upcoming Appointments
                    </button>
                    <button
                        onClick={() => setActiveTab("old")}
                        className={`px-[44px] py-2 text-lg font-semibold ${activeTab === "old" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"} sm:rounded-r-md sm:rounded-l-none rounded-b-md sm:w-auto w-full`}
                    >
                        Old Appointments
                    </button>
                </div>


                {/* Filter Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="p-2 border rounded-md text-gray-500"
                    >
                        {["All", "Pending", "Paid", "Completed", "Canceled"].map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Filter by email"
                        value={filters.email}
                        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                        className="p-2 border rounded-md text-gray-500"
                    />
                    <input
                        type="text"
                        placeholder="Filter by name"
                        value={filters.name}
                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                        className="p-2 border rounded-md text-gray-500"
                    />
                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        className="p-2 border rounded-md text-gray-500"
                    />
                </div>

                {/* Reset Filters Button */}
                <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-blue-400 text-gray-700 rounded-md hover:bg-gray-300 mb-6"
                >
                    Reset Filters
                </button>

                {/* Appointment List */}
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
                    </div>
                ) : appointments.length > 0 ? (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <motion.div
                                key={appointment.id}
                                whileHover={{ scale: 1.02 }}
                                className="p-4 border rounded-lg bg-gray-100"
                            >
                                <div className="flex flex-col md:flex-row lg:flex-row sm:flex-col justify-between items-center">
                                    <div className="text-center sm:text-left">
                                        <p className="sm:text-lg text-sm font-bold text-gray-500">{appointment.name}</p>
                                        <p className="text-gray-600 sm:text-lg text-xs ">{appointment.email}</p>
                                        <p className="text-gray-600">{new Date(appointment.date).toLocaleDateString()}</p>
                                        <p className="text-gray-600">{appointment.time_slot}</p>
                                        <span
                                            className={`px-3 py-1 text-sm font-medium rounded-md mt-1 inline-block ${appointment.status === "Pending"
                                                ? "bg-yellow-500 text-white"
                                                : appointment.status === "Paid"
                                                    ? "bg-green-500 text-white"
                                                    : appointment.status === "Completed"
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-red-500 text-white"
                                                }`}
                                        >
                                            {appointment.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 mt-2 sm:mt-0 ">
                                        {(appointment.status !== "Canceled" && appointment.status !== "Completed") && (
                                            <>
                                                <button
                                                    onClick={() => setUpdateId(appointment.id)}
                                                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                >
                                                    <IoCheckmarkCircleOutline />
                                                </button>

                                                <button
                                                    onClick={() => setCancelId(appointment.id)}
                                                    className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                                >
                                                    <IoTrashOutline />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Pagination */}
                        <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
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
                    </div>
                ) : (
                    <p className="text-center text-red-500">No appointments found.</p>
                )}

                {/* Cancel Confirmation Modal */}
                {cancelId && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
                            <h3 className="text-lg text-gray-700 sm:text-xl font-semibold">Confirm Cancellation</h3>
                            <p className="text-gray-800 mt-2">Are you sure you want to cancel this appointment?</p>
                            <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-2 sm:space-y-0">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md w-full sm:w-auto"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => setCancelId(null)}
                                    className="px-4 py-2 bg-gray-400 rounded-md w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Update Status Modal */}
                {updateId && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
                            <h3 className="text-lg text-gray-700 sm:text-xl font-semibold">Update Status</h3>

                            {/* Find the appointment with the matching updateId */}
                            {appointments.length > 0 &&
                                appointments.map((appointment) => {
                                    if (appointment.id === updateId) {
                                        return (
                                            <div key={appointment.id}>
                                                {/* Conditionally render the dropdown options based on current appointment status */}
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                    className="p-2 border rounded-md mt-2 w-full text-gray-500"
                                                >
                                                    {appointment.status === "Paid" ? (
                                                        <>
                                                            <option value="Paid">Paid</option>
                                                            <option value="Completed">Completed</option>
                                                        </>
                                                    ) : appointment.status === "Pending" ? (
                                                        <>
                                                            <option value="Pending">Pending</option>
                                                            <option value="Paid">Paid</option>
                                                        </>
                                                    ) : (
                                                        // Fallback if no match
                                                        <>
                                                            <option value="Pending">Pending</option>
                                                            <option value="Paid">Paid</option>
                                                            <option value="Completed">Completed</option>
                                                        </>
                                                    )}
                                                </select>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}

                            <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-2 sm:space-y-0">
                                <button
                                    onClick={handleStatusUpdate}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => setUpdateId(null)}
                                    className="px-4 py-2 bg-gray-400 rounded-md w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
