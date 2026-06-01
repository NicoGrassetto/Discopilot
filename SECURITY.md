# Security Policy

## Supported versions

Discopilot is in early development. Only the latest `main` branch and the most recent release receive security fixes.

| Version       | Supported          |
| ------------- | ------------------ |
| latest `main` | :white_check_mark: |
| older         | :x:                |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Report privately via one of:

1. GitHub's [private vulnerability reporting](https://github.com/NicoGrassetto/buddy/security/advisories/new) (preferred).
2. Email **nicograssetto@gmail.com** with the subject `[Discopilot security]`.

Include:

- A description of the issue and its impact.
- Steps to reproduce or a proof of concept.
- Affected version (commit SHA or release tag).
- Your name/handle for credit (optional).

## What to expect

- Acknowledgement within **3 business days**.
- A triage assessment within **7 business days**.
- A fix or mitigation timeline, depending on severity.
- Public disclosure coordinated with the reporter, after a fix ships.

## Scope

In scope:

- Authentication / authorization bypass in the bot.
- Recording or transcript leakage to unauthorized users.
- Remote code execution, command injection, SSRF, dependency vulnerabilities.
- Failures in the consent flow that allow recording without all participants agreeing.

Out of scope:

- Issues that require physical access to a user's machine.
- Social-engineering attacks against Discord server owners.
- Vulnerabilities in Discord itself or third-party services.

Thanks for helping keep Discopilot and its users safe.
