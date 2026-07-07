# CivicPulse-Nexus

<p align="center">
  <b>AI-Powered Smart Civic Grievance Management Platform</b><br>
  Built using Spring Boot Microservices, Spring Cloud, PostgreSQL, Keycloak, OpenFeign, Kafka, and React.
</p>

---

## 📌 Overview

CivicPulse Nexus is a scalable microservices-based platform designed to modernize civic issue management by enabling citizens to register complaints, track grievance status, and interact with government departments efficiently.

The system follows an event-driven microservice architecture using Spring Cloud, Eureka Discovery, API Gateway, OpenFeign for synchronous communication, and Kafka for asynchronous messaging (planned).

---

## 🏗️ Architecture

```
                           React Frontend (Planned)
                                   │
                           Spring Cloud Gateway
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
   User Service             Citizen Service          Grievance Service (Planned)
        │                          │
        │<────── OpenFeign ───────>│
        │                          │
 PostgreSQL (user_db)       PostgreSQL (citizen_db)

                    Eureka Discovery Server

                 Kafka (Planned)
      ├── Citizen Registered Event
      ├── Citizen Updated Event
      ├── Grievance Created Event
      └── Grievance Assigned Event
```

---

# 🚀 Tech Stack

### Backend

- Java 17
- Spring Boot 4
- Spring Cloud
- Spring Data JPA
- Spring Validation
- OpenFeign
- PostgreSQL
- Keycloak IAM
- Eureka Discovery
- Spring Cloud Gateway
- Lombok

### Planned

- Apache Kafka
- Redis
- Swagger/OpenAPI
- Docker
- React
- JWT Role-Based Security

---

# 📂 Project Structure

```
civicpulse-nexus/

├── discovery-server/
├── gateway-service/
├── user-service/
├── citizen-service/
└── grievance-service (Planned)
```

---

# ✅ Current Progress

## Infrastructure

- [x] Eureka Discovery Server
- [x] Spring Cloud Gateway
- [x] PostgreSQL Databases
- [x] Keycloak Realm Configuration

---

# 👤 User Service

Responsible for authentication and user management.

### Features

- User Registration
- Keycloak Integration
- User Persistence
- Get User by ID API

### Database

```
users
```

### APIs

| Method | Endpoint | Status |
|---------|----------|--------|
| POST | `/api/auth/register` | ✅ |
| GET | `/api/users/{id}` | ✅ |

---

# 👥 Citizen Service

Responsible for citizen profile management.

### Features

- Citizen Registration
- Get Citizen by ID
- Get All Citizens
- Update Citizen
- Delete Citizen
- Search by Ward
- Search by Status
- OpenFeign Integration with User Service

### Database

```
citizens
```

### APIs

| Method | Endpoint | Status |
|---------|----------|--------|
| POST | `/api/citizens` | ✅ |
| GET | `/api/citizens` | ✅ |
| GET | `/api/citizens/{id}` | ✅ |
| PUT | `/api/citizens/{id}` | ✅ |
| DELETE | `/api/citizens/{id}` | ✅ |
| GET | `/api/citizens/ward/{ward}` | ✅ |
| GET | `/api/citizens/status/{status}` | ✅ |

---

# 🔄 Current Registration Flow

### Step 1 – User Registration

```
Client
   │
   ▼
User Service
   │
   ▼
Keycloak
   │
   ▼
PostgreSQL (user_db)
```

A user account is created in both Keycloak and the User Service database.

---

### Step 2 – Citizen Profile Registration

```
Client
    │
    ▼
Citizen Service
    │
    ▼
OpenFeign
    │
    ▼
User Service
    │
Returns Email
    │
    ▼
Citizen Service
    │
    ▼
PostgreSQL (citizen_db)
```

The Citizen Service retrieves the user's email from the User Service using OpenFeign before creating the citizen profile.

---

# 🔗 Microservice Communication

Implemented using **Spring Cloud OpenFeign**.

```
Citizen Service
        │
        ▼
User Service
```

No hardcoded URLs are used.

Service discovery is handled by Eureka.

---

# 🗄️ Databases

### user_db

```
users
```

Stores

- User ID
- Keycloak ID
- Email
- Role
- Status

---

### citizen_db

```
citizens
```

Stores

- Citizen ID
- User ID
- Name
- Email
- Phone
- Gender
- Date of Birth
- Address
- Ward
- City
- State
- Postal Code
- Status

---

# 📌 Features Implemented

- Microservice Architecture
- Service Discovery
- API Gateway
- Keycloak Integration
- PostgreSQL Integration
- OpenFeign Communication
- DTO Mapping
- Bean Validation
- Layered Architecture
- Repository Pattern

---

# 🚧 Upcoming Features

## Citizen Service

- Global Exception Handling
- Custom Exceptions
- Swagger/OpenAPI Documentation
- Kafka Event Publishing
- JWT Role-Based Security

---

## Grievance Service

- Complaint Registration
- Complaint Tracking
- Assignment Workflow
- Escalation Workflow
- SLA Monitoring
- Kafka Consumer
- Kafka Producer

---

## Platform

- Redis Caching
- Docker Support
- Frontend (React)
- Admin Dashboard
- Notifications
- AI-Powered Complaint Classification

---

# 📈 Development Status

| Module | Status |
|---------|--------|
| Discovery Server | ✅ Complete |
| API Gateway | ✅ Complete |
| User Service | ✅ Complete (Milestone 1 Foundation) |
| Citizen Service | 🟡 Core Functionality Complete |
| Kafka Integration | ⏳ Planned |
| Security | ⏳ Planned |
| Swagger | ⏳ Planned |
| Grievance Service | ⏳ Planned |
| Frontend | ⏳ Planned |

---

# 👨‍💻 Author

**Jishnu V**

Backend-focused Software Engineer passionate about building scalable Spring Boot microservices and distributed systems.

GitHub: https://github.com/jishnu395

LinkedIn: https://www.linkedin.com/in/jishnu-v-3119462a4/
