# Recurb Coding Standards

## Database Queries
- Never use `SELECT *` in queries
- Always specify exact column names needed
- Use explicit column selection for better performance and maintainability

## Code Quality
- Use TypeScript strict mode
- Handle all error cases explicitly
- Add proper type definitions for all functions
- Use meaningful variable and function names

## Security
- Never expose sensitive data in API responses
- Always validate user input
- Use parameterized queries to prevent SQL injection
- Implement proper authentication checks on all protected routes
