"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "@/lib/api";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";


// ✅ Form Validation Schema
const schema = yup.object().shape({
    full_name: yup.string().when("isRegister", {
        is: true,
        then: (schema) => schema.required("Full Name is required").min(3, "Name must be at least 3 characters"),
    }),
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function AuthForm({ isRegister }) {
    const { updateRole } = useAuth(); // Get context function

    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema), defaultValues: { full_name: "", email: "", password: "" } });

    // ✅ Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token && role) {
            router.push(role === "admin" ? "/admin" : "/booking");
        }
    }, []);

    const onSubmit = async (data) => {
        const toastId = toast.loading("Processing...");

        try {
            const endpoint = isRegister ? "/auth/register" : "/auth/login";
            const response = await axios.post(endpoint, data);

            if (isRegister) {
                toast.success("Registration successful! Check your email for verification.", { id: toastId });
            } else {
                const { token, user } = response.data;
                localStorage.setItem("token", token);
                localStorage.setItem("role", user.role);
                localStorage.setItem("user_id", user.id);
                localStorage.setItem("email", user.email);

                // ✅ Trigger a storage event to update navbar
                window.dispatchEvent(new Event("storage"));
                updateRole(user.role);

                toast.success("Login successful! Redirecting...", { id: toastId });

                setTimeout(() => {
                    router.push(user.role === "admin" ? "/admin" : "/booking");
                }, 2000);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong!", { id: toastId });
        }
    };

    return (
        <div

            className="w-full max-w-md mx-auto mt-16 p-6 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20"
        >

            <h2 className="text-3xl font-bold text-white text-center mb-6">
                {isRegister ? "Create an Account" : "Welcome Back"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {isRegister && (
                    <motion.div whileFocus={{ scale: 1.05 }}>
                        <input
                            {...register("full_name")}
                            type="text"
                            placeholder="Full Name"
                            className="w-full p-3 bg-gray-200 rounded-md border focus:border-blue-500 focus:outline-none transition text-gray-500"
                        />
                        {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
                    </motion.div>
                )}

                <motion.div whileFocus={{ scale: 1.05 }}>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="Email Address"
                        className="w-full p-3 bg-gray-200 rounded-md border focus:border-blue-500 focus:outline-none transition text-gray-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </motion.div>

                <div className="relative">
                    <motion.div whileFocus={{ scale: 1.05 }}>
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full p-3 bg-gray-200 rounded-md border focus:border-blue-500 focus:outline-none transition text-gray-500"
                        />
                    </motion.div>
                    <button type="button" className="absolute right-3 top-3 text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>
                {!isRegister && (
                    <div className="text-right">
                        <Link href="/forgot-password" className="text-blue-600 text-sm hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                )}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-md transition-all duration-300"
                >
                    {isRegister ? "Sign Up" : "Login"}
                </motion.button>
            </form>

            <p className="text-center text-white mt-4">
                {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                <span onClick={() => router.push(isRegister ? "/auth/login" : "/auth/register")} className="text-blue-300 cursor-pointer hover:underline">
                    {isRegister ? "Login here" : "Sign up"}
                </span>
            </p>
        </div>
    );
}
