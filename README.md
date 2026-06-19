# 📋 ProjectHub — Project Management Dashboard

A full-stack **Project Management Dashboard** built with **Node.js, Express, and Vanilla JavaScript**.

**Developed by: Nimitha BC**

---

## 📌 Features

- 📁 **View & Create Projects** — Create projects with name, description, status, priority, deadline and color
- 🗑️ **Delete Projects** — Remove projects along with all associated tasks
- ✅ **Task Management** — Kanban board with To Do, In Progress, Done columns
- 👥 **Team Members** — Add and manage team members with roles and avatars
- 📊 **Progress Tracking** — Auto-calculated progress based on task completion
- 📅 **Deadlines & Status** — Track project deadlines with overdue alerts
- 🔍 **Search & Filter** — Filter projects and tasks by status and priority
- 📈 **Charts** — Doughnut chart showing task overview using Chart.js
- 💾 **Data Persistence** — Data saved in JSON files on the server

---

## 🛠️ Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Charts | Chart.js |
| Storage | JSON files (fs module) |

---

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/project-management-dashboard.git
cd project-management-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the server
```bash
npm start
```

### 4. Open in browser
```
http://localhost:3000
```

---

## 📁 Project Structure

```
project-management-dashboard/
│
├── server.js              → Backend server (Express + REST APIs)
├── package.json           → Dependencies
├── .gitignore
│
├── public/                → Frontend files
│   ├── index.html         → Main HTML (sidebar + all pages)
│   ├── css/style.css      → All styles
│   └── js/app.js          → Frontend JavaScript
│
└── data/                  → JSON data storage
    ├── projects.json      → Projects data
    ├── tasks.json         → Tasks data
    └── members.json       → Team members data
```

---

## 📸 Pages

- **Dashboard** — Stats, task overview chart, recent projects, upcoming deadlines
- **Projects** — Project cards with progress bar, filter by status/priority
- **Project Detail** — Kanban board for tasks within a project
- **All Tasks** — Global Kanban board across all projects
- **Team Members** — Add and view team members

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create a project |
| PUT | /api/projects/:id | Update a project |
| DELETE | /api/projects/:id | Delete a project |
| GET | /api/projects/:id/tasks | Get tasks for a project |
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |
| GET | /api/members | Get all members |
| POST | /api/members | Add a member |
| DELETE | /api/members/:id | Remove a member |
| GET | /api/stats | Get dashboard stats |

---

*This project was built as part of an internship assignment.*
