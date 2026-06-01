<p align="center">
  <img src="assets/logo.png" alt="Discopilot logo" width="200" />
</p>

<h1 align="center">Discopilot</h1>
<p align="center">Your Copilot for Discord</p>

## Overview

Discopilot brings the Microsoft Teams Copilot experience to Discord — natively.

It lives inside your server as a first-class member: drop into a voice channel and Discopilot can record the conversation, transcribe and translate in real time, recap what was said, and answer questions grounded in your server's own data. Outside of voice, it chats in your text channels with the same context, surfacing decisions, action items, and knowledge that would otherwise scroll into the void.

Everything is designed around Discord's native UX — slash commands, threads, voice states, ephemeral messages, and role-based permissions — so it feels less like a bolted-on bot and more like Discord just got smarter. Consent is built in: recordings only start when every participant agrees, and new joiners are notified the moment they enter a recorded channel.

## Installation

```bash
git clone https://github.com/NicoGrassetto/buddy.git
cd buddy
npm install
```

Create a `.env` file with your Discord bot credentials, then start the bot:

```bash
npm start
```

## Disclaimer

Discopilot is an independent, community-driven project. It is not affiliated with, endorsed by, sponsored by, or in any way officially connected to Microsoft Corporation, Discord Inc., or any of their subsidiaries or affiliates. All product names, logos, and brands — including "Microsoft", "Teams", "Copilot", and "Discord" — are property of their respective owners and are used here for descriptive and comparative purposes only.

Discopilot can record, transcribe, and process voice conversations. You are solely responsible for complying with all applicable laws and regulations in your jurisdiction, including consent, wiretapping, privacy, and data-protection laws (e.g., GDPR, CCPA, two-party consent statutes). The maintainers accept no liability for misuse.

The software is provided "AS IS", without warranty of any kind, express or implied. See the [LICENSE](LICENSE) for full terms.

## License

[AGPL-3.0](LICENSE) © Nico Grassetto
