"use client";
import { useState, useEffect } from "react";
import { getAppointments, cancelAppointment } from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { IoArrowBack, IoCalendarClearOutline, IoTrashOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelId, setCancelId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedDate, setSelectedDate] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    const router = useRouter();
    const user_id = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

    useEffect(() => {
        if (user_id) fetchAppointments();
    }, [user_id, page, selectedDate, activeTab]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await getAppointments(user_id);
            let allAppointments = res.data.appointments || [];

            // Date Filtering
            if (selectedDate) {
                allAppointments = allAppointments.filter((appt) => {
                    const apptDate = new Date(appt.date).toLocaleDateString("en-CA");
                    return apptDate === selectedDate;
                });
            }

            // Filter for Upcoming or Old appointments based on the active tab
            const currentDate = new Date();
            if (activeTab === "Upcoming") {
                allAppointments = allAppointments.filter((appt) => new Date(appt.date) >= currentDate);
            } else if (activeTab === "Old") {
                allAppointments = allAppointments.filter((appt) => new Date(appt.date) < currentDate);
            }

            // Status Filtering Based on Active Tab
            if (activeTab !== "All" && activeTab !== "Upcoming" && activeTab !== "Old") {
                allAppointments = allAppointments.filter((appt) => appt.status === activeTab);
            }

            // Sort appointments from new to past (most recent first)
            allAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Pagination Logic
            const perPage = 5;
            setTotalPages(Math.ceil(allAppointments.length / perPage));

            const paginatedData = allAppointments.slice((page - 1) * perPage, page * perPage);
            setAppointments(paginatedData);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!cancelId) return;
        try {
            setLoading(true);
            await cancelAppointment(cancelId);
            setLoading(false)
            toast.success("Appointment canceled successfully!");
            setCancelId(null);
            fetchAppointments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error canceling appointment");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 ">
            {/* Back to Appointment Button */}
            <button
                onClick={() => router.push("/booking")}
                className="flex items-center w-full sm:w-auto mb-4 px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md shadow-sm transition"
            >
                <IoArrowBack className="mr-2 text-lg sm:text-xl" /> Book a Appointment
            </button>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-2xl"
            >
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center">
                    My Appointments
                </h2>

                {/* Tabs for Filtering */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {["All", "Paid", "Pending", "Completed", "Canceled", "Upcoming", "Old"].map((status) => (
                        <button
                            key={status}
                            onClick={() => {
                                setActiveTab(status);
                                setPage(1);
                            }}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition  ${activeTab === status
                                ? "bg-purple-600 text-white"
                                : status === "Upcoming"
                                    ? "bg-yellow-400 text-gray-800 hover:bg-yellow-500 animate-pulse" // Custom style for "Upcoming"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>


                {/* Date Filter */}
                <div className="flex flex-col sm:flex-row items-center w-full gap-2 mb-4">
                    <div className="flex items-center w-full">
                        <IoCalendarClearOutline className="text-gray-500 text-lg sm:text-xl mr-2" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border px-3 py-2 rounded-md text-gray-700 w-full"
                        />
                    </div>
                    {selectedDate && (
                        <button
                            onClick={() => setSelectedDate("")}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 w-full sm:w-auto"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Loading Spinner */}
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
                                className="text-gray-600 flex flex-col sm:flex-row justify-between items-center p-4 border rounded-lg bg-gray-100"
                            >
                                <div className="text-center sm:text-left">
                                    <p className="text-lg font-medium">
                                        {new Date(appointment.date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                    <p className="text-gray-600">{appointment.time_slot || "Time not available"}</p>
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

                                {/* Cancel Button */}
                                {(appointment.status === "Pending" || appointment.status === "Paid") && (
                                    <button
                                        onClick={() => setCancelId(appointment.id)}
                                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                    >
                                        <IoTrashOutline className="text-lg" />
                                        <span>Cancel</span>
                                    </button>
                                )}
                            </motion.div>
                        ))}

                        {cancelId && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
                                <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
                                    <h3 className="text-lg text-gray-700 sm:text-xl font-semibold">Confirm Cancellation</h3>
                                    <p className="text-gray-800 mt-2">Are you sure you want to cancel this appointment?</p>
                                    <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-2 sm:space-y-0">
                                        <button
                                            onClick={() => {
                                                handleCancel();
                                            }}
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
            </motion.div>
        </div>
    );
}
