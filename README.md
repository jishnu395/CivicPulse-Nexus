# CivicPulse Nexus - Frontend

A React-based frontend for **CivicPulse Nexus**, a Smart City Grievance Management System built using a **Microservices Architecture**.

This frontend interacts with the Citizen Service and Grievance Service to provide a simple interface for managing citizens, grievances, and dashboard statistics.

---

## 🚀 Features

- Login Page (UI)
- Home Dashboard
- Register Citizen
- View Citizens
- Register Grievance
- View Grievances
- Dashboard Statistics
- React Router Navigation
- Material UI Components
- Axios API Integration
- Responsive Layout

---

## 🏗️ Tech Stack

- React (Vite)
- React Router DOM
- Material UI
- Axios
- JavaScript
- CSS

---

## 📂 Project Structure

```
src/
│
├── pages/
│   ├── Login.jsx
│   ├── Home.jsx
│   ├── RegisterCitizen.jsx
│   ├── CitizenList.jsx
│   ├── RegisterGrievance.jsx
│   ├── GrievanceList.jsx
│   ├── Dashboard.jsx
│   └── GrievanceHistory.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── services/
│   └── api.js
│
├── App.jsx
└── main.jsx
```

---

## 🌐 Backend Services

The frontend communicates with the following backend services.

| Service | Port |
|----------|------|
| Citizen Service | 8082 |
| Grievance Service | 8083 |

Axios configuration:

```javascript
export const citizenAPI = axios.create({
    baseURL: "http://localhost:8082/api/citizens"
});

export const grievanceAPI = axios.create({
    baseURL: "http://localhost:8083/api/grievances"
});
```

---

## 📋 Available Pages

### Login

Simple login interface for CivicPulse Nexus.

---

### Home

Provides navigation to all available modules.

- Register Citizen
- View Citizens
- Register Grievance
- View Grievances
- Dashboard

---

### Register Citizen

Allows creation of a citizen profile linked to an existing registered user.

Fields:

- User ID
- First Name
- Last Name
- Phone Number
- Gender
- Date of Birth
- Address
- Ward Number
- City
- State
- Postal Code

---

### View Citizens

Displays all registered citizens in a Material UI table.

Columns:

- ID
- Citizen ID
- Name
- Phone Number
- Ward
- Status

---

### Register Grievance

Creates a new grievance.

Fields:

- Citizen ID
- Title
- Description
- Category
- Location
- Priority

---

### View Grievances

Displays all grievances.

Columns:

- ID
- Citizen ID
- Title
- Category
- Priority
- Status
- SLA Status

---

### Dashboard

Displays grievance statistics.

- Total
- Submitted
- Assigned
- In Progress
- Resolved
- Closed
- Escalated
- Overdue

---

## ▶️ Getting Started

Clone the repository

```bash
git clone <repository-url>
```

Navigate into the project

```bash
cd civicpulse-frontend
```

Install dependencies

```bash
npm install
```

Run the application

```bash
npm run dev
```

Application runs at

```
http://localhost:5173
```

---

## ⚙️ Prerequisites

Ensure the following services are running:

- PostgreSQL
- Eureka Discovery Server
- API Gateway
- User Service
- Citizen Service
- Grievance Service
- Kafka
- Keycloak

---

## 📌 Future Enhancements

- JWT Authentication using Keycloak
- Role-Based Access Control
- Officer Dashboard
- Department Management
- Notification Module
- Complaint Tracking Timeline
- File Upload Support
- Search & Filtering
- Pagination
- Responsive Dashboard Charts

---

## 👨‍💻 Developed By

**Jishnu V**

Computer Science Engineering Student

Spring Boot | React | Microservices | Java

---