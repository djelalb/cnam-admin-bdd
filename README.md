# SSMS Web Client

A web-based SQL Server Management Studio alternative built with React and Node.js.

## Features
- **Authentication:** Connect via SQL Server Auth or Windows Auth.
- **Object Explorer:** View databases and server logins.
- **SQL Editor:** Run queries and see results in a tabular format.
- **Administration:** Create/Drop databases, Create/Drop logins, and Backup databases.

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS, Lucide-React, Axios.
- **Backend:** Node.js, Express, mssql (tedious).

## Getting Started

### Prerequisites
- Node.js (v16+)
- Access to a SQL Server instance.

### Installation

1. Install dependencies for the whole project:
   ```bash
   npm install
   ```

2. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

3. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Development
The project uses npm workspaces. You can run commands from the root:
- `npm run dev --workspace=backend`
- `npm run dev --workspace=frontend`
