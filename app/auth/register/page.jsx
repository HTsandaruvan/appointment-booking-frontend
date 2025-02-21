"use client"

import AuthForm from "@/app/components/AuthForm";
import useTitle from "@/utils/useTitle";
import { motion } from "framer-motion";
export default function RegisterPage() {
    useTitle("Register | Appointment Booking");

    return (
        <motion.div
            className="flex flex-col items-center justify-center h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <AuthForm isRegister={true} />
        </motion.div>
    );
}
