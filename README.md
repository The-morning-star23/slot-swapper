# SlotSwapper

## Overview

SlotSwapper is a peer-to-peer time-slot scheduling application (ServiceHive Full Stack Intern challenge). Users can post busy calendar slots as "swappable" and trade them with others.

Key choices
- Stack: MongoDB, Express, React, Node.js (MERN) with TypeScript.
- Styling: Tailwind CSS.
- State: React Context for auth + local component state.
- API: RESTful endpoints; JWT Bearer tokens for auth.
- UI updates by re-fetching after mutations (no WebSockets).

## Setup — Run Locally (Windows)

Prerequisites
- Node.js v18+
- npm
- Git
- MongoDB Atlas (or local MongoDB)

1) Clone
```bash
git clone https://github.com/<YourUsername>/SlotSwapper.git
cd SlotSwapper
```

2) Backend (server)
```bash
cd server
npm install
```

Create a `.env` in the server folder with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_strong_secret_key
```
Create `.env` (Windows):
- PowerShell: `New-Item .env -ItemType File`
- CMD: `type nul > .env`
- Or create the file in your editor.

Start the backend:
```bash
npm start
```
Default: http://localhost:5001 (confirm in server start logs).

3) Frontend (client)
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
Typical dev URL: http://localhost:5173

4) Testing notes
To test swaps, use two distinct browser sessions (different browsers or an incognito window) to log in as two different users.

## API Endpoints (protected routes require `Authorization: Bearer <token>`)

Auth (`/api/auth`)
| Method | Endpoint   | Description                  | Access |
|--------|------------|------------------------------|--------|
| POST   | /register  | Register a new user          | Public |
| POST   | /login     | Log in and receive a JWT     | Public |

Events (`/api/events`)
| Method | Endpoint         | Description                                      | Access  |
|--------|------------------|--------------------------------------------------|---------|
| POST   | /                | Create a new event                               | Private |
| GET    | /my-events       | Get all events for the logged-in user            | Private |
| PUT    | /:id/status      | Update an event's status (e.g., BUSY, SWAPPABLE) | Private |
| DELETE | /:id             | Delete an event                                  | Private |

Swaps (`/api/swaps`)
| Method | Endpoint               | Description                                               | Access  |
|--------|------------------------|-----------------------------------------------------------|---------|
| GET    | /swappable-slots       | Get all SWAPPABLE slots from other users                  | Private |
| POST   | /request               | Create a new swap request                                 | Private |
| GET    | /my-requests           | Get incoming and outgoing requests for the user           | Private |
| POST   | /response/:requestId   | Accept or reject an incoming swap request                 | Private |

## Assumptions & Challenges

Assumptions
- No real-time updates (no WebSockets). UI re-fetches after actions; incoming requests appear after navigating/refreshing.
- Simple calendar: list view rather than full grid.
- Minimal user info shared (name only).

Challenges
- Atomic swap logic: swapping owners and statuses for two events must be consistent; handled in controller by updating both documents in a single flow before saving.
- Testing requires two user sessions.

If you want, I can also:
- Fix any typos or wording further.
- Add example requests (curl) for each endpoint.
- Generate a CONTRIBUTING or ENV example file.
