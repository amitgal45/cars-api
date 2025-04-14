# Cars API

A modern NestJS-based API for managing car-related data with authentication and user management.

## Project Structure

```
cars-api/
├── src/                    # Main application source
│   ├── auth/              # Authentication routes and controllers
│   ├── config/            # Application configuration
│   ├── app.module.ts      # Root application module
│   ├── main.ts            # Application entry point
│   └── app.controller.ts  # Root controller
│
├── libs/                  # Shared libraries
│   ├── auth/             # Authentication library
│   │   ├── guards/       # Authentication guards
│   │   ├── strategies/   # Passport strategies
│   │   ├── decorators/   # Custom decorators
│   │   └── interfaces/   # Type definitions
│   │
│   ├── common/           # Common utilities
│   ├── database/         # Database configuration and entities
│   └── users/            # User management
```

## Features

- 🔐 JWT-based authentication
- 👥 User management
- 🗄️ PostgreSQL database integration
- 📝 Swagger API documentation
- 🧪 Testing setup with Jest
- 🔄 TypeORM for database operations
- 🛡️ Role-based access control

## Prerequisites

- Node.js 20.18.0 or higher
- pnpm 8.5.1
- PostgreSQL database

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cars-api
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=cars_api

JWT_ACCESS_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

JWT_ADMIN_ACCESS_SECRET=your_admin_secret
JWT_ADMIN_ACCESS_EXPIRATION=15m
```

## Development

Start the development server:
```bash
pnpm start:dev
```

The API will be available at `http://localhost:3000`

## API Documentation

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## Testing

Run the test suite:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

Generate test coverage:
```bash
pnpm test:cov
```

## Building for Production

Build the application:
```bash
pnpm build
```

Start the production server:
```bash
pnpm start:prod
```

## Available Scripts

- `pnpm start` - Start the application
- `pnpm start:dev` - Start the application in development mode
- `pnpm start:debug` - Start the application in debug mode
- `pnpm start:prod` - Start the application in production mode
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:cov` - Generate test coverage
- `pnpm lint` - Run linting
- `pnpm format` - Format code with Prettier
- `pnpm build` - Build the application

## Libraries

### @gearspace/auth
Authentication library providing JWT-based authentication, guards, and strategies.

### @gearspace/database
Database configuration and entity management using TypeORM.

### @gearspace/users
User management functionality including CRUD operations and role management.

### @gearspace/common
Shared utilities and common functionality used across the application.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED License.
