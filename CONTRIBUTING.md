# Contributing to QR-NINJA 🥷

First off, thank you for considering contributing to QR-NINJA! It's people like you that make QR-NINJA such a great tool.

### Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Styleguides](#styleguides)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript Styleguide](#javascript-styleguide)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for QR-NINJA. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- **Check if it has already been reported.** Use the GitHub issues search.
- **Use a clear and descriptive title.**
- **Describe the exact steps which reproduce the problem.**
- **Explain which behavior you expected to see and why.**
- **Include screenshots if possible.**

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for QR-NINJA, including completely new features and minor improvements to existing functionality.

- **Check if it has already been suggested.**
- **Use a clear and descriptive title.**
- **Provide a step-by-step description of the suggested enhancement.**
- **Explain why this enhancement would be useful to most QR-NINJA users.**

### Pull Requests

1. **Fork the repository** and create your branch from `main`.
2. **Install dependencies** using `npm install`.
3. **Make your changes.** If you've added code that should be tested, add tests.
4. **Ensure the test suite passes** and the code lints.
   - Run `npm run lint` to check for style issues.
   - Run `npm run format` to automatically fix formatting.
5. **Issue that PR!**

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript Styleguide

- We use **ESLint** and **Prettier** to maintain code quality.
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) where possible.
- Use functional components and hooks for React.
- Keep components small and focused.

### Workflow

1. `git checkout -b feat/your-feature-name`
2. `npm run dev` (test your changes locally)
3. `npm run lint`
4. `git commit -m "feat: add your feature description"`
5. `git push origin feat/your-feature-name`

---

Thank you for contributing to the future of privacy-first QR generation! 🚀
