# JWT Authentication with Access & Refresh Tokens

A Node.js implementation demonstrating JWT-based authentication using separate access and refresh tokens. This project uses two Express servers to showcase security best practices for API authentication.

## 🎯 What This Project Does

This is a learning project that demonstrates:
- **Dual-token authentication** (access + refresh tokens)
- **Separation of concerns** (auth server vs. resource server)
- **Token refresh mechanism** to maintain sessions without re-login
- **Protected API endpoints** that require authentication

## 🏗️ Architecture

The project consists of two separate servers:

### 1. **AuthServer** (Port 4000)
Handles all authentication operations:
- User login
- Token generation (access + refresh)
- Token refresh
- Logout (token revocation)

### 2. **Server** (Port 3000)
Your main API server with protected resources:
- Serves posts (protected endpoint)
- Validates access tokens
- Filters content by authenticated user

## 🔐 How It Works

### The Flow

```
1. User logs in → Receives access token (15s) + refresh token
2. User accesses API → Sends access token in header
3. Access token expires → User sends refresh token
4. Receives new access token → Continue accessing API
5. User logs out → Refresh token invalidated
```

### Token Types

| Token Type | Lifetime | Purpose | Storage |
|------------|----------|---------|---------|
| **Access Token** | 15 seconds | Access protected resources | Client (memory/localStorage) |
| **Refresh Token** | Until logout | Get new access tokens | Server array + Client |

## 📁 Project Structure

```
jwt-auth-demo/
├── authServer.js       # Authentication server (port 4000)
├── server.js           # Resource server (port 3000)
├── .env                # Environment variables (secrets)
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/jwt-auth-demo.git
cd jwt-auth-demo
```

2. **Install dependencies**
```bash
npm install
```

3. **Create a `.env` file** in the root directory:
```env
ACCESS_TOKEN_SECRET=your-super-secret-access-key-here
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-here
```

> **Important:** Use strong, random strings for production. You can generate them with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. **Start both servers** (in separate terminals):

Terminal 1:
```bash
node authServer.js
```

Terminal 2:
```bash
node server.js
```

## 📡 API Endpoints

### Authentication Server (Port 4000)

#### **POST /login**
Login and receive tokens.

**Request:**
```json
POST http://localhost:4000/login
Content-Type: application/json

{
  "username": "Kyle"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### **POST /token**
Get a new access token using refresh token.

**Request:**
```json
POST http://localhost:4000/token
Content-Type: application/json

{
  "token": "your-refresh-token-here"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### **DELETE /logout**
Invalidate refresh token (logout).

**Request:**
```json
DELETE http://localhost:4000/logout
Content-Type: application/json

{
  "token": "your-refresh-token-here"
}
```

**Response:** `204 No Content`

---

### Resource Server (Port 3000)

#### **GET /posts**
Get posts for authenticated user.

**Request:**
```
GET http://localhost:3000/posts
Authorization: Bearer your-access-token-here
```

**Response:**
```json
[
  {
    "username": "Kyle",
    "title": "Post 1"
  }
]
```

## 🧪 Testing the API

### Using cURL

**1. Login:**
```bash
curl -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Kyle"}'
```

**2. Access protected resource:**
```bash
curl http://localhost:3000/posts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**3. Refresh token:**
```bash
curl -X POST http://localhost:4000/token \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_REFRESH_TOKEN"}'
```

**4. Logout:**
```bash
curl -X DELETE http://localhost:4000/logout \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_REFRESH_TOKEN"}'
```

### Using Postman or Thunder Client

1. Create a new request collection
2. Add requests for each endpoint above
3. Use environment variables to store tokens between requests

## 🔒 Security Features

✅ **Short-lived access tokens** - Minimize damage if stolen  
✅ **Long-lived refresh tokens** - Better UX, stored server-side  
✅ **Token verification** - Cryptographic validation with JWT  
✅ **Separate servers** - Auth logic isolated from business logic  
✅ **Token revocation** - Logout invalidates refresh tokens  

## ⚠️ Known Limitations

This is a **learning/demo project** and has limitations:

- ❌ **No password authentication** - Anyone can login with any username
- ❌ **In-memory token storage** - Refresh tokens lost on server restart
- ❌ **No rate limiting** - Vulnerable to brute force
- ❌ **No HTTPS** - Tokens transmitted in plain text (use HTTPS in production!)
- ❌ **No user database** - No real user management
- ❌ **Refresh tokens never expire** - Should have expiration in production

## 🎓 Learning Outcomes
Tutorial from https://youtu.be/mbsmsi7l3r4?si=4bECkyq7TyRVfH2b

After exploring this project, you'll understand:

- How JWT authentication works
- The difference between access and refresh tokens
- Why short-lived tokens improve security
- How middleware protects routes
- Token refresh mechanisms
- Basic Express.js server setup

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **jsonwebtoken** - JWT creation and verification
- **dotenv** - Environment variable management

## 📚 Further Reading

- [JWT.io](https://jwt.io/) - Learn about JWTs
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## 🤝 Contributing

Feel free to fork this project and experiment! Some ideas for improvements:

- Add a user database (MongoDB, PostgreSQL)
- Implement password hashing (bcrypt)
- Add rate limiting (express-rate-limit)
- Add CORS configuration
- Implement token expiration for refresh tokens
- Add unit tests
- Create a frontend demo

## 📝 License

MIT License - feel free to use this for learning!

## 👤 Author

Your Name - [@ReetSolanki](https://github.com/ReetSolanki)
