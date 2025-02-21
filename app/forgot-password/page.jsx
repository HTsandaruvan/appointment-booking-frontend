"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "@/lib/api";

const schema = yup.object().shape({
    email: yup.string().required("Email is required").email("Invalid email address"),
});

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await api.post("/auth/forgot-password", data);
            toast.success(response.data.message || "Password reset link sent!");
            reset();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <div className="w-full max-w-md mx-auto mt-16 p-6 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 min-h-s">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Forgot Password</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <motion.div whileFocus={{ scale: 1.05 }}>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full p-3 bg-gray-200 rounded-md border focus:border-blue-500 focus:outline-none transition text-gray-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-md transition-all duration-300"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
