# CivicPulse Nexus: Master Project Completion Matrix

This matrix documents the complete specification requirements across all 4 Milestones of the CivicPulse Nexus platform, their backend services, API contracts, databases, Kafka events, frontend components, RBAC roles, validations, testing evidence, and completion status.

---

## Milestone 1: Citizen & Grievance Management

| Milestone | Requirement | Backend Service | API Endpoint | Database | Kafka Topic/Event | Frontend Page/Component | Role | Validation | Testing Evidence | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **M1** | Citizen User Registration | `user-service` | `POST /api/auth/register` | `user_db.users` | - | `RegisterPage.tsx` | PUBLIC | Email, Password, Name validation | `verify_m1_runtime.ps1` (201 Created) | **COMPLETE** |
| **M1** | Citizen & Staff Login | `user-service` | `POST /api/auth/login` | `user_db.users` | - | `LoginPage.tsx` | PUBLIC | Valid credentials, JWT token issue | `verify_m1_runtime.ps1` (200 OK) | **COMPLETE** |
| **M1** | Citizen Profile Creation | `citizen-service` | `POST /api/citizens` | `citizen_db.citizens` | `CitizenCreatedEvent` | `CitizenProfilePage.tsx` | CITIZEN | DOB, Phone unique, Ward validation | `verify_m1_runtime.ps1` (201 Created) | **COMPLETE** |
| **M1** | Citizen Profile Retrieval | `citizen-service` | `GET /api/citizens/user/{userId}` | `citizen_db.citizens` | - | `CitizenProfilePage.tsx` | CITIZEN | Authenticated token matching | `verify_m1_runtime.ps1` (200 OK) | **COMPLETE** |
| **M1** | Citizen Profile Update | `citizen-service` | `PUT /api/citizens/{id}` | `citizen_db.citizens` | `CitizenUpdatedEvent` | `CitizenEditDialog.tsx` | CITIZEN / ADMIN | Field validation | `verify_m1_runtime.ps1` (200 OK) | **COMPLETE** |
| **M1** | Citizen Directory & Search | `citizen-service` | `GET /api/citizens`, `GET /api/citizens/search` | `citizen_db.citizens` | - | `CitizenListPage.tsx` | OFFICER / ADMIN | Query param search, ward filter | `verify_m1_runtime.ps1` (200 OK) | **COMPLETE** |
| **M1** | Grievance Creation | `grievance-service` | `POST /api/grievances` | `grievance_db.grievances` | `GrievanceCreatedEvent` (`grievance-created`) | `RaiseGrievancePage.tsx` | CITIZEN | Title, Category, Priority, Location | `verify_m1_runtime.ps1` (201 Created) | **COMPLETE** |
| **M1** | My Grievances Query | `grievance-service` | `GET /api/grievances/my` | `grievance_db.grievances` | - | `GrievanceListPage.tsx` | CITIZEN | Authenticated citizenId resolution | `verify_m1_runtime.ps1` (200 OK) | **COMPLETE** |
| **M1** | Grievance Assignment | `grievance-service` | `PUT /api/grievances/{id}/assign` | `grievance_db.grievances` | `GrievanceAssignedEvent` | `GrievanceAssignDialog.tsx` | COMMISSIONER / ADMIN | Valid Department & Officer ID | `verify_m1_runtime.ps1` (200 OK) | **COMPLETE** |
| **M1** | Grievance Status Transitions | `grievance-service` | `PUT /api/grievances/{id}/status` | `grievance_db.grievances` | `GrievanceStatusUpdatedEvent` | `GrievanceStatusDialog.tsx` | OFFICER / COMMISSIONER / ADMIN | State machine transition rules | `verify_m1_runtime.ps1` (200 OK for ASSIGNED $\rightarrow$ IN_PROGRESS $\rightarrow$ ESCALATED $\rightarrow$ RESOLVED $\rightarrow$ CLOSED) | **COMPLETE** |
| **M1** | Grievance Lifecycle History | `grievance-service` | `GET /api/grievances/{id}/history` | `grievance_db.grievance_history` | - | `GrievanceTimeline.tsx` | CITIZEN / OFFICER / ADMIN | Chronological audit logs & remarks | `verify_m1_runtime.ps1` (6 events verified) | **COMPLETE** |
| **M1** | Grievance Feedback | `grievance-service` | `POST /api/grievances/{id}/feedback`, `GET /api/grievances/{id}/feedback` | `grievance_db.grievance_feedback` | - | `GrievanceFeedbackDialog.tsx` | CITIZEN | 1-5 Star rating, resolved status | `verify_m1_runtime.ps1` (201 Created & 200 OK) | **COMPLETE** |
| **M1** | Known Discrepancy: PENDING Constraint | `grievance-service` | `PUT /api/grievances/{id}/status` (`PENDING`) | `grievance_db.grievances` | - | `GrievanceStatusDialog.tsx` | OFFICER / ADMIN | DB check constraint `grievances_status_check` lacks `PENDING` | Logged in `walkthrough.md`, frontend handles error gracefully | **KNOWN DISCREPANCY** |

