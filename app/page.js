"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Head from "next/head";


export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [isClient, setIsClient] = useState(false); // ✅ Ensures code runs only on the client

  useEffect(() => {
    setIsClient(true); // ✅ Set client-side rendering flag
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  return (
    <div>
      <Head>
        <title>Dashboard | Appointment Booking</title>
      </Head>
      <div className=" flex flex-col bg-gradient-to-b from-blue-600 to-blue-900 text-white mt-4 py-10">

        {/* ✅ Hero Section */}
        <header className="relative flex flex-col items-center text-center py-20 px-6">
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-blue-500 opacity-50 blur-3xl -z-10"></div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:text-6xl lg:text-6xl sm:text-5xl text-4xl font-extrabold tracking-tight"
          >
            Book Your Appointments with <span className="text-yellow-300">Ease</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-4 text-lg text-gray-200 max-w-lg"
          >
            Fast, simple, and hassle-free online booking system.
          </motion.p>

          {/* ✅ CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-6 flex gap-4"
          >
            {isClient && (
              role ? (
                <button
                  onClick={() => router.push(role === "admin" ? "/admin" : "/dashboard")}
                  className="px-6 py-3 bg-yellow-400 text-blue-900 rounded-lg font-medium shadow-lg hover:bg-yellow-500 transition"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  onClick={() => router.push("/auth/login")}
                  className="px-6 py-3 bg-white text-blue-900 rounded-lg font-medium shadow-lg hover:bg-gray-200 transition"
                >
                  Get Started
                </button>
              )
            )}
          </motion.div>
        </header>

        {/* ✅ Features Section */}
        <section className="py-4 px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold"
          >
            Why <span className="text-yellow-300">Choose</span> Us?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <FeatureCard
              title="Easy Scheduling"
              description="Select your preferred date and time in just a few clicks."
              icon="📅"
            />
            <FeatureCard
              title="Secure & Reliable"
              description="Your data is safe with our secure authentication system."
              icon="🔒"
            />
            <FeatureCard
              title="Instant Notifications"
              description="Receive email confirmations for every appointment."
              icon="📩"
            />
          </motion.div>
        </section>

      </div>
    </div>
  );
}

/** ✅ Feature Card Component */
const FeatureCard = ({ title, description, icon }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
    className="p-6 bg-white text-blue-900 rounded-lg shadow-lg flex flex-col items-center"
  >
    <div className="text-4xl">{icon}</div>
    <h3 className="mt-4 text-xl font-semibold">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
  </motion.div>
);
