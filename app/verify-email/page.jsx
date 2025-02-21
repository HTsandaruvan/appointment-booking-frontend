"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmailPage = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();
    const [status, setStatus] = useState("verifying"); // "verifying", "success", "error"

    useEffect(() => {
        console.log("Token from URL:", token);

        if (!token) {
            setStatus("error");
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/auth/verify", { token });
                console.log("Verification response:", response.data);

                setStatus("success");
                toast.success("Email verified successfully! Redirecting to login...");

                setTimeout(() => {
                    router.push("/auth/login");
                }, 3000);
            } catch (error) {
                console.error("Verification failed", error);
                setStatus("error");
                toast.error(error.response?.data?.message || "Email verification failed.");
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10 text-center">
            {status === "verifying" && <p className="text-gray-600">Verifying your email...</p>}
            {status === "success" && <p className="text-green-600 font-bold">Email Verified! Redirecting...</p>}
            {status === "error" && <p className="text-red-600 font-bold">Invalid or Expired Link!</p>}
        </div>
    );
};

export default VerifyEmailPage;
