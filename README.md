# NexusChat

NexusChat is a real-time chat platform built with the MERN stack and Socket.IO. It supports private and group conversations, live message delivery, file uploads, authentication, user search, chat requests, notifications, reporting, and an admin dashboard.

## Features

- Real-time messaging with Socket.IO
- Direct and group conversations
- File and image uploads for messages and profiles
- JWT authentication with cookie and bearer token support
- Conversation search and user search
- Message reactions, pinning, and delete flows
- Chat requests, notifications, and reporting
- Admin dashboard for moderation and stats
- Responsive React UI with Zustand state management

## Tech Stack

- Frontend: React, Vite, Zustand, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express, Socket.IO, Mongoose, Multer
- Database: MongoDB
- Authentication: JSON Web Token, HTTP-only cookies

## Project Structure

- `client/` - React frontend
- `server/` - Express and Socket.IO backend
- `server/models/` - MongoDB models
- `server/controllers/` - API controllers
- `server/routes/` - Express route definitions
- `server/middleware/` - Auth, validation, upload, and error handling
- `server/sockets/` - Socket.IO authentication and event handling

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally or a MongoDB Atlas connection string

## Installation

Install dependencies for the root project, client, and server:

```bash
npm run install:all
```

## Environment Variables

Create a `.env` file in the `server/` folder with values like these:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nexuschat
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Optional client variables can be set in `client/.env` if you are not using the defaults:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

If these are omitted, the frontend falls back to the local backend defaults.

## Running the App

Start both the client and server from the project root:

```bash
npm run dev
```

This starts the backend on port `5000` and the Vite frontend on port `5173` by default.

### Run Individually

Backend only:

```bash
npm run server
```

Frontend only:

```bash
npm run client
```

## Build

Build the frontend for production:

```bash
npm run build
```

## Database Seeding

Seed the database with initial data, if your setup includes it:

```bash
npm run seed
```

## How It Works

- The frontend authenticates users, loads conversations, and subscribes to Socket.IO events for live updates.
- The backend exposes REST endpoints for auth, users, conversations, messages, notifications, requests, reports, and admin actions.
- Messages are stored in MongoDB and emitted to the active conversation room so new content appears without a page refresh.
- Uploaded files are saved under `server/uploads/` and served statically from `/uploads`.

## API Overview

- `/api/auth` - register, login, logout, current user
- `/api/users` - profile update, search, user lookup
- `/api/conversations` - direct and group conversation management
- `/api/messages` - message history, send, reactions, delete
- `/api/notifications` - notification retrieval
- `/api/requests` - chat request flows
- `/api/reports` - report submission
- `/api/admin` - moderation and admin stats

## Socket Events

- `message:new` - broadcast when a new message is created
- `message:reaction` - broadcast when a reaction changes
- `message:delete` - broadcast when a message is deleted for everyone
- `typing:start` and `typing:stop` - typing indicators
- `user:online` and `user:offline` - presence updates

## Notes

- If real-time updates are not appearing, confirm the client is pointed at the correct backend URL with `VITE_SOCKET_URL` or `VITE_API_BASE_URL`.
- If uploads fail, make sure the browser is sending a valid file type and the backend process has permission to write to `server/uploads/`.

## License

No license has been specified for this project.
