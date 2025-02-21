import axios from "axios";

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// Create an axios instance with base URL
const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
});


// Function to set Authorization header dynamically based on token
const setAuthHeader = (token) => {
    if (token) {
        API.defaults.headers["Authorization"] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers["Authorization"];
    }
};

// ============================
// User Authentication API
// ============================
export const loginUser = async (email, password) => {
    try {
        const response = await API.post("/auth/login", { email, password });
        const data = response.data;

        // Store token and user details in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user?.id);
        localStorage.setItem("email", data.user?.email);
        localStorage.setItem("role", data.user?.role);
        localStorage.setItem("active", data.user?.active);

        return data.user;
    } catch (error) {
        console.error("Login Error:", error.message);
        throw error;
    }
};

// ============================
// Appointment Management APIs
// ============================
export const getSlots = async (date) => {
    try {
        const response = await API.post("/slots", { date });
        return response.data.slots; // Return slots array from response
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const bookAppointment = async (data) => {
    try {
        const response = await API.post("/appointments", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAppointments = async (user_id) => API.get(`/appointments?user_id=${user_id}`);

export const cancelAppointment = async (id) => API.put(`/appointments/${id}`);

export const getUserProfile = async (user_id) => API.get(`/user/profile?user_id=${user_id}`);

export const updateUserProfile = async (user_id, formData) =>
    API.put(`/user/profile/${user_id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

// ============================
// Admin User Management APIs
// ============================
export const getAllUsers = async (token) => {
    setAuthHeader(token);
    return API.get("/admin/users");
};

export const addUser = async (userData, token) => {
    setAuthHeader(token);
    return API.post("/admin/users", userData);
};

export const updateUser = async (id, userData, token) => {
    setAuthHeader(token);
    return API.put(`/admin/users/${id}`, userData);
};

export const activeUser = async (id, active, token) => {
    setAuthHeader(token);
    const response = await API.put(`/admin/users/${id}/active`, { active });
    return response.data;
};

export const updateUserRole = async (id, role, token) => {
    setAuthHeader(token);
    return API.put(`/admin/users/${id}/role`, { role });
};

// ============================
// Admin Slot Management APIs
// ============================
export const getDefaultSlots = async (token) => {
    setAuthHeader(token);
    return API.get("/admin/slots");
};

export const addDefaultSlot = async (time_slot, token) => {
    setAuthHeader(token);
    return API.post("/admin/slots", { time_slot });
};

export const deleteDefaultSlot = async (id, token) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    return API.delete(`/admin/slots/${id}`, config);
};

export const activeSlot = async (id, active, token) => {
    setAuthHeader(token);
    const response = await API.put(`/admin/slots/${id}/active`, { active });
    return response.data;
};

export const addSpecificSlot = async (date, time_slot, token) => {
    setAuthHeader(token);
    return API.post("/admin/slots/specific", { date, time_slot });
};
export const deleteSpecificSlot = async (id, token) => {
    setAuthHeader(token);
    return API.delete(`/admin/slots/specific/${id}`);
};

// ============================
// Admin Appointment Management APIs
// ============================
export const getAllAppointments = async (filters, token) => {
    setAuthHeader(token);
    return API.get("/admin/appointments", { params: filters });
};

export const cancelAppointmentAdmin = async (id, token) => {
    setAuthHeader(token);
    return API.put(`/admin/appointments/${id}/cancel`);
};

export const updateAppointmentStatus = async (id, status, token) => {
    setAuthHeader(token);
    return API.put(`/admin/appointments/${id}/status`, { status });
};

export const bookAppointmentAdmin = async (data, token) => {
    setAuthHeader(token);
    return API.post("/admin/appointments/book", data);
};

// ============================
// Admin Analytics APIs
// ============================
export const getBookingTrends = async (token) => {
    setAuthHeader(token);
    return API.get("/admin/analytics/booking-trends");
};

export const getPopularTimeSlots = async (token) => {
    setAuthHeader(token);
    return API.get("/admin/analytics/popular-time-slots");
};

export const getUserCounts = async (token) => {
    setAuthHeader(token);
    const response = await API.get("/admin/analytics/user-counts");
    return response.data;
};

export const getAppointmentInsights = async (token) => {
    setAuthHeader(token);
    const response = await API.get("/admin/appointment-insights");
    return response.data;
};

export default API;
