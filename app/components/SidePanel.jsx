"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBook, FaClock, FaUserCog, FaUserShield } from "react-icons/fa";

export default function AdminSidebar({ onLinkClick }) {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-full p-6">
            <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
            <nav>
                <ul>
                    <li className={`mb-2 ${pathname === "/admin/user-management" ? "font-bold text-yellow-400" : ""}`}>
                        <Link className="flex items-center gap-2" href="/admin/user-management" onClick={onLinkClick}>
                            <FaUserCog className="text-cyan-300" /> User Management
                        </Link>
                    </li>
                    <li className={`mb-2 ${pathname === "/admin/appointment-management" ? "font-bold text-yellow-400" : ""}`}>
                        <Link className="flex items-center gap-2" href="/admin/appointment-management" onClick={onLinkClick}>
                            <FaBook className="text-orange-300" /> Appointment Management
                        </Link>
                    </li>
                    <li className={`mb-2 ${pathname === "/admin/slot-management" ? "font-bold text-yellow-400" : ""}`}>
                        <Link className="flex items-center gap-2" href="/admin/slot-management" onClick={onLinkClick}>
                            <FaClock className="text-lime-300" /> Slot Management
                        </Link>
                    </li>
                    <li className={`mb-2 ${pathname === "/admin/admin-analytics" ? "font-bold text-yellow-400" : ""}`}>
                        <Link className="flex items-center gap-2" href="/admin/admin-analytics" onClick={onLinkClick}>
                            <FaUserShield className="text-sky-300" /> Admin Analytics
                        </Link>
                    </li>

                </ul>
            </nav>
        </aside>
    );
}
