# NodeNexus Cloud ☁️

**NodeNexus Cloud** is a self-hosted, full-stack cloud platform dashboard designed to manage local containerized cloud infrastructure. It emulates essential AWS-like services (EC2, S3, Lambda, RDS, DynamoDB, EBS, VPC, IAM, API Gateway) via Docker, MinIO, PostgreSQL, and Traefik.

---

## 🚀 Features

- **Compute Services**:
  - **EC2**: Launch, stop, terminate, and monitor virtual instances powered by Docker containers.
  - **Lambda**: Deploy serverless function execution environments with event triggers.
  - **Containers**: Manage Docker containers, view real-time logs, and inspect metrics.
- **Storage & Databases**:
  - **S3 Object Storage**: Bucket creation, object uploads/downloads powered by MinIO integration.
  - **RDS & DynamoDB**: Relational database instances and document/key-value store management.
  - **EBS**: Persistent block storage volume provisioning and attachment.
- **Networking & Security**:
  - **VPC**: Virtual Private Cloud network isolation and subnet management.
  - **API Gateway**: Route mapping and ingress management powered by Traefik.
  - **IAM**: User authentication, role-based access control (RBAC), and API key management.
- **Monitoring & Tools**:
  - Real-time system resource dashboard (CPU, Memory, Disk, Network).
  - Integrated web terminal and marketplace.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Python FastAPI
- **Security**: JWT Authentication, Passlib bcrypt
- **Database & Storage**: Async SQLAlchemy, PostgreSQL, MinIO Python Client
- **Infrastructure Automation**: Docker SDK for Python, Psutil

### Frontend
- **Framework**: React 18 with TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide Icons + Custom Components
- **State Management**: Custom Reactive Store & UI Context

### Core Infrastructure
- **Reverse Proxy**: Traefik v2
- **Orchestration**: Docker Compose

---

## 📦 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) v18+ (for frontend development)
- [Python](https://www.python.org/) 3.11+ (for backend development)

### Quick Start with Docker Compose

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NodeNexus/NodeNexus-Cloud.git
   cd NodeNexus-Cloud
   ```

2. **Launch Core Infrastructure & Services**:
   ```bash
   docker-compose up -d --build
   ```

3. **Access the Dashboard**:
   Open your browser and navigate to `http://localhost:3000` (or `http://localhost:8000/docs` for API documentation).

---

## 📁 Directory Structure

```
NodeNexus-Cloud/
├── backend/            # FastAPI REST backend & service handlers
│   ├── routers/        # Service route endpoints (ec2, s3, iam, lambda, rds, etc.)
│   ├── services/       # Docker/MinIO SDK wrappers and system metrics
│   └── models/         # SQLAlchemy data models & schemas
├── frontend/           # React + Vite frontend UI
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Dashboards for Compute, Storage, Networking, Security
│   │   └── store/      # Application state
├── core-infra/         # Traefik configuration & reverse proxy setups
└── docker-compose.yml  # Multi-container service orchestration
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request for new features, UI enhancements, or bug fixes.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
