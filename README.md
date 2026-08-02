# CivicPulse Nexus

> A cloud-native Smart Governance platform built as a **Java full-stack project** using **Spring Boot Microservices**, **React**, **PostgreSQL**, **Kafka**, **Keycloak**, and **Docker** to digitize citizen services and improve transparency, accountability, and operational efficiency in government administration.

---

## Overview

CivicPulse Nexus is an enterprise-grade Smart Governance platform that provides a centralized digital ecosystem for citizens, government officers, and administrators.

The platform replaces manual government processes with secure digital workflows for grievance management, certificate issuance, permit processing, welfare administration, and budget management.

The system follows a **microservices architecture**, ensuring scalability, modularity, fault isolation, and easier maintenance.

---

# Features

## Authentication & Authorization

- Keycloak Authentication
- JWT-based Security
- OAuth2 Integration
- Role-Based Access Control (RBAC)
- Admin, Officer, and Citizen Roles

---

## Citizen Services

- Citizen Registration
- Complaint Registration
- Complaint Tracking
- Certificate Applications
- Permit Applications
- Welfare Scheme Applications
- Document Upload
- Application Status Tracking

---

## Officer Services

- Document Verification
- Certificate Approval / Rejection
- Permit Approval / Rejection
- Complaint Status Management
- Application Processing

---

## Admin Services

- Welfare Scheme Management
- Beneficiary Management
- Budget Management
- Budget Allocation
- Expense Management
- Fund Distribution
- Analytics Dashboard
- Audit Monitoring
- Grievance Monitoring

---

# System Architecture

```
                     React Frontend
                           │
                    API Gateway (8080)
                           │
          ───────────────────────────────────
           Eureka Discovery Server (8761)
          ───────────────────────────────────
                           │
     ┌───────────────────────────────────────────┐
     │                                           │
 User Service          Citizen Service
 Grievance Service     Service Management Service
 Welfare Service       Budget Service
     │
 PostgreSQL Databases
     │
 Apache Kafka
```

---

# Tech Stack

## Frontend

- React (Vite)
- Material UI
- React Router
- Axios

## Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Cloud Gateway
- Spring Data JPA
- OpenFeign
- Hibernate
- Maven

## Database

- PostgreSQL

## Security

- Keycloak
- OAuth2
- JWT

## Messaging

- Apache Kafka

## Service Discovery

- Netflix Eureka

## DevOps

- Docker

---

# Implemented Modules

## Authentication

- User Login
- JWT Authentication
- Role Management
- Secure API Access

---

## Citizen Management

- Citizen Registration
- Citizen Profile
- Citizen Listing

---

## Grievance Management

### Citizen

- Register Grievance
- View Grievances
- Track Status

### Officer

- Manage Assigned Complaints
- Update Complaint Status

### Admin

- Monitor Complaints
- Dashboard Overview

---

## Certificate Management

Implemented Workflow

```
Citizen
      │
Apply Certificate
      │
Upload Documents
      │
Officer Verification
      │
Approval / Rejection
      │
Certificate Generation
```

Supported Certificates

- Birth Certificate
- Income Certificate
- Residence Certificate
- Death Certificate

---

## Permit Management

Implemented Workflow

```
Citizen
      │
Apply Permit
      │
Verification
      │
Approval
      │
Permit Generation
```

Supported Permits

- Trade License
- Business Permit
- Building Permit
- Utility Permit

---

# Welfare Management

## Welfare Scheme Management

Implemented

- Create Scheme
- View Schemes
- Update Scheme
- Delete Scheme *(Currently under debugging)*

Each Scheme Includes

- Scheme Name
- Department
- Description
- Eligibility Criteria
- Benefit Amount
- Status
- Start Date
- End Date

---

## Welfare Applications

Implemented

- Citizen Welfare Applications
- Officer Approval
- Officer Rejection
- Application Status Tracking

Workflow

```
Citizen
     │
Apply
     │
Eligibility Verification
     │
Officer Review
     │
Approval
     │
Beneficiary Registration
```

---

## Beneficiary Management

Implemented

- Beneficiary Registration
- Beneficiary Listing
- Citizen-wise Beneficiaries
- Scheme-wise Beneficiaries

---

# Budget Management

Implemented

- Budget Creation
- Budget Update
- Budget Deletion
- Department Budgets
- Budget Dashboard
- Remaining Budget Calculation
- Budget Utilization

---

# Budget Allocation

Implemented

- Allocate Budget to Welfare Schemes
- Remaining Allocation Calculation
- Allocation Listing

---

# Expense Management

Implemented

- Record Expenses
- Department Expenses
- Expense Categories
- Expense History

---

# Fund Distribution

Implemented

- Welfare Fund Distribution
- Beneficiary Payments
- Payment Status
- Distribution History

---

# Analytics Dashboard

Implemented

Dashboard includes

- Total Budget
- Utilized Budget
- Remaining Budget
- Budget Utilization %
- Total Expenses
- Total Payments
- Completed Payments
- Pending Payments
- Failed Payments
- Department Statistics

---

# Audit Monitoring

Implemented

- Audit Logs
- Entity Tracking
- Administrative Actions
- Financial Operations
- Compliance Monitoring

---

# Event-Driven Architecture

Apache Kafka is used for asynchronous communication.

Implemented Events

- Grievance Created
- Grievance Assigned
- Grievance Status Updated
- Grievance Escalated
- Citizen Events

---

# Frontend

Implemented React Pages

### Authentication

- Login

### Citizen

- Dashboard
- Register Citizen
- Register Grievance
- My Grievances
- Apply Certificate
- Apply Permit
- My Applications
- Upload Documents
- Track Application

### Officer

- Dashboard
- Verification
- Approval

### Admin

- Dashboard
- Welfare Schemes
- Welfare Applications
- Beneficiaries
- Budgets
- Budget Allocation
- Expenses
- Fund Distribution
- Analytics Dashboard
- Audit Logs

---

# Current Status

## Completed

- Microservices Architecture
- API Gateway
- Eureka Discovery
- Keycloak Authentication
- JWT Security
- Citizen Module
- Grievance Module
- Certificate Module
- Permit Module
- Welfare Module
- Budget Module
- Expense Module
- Fund Distribution Module
- Analytics Dashboard
- Audit Monitoring
- React Frontend Integration

---

## In Progress

- Final Integration Testing
- Welfare Scheme Delete Debugging
- UI Enhancements

---

# Future Enhancements

- AI-based Complaint Classification
- Predictive Governance Analytics
- Mobile Application
- GIS Complaint Mapping
- Blockchain Document Verification
- Email Notifications
- SMS Notifications
- Redis Caching
- CI/CD Deployment Pipeline

---

# Project Highlights

- Enterprise Microservices Architecture
- Secure Authentication using Keycloak
- Event-Driven Communication with Kafka
- RESTful APIs
- Role-Based Access Control
- Cloud-Native Design
- Real-Time Analytics
- Financial Transparency
- Digital Governance Platform

---

# Developer

**Jishnu V**

Backend-Focused Software Engineer

**Tech Stack**

- Java
- Spring Boot
- React
- PostgreSQL
- Kafka
- Keycloak
- Docker
- Microservices

---

## License

This project is developed independently by **Jishnu V** as a personal software engineering and smart governance portfolio project.
