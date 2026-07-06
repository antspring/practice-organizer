# Practice Organizer Backend

Backend API for organizing student internships in companies.

## Requirements

- Node.js 26+
- npm
- Docker and Docker Compose

## Environment

Create a local environment file from the example:

```bash
cp .env.example .env
```

Update secrets and credentials in `.env` before running the app outside local development.

## Development

Install dependencies:

```bash
npm install
```

Start PostgreSQL for local development:

```bash
docker compose up -d postgres
```

Run database migrations:

```bash
npm run db:migrate
```

Run database seeders:

```bash
npm run db:seed
```

Start the API in watch mode:

```bash
npm run dev
```

The API uses `PORT` from `.env`.

## API Docs

In development mode, Swagger UI is available at:

```bash
http://localhost:3000/docs
```

The OpenAPI JSON document is available at:

```bash
http://localhost:3000/docs.json
```

## Docker

Start the API and PostgreSQL together:

```bash
docker compose up --build
```

Stop containers:

```bash
docker compose down
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the API in watch mode with `tsx`. |
| `npm run build` | Generates Prisma Client and compiles TypeScript to `dist`. |
| `npm start` | Starts the compiled API from `dist/index.js`. |
| `npm run start:migrate` | Applies production migrations and starts the compiled API. |
| `npm run prisma:generate` | Generates Prisma Client. |
| `npm run prisma:validate` | Validates the Prisma schema. |
| `npm run db:migrate` | Creates and applies a development migration. |
| `npm run db:seed` | Runs database seeders. |
| `npm run db:studio` | Opens Prisma Studio. |
