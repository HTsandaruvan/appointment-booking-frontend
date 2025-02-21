const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white text-center py-4 mt-10">
            &copy; {new Date().getFullYear()} Appointment Booking System. All rights reserved.
        </footer>
    );
};

export default Footer; // ✅ Ensure it's a default export