---

## Milestone 2: Certificate & Permit Management

| Milestone | Requirement | Backend Service | API Endpoint | Database | Kafka Topic/Event | Frontend Page/Component | Role | Validation | Testing Evidence | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **M2** | Certificate Application (5 Types: Birth, Death, Income, Residence, Marriage) | `service-management-service` | `POST /api/applications/certificates/apply` | `service_management_db.applications` | `ApplicationSubmitted` | `ApplyServicePage.tsx` | CITIZEN / ADMIN | Mandatory citizenId & valid CertificateType | `npm run build` passed, backend boot & route verified | **COMPLETE** |
| **M2** | Permit Application (4 Types: Trade, Shop, Building, Water) | `service-management-service` | `POST /api/applications/permits/apply` | `service_management_db.applications` | `ApplicationSubmitted` | `ApplyServicePage.tsx` | CITIZEN / ADMIN | Mandatory citizenId & valid PermitType | `npm run build` passed, backend boot & route verified | **COMPLETE** |
| **M2** | Citizen Application Tracking & History | `service-management-service` | `GET /api/applications/my/{citizenId}`, `GET /api/applications/{id}` | `service_management_db.applications` | - | `MyApplicationsPage.tsx`, `ApplicationDetailPage.tsx` | CITIZEN / ADMIN | Authenticated citizenId matching | `npm run build` passed, backend boot & route verified | **COMPLETE** |
| **M2** | Supporting Document Upload & Management | `service-management-service` | `POST /api/documents/upload/{applicationId}`, `GET /api/documents/application/{applicationId}`, `DELETE /api/documents/{documentId}` | `service_management_db.documents` | - | `ApplicationDetailPage.tsx` | CITIZEN / OFFICER / ADMIN | Multipart file upload (PDF/JPG/PNG) | `npm run build` passed, backend boot & route verified | **COMPLETE** |
| **M2** | Officer Document Verification | `service-management-service` | `GET /api/officer/pending`, `PUT /api/officer/verify/{applicationId}`, `PUT /api/officer/document/{documentId}` | `service_management_db.applications`, `documents` | `DocumentVerified` | `OfficerApplicationsPage.tsx` | OFFICER / ADMIN | Verification status & remarks | `npm run build` passed, backend boot & route verified | **COMPLETE** |
| **M2** | Department Approval & Rejection | `service-management-service` | `PUT /api/officer/approve/{applicationId}`, `PUT /api/officer/reject/{applicationId}` | `service_management_db.applications` | - | `OfficerApplicationsPage.tsx` | OFFICER / COMMISSIONER / ADMIN | Approval requires completed verification | `npm run build` passed, backend boot & route verified | **COMPLETE** |
| **M2** | Automated Certificate Generation | `service-management-service` | `POST /api/certificate/generate/{applicationId}` | `service_management_db.certificates` | `CertificateGenerated` | `OfficerApplicationsPage.tsx`, `CertificatePreviewDialog.tsx` | COMMISSIONER / ADMIN | Unique certificate number generation | `npm run build` passed, backend boot & route verified | **COMPLETE** |
| **M2** | Automated Permit Generation | `service-management-service` | `POST /api/permit/generate/{applicationId}` | `service_management_db.permits` | `PermitGenerated` | `OfficerApplicationsPage.tsx`, `CertificatePreviewDialog.tsx` | COMMISSIONER / ADMIN | Unique permit number generation | `npm run build` passed, backend boot & route verified | **COMPLETE** |
| **M2** | PDF Download & Digital Signature Authentication | `service-management-service` | `GET /api/certificate/download/{applicationId}`, `GET /api/permit/download/{applicationId}` | `service_management_db.download_logs` | - | `CertificatePreviewDialog.tsx` | CITIZEN / COMMISSIONER / ADMIN | Binary PDF stream & digital signature verification badge | `npm run build` passed, backend boot & route verified | **COMPLETE** |
| **M2** | Certificate/Permit Service Dashboard & Stats | `service-management-service` | `GET /api/dashboard/stats` | `service_management_db` tables | - | `OfficerDashboard.tsx`, `AdminDashboard.tsx` | PUBLIC / OFFICER / ADMIN | Total applications, revenue, download stats | `npm run build` passed, backend boot & route verified | **COMPLETE** |

