"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/utils/auth";
import useTitle from "@/utils/useTitle";
import useProtectedRoute from "@/lib/protectedRoutes";


const AdminPage = () => {
    const router = useRouter();
    const [role, setRole] = useState("");

    useEffect(() => {
        const auth = checkAuth(router);
        if (auth) {
            if (auth.role !== "admin") {
                router.push("/");
            } else {
                setRole(auth.role);
            }
        }
    }, [router]);
    useTitle("Admin Dashboard | Appointment Booking");
    useProtectedRoute["admin"];

    return (
        <div className="p-6 min-h-screen ">
            <div className="max-w-4xl mx-auto  ">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Admin Dashboard</h1>

                {role === "admin" ? (
                    <div className="space-y-6">
                        <p className="text-lg text-gray-600">Welcome back, Admin! You have full access to manage users and appointments.</p>

                        <section className="bg-blue-100 p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
                            <p className="text-gray-700 mt-2">Here you can view and manage all registered users. You can update user roles, deactivate accounts, or view user activity.</p>
                            <button
                                onClick={() => router.push("/admin/user-management")}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                            >
                                Manage Users
                            </button>
                        </section>

                        <section className="bg-green-100 p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800">Appointments</h2>
                            <p className="text-gray-700 mt-2">Manage all appointments, confirm or reschedule requests, and keep track of appointments for users.</p>
                            <button
                                onClick={() => router.push("/admin/appointment-management")}
                                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
                            >
                                Manage Appointments
                            </button>
                        </section>

                        <section className="bg-yellow-100 p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800">System Analytics</h2>
                            <p className="text-gray-700 mt-2">Configure system analytics, User, appointments and slots analyzing.</p>
                            <button
                                onClick={() => router.push("/admin/admin-analytics")}
                                className="mt-4 px-6 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition duration-300"
                            >
                                System Analytics
                            </button>
                        </section>
                    </div>
                ) : (
                    <div className="flex justify-center items-center">
                        <p className="text-xl font-semibold text-red-600">Access Denied: You are not authorized to view this page.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
