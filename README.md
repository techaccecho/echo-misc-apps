# Echo Miscellaneous Apps

A collection of miscellaneous applications built with Fastify, pnpm, and TypeScript.

## Features

### ⏳ Countdown App
A dark-themed, atmospheric countdown application.
- **Backend-Driven:** The target date is strictly controlled by the backend (configurable via environment variables) to prevent client-side manipulation.
- **Dynamic Injection:** The Fastify server injects the target timestamp directly into the HTML template on serve.
- **Visual Sequence:** Features a dramatic visual sequence and "UNLOCKED" message (fetched from the backend) when the timer reaches zero.
- **Unified Error Experience:** All 4xx and 5xx errors serve a themed "Failed to establish connection" page to maintain immersion.

## Tech Stack

- **Backend:** [Fastify](https://www.fastify.io/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Package Manager:** [pnpm](https://pnpm.io/)
- **Documentation:** [Swagger/OpenAPI](https://swagger.io/)
- **Linting:** [Biome](https://biomejs.dev/)

## Project Structure

```text
src/
├── fe/              # Frontend assets and HTML templates
│   ├── assets/      # Static assets (CSS, JS)
│   │   ├── css/     # Externalized stylesheets
│   │   └── js/      # Frontend logic (countdown timer, etc.)
│   ├── count-down/  # Countdown app templates (HTML)
│   └── error.html   # Fallback error page
├── routes/          # API route definitions
├── services/        # Backend business logic and services
└── index.ts         # Server entry point
```

## Getting Started

### Prerequisites

- Node.js (Latest)
- pnpm

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure environment:
   Create a `.env` file (or copy from `.env.example` if available) and set the target date:
   ```text
   PORT=3000
   TARGET_DATE=2026-07-01T00:00:00Z
   ```

### Development

Start the development server with hot-reload:

```bash
pnpm dev
```

The server will be available at `http://localhost:3000`.
- Countdown App: `http://localhost:3000/countdown`
- API Documentation: `http://localhost:3000/api-docs`

### Building for Production

```bash
pnpm build
pnpm start
```

## API Endpoints

- `GET /countdown`: Serves the atmospheric countdown HTML page with injected target timestamp.
- `GET /v1/api/countdown`: Returns the target date, timestamp, and the "Unlocked" message (if reached) as JSON.
- `GET /api-docs`: Swagger UI documentation for all API routes.
