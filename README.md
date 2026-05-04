# 🏥 Hospital Management System

A full-stack web application for managing hospital operations including patients, appointments, admissions, prescriptions, and billing.

**Live Demo:** [hms-project-2026.vercel.app](https://hms-project-2026.vercel.app)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MySQL (hosted on Railway) |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Features

- **Patients** — Add, edit, delete patients. Age auto-calculated via `fn_Calculate_Age()`
- **Appointments** — Book appointments with double-booking prevention via trigger
- **Admissions** — Admit and discharge patients. Auto-billing on discharge via `sp_Discharge_Patient_And_Bill()`
- **Prescriptions** — Prescribe medications with cost calculated via `fn_Calculate_Medication_Cost()`
- **Audit Log** — Track all patient record changes via `trg_Audit_Patient_Update`

---

## Project Structure

```
hms-project/
├── client/          # React frontend
│   ├── src/
│   │   ├── pages/   # Patients, Appointments, Admissions, Prescriptions, AuditLog
│   │   ├── components/  # Sidebar
│   │   └── api.js   # Base URL config
│   └── vercel.json
│
└── server/          # Express backend
    ├── routes/      # patients, appointments, admissions, prescriptions, staff, rooms, inventory, auditLog
    ├── db.js        # MySQL connection pool
    └── index.js     # Express app entry point
```

---

## Database

The MySQL database is hosted on Railway and includes:

- **11 Tables** — Patients, Staff, Departments, Rooms, Schedules, Appointments, Admissions, Inventory, Prescriptions, Invoices, Transactions
- **5 Stored Procedures** — sp_Admit_Patient, sp_Discharge_Patient_And_Bill, sp_Book_Appointment, sp_Schedule_Staff_Shift, sp_Process_Transaction
- **5 Functions** — fn_Calculate_Age, fn_Get_Bed_Availability, fn_Length_Of_Stay, fn_Total_Current_Balance, fn_Calculate_Medication_Cost
- **3 Views** — v_active_admissions, v_unpaid_invoices, v_department_stats
- **Triggers** — Audit logging, room status updates, double-booking prevention, invoice generation

---

## Local Setup

### Prerequisites
- Node.js
- MySQL database (or Railway account)

### 1. Clone the repo
```bash
git clone https://github.com/orangebead/hms-project.git
cd hms-project
```

### 2. Setup the backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:
```
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_PORT=your-db-port
```

Run the server:
```bash
node index.js
```

### 3. Setup the frontend
```bash
cd client
npm install
```

Create a `.env.development` file in the `client/` folder:
```
VITE_API_URL=http://127.0.0.1:3001
```

Run the frontend:
```bash
npm run dev
```

Open `http://localhost:5173`

---

## Deployment

| Service | Purpose | Config |
|---------|---------|--------|
| Railway | MySQL database | — |
| Railway | Express backend | Root directory: `server` |
| Vercel | React frontend | Root directory: `client` |

---


## Course

CS F212 — Database Systems, BITS Pilani Dubai Campus
