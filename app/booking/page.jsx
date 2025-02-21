"use client";
import { IoReload } from "react-icons/io5";

import { useState, useEffect } from "react";
import { getSlots, bookAppointment } from "@/lib/api";
import { toast } from "react-hot-toast";
import useProtectedRoute from "@/lib/protectedRoutes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import useTitle from "@/utils/useTitle";

export default function BookingPage() {
    const [isClient, setIsClient] = useState(false);
    const [date, setDate] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedSlotTime, setSelectedSlotTime] = useState("");
    const [isBooking, setIsBooking] = useState(false);
    useEffect(() => {
        setIsClient(true); // Set to true when the component mounts on the client side
    }, []);

    useEffect(() => {
        if (date && isClient) {
            getSlots(date.toISOString().split("T")[0])
                .then((data) => setSlots(data || []))
                .catch((err) => {
                    toast.error(err.response?.data?.message || "Failed to load slots");
                    setSlots([]);
                });
        } else {
            setSlots([]);
        }
    }, [date, isClient]);

    const handleBooking = () => {
        if (!selectedSlot) return toast.error("Please select a time slot");
        if (!date) return toast.error("Please select a date");

        const user_id = localStorage.getItem("user_id");
        const email = localStorage.getItem("email");

        if (!user_id || !email) {
            toast.error("User data missing. Please log in again.");
            return;
        }

        const formattedDate = date.toISOString().split("T")[0];

        toast(
            (t) => (
                <div className="p-4 ">
                    <p className="text-lg font-semibold">Are you sure?</p>
                    <p className="text-gray-700">You're about to book an appointment on:</p>
                    <p className="font-medium">{formattedDate}</p>
                    <p className="font-medium">{selectedSlotTime}</p>
                    <div className="flex justify-between mt-3">
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                confirmBooking(user_id, email, selectedSlot, formattedDate);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-md"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
            { duration: 5000 }
        );
    };

    const confirmBooking = (user_id, email, slot_id, date) => {
        setIsBooking(true); // Start the loading process

        const data = { user_id, slot_id, date, email };

        bookAppointment(data)
            .then(() => {

                setIsBooking(false); // End the loading process
                toast.success("Appointment booked successfully!");
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || "Error booking appointment");
                setIsBooking(false); // End the loading process
            });
    };


    useProtectedRoute(["user"]);
    useTitle("Book Appointment | Appointment Booking");

    return (
        <div className="flex flex-col items-center  min-h-screen p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-sky-200/20 backdrop-blur-lg shadow-lg rounded-lg p-5 sm:p-6 w-full max-w-md"
            >
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Book an Appointment
                </h2>

                {/* Date Picker */}
                <div className="mb-4 text-center justify-center ">
                    <label className="block text-gray-700 font-medium mb-2 text-center">
                        Select Date:
                    </label>
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        minDate={new Date()}
                        dateFormat="yyyy-MM-dd"
                        className="w-full p-3 border rounded-lg text-gray-600 justify-center text-center"
                        placeholderText="Pick a date"
                    />
                </div>

                {/* Slots Section */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Available Time Slots:</h3>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-2"
                    >
                        {slots.length > 0 ? (
                            slots.map((slot) => (
                                <motion.button
                                    key={slot.id}
                                    whileTap={{ scale: 0.9 }}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => {
                                        setSelectedSlot(slot.id);
                                        setSelectedSlotTime(slot.time_slot);
                                    }}
                                    className={`p-2 text-sm font-medium rounded-md text-center cursor-pointer 
                                        ${selectedSlot === slot.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} transition w-full`}
                                >
                                    {slot.time_slot}
                                </motion.button>
                            ))
                        ) : (
                            <p className="text-red-500 text-center col-span-2 sm:col-span-3">No slots available.</p>
                        )}
                    </motion.div>
                </div>

                {isBooking && (
                    <div className="flex justify-center items-center py-4">
                        <IoReload className="animate-spin text-blue-600 text-4xl" />
                    </div>
                )}

                {/* Book Button */}
                <motion.button
                    disabled={isBooking}

                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={handleBooking}
                    className="w-full mt-4 p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    {isBooking ? "Processing..." : "Book Appointment"}
                </motion.button>
            </motion.div>
        </div>
    );
}
