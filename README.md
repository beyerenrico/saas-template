# SaaS Template

This is a basic template which features user registration, login, and password reset. It consists of a dashboard and account settings pages, where users can update their information.

## Stack

- [SvelteKit](https://kit.svelte.dev/) as the frontend framework
- [Carbon UI](https://carbon-components-svelte.onrender.com/) as the UI system
- [Docker](https://www.docker.com/) for containerization
- [PostgreSQL](https://www.postgresql.org/) as the database
- [Prisma](https://www.prisma.io/) as the ORM
- [Lucia Auth](https://lucia-auth.vercel.app/) for user authentication

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/), [npm](https://www.npmjs.com/), or [pnpm](https://pnpm.io/)
- [nginx](https://www.nginx.com/)

### Configuration

Create a duplicate of the `.env.example` file and rename it to `.env`. Then, fill in the values for the environment variables.

### Installation

1. Clone the repo

```bash
  git clone
```

2. Install dependencies

```bash
  npm install
```

3. Start the database

```bash
  docker-compose up -d
```

4. Push the database schema to the database

```bash
  npx prisma push
```

5. Generate the Prisma client

```bash
  npx prisma generate
```

6. Start the development server

```bash
  npm run dev
```

### Extend database schema

When you want to extend the database schema, you can do so by editing the `prisma/schema.prisma` file. After you have made your changes, you can push the changes to the database by running the following command:

```bash
  npx prisma push
  npx prisma generate
```

## Roadmap

- [x] User registration
- [ ] User email verification
- [x] User login
- [x] User logout
- [x] User password reset
- [x] Two-factor authentication
- [x] Basic Overview Dashboard
- [ ] Global system for toasts and notifications
- [ ] Account Settings
  - [x] Profile page to edit name and email
  - [x] Security page to edit password
  - [ ] Settings for theme, language and accessibility
- [ ] Pricing System
  - [ ] Free tier
  - [ ] Paid tier
