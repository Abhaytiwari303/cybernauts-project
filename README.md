# Cybernauts Interactive User Relationship & Hobby Network

## 📋 Project Description

A full-stack application for managing users, their friendships, and hobbies with real-time graph visualization. Users can be linked/unlinked as friends, hobbies can be assigned via drag-and-drop, and popularity scores are dynamically computed based on friend connections and shared hobbies.

The application features an interactive network graph where users are represented as nodes (sized and colored by popularity), friendships as edges, and hobbies as draggable elements that can be assigned to users in real-time.

## 🚀 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **Testing:** Jest + Supertest
- **Dev Tools:** nodemon / ts-node-dev

### Frontend
- **Framework:** React
- **Language:** TypeScript
- **Visualization:** React Flow
- **State Management:** React Context API / Redux Toolkit
- **Styling:** CSS Modules / Tailwind CSS
- **HTTP Client:** Axios

### Deployment
- **Platform:** Render (Backend + Frontend)
- **Database Hosting:** MongoDB Atlas

## 📦 Features

### Core Features
- ✅ **User Management:** Complete CRUD operations for users
- ✅ **Friend Linking:** Link and unlink users as friends with relationship validation
- ✅ **Hobby Assignment:** Drag-and-drop hobbies onto users
- ✅ **Popularity Calculation:** Dynamic score based on friends and shared hobbies
- ✅ **Graph Visualization:** Interactive network graph with React Flow
- ✅ **Real-time Updates:** Live graph updates when relationships or hobbies change
- ✅ **Validation:** Prevent deletion of users with active friendships
- ✅ **Error Handling:** Comprehensive error messages and notifications

### Bonus Features (if implemented)
- 🎯 **Custom Node Types:** HighScoreNode and LowScoreNode based on popularity
- 🔄 **Undo/Redo:** Revert graph changes
- ⚡ **Debounced Updates:** Optimized API calls for hobby assignments
- 🔍 **Search & Filter:** Find users and hobbies quickly
- 📊 **Lazy Loading:** Performance optimization for large datasets
- 🔐 **Load Balancing:** Node.js cluster with Redis state synchronization

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas account)
- Git

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd cybernauts-network
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update the values with your configuration
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

5. **Run tests:**
   ```bash
   npm test
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create `.env` file in frontend folder
   - Add backend API URL:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

## 📡 API Documentation

### Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://your-app.onrender.com/api`

### Endpoints

#### Users

**Get All Users**
```
GET /api/users
Response: 200 OK
[
  {
    "id": "uuid",
    "username": "john_doe",
    "age": 25,
    "hobbies": ["coding", "gaming"],
    "friends": ["user-id-2", "user-id-3"],
    "popularityScore": 3.5,
    "createdAt": "2025-01-15T10:30:00Z"
  }
]
```

**Create User**
```
POST /api/users
Body: {
  "username": "jane_smith",
  "age": 28,
  "hobbies": ["reading", "hiking"]
}
Response: 201 Created
```

**Update User**
```
PUT /api/users/:id
Body: {
  "username": "jane_smith_updated",
  "age": 29,
  "hobbies": ["reading", "hiking", "photography"]
}
Response: 200 OK
```

**Delete User**
```
DELETE /api/users/:id
Response: 200 OK (only if user has no friends)
Response: 409 Conflict (if user has active friendships)
```

#### Friendships

**Link Users (Create Friendship)**
```
POST /api/users/:id/link
Body: {
  "friendId": "user-id-to-link"
}
Response: 200 OK
```

**Unlink All Friends**
```
DELETE /api/users/:id/unlinkAll
Response: 200 OK
```

#### Graph Data

**Get Graph Visualization Data**
```
GET /api/graph
Response: 200 OK
{
  "nodes": [...],
  "edges": [...]
}
```

### Postman Collection

Import the included `Cybernauts.postman_collection.json` file:

1. Open Postman
2. Click **Import** → **Upload Files**
3. Select `Cybernauts.postman_collection.json`
4. Set environment variable `{{API_URL}}` to your backend URL
5. Run requests individually or use the collection runner

### Error Responses

- **400 Bad Request:** Validation errors
- **404 Not Found:** Resource not found
- **409 Conflict:** Relationship conflict (e.g., delete user with friends)
- **500 Internal Server Error:** Server-side errors

## 🧪 Testing

### Backend Tests

Run the test suite:
```bash
cd backend
npm test
```

**Test Coverage:**
- ✅ User CRUD operations
- ✅ Friendship linking/unlinking
- ✅ Popularity score calculation
- ✅ Conflict prevention (delete with active friends)
- ✅ Circular friendship prevention
- ✅ Edge cases and error handling

**Example Test Scenarios:**
1. Creating users and calculating initial popularity scores
2. Linking users and verifying score updates
3. Preventing deletion of users with active friendships
4. Hobby sharing impact on popularity scores

### Test Database

Tests use a separate MongoDB instance defined in `MONGO_URI_TEST` to avoid affecting development data.

## 🎨 Popularity Score Algorithm

```
popularityScore = (number of unique friends) + (shared hobbies with friends × 0.5)
```

**Example:**
- User A has 3 friends
- User A shares 4 hobbies total with those friends
- Popularity Score = 3 + (4 × 0.5) = **5.0**

## 🎯 Business Rules

1. **Friendship Constraints:**
   - No self-friending
   - No duplicate friendships
   - Bidirectional relationships (A→B means B→A)

2. **Deletion Rules:**
   - Users with active friendships cannot be deleted
   - Must unlink all friends first

3. **Hobby Assignment:**
   - Unlimited hobbies per user
   - Case-insensitive hobby matching
   - Real-time popularity recalculation

## 🚀 Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **New** → **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:** Add from `.env.example`
6. Deploy

### Frontend Deployment (Render)

1. Go to Render Dashboard
2. Click **New** → **Static Site**
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `build`
   - **Environment Variables:** 
     - `REACT_APP_API_URL=<your-backend-url>`
5. Deploy

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Whitelist IP addresses (or allow all: `0.0.0.0/0`)
4. Create database user
5. Get connection string and add to `DB_URL` in Render environment variables

## 📝 Project Structure

```
cybernauts-network/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── User.ts
│   │   ├── routes/
│   │   │   └── userRoutes.ts
│   │   ├── controllers/
│   │   │   └── userController.ts
│   │   ├── services/
│   │   │   └── userService.ts
│   │   ├── utils/
│   │   │   └── calculatePopularity.ts
│   │   └── index.ts
│   ├── tests/
│   │   └── user.test.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Graph/
│   │   │   ├── Sidebar/
│   │   │   └── UserPanel/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── Cybernauts.postman_collection.json
└── README.md
```

## 🔗 Live Demo

- **Frontend:** https://cybernauts-frontend-ckhd.onrender.com
- **Backend API:** https://cybernauts-backend-wlag.onrender.com

## 📹 Video Demonstration

[Link to screen recording demonstration] - Coming soon

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Name - [https://github.com/Abhaytiwari30/](https://github.com/Abhaytiwari303)

## 🙏 Acknowledgments

- React Flow for graph visualization
- MongoDB for flexible data storage
- Render for seamless deployment

---

**Note:** Replace placeholder URLs and values with your actual deployment links and repository information.
