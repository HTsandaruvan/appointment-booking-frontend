"use client";
import { useEffect, useState } from "react";
import { getDefaultSlots, addDefaultSlot, deleteDefaultSlot, addSpecificSlot, activeSlot } from "@/lib/api";
import { toast } from "react-hot-toast";
import { FaPlus, FaTrash, FaSpinner } from "react-icons/fa"; // Icons for better UI
import { motion } from "framer-motion";
import useTitle from "@/utils/useTitle";
import useProtectedRoute from "@/lib/protectedRoutes";
export default function SlotManagementPage() {
    const [defaultSlots, setDefaultSlots] = useState([]);
    const [newSlot, setNewSlot] = useState("");
    const [specificDate, setSpecificDate] = useState("");
    const [specificSlot, setSpecificSlot] = useState("");
    const [loading, setLoading] = useState(false);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        if (token) {
            fetchDefaultSlots();
        } else {
            toast.error("Please log in again.");
        }
    }, [token]);

    const fetchDefaultSlots = async () => {
        try {
            setLoading(true);
            const res = await getDefaultSlots(token);
            setDefaultSlots(res.data);
        } catch (error) {
            toast.error("Failed to fetch default slots");
        } finally {
            setLoading(false);
        }
    };

    const handleAddDefaultSlot = async () => {
        if (!newSlot) return;
        try {
            await addDefaultSlot(newSlot, token);
            toast.success("Default slot added successfully");
            setNewSlot("");
            fetchDefaultSlots();
        } catch (error) {
            toast.error("Failed to add default slot");
        }
    };

    const updateSlotState = async (id, status) => {
        try {
            // Update active status in the backend
            await activeSlot(id, status, token);

            setDefaultSlots((prevSlots) =>
                prevSlots.map((slot) =>
                    slot.id === id ? { ...slot, status } : slot
                )
            );
            if (status === 1) {
                toast.success("Slot was Active successfully!");
            } else { toast.success("Slot was Inactive successfully!"); }

            // Show a success toast
        } catch (err) {
            console.error("Error updating active status:", err);
            toast.error("Failed to update active status");
        }
    };


    // const handleDeleteDefaultSlot = async (id, slot) => {
    //     toast(
    //         (t) => (
    //             <div>
    //                 <p className="text-sm">
    //                     Are you sure you want to delete <br /><strong>{slot}</strong> ?
    //                 </p>
    //                 <div className="mt-2 flex justify-end gap-2">
    //                     <button
    //                         className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
    //                         onClick={async () => {
    //                             toast.dismiss(t.id);
    //                             try {
    //                                 await deleteDefaultSlot(id, token);
    //                                 fetchDefaultSlots();
    //                                 toast.success("Slot deleted successfully!");
    //                             } catch (error) {
    //                                 toast.error("Error deleting slot.");
    //                                 console.error("Error deleting slot:", error);
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

    const handleAddSpecificSlot = async () => {
        if (!specificDate || !specificSlot) return;
        try {
            await addSpecificSlot(specificDate, specificSlot, token);
            toast.success("Specific slot added successfully");
            setSpecificDate("");
            setSpecificSlot("");
        } catch (error) {
            toast.error("Failed to add specific slot");
        }
    };
    useTitle("Slots Management | Appointment Booking");
    useProtectedRoute(["admin"]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} className="flex flex-col min-h-screen p-4 sm:p-6">
            <h1 className="text-3xl font-bold text-yellow-400 mb-8">Slot Management</h1>

            {/* Default Slots Section */}
            <div className="bg-white/90 p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Default Slots</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        value={newSlot}
                        onChange={(e) => setNewSlot(e.target.value)}
                        placeholder="Enter new slot (e.g., 09:00:00 - 09:30:00)"
                        className="flex-1 border text-gray-500 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                        onClick={handleAddDefaultSlot}
                        className="flex items-center justify-center bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all"
                    >
                        <FaPlus className="mr-2" /> Add Default Slot
                    </button>


                </div>
                {loading ? (
                    <div className="flex justify-center items-center py-6">
                        <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {defaultSlots.map((slot) => (
                            <li
                                key={slot.id}
                                className="flex justify-between items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                            >
                                <span className="text-gray-700">{slot.time_slot}</span>
                                {/* <button
                                    onClick={() => handleDeleteDefaultSlot(slot.id, slot.time_slot)}
                                    className="text-red-500 hover:text-red-700 transition-all"
                                >
                                    <FaTrash />
                                </button> */}
                                <select
                                    value={slot.status ? 1 : 0} // Correct conversion of value
                                    onChange={(e) => updateSlotState(slot.id, e.target.value === '1' ? 1 : 0)} // Correct conversion of value
                                    className="border text-gray-500 border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>

                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Specific Slots Section */}
            <div className="bg-white/90 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Add Specific Slot <span className="text-red-600 animate-pulse text-sm">This is not working yet</span></h2>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="date"
                        value={specificDate}
                        onChange={(e) => setSpecificDate(e.target.value)}
                        className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    />
                    <input
                        type="text"
                        value={specificSlot}
                        onChange={(e) => setSpecificSlot(e.target.value)}
                        placeholder="Enter slot (e.g., 10:00 AM)"
                        className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    />
                    <button
                        onClick={handleAddSpecificSlot}
                        className="flex items-center justify-center bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all"
                    >
                        <FaPlus className="mr-2" /> Add Specific Slot
                    </button>
                </div>
            </div>
        </motion.div>
    );
}