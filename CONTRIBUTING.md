# Contributing to Recurb

Thank you for your interest in contributing to Recurb! We welcome contributions from the community.

## 📋 Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- SQLite (default) or PostgreSQL/MySQL

### Getting Started

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/recurb.git
   cd recurb
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/rahulvijay81/recurb.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

6. **Run migrations**
   ```bash
   npm run migrate
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the app running.

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper typing
- Enable strict mode compliance

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Run `npm run lint` before committing

### File Organization

- Place components in `/src/components`
- Place API routes in `/src/app/api`
- Place utilities in `/src/lib/utils`
- Place types in `/src/lib/types`

### Naming Conventions

- **Components**: PascalCase (`SubscriptionCard.tsx`)
- **Files**: kebab-case (`subscription-utils.ts`)
- **Functions**: camelCase (`calculateTotal()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)

## 🔄 Git Workflow

### Branching Strategy

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Keep your branch updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

3. **Make your changes**
   - Write clean, readable code
   - Add tests if applicable
   - Update documentation

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

### Commit Message Conventions

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(subscriptions): add bulk import functionality
fix(auth): resolve JWT token expiration issue
docs(readme): update installation instructions
refactor(api): simplify database queries
```

## 🐛 Reporting Bugs

### Before Submitting

- Check existing [issues](https://github.com/rahulvijay81/recurb/issues)
- Verify the bug in the latest version
- Collect relevant information

### Bug Report Template

Use the bug report template when creating an issue. Include:

- **Environment**: OS, Node version, database type
- **Steps to reproduce**: Clear, numbered steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Logs**: Error messages or console output

## 💡 Suggesting Features

### Feature Request Guidelines

- Check if the feature already exists or is planned
- Clearly describe the problem it solves
- Provide use cases and examples
- Consider implementation complexity

### Feature Request Template

- **Problem**: What problem does this solve?
- **Solution**: Proposed solution
- **Alternatives**: Other approaches considered
- **Additional context**: Screenshots, mockups, etc.

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Tests pass (if applicable)
- [ ] Lint checks pass

### PR Guidelines

1. **Title**: Use conventional commit format
2. **Description**: Explain what and why
3. **Link issues**: Reference related issues
4. **Screenshots**: For UI changes
5. **Breaking changes**: Clearly document

### Review Process

- Maintainers will review within 48 hours
- Address feedback promptly
- Keep discussions respectful
- Be patient - reviews take time

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build project
npm run build
```

## 📚 Documentation

- Update README.md for user-facing changes
- Update inline code comments
- Add JSDoc comments for functions
- Update `/docs` for major features

## 🎯 Good First Issues

Look for issues labeled [`good first issue`](https://github.com/rahulvijay81/recurb/labels/good%20first%20issue) - these are great for newcomers!

## 💬 Getting Help

- **Discord**: Join our [Discord server](https://discord.gg/yourinvite)
- **Issues**: Ask questions in [GitHub Issues](https://github.com/rahulvijay81/recurb/issues)
- **Email**: Contact [rahulvijay81@gmail.com](mailto:rahulvijay81@gmail.com)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Recurb! 🎉
