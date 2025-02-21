import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast"; // ✅ Import toast provider
import { AuthProvider } from "@/context/AuthContext";
import Footer from "./components/Footer"; // ✅ Import Footer

export const metadata = {
  title: "Home | Appointment Booking App",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-r from-blue-500 to-purple-700 antialiased min-h-screen flex flex-col ">
        <AuthProvider> {/* Wrap entire app */}
          {/* ✅ Navbar */}
          <Navbar />

          {/* ✅ Page Content */}
          <main className="container mx-auto px-6 py-12 flex-grow">
            {children}
          </main>

          <Toaster position="top-center" /> {/* Toast notification provider */}

          {/* ✅ Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
