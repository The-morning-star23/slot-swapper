SlotSwapper

SlotSwapper is a full-stack peer-to-peer time-slot scheduling application. Users can post their busy calendar slots as "swappable," browse a marketplace of other users' available slots, and request to swap one of their own slots for a desired one.

This project was built as a full-stack technical challenge.

🚀 Features
User Authentication: Secure user registration and login using JWT (JSON Web Tokens).

Calendar Management: A personal dashboard where users can create, delete, and manage their calendar events.

Swappable Status: Users can mark their events as "BUSY" or "SWAPPABLE."

Slot Marketplace: A view that displays all "SWAPPABLE" slots from other users.

Swap Request System: Users can request a swap by offering one of their own swappable slots.

Request Management: A dedicated page to view incoming and outgoing swap requests.

Accept/Reject Logic: Users can accept or reject incoming swap requests. An accepted swap atomically exchanges the ownership of the two events.

🛠️ Tech Stack
Frontend: React with TypeScript (built with Vite)

Backend: Node.js with Express.js

Database: MongoDB (with Mongoose)

Styling: Tailwind CSS

Authentication: JWT (jsonwebtoken) & bcrypt.js

Routing: React Router DOM

🏁 Getting Started
Prerequisites
Node.js (v18 or later)

npm

A free MongoDB Atlas account (or a local MongoDB instance)

1. Clone the Repository
Bash

git clone <your-repository-url>
cd SlotSwapper
2. Backend Setup (/server)
Navigate to the server directory:

Bash

cd server
Install dependencies:

Bash

npm install
Create a .env file in the /server directory and add your environment variables.

Code snippet

# Your MongoDB connection string
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/SlotSwapper?retryWrites=true&w=majority

# A random, strong secret for JWT
JWT_SECRET=your-super-secret-key
Start the backend server:

Bash

npm start
The server will be running on http://localhost:5001.

3. Frontend Setup (/client)
Open a new terminal and navigate to the client directory:

Bash

cd client
Install dependencies:

Bash

npm install
Start the frontend development server:

Bash

npm run dev
Open your browser and navigate to http://localhost:5173 (or the port shown in your terminal).

You can now register a new user and start using the application!

