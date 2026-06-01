# Discopilot - your Copilot for Discord

A Discord bot that records voice channel conversations with built-in consent management.

## Features

- 🎙️ Record voice channel conversations
- ✅ Consent-based recording (all participants must agree)
- 🔔 Automatic notifications when new users join a recorded channel
- 📡 Streams audio packets to a configurable backend
- 👥 Individual audio streams per user

## Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              RECORDING FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

1. USER INITIATES RECORDING
   │
   │  User types: /record
   │
   ▼
2. CONSENT REQUEST
   │
   │  Bot sends a message to the voice channel's text chat:
   │  ┌────────────────────────────────────────────────────────────┐
   │  │ 🎙️ @User wants to start recording this voice channel.     │
   │  │                                                            │
   │  │ All participants must consent to be recorded.              │
   │  │                                                            │
   │  │ Current participants:                                      │
   │  │ • @Alice - ⏳ Pending                                      │
   │  │ • @Bob - ⏳ Pending                                        │
   │  │ • @Charlie - ⏳ Pending                                    │
   │  │                                                            │
   │  │ [✅ I Consent] [❌ Decline]                                │
   │  └────────────────────────────────────────────────────────────┘
   │
   ▼
3. WAITING FOR CONSENT
   │
   │  ├─► If ALL users click "✅ I Consent"
   │  │       → Proceed to step 4
   │  │
   │  ├─► If ANY user clicks "❌ Decline"
   │  │       → Cancel recording, notify channel
   │  │
   │  └─► If timeout (60 seconds) with pending consents
   │          → Cancel recording, notify channel
   │
   ▼
4. RECORDING STARTS
   │
   │  Bot announces:
   │  ┌────────────────────────────────────────────────────────────┐
   │  │ 🔴 Recording has started.                                  │
   │  │ All participants have consented.                           │
   │  │ Type /stop to end the recording.                           │
   │  └────────────────────────────────────────────────────────────┘
   │
   │  • Bot subscribes to all user audio streams
   │  • Audio packets are sent to the configured backend
   │
   ▼
5. NEW USER JOINS (while recording)
   │
   │  Bot sends a DM or channel message:
   │  ┌────────────────────────────────────────────────────────────┐
   │  │ ⚠️ @NewUser, this voice channel is currently being        │
   │  │ recorded.                                                  │
   │  │                                                            │
   │  │ By staying in this channel, you consent to being recorded. │
   │  │                                                            │
   │  │ [✅ I Consent & Stay] [❌ Leave Channel]                   │
   │  └────────────────────────────────────────────────────────────┘
   │
   │  ├─► If user clicks "✅ I Consent & Stay"
   │  │       → Add user to recording, continue
   │  │
   │  └─► If user clicks "❌ Leave Channel" or leaves
   │          → User is not recorded, recording continues for others
   │
   ▼
6. RECORDING ENDS
   │
   │  Triggered by:
   │  • User types /stop
   │  • All users leave the voice channel
   │  • Bot is disconnected
   │
   │  Bot announces:
   │  ┌────────────────────────────────────────────────────────────┐
   │  │ ⏹️ Recording has ended.                                    │
   │  │ Duration: 15 minutes 32 seconds                            │
   │  │ Participants: @Alice, @Bob, @Charlie                       │
   │  └────────────────────────────────────────────────────────────┘
   │
   ▼
7. AUDIO PROCESSING
   │
   │  Backend receives all audio streams and processes them.
   │
   └─► Done
```

## Commands

| Command | Description |
|---------|-------------|
| `/record` | Start a recording session (requires consent from all participants) |
| `/stop` | Stop the current recording session |
| `/status` | Check if a recording is currently active |

## Installation

### Prerequisites

- Node.js v16.11.0 or higher
- FFmpeg (for audio processing)
- A Discord bot token

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/buddy.git
   cd buddy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   DISCORD_TOKEN=your-bot-token-here
   CLIENT_ID=your-application-client-id
   BACKEND_URL=https://your-backend-api.com/audio
   BACKEND_API_KEY=your-backend-api-key
   ```

4. Deploy slash commands:
   ```bash
   npm run deploy-commands
   ```

5. Start the bot:
   ```bash
   npm start
   ```

## Configuration

| Environment Variable | Description | Required |
|---------------------|-------------|----------|
| `DISCORD_TOKEN` | Your Discord bot token | ✅ |
| `CLIENT_ID` | Your Discord application client ID | ✅ |
| `BACKEND_URL` | URL where audio packets will be sent | ✅ |
| `BACKEND_API_KEY` | API key for backend authentication | ✅ |
| `CONSENT_TIMEOUT` | Seconds to wait for consent (default: 60) | ❌ |

## Backend Integration

The bot sends audio packets to your backend via HTTP POST requests:

### Endpoint: `POST /audio/stream`

**Headers:**
```
Authorization: Bearer <BACKEND_API_KEY>
Content-Type: application/octet-stream
X-Guild-ID: <discord-guild-id>
X-Channel-ID: <discord-channel-id>
X-User-ID: <discord-user-id>
X-Session-ID: <recording-session-id>
X-Timestamp: <unix-timestamp-ms>
```

**Body:** Raw Opus audio packet data

### Endpoint: `POST /audio/session/start`

Called when a recording session begins.

**Body:**
```json
{
  "sessionId": "abc123",
  "guildId": "123456789",
  "channelId": "987654321",
  "participants": ["user1", "user2", "user3"],
  "startedAt": "2024-01-15T10:30:00Z",
  "startedBy": "user1"
}
```

### Endpoint: `POST /audio/session/end`

Called when a recording session ends.

**Body:**
```json
{
  "sessionId": "abc123",
  "guildId": "123456789",
  "channelId": "987654321",
  "participants": ["user1", "user2", "user3"],
  "startedAt": "2024-01-15T10:30:00Z",
  "endedAt": "2024-01-15T10:45:32Z",
  "endedBy": "user1",
  "reason": "manual_stop"
}
```

## Privacy & Legal Considerations

⚠️ **Important:** Recording conversations may be subject to legal requirements in your jurisdiction.

- Always obtain consent before recording
- Inform users when they join a recorded channel
- Check local laws regarding recording consent (one-party vs. all-party consent)
- Review Discord's Terms of Service regarding bots and recording

## License

MIT License - See [LICENSE](LICENSE) for details.
