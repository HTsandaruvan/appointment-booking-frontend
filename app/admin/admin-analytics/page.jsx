"use client";

import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { getBookingTrends, getPopularTimeSlots, getUserCounts, getAppointmentInsights } from "@/lib/api"; // Assuming you have a function for additional insights
import { toast } from "react-hot-toast";
import { FaBook, FaCalendarAlt, FaClock, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import useTitle from "@/utils/useTitle";
import useProtectedRoute from "@/lib/protectedRoutes";

// Register Chart.js components
Chart.register(...registerables);

export default function AdminAnalytics() {
    const [bookingTrends, setBookingTrends] = useState([]);
    const [popularTimeSlots, setPopularTimeSlots] = useState([]);
    const [tomorrowDate, setTomorrowDate] = useState("");

    const [additionalInsights, setAdditionalInsights] = useState({
        totalUsers: 0,
        emailVerifiedUsers: 0,
        emailNotVerifiedUsers: 0,
        newUsers: 0,
    });
    const [appointmentInsights, setAppointmentInsights] = useState({
        totalAppointments: 0,
        pendingAppointments: 0,
        paidAppointments: 0,
        canceledAppointments: 0,
        completedAppointments: 0,
        upcomingAppointments: 0,
    });
    const [loading, setLoading] = useState(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        if (token) fetchAnalyticsData();
    }, [token]);

    useEffect(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setTomorrowDate(tomorrow.toLocaleDateString("en-US"));
    }, []);

    useEffect(() => {
        if (token) fetchAppointmentInsights();
    }, [token]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const trendsRes = await getBookingTrends(token);
            const slotsRes = await getPopularTimeSlots(token);
            const insightsRes = await getUserCounts(token);

            setBookingTrends(Array.isArray(trendsRes.data?.data) ? trendsRes.data.data : []);
            setPopularTimeSlots(Array.isArray(slotsRes.data?.data) ? slotsRes.data.data : []);
            setAdditionalInsights({
                totalUsers: insightsRes?.totalUsers || 0,
                verifiedUsers: insightsRes?.emailVerifiedUsers || 0,
                nonVerifiedUsers: insightsRes?.emailNotVerifiedUsers || 0,
                newUsersLast7Days: insightsRes?.newUsers || 0,
            });
        } catch (error) {
            toast.error("Failed to fetch analytics data");
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointmentInsights = async () => {
        try {
            setLoading(true);
            const insights = await getAppointmentInsights(token);
            setAppointmentInsights(insights.data);
        } catch (error) {
            console.error("Error fetching appointment insights:", error);
            toast.error("Failed to fetch appointment insights");
        } finally {
            setLoading(false);
        }
    };

    const bookingTrendsData = {
        labels: bookingTrends.map((trend) =>
            new Date(trend.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        ),
        datasets: [{
            label: "Bookings",
            data: bookingTrends.map((trend) => trend.count),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
        }],
    };

    const popularTimeSlotsData = {
        labels: popularTimeSlots.map((slot) => slot.time_slot),
        datasets: [{
            label: "Bookings",
            data: popularTimeSlots.map((slot) => slot.count),
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
        }],
    };
    useTitle("Admin analytics | Appointment Booking");
    useProtectedRoute(["admin"]);

    return (
        <div className="flex flex-col min-h-screen p-4 sm:p-6">
            <h1 className="text-3xl font-bold text-yellow-400 mb-8">Admin Analytics Dashboard</h1>

            {/* Loading Spinner */}
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6"
                >
                    {/* Booking Trends Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <FaCalendarAlt className="mr-2 text-blue-500" /> Booking Trends
                        </h2>
                        <Line
                            data={bookingTrendsData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: true },
                                },
                                scales: {
                                    x: { title: { display: true, text: "Date" } },
                                    y: { title: { display: true, text: "Number of Bookings" } },
                                },
                            }}
                        />
                    </div>

                    {/* Popular Time Slots Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <FaClock className="mr-2 text-purple-500" /> Popular Time Slots
                        </h2>
                        <Bar
                            data={popularTimeSlotsData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: true },
                                },
                                scales: {
                                    x: { title: { display: true, text: "Time Slot" } },
                                    y: { title: { display: true, text: "Number of Bookings" } },
                                },
                            }}
                        />
                    </div>

                    {/* User Insights */}
                    <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2 xl:col-span-3">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <FaUsers className="mr-2 text-green-500" /> User Insights
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-blue-600">{additionalInsights.totalUsers}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-gray-600">Verified Users</p>
                                <p className="text-2xl font-bold text-green-600">{additionalInsights.verifiedUsers}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-gray-600">Unverified Users</p>
                                <p className="text-2xl font-bold text-purple-600">{additionalInsights.nonVerifiedUsers}</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <p className="text-gray-600">New Users (Last 7 Days)</p>
                                <p className="text-2xl font-bold text-yellow-600">{additionalInsights.newUsersLast7Days}</p>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Insights */}
                    <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2 xl:col-span-3">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <FaBook className="mr-2 text-green-500" /> Appointment Insights
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-yellow-50 p-4 rounded-lg border-4 border-yellow-500 animate-pulse">
                                <p className="text-gray-600">Upcomming Tomorrow ({tomorrowDate})</p>
                                <p className="text-2xl font-bold text-yellow-600">{appointmentInsights.upcomingAppointments}</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-blue-600">{appointmentInsights.totalAppointments}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-green-600">{appointmentInsights.pendingAppointments}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-gray-600">Paid</p>
                                <p className="text-2xl font-bold text-purple-600">{appointmentInsights.paidAppointments}</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <p className="text-gray-600">Canceled</p>
                                <p className="text-2xl font-bold text-red-600">{appointmentInsights.canceledAppointments}</p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <p className="text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-orange-600">{appointmentInsights.completedAppointments}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
