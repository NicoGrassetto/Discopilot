# Contributing to Discopilot

Thanks for your interest in improving Discopilot! This document covers how to report issues, propose changes, and submit pull requests.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Reporting bugs

Open a [GitHub issue](https://github.com/NicoGrassetto/buddy/issues) and include:

- What you expected to happen and what actually happened.
- Steps to reproduce.
- Discopilot version (commit SHA or release tag), Node.js version, and OS.
- Relevant logs with secrets redacted.

For **security vulnerabilities**, do NOT open a public issue — see [SECURITY.md](SECURITY.md).

## Suggesting features

Check [ROADMAP.md](ROADMAP.md) and existing issues first. If your idea isn't there, open an issue describing the use case and the user problem before sending code.

## Development setup

```bash
git clone https://github.com/NicoGrassetto/buddy.git
cd buddy
npm install
cp .env.example .env   # fill in your bot token and config
npm start
```

You'll need:

- Node.js 20+
- A Discord application + bot token ([Developer Portal](https://discord.com/developers/applications))
- A test Discord server you own

## Pull request process

1. Fork the repo and create a feature branch from `main`: `git checkout -b feat/short-description`.
2. Keep changes focused — one logical change per PR.
3. Follow the existing code style. Run any linter/formatter the repo configures.
4. Update `README.md`, `ROADMAP.md`, or `CHANGELOG.md` if your change affects users.
5. Write a clear PR description: what changed, why, and how to test it. Link the issue it closes (`Closes #123`).
6. Be ready to iterate on review feedback.

## Commit messages

Use clear, imperative messages. [Conventional Commits](https://www.conventionalcommits.org/) are encouraged but not required:

```
feat(record): stream per-user audio to backend
fix(consent): handle user leaving mid-recording
docs: clarify .env setup
```

## License

By contributing, you agree that your contributions will be licensed under the [AGPL-3.0](LICENSE) license that covers the project.
