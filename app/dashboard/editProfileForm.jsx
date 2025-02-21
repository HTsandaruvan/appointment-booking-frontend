"use client";
import { useState, useEffect } from "react";
import { updateUserProfile, getUserProfile } from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function UpdateProfile() {
    const [formData, setFormData] = useState({ name: "", address: "", telephone: "" });
    const [profilePic, setProfilePic] = useState(null);
    const router = useRouter();
    const user_id = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

    useEffect(() => {
        if (user_id) {
            fetchUserProfile();
        }
    }, [user_id]);

    const fetchUserProfile = async () => {
        try {
            const res = await getUserProfile(user_id);
            setFormData(res.data.user);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));
        if (profilePic) data.append("profile_picture", profilePic);

        try {
            await updateUserProfile(user_id, data);
            toast.success("Profile updated successfully!");
            router.push("/dashboard");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />
            <button type="submit">Save</button>
        </form>
    );
}
