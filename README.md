# SnapLink - MERN URL Shortener

SnapLink is a modern, fast, and responsive full-stack URL shortener built with the MERN stack (MongoDB, Express, React, Node.js). It allows users to quickly shorten long URLs, track the number of clicks, and generate downloadable QR codes for their links.

## 🚀 Features

- **Instant URL Shortening:** Convert long, unwieldy URLs into clean, short links using unique IDs.
- **Click Analytics:** Real-time tracking of how many times a shortened link has been clicked.
- **QR Code Generation:** Automatically generates a QR code for every shortened URL that can be easily downloaded.
- **Local Persistence:** Keeps track of your recently shortened links in the browser's local storage.
- **Beautiful UI:** A stunning, responsive user interface built with Tailwind CSS, DaisyUI, and modern design principles.
- **Collision Resistant:** Uses `nanoid` to generate short, secure, and unique URL identifiers.

## 🛠️ Tech Stack

### Frontend
- **React 19** (Built with Vite for fast HMR)
- **Tailwind CSS & DaisyUI** (For styling and component library)
- **Axios** (For API requests)
- **qrcode.react** (For QR code generation)

### Backend
- **Node.js & Express.js** (REST API framework)
- **MongoDB & Mongoose** (Database and ODM)
- **nanoid** (For generating unique short IDs)
- **Cors & Dotenv** (Middleware and environment configuration)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- Git

## ⚙️ Installation & Setup

Follow these steps to get the project running locally.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/SnapLink.git
cd SnapLink
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add the following variables:
   ```env
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   FRONTEND_URL=http://localhost:5173
   BASE_URL=http://localhost:5000
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory and add the backend URL:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend should now be running on `http://localhost:5173` and the backend on `http://localhost:5000`.

## 📡 API Endpoints

### `POST /shorten`
Creates a new short URL.
- **Body:** `{ "originalUrl": "https://example.com/very-long-url" }`
- **Response:** `{ "shortId": "abc123x", "shortUrl": "http://localhost:5000/abc123x" }`

### `GET /:shortId`
Redirects the user to the original URL and increments the click counter.

### `GET /analytics/:shortId`
Retrieves the analytics (click count) for a specific short link.
- **Response:** `{ "originalUrl": "...", "shortId": "abc123x", "clicks": 5 }`

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/SnapLink/issues).

## 📝 License

This project is open source and available under the [ISC License](LICENSE).
