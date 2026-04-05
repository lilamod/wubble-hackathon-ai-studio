## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Wubble API key — get one from the [Wubble API docs](https://wubble.readme.io/reference/introduction)

### 1. Setup the server

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/wubble-studio
JWT_SECRET=your-secret-key-min-32-chars
WUBBLE_API_KEY=your-wubble-api-key
FRONTEND_URL=http://localhost:3000
```

Start the server:

```bash
npm run dev
```

### 2. Setup the client

```bash
cd client
npm install
```

Create `client/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the client:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/wubble/provision` | Create Wubble user + API key |
| GET | `/api/wubble/credits` | Check Wubble credits |
| POST | `/api/music/generate` | Generate a music track |
| GET | `/api/music/poll/:id` | Poll track generation status |
| GET | `/api/music/my-tracks` | Get user's track library |
| DELETE | `/api/music/:id` | Delete a track |

---

## Wubble API Integration

The app uses three Wubble API endpoints:

- `POST /api/v1/users` — creates a scoped Wubble user per app account
- `POST /api/v1/keys` — generates an API key for that user
- `POST /api/v1/chat` — conversational music generation (text prompt → music)
- `GET /api/v1/polling/{requestId}` — polls until the track is ready

The server builds a rich prompt from the user's inputs (mood, format, tempo, instruments, description) and sends it to Wubble's chat endpoint. Generation is async — the client polls every 3 seconds until the audio URL is returned.

---

## Environment Variables

### Server

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3001) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `WUBBLE_API_KEY` | Your Wubble platform API key |
| `FRONTEND_URL` | Allowed CORS origin |

### Client

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
