"use client"

import React from "react";
import AppointmentsPage from "./appoinment";
import UserProfile from "./profile";
import useTitle from "@/utils/useTitle";

const Dashboard = () => {
    useTitle("Profile | Appointment Booking");

    return (
        <div className="container mx-auto mt-12 px-4">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">User Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* User Profile Section */}
                <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 mx-4 sm:mx-2 lg:mx-72 md:mx-32">
                    <UserProfile />
                </div>

                {/* Appointments Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 p-6 hover:shadow-xl transition duration-300">
                    <AppointmentsPage />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