---

## Milestone 3: Welfare & Budget Management

| Milestone | Requirement | Backend Service | API Endpoint | Database | Kafka Topic/Event | Frontend Page/Component | Role | Validation | Testing Evidence | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **M3** | Welfare Scheme Catalog & CRUD | `welfare-service` | `POST /api/welfare/schemes`, `GET /api/welfare/schemes`, `PUT /api/welfare/schemes/{id}` | `welfare_db.welfare_schemes` | - | `WelfareSchemesPage.tsx` | ADMIN / COMMISSIONER | Scheme budget, eligibility criteria | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M3** | Citizen Welfare Scheme Application | `welfare-service` | `POST /api/welfare/applications/apply`, `GET /api/welfare/applications/my/{citizenId}` | `welfare_db.welfare_applications` | - | `ApplyWelfarePage.tsx`, `MyWelfareApplicationsPage.tsx` | CITIZEN | Annual income, age, criteria check | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M3** | Eligibility Verification & Application Approval | `welfare-service` | `GET /api/welfare/applications/pending`, `PUT /api/welfare/applications/{id}/approve`, `PUT /api/welfare/applications/{id}/reject` | `welfare_db.welfare_applications` | - | `WelfareManagementPage.tsx` | OFFICER / ADMIN | Automatic & manual eligibility checks | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M3** | Beneficiary Enrollment & Tracking | `welfare-service` | `POST /api/welfare/beneficiaries/register/{applicationId}`, `GET /api/welfare/beneficiaries` | `welfare_db.beneficiaries` | - | `WelfareManagementPage.tsx` | OFFICER / ADMIN | Duplicate beneficiary prevention | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M3** | Budget Planning & Annual/Quarterly Creation | `budget-service` | `POST /api/budget`, `GET /api/budget`, `PUT /api/budget/{id}` | `budget_db.budgets` | - | `BudgetDashboardPage.tsx` | COMMISSIONER / ADMIN | Fiscal year, department budget limits | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M3** | Department & Scheme Budget Allocations | `budget-service` | `POST /api/budget/allocation`, `GET /api/budget/allocation/budget/{budgetId}` | `budget_db.budget_allocations` | - | `BudgetAllocationDialog.tsx` | COMMISSIONER / ADMIN | Allocated amount $\le$ remaining budget | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M3** | Departmental Expense Management | `budget-service` | `POST /api/expenses`, `GET /api/expenses`, `GET /api/expenses/budget/{budgetId}` | `budget_db.expenses` | - | `ExpenseManagementPage.tsx` | OFFICER / ADMIN | Valid expense category & budget ID | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M3** | Automated Fund Distribution & Payment Tracking | `budget-service` | `POST /api/fund-distributions`, `PUT /api/fund-distributions/{id}/complete`, `PUT /api/fund-distributions/{id}/fail` | `budget_db.fund_distribution` | - | `FundDistributionPage.tsx` | COMMISSIONER / ADMIN | Beneficiary verification, bank details | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M3** | Financial Compliance & Audit Trail | `budget-service` | `GET /api/audit`, `GET /api/audit/entity/{entityType}` | `budget_db.audit_logs` | - | `AuditLogsPage.tsx` | COMMISSIONER / ADMIN | Immutable transaction timestamps | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M3** | Budget Analytics & Utilization Dashboard | `budget-service` | `GET /api/budget/dashboard`, `GET /api/analytics/dashboard` | `budget_db` tables | - | `BudgetDashboardPage.tsx` | COMMISSIONER / ADMIN | Utilization %, remaining balances | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |

