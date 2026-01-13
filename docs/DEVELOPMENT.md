# Development Guide

This guide covers development setup and best practices for the Workflow Configuration Platform.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Docker and Docker Compose (optional)
- Git

## Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd "Workflow Configuration Platform for Client Operations"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npm run seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation, pagination
│   │   ├── utils/          # Helper functions
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   ├── tests/              # Test files
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Helper functions
│   │   └── App.tsx         # Main app component
│   └── package.json
└── docs/                   # Documentation
```

## Code Style

### TypeScript

- Use TypeScript for type safety
- Define interfaces for all data structures
- Avoid `any` type when possible
- Use strict mode

### Backend

- Follow RESTful API conventions
- Use async/await for async operations
- Handle errors properly
- Validate all inputs
- Use Prisma for database operations

### Frontend

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic to custom hooks
- Use TypeScript interfaces for props
- Handle loading and error states

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Writing Tests

- Write unit tests for services
- Write integration tests for routes
- Aim for >80% code coverage
- Test error cases and edge cases

## Database Migrations

### Create Migration

```bash
cd backend
npx prisma migrate dev --name migration_name
```

### Apply Migrations

```bash
npx prisma migrate deploy
```

### Reset Database

```bash
npx prisma migrate reset
```

## API Development

### Adding New Endpoints

1. Create service function in `src/services/`
2. Create controller in `src/controllers/`
3. Create route in `src/routes/`
4. Add validation middleware
5. Add Swagger documentation
6. Write tests

### Example:

```typescript
// services/example.service.ts
export const getExample = async (id: string) => {
  return prisma.example.findUnique({ where: { id } });
};

// controllers/example.controller.ts
export const getExample = async (req: Request, res: Response) => {
  try {
    const example = await exampleService.getExample(req.params.id);
    res.json(example);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// routes/example.routes.ts
router.get('/:id', authenticate, getExample);
```

## Frontend Development

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Create service function in `src/services/`
4. Add navigation link in `Layout.tsx`

### State Management

- Use React hooks for local state
- Use context for global state (if needed)
- Consider Redux for complex state management

## Debugging

### Backend

- Use `console.log` for debugging
- Use VS Code debugger
- Check Prisma Studio: `npx prisma studio`
- Check logs in terminal

### Frontend

- Use React DevTools
- Check browser console
- Use network tab for API calls
- Use Redux DevTools (if using Redux)

## Git Workflow

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and commit: `git commit -m "Description"`
3. Push branch: `git push origin feature/name`
4. Create pull request
5. Review and merge

### Commit Messages

- Use descriptive commit messages
- Follow conventional commits format:
  - `feat:` New feature
  - `fix:` Bug fix
  - `docs:` Documentation
  - `style:` Formatting
  - `refactor:` Code refactoring
  - `test:` Tests
  - `chore:` Maintenance

## Performance Optimization

### Backend

- Use database indexes
- Implement pagination
- Cache frequently accessed data
- Optimize database queries
- Use connection pooling

### Frontend

- Code splitting
- Lazy loading
- Memoization
- Optimize re-renders
- Use CDN for static assets

## Security Best Practices

- Never commit secrets to git
- Use environment variables
- Validate all inputs
- Sanitize user input
- Use HTTPS in production
- Implement rate limiting
- Use prepared statements
- Keep dependencies updated

## Common Issues

### Database Connection

- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Check firewall settings

### CORS Errors

- Verify CORS_ORIGIN in backend .env
- Check frontend API URL

### Prisma Issues

- Run `npx prisma generate`
- Check schema.prisma syntax
- Verify database connection

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
