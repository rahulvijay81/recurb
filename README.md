<div align="center">
  <h1>🔄 Recurb</h1>
  <p><strong>Self-hosted subscription tracking that respects your privacy</strong></p>
  
  <p>
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-documentation">Documentation</a> •
    <a href="#-community">Community</a>
  </p>

  <p>
    <a href="https://github.com/rahulvijay81/recurb/stargazers"><img src="https://img.shields.io/github/stars/rahulvijay81/recurb?style=social" alt="GitHub stars"></a>
    <a href="https://github.com/rahulvijay81/recurb/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
    <a href="https://github.com/rahulvijay81/recurb/issues"><img src="https://img.shields.io/github/issues/rahulvijay81/recurb" alt="GitHub issues"></a>
  </p>

  <p>
    <a href="https://github.com/sponsors/rahulvijay81"><img src="https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?logo=github" alt="GitHub Sponsors"></a>
    <a href="https://buymeacoffee.com/rahulvijay81"><img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee"></a>
  </p>
</div>

---

## 📸 Screenshots

> Add screenshots here showcasing the dashboard, analytics, and key features

---

## ✨ Features

- 🔒 **Privacy-First** - Self-hosted solution, your data stays on your server
- 🗄️ **Multi-Database Support** - Choose between SQLite, PostgreSQL, or MySQL
- 📊 **Advanced Analytics** - Track spending trends, forecasts, and insights
- 🎨 **Beautiful UI** - Modern design with dark mode support
- 👥 **Team Collaboration** - Role-based access control and audit logs
- 🔔 **Smart Notifications** - Renewal alerts and payment reminders
- 💰 **Cost Optimization** - Duplicate detection and spending analysis
- 📈 **Financial Forecasting** - Predict future expenses and budget accordingly
- 🔄 **Bulk Operations** - Import/export subscriptions with ease
- 🌍 **Multi-Currency** - Support for multiple currencies and conversion
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🔧 **Developer-Friendly** - Easy to extend and customize

---

## 🚀 Quick Start

Get Recurb up and running in 3 simple steps:

```bash
# 1. Clone the repository
git clone https://github.com/rahulvijay81/recurb.git
cd recurb

# 2. Install dependencies
npm install

# 3. Set up environment and start
cp .env.example .env.local
npm run migrate
npm run dev
```

Visit `http://localhost:3000` and complete the setup wizard!

### 🐳 Docker Quick Start

```bash
docker-compose up -d
```

---

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- One of: SQLite (default), PostgreSQL, or MySQL

---

## 🛠️ Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)
![Zustand](https://img.shields.io/badge/Zustand-4.5-orange)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-supported-336791?logo=postgresql)
![MySQL](https://img.shields.io/badge/MySQL-supported-4479A1?logo=mysql)

</div>

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Shadcn/ui Components
- Zustand (State Management)
- Chart.js (Analytics)

**Backend:**
- Next.js API Routes
- JWT Authentication
- Multi-database support (SQLite/PostgreSQL/MySQL)
- Node-cron (Scheduled tasks)

**Security:**
- bcryptjs (Password hashing)
- JWT tokens
- Role-based access control
- Rate limiting
- CSRF protection

---

## 📚 Documentation

- [Installation Guide](docs/installation.md)
- [Configuration](docs/configuration.md)
- [Database Setup](docs/database.md)
- [Deployment](docs/deployment.md)
- [API Reference](docs/api.md)
- [Contributing](CONTRIBUTING.md)
- [Architecture](ARCHITECTURE.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 💖 Support the Project

If Recurb helps you manage your subscriptions, consider supporting its development:

- ⭐ Star this repository
- 💰 [Become a GitHub Sponsor](https://github.com/sponsors/rahulvijay81)
- ☕ [Buy me a coffee](https://buymeacoffee.com/rahulvijay81)
- 🐛 Report bugs and suggest features
- 📢 Share with others who might find it useful

### Sponsor Tiers

- **$5/mo** - Supporter badge
- **$10/mo** - Name in README
- **$25/mo** - Priority support
- **$50/mo** - Feature request priority
- **$100/mo** - 1-on-1 consultation (1hr/mo)
- **$500/mo** - Enterprise support

---

## 🌟 Community

Join our community to get help, share ideas, and connect with other users:

- 💬 [Discord Server](https://discord.gg/yourinvite)
- 🐦 [Twitter/X](https://twitter.com/rahulvijay81)
- 📧 [Email](mailto:rahulvijay81@gmail.com)
- 🐛 [Issue Tracker](https://github.com/rahulvijay81/recurb/issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with ❤️ using amazing open-source projects:
- [Next.js](https://nextjs.org/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- And many more...

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/rahulvijay81">Rahul Vijay</a></p>
  <p>⭐ Star us on GitHub — it motivates us a lot!</p>
</div>
