"use client";
import { useState } from "react";
import AdminSidebar from "../components/SidePanel";
import { IoMenu, IoClose } from "react-icons/io5"; // Import icons
import useTitle from "@/utils/useTitle";
import useProtectedRoute from "@/lib/protectedRoutes";

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Function to close sidebar when clicking outside
    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };
    useTitle("Admin Dashboard | Appointment Booking");
    useProtectedRoute["admin"];


    return (
        <div className="flex h-screen mt-8  bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20">
            {/* Move Hamburger Icon to Bottom of Header */}
            <button
                className="sm:hidden   p-3  bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 fixed bottom-5 left-5 z-50"
                onClick={() => setIsSidebarOpen(true)}
            >
                <IoMenu size={28} />
            </button>


            {/* Sidebar + Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
                    onClick={handleCloseSidebar} // Click outside to close
                ></div>
            )}

            {/* Sidebar with Slide Effect */}
            <div
                className={` fixed top-0 left-0 h-full w-64  bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 transition-transform transform z-40 
                ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"} sm:relative sm:translate-x-0 sm:opacity-100`}
            >
                {/* Close Button Inside Sidebar */}
                <button
                    className="sm:hidden absolute top-5 right-5 text-gray-600"
                    onClick={handleCloseSidebar}
                >
                    <IoClose size={28} />
                </button>

                {/* Sidebar Content */}
                <AdminSidebar onLinkClick={handleCloseSidebar} />
            </div>

            {/* Content Section with Hidden Scrollbar */}
            <div className="flex-1 p-6  overflow-auto hide-scrollbar">
                {children}
            </div>


        </div>

    );
}
