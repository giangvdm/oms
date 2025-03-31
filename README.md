# Open Media Search
Media Search System - a project from MSc of Computer Science course @ UoL

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blueviolet)
![Openverse API](https://img.shields.io/badge/API-Openverse-1f8dd6)
![Docker](https://img.shields.io/badge/Containerised-Docker-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React.js-61DAFB)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Security](https://img.shields.io/badge/Security-GDPR%20Compliant-yellowgreen)
![HTTPS](https://img.shields.io/badge/HTTPS-Enabled-brightgreen)
![Auth](https://img.shields.io/badge/Auth-JWT-orange)
![Testing](https://img.shields.io/badge/Tests-Automated-informational)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue)
![Agile](https://img.shields.io/badge/Methodology-Agile%20%2F%20Scrum-lightgrey)
![Sprints](https://img.shields.io/badge/Sprints-Weekly-blue)
![Docs](https://img.shields.io/badge/Docs-Complete-success)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ⚙️ Environment Setup
This project supports quick and consistent setup using Docker and Visual Studio Code Dev Containers. Follow the steps below to get started:

### 📦 Prerequisites
- [Docker](https://www.docker.com/) (Engine + CLI)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### 🚀 Getting Started (with Dev Container)

1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. Open in **VS Code**

Open the project folder in Visual Studio Code.

3. Reopen in **Container**

If prompted, click `Reopen in Container`. If not:

- Press `F1` (or Ctrl+Shift+P)
- Select `Dev Containers: Reopen in Container`

This will build the container based on the `.devcontainer` configuration and install all required tools.

### 🐳 Manual Docker Setup (Alternative)

If you're not using Dev Containers:

1. Build and run the app using Docker Compose

```bash
docker-compose up --build
```

2. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 🧪 Testing

To run tests inside the container:

```bash
# Inside the container terminal
npm run test
```