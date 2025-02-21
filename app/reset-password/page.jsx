"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "@/lib/api";
import { Suspense } from "react";

const schema = yup.object().shape({
    newPassword: yup.string().required("Password is required").min(6, "Must be at least 6 characters"),
});

const ResetPasswordContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    // ✅ Fix hydration issue by setting token inside useEffect
    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(searchParams.get("token") || "");
        }
    }, [searchParams]);

    const onSubmit = async (data) => {
        if (!token) {
            toast.error("Invalid or missing token.");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/auth/reset-password", { token, newPassword: data.newPassword });
            toast.success(response.data.message || "Password reset successful!");
            reset();
            setTimeout(() => router.push("/auth/login"), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} className="min-h-screen">
            <div className="w-full max-w-md mx-auto mt-16 p-6 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Reset Password</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="relative">
                        <motion.div whileFocus={{ scale: 1.05 }}>
                            <input
                                {...register("newPassword")}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                className="w-full p-3 bg-gray-200 rounded-md border focus:border-blue-500 focus:outline-none transition text-gray-500"
                            />
                        </motion.div>
                        <button type="button" className="absolute right-3 top-3 text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                        {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-md transition-all duration-300"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}