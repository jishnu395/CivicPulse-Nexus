# CivicPulse Nexus

CivicPulse Nexus is a cloud-native microservices-based civic grievance management platform designed to streamline complaint registration, assignment, tracking, SLA monitoring, and escalation for smart city governance.

The system follows a scalable microservices architecture using Spring Boot, Spring Cloud, Kafka, PostgreSQL, Keycloak, and React.

---

## Architecture

```
                +----------------------+
                |     React Frontend   |
                +----------+-----------+
                           |
                     API Gateway
                           |
        ---------------------------------------
        |            |             |          |
   User Service  Citizen Service  Grievance Service
        |            |             |
        ----------- PostgreSQL Databases ---------

                    |
               Eureka Discovery

                    |
                  Kafka
```

---

# Tech Stack

## Backend

- Java 21
- Spring Boot 3
- Spring Data JPA
- Spring Security
- Spring Cloud Gateway
- Eureka Discovery Server
- OpenFeign
- Spring Kafka
- PostgreSQL
- Hibernate
- Maven

## Authentication

- Keycloak

## Messaging

- Apache Kafka

## Documentation

- Swagger / OpenAPI

## Frontend (Upcoming)

- React
- Material UI
- Axios

---

# Microservices

## User Service

Responsible for user management and authentication.

### Features

- User Registration
- User Management
- Keycloak Integration
- PostgreSQL Persistence

---

## Citizen Service

Responsible for citizen profile management.

### Features

- Citizen Registration
- Citizen CRUD
- User Validation
- PostgreSQL Persistence

---

## Grievance Service

Responsible for complete grievance lifecycle management.

### Features

### Complaint Management

- Create Complaint
- Update Complaint
- View Complaint
- Delete Complaint

### Assignment Workflow

- Assign Department
- Assign Officer

### Status Workflow

- SUBMITTED
- ASSIGNED
- IN_PROGRESS
- RESOLVED
- CLOSED
- ESCALATED

### Status Transition Validation

Invalid workflow transitions are prevented.

Example:

```
SUBMITTED
    ↓
ASSIGNED
    ↓
IN_PROGRESS
    ↓
RESOLVED
    ↓
CLOSED
```

---

### SLA Management

Automatic due date calculation based on priority.

| Priority | SLA |
|----------|------|
| HIGH | 1 Day |
| MEDIUM | 3 Days |
| LOW | 7 Days |

SLA Status

- WITHIN_SLA
- NEAR_DEADLINE
- OVERDUE

---

### Automatic Escalation

A scheduler periodically checks overdue grievances.

If SLA is breached:

- Complaint status changes to ESCALATED
- SLA Status becomes OVERDUE
- History entry is created
- Kafka event is published

---

### Complaint History

Every important action is stored.

Example

```
Complaint Submitted

↓

Assigned

↓

In Progress

↓

Resolved

↓

Closed

↓

Escalated (if overdue)
```

---

### Dashboard

Dashboard API provides:

- Total Complaints
- Submitted
- Assigned
- In Progress
- Resolved
- Closed
- Escalated
- Overdue

---

### Kafka Events

The Grievance Service publishes the following events:

- grievance-created
- grievance-assigned
- grievance-status-updated
- grievance-escalated

---

# Service Communication

OpenFeign is used for inter-service communication.

Current integrations

- Grievance Service → Citizen Service

---

# API Documentation

Swagger UI

```
http://localhost:8083/swagger-ui/index.html
```

---

# Project Structure

```
CivicPulse-Nexus
│
├── discovery-server
├── api-gateway
├── user-service
├── citizen-service
├── grievance-service
│
└── frontend (Upcoming)
```

---

# Running the Project

## Prerequisites

- Java 21
- Maven
- PostgreSQL
- Apache Kafka
- Keycloak

---

## Start Order

1. PostgreSQL
2. Kafka
3. Keycloak
4. Discovery Server
5. API Gateway
6. User Service
7. Citizen Service
8. Grievance Service

---

# Current Progress

## Completed

- Infrastructure Setup
- Eureka Discovery
- API Gateway
- PostgreSQL Integration
- Keycloak Authentication
- User Service
- Citizen Service
- Grievance CRUD
- Validation
- Global Exception Handling
- Swagger
- OpenFeign Integration
- Kafka Producers
- Complaint Assignment
- Status Workflow
- Status Validation
- SLA Monitoring
- Automatic Escalation
- Complaint History
- Dashboard API

---

# Upcoming Features

- Officer Service
- Notification Service
- React Frontend
- Email Notifications
- Analytics Dashboard
- Docker Deployment
- Kubernetes Deployment

---

# Author

**Jishnu V**

GitHub: https://github.com/jishnu395

LinkedIn: https://www.linkedin.com/in/jishnu-v-3119462a4/

---

# License

This project is developed for educational and portfolio purposes.