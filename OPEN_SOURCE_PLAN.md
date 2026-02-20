# Open Source Conversion Plan for Recurb

## Overview
This document outlines the steps to convert Recurb from a tiered subscription model to a free, open-source project.

---

## Phase 1: Legal & Licensing (Week 1)

### 1.1 Choose License
- **Recommended**: MIT License (permissive, business-friendly)
- **Alternative**: Apache 2.0 (includes patent protection)
- **Alternative**: GPL v3 (copyleft, requires derivatives to be open source)

### 1.2 Add License Files
- Create `LICENSE` file in root directory
- Add copyright notice with year and author name
- Include license badge in README

### 1.3 Contributor Agreement
- Create `CONTRIBUTING.md` with contribution guidelines
- Define code of conduct (`CODE_OF_CONDUCT.md`)
- Specify how to submit issues and pull requests

---

## Phase 2: Remove Plan-Based Restrictions (Week 1-2)

### 2.1 Remove Feature Gating
- **Remove middleware checks** for plan-based access
- **Delete plan validation** from API routes
- **Remove Zustand plan checks** from client-side stores
- **Unlock all features** for all users

### 2.2 Code Changes Required
```
Files to modify:
- src/middleware.ts (remove plan checks)
- src/hooks/store/auth-store.ts (remove plan field)
- src/lib/auth/* (remove plan validation)
- All API routes in src/app/api/* (remove 403 responses)
- All components with plan-gated UI
```

### 2.3 Database Schema Updates
- Remove `plan` field from user table
- Remove subscription/payment tables (if any)
- Keep `role` field for basic admin/user distinction

---

## Phase 3: Documentation (Week 2)

### 3.1 Update README.md
- Remove plan tier descriptions
- Add "Open Source" badge
- Update feature list (all features available)
- Add installation instructions
- Add deployment guide
- Remove demo account credentials
- Add screenshots/demo GIF

### 3.2 Create Documentation Files
- `INSTALLATION.md` - Detailed setup guide
- `ARCHITECTURE.md` - System design overview
- `API_DOCS.md` - API endpoint documentation
- `DEPLOYMENT.md` - Hosting options (Vercel, Docker, etc.)
- `CHANGELOG.md` - Version history
- `ROADMAP.md` - Future features

### 3.3 Code Documentation
- Add JSDoc comments to complex functions
- Document environment variables in `.env.example`
- Create inline comments for business logic

---

## Phase 4: Configuration & Setup (Week 2-3)

### 4.1 Environment Setup
- Create comprehensive `.env.example`
- Document all required environment variables
- Add setup script (`npm run setup`)
- Include database migration scripts

### 4.2 Docker Support
- Create `Dockerfile` for containerization
- Create `docker-compose.yml` for local development
- Include database service in compose file
- Add Docker instructions to README

### 4.3 Development Tools
- Add ESLint configuration
- Add Prettier configuration
- Add Husky for pre-commit hooks
- Add GitHub Actions for CI/CD

---

## Phase 5: Community Setup (Week 3)

### 5.1 GitHub Repository Setup
- Make repository public
- Add repository description and topics
- Enable GitHub Discussions
- Create issue templates:
  - Bug report
  - Feature request
  - Question
- Create pull request template

### 5.2 Community Guidelines
- `CODE_OF_CONDUCT.md` (use Contributor Covenant)
- `CONTRIBUTING.md` with:
  - How to set up dev environment
  - Coding standards
  - Commit message conventions
  - PR process
- `SECURITY.md` for vulnerability reporting

### 5.3 Project Management
- Create GitHub Projects board
- Label system (bug, enhancement, good first issue, etc.)
- Milestone planning
- Add FUNDING.yml (optional, for sponsorships)

---

## Phase 6: Remove Monetization (Week 3)

### 6.1 Remove Payment Integration
- Remove Stripe/payment provider code
- Remove billing pages/components
- Remove subscription management UI
- Remove pricing page

### 6.2 Simplify Authentication
- Keep basic auth (email/password)
- Remove plan-based redirects
- Simplify user onboarding
- Remove upgrade prompts/CTAs

---

## Phase 7: Testing & Quality Assurance (Week 4)

