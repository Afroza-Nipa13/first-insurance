# 🛡️ FIRST Life Insurance Web App

A secure, responsive, and modern MERN Stack-based life insurance web application that enables users to explore policies, get personalized quotes, apply for policies, manage their dashboard, and make payments online — all while maintaining proper user role access and control.

---

## 🔐 Admin Credentials

- **Email:** tandoori@chicken.com  
- **Password:** Tandoori
## 🔐 Agent Credentials

- **Email:** anisur@rahman.com  
- **Password:**AnisurRahman


agent:abrar@fahad.com
pass:AbrarFahad

agent:mugdho@islam.com
pass:MugdhoIslam

agent:abu@sayeed.com
pass:AbuSayeed

> ✨ You can change these in your seed data or Firebase.

---

## 🌐 Live Site

🔗 [https://last-assignment-project.web.app/]

---

## 🏢 About the Company

**FIRST Life Insurance** is a modern tech-driven life insurance platform aimed at simplifying the way people purchase and manage life insurance. The platform focuses on:
- Transparency in policy offerings  
- Instant quote estimations  
- Online claim & premium handling  
- Seamless customer-agent interaction

---

## 👨‍💻 Developer Role

As a **MERN Stack Developer**, you are responsible for:

- Designing a fully responsive, intuitive UI
- Implementing REST APIs with role-based access
- Securely integrating Firebase Authentication and JWT
- Stripe-based payment system
- Managing data using MongoDB

---

## 🔑 User Roles & Access

| Role     | Permissions |
|----------|-------------|
| **Admin** | Manages users, agents, policies, applications, transactions, blogs |
| **Agent** | Handles assigned customers, manages blogs, processes claims |
| **Customer** | Applies for policies, requests claims, makes payments |

---

## 🚀 Key Features

✅ **Role-based dashboard for Admin, Agent, Customer**  
✅ **Dynamic quote estimation** based on input fields  
✅ **Stripe payment integration**  
✅ **JWT token-based secure routes with cookie auth**  
✅ **PDF download** for approved policy  
✅ **Rejection feedback** modal for admin  
✅ **Blog management system** for agents and admins  
✅ **Newsletter subscription** with DB save  
✅ **Responsive UI** with Tailwind + Flowbite/Mamba UI  
✅ **Firebase Auth with Google login support**  
✅ **Helmet Async for dynamic titles**  
✅ **Toast/SweetAlert2** for all messages  
✅ **Search & Filter** policies (case-insensitive search)  
✅ **Analytics: Total earnings, transaction logs**  
✅ **Pagination** for policies & blogs  
✅ **Claim request form with file upload (PDF/Image)**  
✅ **Customer reviews shown in carousel on Home**

---

## 📋 Pages Breakdown

### 🏠 Home Page
- Hero section with CTA
- Popular Policies (Dynamic - Top 6 purchased)
- Customer Reviews (Carousel)
- Latest Blogs (Dynamic - Top 4)
- Meet Our Agents (Top 3)
- Newsletter Subscription Form

### 📚 All Policies Page
- All policy listings
- Category-based filtering
- Case-insensitive search
- Pagination (9 per page)

### 📄 Policy Details Page
- Full policy info
- "Get Quote" CTA

### 📈 Quote Page (Private)
- Form to estimate premium
- Dynamic calculation
- Button to apply for policy

### ✍ Application Form Page
- Collect personal, nominee, health info
- Stored as "Pending"

---

## 🔒 Dashboards

### 🧑 Admin Dashboard
- **Manage Applications:** View, assign agent, reject with feedback
- **Manage Users:** Promote/demote roles
- **Manage Policies:** CRUD with image upload
- **Manage Transactions:** See Stripe payments, filter by date/policy
- **Manage Blogs:** See all blogs

### 🧑 Agent Dashboard
- **Assigned Customers:** Change their application status
- **Manage Blogs:** Post/edit/delete their own blogs
- **Policy Clearance:** Approve claims

### 👤 Customer Dashboard
- **My Policies:** See status + give reviews
- **Payment Status:** See due/paid, pay via Stripe
- **Claim Request:** File claims with document upload
- **Profile:** Edit name/photo, view last login

---

## 🧠 Tech Stack

- **Frontend:** React, TailwindCSS, DaisyUI / Flowbite / Mamba UI  
- **Routing & State:** React Router DOM, Tanstack Query  
- **Auth:** Firebase Auth (Email/Password + Google)  
- **Backend:** Express.js, Node.js, MongoDB  
- **Security:** JWT (via HTTPOnly Cookie)  
- **Payments:** Stripe  
- **Form Handling:** React Hook Form  
- **PDF Generation:** @react-pdf/renderer  
- **File Upload:** Base64 or multipart/form-data  
- **Sweet Alerts:** sweetalert2  
- **Helmet:** react-helmet-async

---

## 🔐 Security

- JWT token stored in HTTPOnly cookies
- `verifyToken` middleware protects sensitive routes
- Role-based route access for admin/agent/customer
- 401/403 handling with fallback UI

---



❤️ Special Thanks
Thanks to the instructor and community for providing the guidelines and dataset used to build this project.