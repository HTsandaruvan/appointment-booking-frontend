"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/utils/auth";

const BookingPage = () => {
    const router = useRouter();
    const [role, setRole] = useState("");

    useEffect(() => {
        const auth = checkAuth(router);
        if (auth) {
            if (auth.role !== "user") {
                router.push("/");
            } else {
                setRole(auth.role);
            }
        }
    }, [router]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Book an Appointment</h1>
            {role === "user" ? <p>Welcome, user! You can book appointments here.</p> : null}
        </div>
    );
};

export default BookingPage;
