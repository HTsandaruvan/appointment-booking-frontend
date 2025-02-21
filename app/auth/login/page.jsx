"use client"

import { motion } from "framer-motion";
import AuthForm from "@/app/components/AuthForm";
import useTitle from "@/utils/useTitle";

export default function LoginPage() {
    useTitle("Login | Appointment Booking");

    return (
        // Page transition using framer-motion
        <motion.div
            className="flex flex-col items-center justify-center h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <AuthForm isRegister={false} />
        </motion.div>
    );
}