---

## Milestone 4: Governance Analytics & Consolidated Reporting

| Milestone | Requirement | Backend Service | API Endpoint | Database | Kafka Topic/Event | Frontend Page/Component | Role | Validation | Testing Evidence | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **M4** | OpenFeign Multi-Service Data Aggregation | `reporting-service` | Internal OpenFeign Clients (`CitizenClient`, `GrievanceClient`, `ServiceManagementClient`, `WelfareClient`, `BudgetClient`) | Aggregates all 5 DBs | - | Reporting Service Pipeline | SYSTEM | Fallbacks for resilient aggregation | Backend compiled cleanly | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M4** | Executive Governance Dashboard | `reporting-service` | `GET /api/reports/dashboard` | Consolidated | - | `ExecutiveDashboardPage.tsx` | COMMISSIONER / ADMIN | Cross-service KPI cards, resolution rates | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M4** | Citizen Demographics Analytics Report | `reporting-service` | `GET /api/reports/citizens` | `citizen_db` | - | `CitizenReportPage.tsx` | COMMISSIONER / ADMIN | Ward distribution, active/inactive ratios | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M4** | Grievance Redressal & SLA Performance Report | `reporting-service` | `GET /api/reports/grievances` | `grievance_db` | - | `GrievanceReportPage.tsx` | COMMISSIONER / ADMIN | Category breakdown, priority SLA | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M4** | Municipal Revenue & Collections Report | `reporting-service` | `GET /api/reports/revenue` | `service_management_db` | - | `RevenueReportPage.tsx` | COMMISSIONER / ADMIN | Department collections, monthly totals | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M4** | Budget Allocation & Welfare Disbursement Report | `reporting-service` | `GET /api/reports/budget` | `budget_db`, `welfare_db` | - | `BudgetReportPage.tsx` | COMMISSIONER / ADMIN | Allocation vs utilization, payments | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |
| **M4** | Cross-Department Performance Scorecard | `reporting-service` | `GET /api/reports/performance` | Cross-domain | - | `DepartmentPerformancePage.tsx` | COMMISSIONER / ADMIN | Department performance scores | Backend compiled & controller verified | **BACKEND COMPLETE / FRONTEND PENDING** |

---

## Infrastructure & Gateway Configuration

| Component | Port | Config / Route | Health / Discovery | Status |
| :--- | :---: | :--- | :--- | :---: |
| **Eureka Discovery Server** | `8761` | `discovery-service` | `http://localhost:8761/eureka` | **VERIFIED & UP** |
| **Spring Cloud API Gateway** | `8080` | `gateway-service` (`routes[0..6]`) | Routes all 7 backend services | **VERIFIED & UP** |
| **Keycloak IAM (OAuth2/OIDC)** | `8090` | `civicpulse` realm | JWK Set at `/protocol/openid-connect/certs` | **CONFIGURED** |
| **PostgreSQL 18** | `5432` | 6 independent databases (`user_db`, `citizen_db`, `grievance_db`, `service_management_db`, `welfare_db`, `budget_db`) | All tables & relations initialized | **VERIFIED & UP** |
| **Apache Kafka (KRaft)** | `9092` | Topics: `grievance-created`, `grievance-assigned`, `grievance-status-updated`, `citizen-updated`, `application-events` | Event streaming active | **VERIFIED** |
| **Frontend React 19 + TypeScript** | `5173` | `civicpulse-frontend` (Vite) | Production build `✓ built in 1.28s` | **VERIFIED & READY** |
