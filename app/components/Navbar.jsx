"use client";  // Ensure client-side execution

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";  // Import AuthContext

const Navbar = () => {
    const { role, updateRole } = useAuth();  // Get role and update function
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleLogout = () => {
        updateRole(null); // Update global state
        localStorage.removeItem("token");
        router.push("/auth/login");
    };

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-blue-500 shadow-lg" : "bg-transparent"} backdrop-blur-lg text-white px-6 py-4 flex justify-between items-center`}>
            <Link href="/" className="text-2xl font-bold tracking-wide">
                Booking<span className="text-yellow-400">App</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6 items-center">
                {role === "user" && (
                    <>
                        <NavLink href="/booking" label="Book Appointment" />
                        <NavLink href="/dashboard" label="Profile" />
                        <NavLink href="/dashboard" label="My Appointments" />
                    </>
                )}
                {role === "admin" && (
                    <>
                        <NavLink href="/admin" label="Dashboard" />

                    </>
                )}
                {role ? (
                    <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-full hover:bg-red-700 transition">
                        Logout
                    </button>
                ) : (
                    <Link href="/auth/login" className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-gray-200 transition">
                        Login
                    </Link>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="md:hidden focus:outline-none">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>

            {/* Mobile Menu */}
            <div className={`absolute top-16 left-0 w-full backdrop-blur-xl bg-blue-500/90 text-white transition-all duration-300 ${menuOpen ? "h-auto py-4 opacity-100" : "h-0 opacity-0 overflow-hidden"}`}>
                <div className="flex flex-col gap-3 px-6 items-center">
                    {role === "user" && (
                        <>
                            <NavLink href="/booking" label="Book Appointment" />
                            <NavLink href="/dashboard" label="Profile" />
                            <NavLink href="/dashboard" label="My Appointments" />
                        </>
                    )}
                    {role === "admin" && (
                        <>
                            <NavLink href="/admin" label="Dashboard" />

                        </>
                    )}
                    {role ? (
                        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-700">
                            Logout
                        </button>
                    ) : (
                        <Link href="/auth/login" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

// 🏷 Custom Link Component
const NavLink = ({ href, label }) => {
    const router = useRouter();
    return (
        <Link href={href} className={`hover:text-yellow-400 transition ${router.pathname === href ? "text-yellow-400 font-semibold" : "text-white"}`}>
            {label}
        </Link>
    );
};

export default Navbar;
