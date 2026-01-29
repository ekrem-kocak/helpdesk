# Helpdesk System

Modern, scalable, and AI-powered helpdesk management system.

## Features

- 🎫 **Ticket Management** - Comprehensive ticket creation, updating, and tracking system
- 🔐 **JWT Authentication** - Secure user authentication
- 🤖 **AI Integration** - Automated response suggestions with Google Gemini
- 📧 **Email Notifications** - Asynchronous email delivery
- ⚡ **Cache Management** - Performance optimization with Redis
- 🔄 **Queue Management** - Background job processing with BullMQ
- 🛡️ **Rate Limiting** - API security and abuse prevention
- 📊 **Swagger API Documentation** - Automatic API reference

## Tech Stack

### Backend

- **Framework:** NestJS
- **Database:** PostgreSQL + Prisma ORM
- **Cache:** Redis
- **Queue:** BullMQ
- **Authentication:** JWT + Passport
- **AI:** Google Gemini API
- **Email:** Nodemailer

### Frontend

- **Framework:** Angular 21
- **Build Tool:** Nx

### DevOps

- **Monorepo:** Nx Workspace
- **Package Manager:** pnpm
- **Code Quality:** ESLint + Prettier + Husky

## Prerequisites

- Node.js >= 18
- pnpm >= 8
- PostgreSQL >= 14
- Redis >= 6
- Docker (optional)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd helpdesk
```

2. Install dependencies:

```bash
pnpm install
```

3. Configure environment variables:

```bash
cp .env.example .env
# Update .env file with your own values
```

4. Start PostgreSQL and Redis with Docker:

```bash
docker-compose up -d
```

5. Run database migrations:

```bash
pnpm prisma:migrate:dev
```

6. Generate Prisma Client:

```bash
pnpm prisma:generate
```

## Development

### Start all applications

```bash
pnpm start
```

### Start API only

```bash
pnpm start:api
```

API runs on `http://localhost:3000` by default.
Swagger documentation: `http://localhost:3000/api`

### Start Frontend only

```bash
pnpm start:client
```

Frontend runs on `http://localhost:4200` by default.

### Database Management

```bash
# View database with Prisma Studio
pnpm prisma:studio

# Create new migration
pnpm prisma:migrate:dev

# Apply migrations in production
pnpm prisma:migrate:deploy
```

## Build

### Build all applications

```bash
pnpm build:all
```

### Build API only

```bash
pnpm build:api
```

### Build Client only

```bash
pnpm build:client
```

## Testing and Linting

```bash
# Run all tests
pnpm test:all

# Test only affected code
pnpm test:affected

# Run lint checks
pnpm lint:all

# Auto-fix lint errors
pnpm lint:all:fix

# Format code
pnpm format
```

## Project Structure

```
helpdesk/
├── apps/
│   ├── api/              # NestJS backend application
│   └── client/           # Angular frontend application
├── libs/
│   ├── api/
│   │   ├── auth/         # Authentication module
│   │   ├── tickets/      # Ticket management
│   │   ├── users/        # User management
│   │   ├── ai/           # AI integration
│   │   ├── mail/         # Email service
│   │   ├── queue/        # Queue management
│   │   ├── cache/        # Cache management
│   │   └── data-access-db/ # Prisma + Database
│   └── shared/
│       ├── config/       # Shared configuration
│       └── interfaces/   # Shared types
└── docker-compose.yml    # PostgreSQL + Redis
```

## API Endpoints

API documentation is available at `http://localhost:3000/api`.

### Main Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /tickets` - List tickets
- `POST /tickets` - Create new ticket
- `GET /tickets/:id` - Get ticket details
- `PATCH /tickets/:id` - Update ticket

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

MIT
