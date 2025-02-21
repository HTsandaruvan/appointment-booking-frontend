# 🗓️ Appointment Booking System - Frontend

A modern, responsive, and user-friendly frontend for the **Appointment Booking System**, built using **Next.js**, **TailwindCSS**, **ShadCN**, and **React Hook Form**. It provides seamless appointment scheduling with role-based access for **Users** and **Admins**.

---

## 🚀 **Features**

- ✨ **Role-Based Dashboards:**  
  - **User Dashboard:** View, book, and manage appointments; edit profile details.  
  - **Admin Dashboard:** Manage users, appointments, and time slots.


- 📅 **Appointment Booking:**  
  - Calendar-based date selection with real-time available time slots.  
  - Error handling for already booked slots with instant feedback.

- 🏷️ **Profile Management:**  
  - View and update user profile with secure authentication.  
  - Upload and update profile pictures.

- 📩 **Interactive UI:**  
  - Beautifully designed UI with **ShadCN** components.  
  - Fully responsive and mobile-friendly.

- 📬 **Notifications:**  
  - Success and error toast notifications powered by `react-hot-toast`.  
  - Real-time updates for booking confirmations and profile changes.
  - Real-time updates for booking confirmations and cancl via emails.

- 📊 **Admin Analytics:**
  - Implementation: Use Chart.js or Recharts to display analytics (e.g., most popular time slots, user booking trends).
  - Benefit: Gives admins insights for better resource allocation and slot management.

- 🗃️ **Pagination & Filtering for Admin Panels:**
  - Implementation: Add pagination and filtering on user and appointment management tables.
  - Benefit: Improves performance and usability when dealing with large datase 
---

## 🏗️ **Tech Stack**

- **Framework:** Next.js (React 18)  
- **Styling:** TailwindCSS, ShadCN UI  
- **Forms & Validation:** React Hook Form, Yup  
- **HTTP Client:** Axios  
- **Authentication:** JWT (via backend APIs)  
- **Notifications:** react-hot-toast  
- **State Management:** React Context API

---

## 💻 **Getting Started**

### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/your-username/appointment-booking-frontend.git
cd appointment-booking-frontend
```

2️⃣ Install Dependencies
```bash
npm install
3️⃣ Configure Environment Variables
Create a .env.local file in the root directory:
```
```env

NEXT_PUBLIC_API_URL=http://localhost:5000/api

```

4️⃣ Run the Development Server
```bash

npm run dev

```

Open http://localhost:3000 to view it in the browser.
```
/app
  ├── admin/                # Admin dashboard components & pages
  ├── booking/              # Booking flow pages
  ├── dashboard/            # User dashboard (profile & appointments)
  ├── components/           # Reusable UI components
/lib 
  ├── api.js                # API integrations & helper functions
```

📜 Key Functionalities
🏠 User Dashboard
View and update profile details (name, address, phone, profile picture).
View and cancel booked appointments.
🏢 Admin Dashboard
User Management: Add, edit, delete users, and view their appointments.
Appointment Management: View all appointments, delete appointments.
Slot Management: Add, view, delete, and manage time slots.
🎨 UI Highlights
Responsive sidebar for navigation.
Dynamic role-based rendering for users and admins.
Smooth form validations with real-time feedback.
Modern and animated UI components.


🛠️ Build for Production
```bash

npm run build
npm run start
```

🌐 Live Demo
🔗 https://appointment-booking-taupe.vercel.app/

📞 Contact
💻 GitHub: HTsandaruvan
🌐 Portfolio: https://harsha-portfolio-rho.vercel.app
📧 Email: tsandaruvan29@gmail.com
