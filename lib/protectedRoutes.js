"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useProtectedRoute(allowedRoles) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || !allowedRoles.includes(role)) {
            router.push("/auth/login");
        }
    }, [allowedRoles, router]); // ✅ Include dependencies

}
