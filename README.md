# TodoList with Antigravity

A Todo List application built with React and Vite, featuring a local Supabase environment for backend services and orchestrated using Docker Compose.

## 🚀 Getting Started

To start the development environment execute:

```bash
docker compose up
```

This will:
1. Start the **frontend** development server.
2. Spin up a **local Supabase stack** (PostgreSQL, Auth, API, Studio).
3. Initialize the database with required migrations.

## 🔗 Service Links

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend App** | [http://localhost:5173](http://localhost:5173) | The React + Vite application |
| **Supabase Studio** | [http://localhost:54323](http://localhost:54323) | Dashboard for local DB, Auth, and Storage |
| **Mailpit (Inbucket)**| [http://localhost:54324](http://localhost:54324) | Local email testing dashboard |

## 🛠 Project Structure

```text
.
├── frontend/             # React + Vite application
│   ├── src/              # Application logic and UI components
│   └── .devcontainer/    # Dev container configuration
├── supabase/             # Local database and service configuration
│   ├── migrations/       # SQL database schema migrations
│   └── config.toml       # Supabase CLI configuration
├── docker-compose.yml    # Main orchestration file
└── README.md             # Project documentation
```

## 🏗 Services Used

- **Vite + React**
- **TypeScript**
- **Supabase Local Dev**
- **PostgreSQL**
- **Mailpit (via Inbucket)**
- **Docker Compose**
