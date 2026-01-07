
# ⚡ FlashLink - High-Scale URL Shortener

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/Rabbitmq-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)

FlashLink is a production-ready URL shortening service designed to handle high-traffic campaigns (e.g., 1 million SMS blasts). It leverages an asynchronous, event-driven architecture to ensure low latency for users while maintaining data consistency.

---

## 🏗 System Architecture

The project solves the "Read-Heavy" and "Write-Burst" problem using a microservices-style approach orchestrated via Docker Compose.

### The Workflow
1.  **Write (Shortening):** Persists URL mapping to **PostgreSQL**.
2.  **Read (Redirecting):**
    * **Cache First:** Checks **Redis** for sub-millisecond redirects.
    * **Async Analytics:** Instead of writing to the DB during the redirect (which slows down the user), the API fires a "Click Event" to **RabbitMQ**.
3.  **Processing:** A background worker consumes events from the queue and performs bulk updates to the database.

---

## 🚀 Tech Stack & Features

* **API Gateway:** NestJS (Node.js)
* **Database:** PostgreSQL (with `pgvector` image)
* **Caching:** Redis (LRU Eviction Policy enabled)
* **Message Queue:** RabbitMQ (Async processing)
* **Infrastructure:** Docker & Docker Compose

### 🔧 Key Engineering Highlights
* **Resilience:** Implemented strict `healthcheck` policies. The API will not crash-loop; it waits for DB and Queue to be fully healthy.
* **Resource Management:** Redis and RabbitMQ containers have hard memory limits (`deploy.resources.limits`) to prevent OOM (Out of Memory) incidents on the host.
* **Security:** No default passwords. All services are protected via environment variables.
* **Persistence:** Docker Volumes ensure data survives container restarts.

---

## 🛠️ Getting Started

### Prerequisites
* Docker Desktop / Docker Engine installed.
* (Optional) Node.js if you want to run local tests.

### Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/flashlink.git](https://github.com/your-username/flashlink.git)
    cd flashlink
    ```

2.  **Configure Environment**
    Create a `.env` file in the root directory. Refer `.env.sample` for the keys

3.  **Run with Docker Compose**
    Build and start the entire system with one command:
    ```bash
    docker-compose up --build
    ```

4.  **Verify Status**
    * **API:** `http://localhost:3000`
    * **RabbitMQ Dashboard:** `http://localhost:15672` (User: `guest` / Pass: `guest`)

---

## 🔌 API Endpoints

### 1. Shorten a URL
**POST** `/shorten`
```json
{
  "url": "[https://www.youtube.com/watch?v=dQw4w9WgXcQ](https://www.youtube.com/watch?v=dQw4w9WgXcQ)",
  "code": "rickroll"
}

```

### 2. Access a URL

**GET** `/{code}`

* Redirects to the original URL.
* Triggers background analytics event.

---

## 🐳 Docker Services Overview

| Service Name | Internal Port | Host Port | Role |
| --- | --- | --- | --- |
| **flashlink-server** | 3000 | 3000 | NestJS API & Worker |
| **flashlink-postgres** | 5432 | 5444 | Persistent Data Store |
| **flashlink-redis** | 6379 | 6444 | Caching Layer (Max 128MB) |
| **flashlink-queue** | 5672 | - | Event Broker |
| **flashlink-queue (UI)** | 15672 | 15672 | Management Dashboard |

---

## 🧪 Development Notes

* **Hot Reload:** The `docker-compose.yml` mounts the local directory in dev mode, so changes to `src/` are reflected instantly without rebuilding.
* **Database Init:** The `init.sql` script automatically creates necessary tables and indexes on the first container run.

---

## 📜 License

This project is open-source and available under the MIT License.