### 7.1 Test All Features
- Verify all features work without plan restrictions
- Test CSV import/export
- Test analytics and charts
- Test team features
- Test file uploads

### 7.2 Security Audit
- Remove hardcoded secrets
- Validate environment variable usage
- Check for exposed API keys
- Review authentication flow
- Test rate limiting

### 7.3 Performance Testing
- Load testing for API endpoints
- Frontend performance audit
- Database query optimization
- Bundle size optimization

---

## Phase 8: Launch Preparation (Week 4)

### 8.1 Marketing Materials
- Create demo video/GIF
- Take screenshots for README
- Write blog post announcement
- Prepare social media posts

### 8.2 Hosting Demo
- Deploy live demo instance
- Use free tier (Vercel/Netlify)
- Add "View Demo" link to README
- Seed with sample data

### 8.3 Community Outreach
- Post on Reddit (r/opensource, r/selfhosted)
- Share on Hacker News
- Tweet announcement
- Post on Dev.to
- Submit to awesome lists

---

## Phase 9: Post-Launch (Ongoing)

### 9.1 Maintenance
- Respond to issues within 48 hours
- Review pull requests weekly
- Update dependencies monthly
- Release new versions regularly

### 9.2 Community Building
- Welcome first-time contributors
- Create "good first issue" labels
- Mentor new contributors
- Recognize contributors in CHANGELOG

### 9.3 Feature Development
- Prioritize community-requested features
- Accept quality pull requests
- Maintain backward compatibility
- Document breaking changes

---

## Checklist Summary

### Legal
- [ ] Choose and add LICENSE file
- [ ] Add copyright notices
- [ ] Create CODE_OF_CONDUCT.md
- [ ] Create CONTRIBUTING.md
- [ ] Create SECURITY.md

### Code Changes
- [ ] Remove all plan-based middleware
- [ ] Remove plan checks from API routes
- [ ] Remove plan validation from client
- [ ] Update database schema
- [ ] Remove payment integration
- [ ] Remove billing UI

### Documentation
- [ ] Update README.md
- [ ] Create INSTALLATION.md
- [ ] Create ARCHITECTURE.md
- [ ] Create API_DOCS.md
- [ ] Create DEPLOYMENT.md
- [ ] Create .env.example
- [ ] Add code comments

### Infrastructure
- [ ] Create Dockerfile
- [ ] Create docker-compose.yml
- [ ] Add CI/CD pipeline
- [ ] Configure linting/formatting
- [ ] Add pre-commit hooks

### Community
- [ ] Make repository public
- [ ] Create issue templates
- [ ] Create PR template
- [ ] Enable GitHub Discussions
- [ ] Set up project board
- [ ] Create label system

### Testing
- [ ] Test all features
- [ ] Security audit
- [ ] Performance testing
- [ ] Remove test credentials

### Launch
- [ ] Deploy demo instance
- [ ] Create demo video
- [ ] Write announcement post
- [ ] Share on social media
- [ ] Submit to directories

---

## Recommended Timeline

**Total Duration**: 4 weeks

- **Week 1**: Legal, licensing, remove plan restrictions
- **Week 2**: Documentation, configuration, Docker setup
- **Week 3**: Community setup, remove monetization
- **Week 4**: Testing, launch preparation, go public

---

## Alternative: Hybrid Model

If you want to keep some monetization:

### Open Core Model
- **Free (Open Source)**: Core features, self-hosted
- **Paid (Hosted)**: Managed hosting, premium support, additional features

### Dual License
- **Open Source**: GPL/AGPL (requires derivatives to be open)
- **Commercial**: Proprietary license for businesses

### Sponsorware
- Keep repository public
- Accept GitHub Sponsors
- Offer priority support for sponsors

---

## Resources

- **License Chooser**: https://choosealicense.com/
- **Contributor Covenant**: https://www.contributor-covenant.org/
- **GitHub Docs**: https://docs.github.com/en/communities
- **Open Source Guides**: https://opensource.guide/

---

## Notes

- Backup your current codebase before making changes
- Consider creating a new branch for open-source conversion
- Test thoroughly before making repository public
- Be prepared to support the community
- Set realistic expectations for maintenance time
