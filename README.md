# 🎫 Helpdesk System

Full-stack helpdesk management system with AI-powered ticket responses, built using modern technologies and best practices.

## 🌐 Live Demo

**Frontend:** [helpdesk-xi-pied.vercel.app](https://helpdesk-xi-pied.vercel.app)  
**API Documentation:** [helpdesk-api-beta.vercel.app/api](https://helpdesk-api-beta.vercel.app/api)

## ✨ Features

- 🎫 Ticket management with full CRUD operations
- 🔐 JWT authentication with HTTP-only cookies & refresh tokens
- 🤖 AI-powered response suggestions (Google Gemini)
- 📧 Asynchronous email notifications
- ⚡ Redis caching for performance optimization
- 🔄 Background job processing with BullMQ
- 🎨 Modern, responsive UI with shadcn/ui
- 📊 Auto-generated API documentation (Swagger)

## 🛠️ Tech Stack

**Backend:** NestJS • PostgreSQL • Prisma • Redis • BullMQ • JWT  
**Frontend:** Next.js 16 • React 19 • TypeScript • Tailwind CSS 4 • shadcn/ui  
**State Management:** TanStack Query • React Hook Form • Zod  
**DevOps:** Nx Monorepo • pnpm • Docker • ESLint • Prettier

## 🚀 Quick Start

### Prerequisites

Node.js 18+ • pnpm 8+ • PostgreSQL 14+ • Redis 6+ • Docker (optional)

### Installation

```bash
# Clone and install
git clone <repository-url>
cd helpdesk
pnpm install

# Setup environment variables (create .env file)
cp .env.example .env

# Start services with Docker
docker-compose up -d

# Setup database
pnpm prisma:generate
pnpm prisma:migrate:dev

# Start applications
pnpm start:api      # API on http://localhost:3001
pnpm start:client   # Client on http://localhost:3000
```

**📚 API Documentation:** http://localhost:3001/api

## 💻 Development

### Main Commands

```bash
# Development
pnpm start:api              # Start API (port 3001)
pnpm start:client           # Start Client (port 3000)

# Build
pnpm build:all              # Build all apps
pnpm build:api              # Build API only
pnpm build:client           # Build client only

# Database
pnpm prisma:studio          # Open Prisma Studio
pnpm prisma:migrate:dev     # Create migration

# Code Quality
pnpm test:all               # Run all tests
pnpm lint:all               # Lint all projects
pnpm lint:all:fix           # Auto-fix linting
pnpm format                 # Format with Prettier

# Nx
pnpm graph                  # View dependency graph
nx reset                    # Clear Nx cache
```

## 📁 Project Structure

```
helpdesk/
├── apps/
│   ├── api/                    # NestJS Backend
│   └── client/                 # Next.js Frontend
│
├── libs/
│   ├── api/
│   │   ├── auth/               # Authentication & JWT
│   │   ├── tickets/            # Ticket management
│   │   ├── users/              # User management
│   │   ├── ai/                 # AI integration
│   │   ├── mail/               # Email service
│   │   ├── queue/              # Background jobs
│   │   ├── cache/              # Redis caching
│   │   └── data-access-db/     # Prisma ORM
│   │
│   └── shared/
│       ├── ui/                 # Shared UI components
│       └── interfaces/         # Shared types
│
└── docker-compose.yml          # PostgreSQL + Redis
```

## 🔌 API Endpoints

Full documentation: **http://localhost:3001/api** (Swagger UI)

**Authentication:** `/api/auth/register` • `/api/auth/login` • `/api/auth/logout`  
**Tickets:** `/api/tickets` (CRUD operations)  
**Users:** `/api/users` (Admin only)  
**AI:** `/api/ai/suggest-response` (AI-powered responses)

## 🏗️ Architecture

**Backend (NestJS):** Modular architecture with dependency injection, Prisma for data access, JWT authentication, Redis caching, and BullMQ for background jobs.

**Frontend (Next.js):** App Router with Server Components for data fetching, Client Components for interactivity, TanStack Query for server state management.

**Monorepo (Nx):** Code sharing between apps, incremental builds, affected project detection, and centralized dependency management.

## 📝 License

MIT License - feel free to use this project for learning and portfolio purposes.

---

**Built with modern web technologies for learning and showcasing full-stack development skills.**
