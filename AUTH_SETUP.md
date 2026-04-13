# 🔐 AI Battle Arena - Authentication Setup Guide

## ✅ What Has Been Added

### Backend Authentication
- **User Model** with MongoDB/Mongoose
- **Secure Password Hashing** (bcryptjs)
- **JWT Token Authentication** (7-day expiration)
- **Protected Routes** with middleware
- **Auth Endpoints**:
  - `POST /api/auth/register` - Create new user
  - `POST /api/auth/login` - Login user
  - `POST /api/auth/logout` - Logout user
  - `GET /api/auth/verify` - Verify token validity

### Frontend Authentication
- **Login Component** - Beautiful dark-themed login form
- **Register Component** - User registration with validation
- **Auth Context** - Global state management for auth
- **Logout Button** - In app header with confirmation dialog
- **Token Management** - Auto-persist login, verify on app load
- **Protected API Calls** - All requests include auth token

## 📋 Requirements to Run

### Must Have
1. **MongoDB** running on `localhost:27017` OR update `MONGODB_URI` in `.env`
2. **Node.js** with npm installed

### Environment Setup
Your `.env` file is already configured with:
```
MONGODB_URI=mongodb://localhost:27017/ai-battle-arena
JWT_SECRET=your_jwt_secret_key_change_this_in_production_2024
JWT_EXPIRE=7d
```

## 🚀 How to Start

### 1. Backend
```bash
cd BACKEND
npm install  # Already done, just for reference
npm run dev  # Starts on http://localhost:3000
```

### 2. Frontend
```bash
cd FRONTEND
npm install  # Already done, just for reference
npm run dev  # Starts on http://localhost:5173
```

## 🔄 User Flow

### Registration
1. User fills registration form
2. Backend validates input & checks for duplicates
3. Password is hashed with bcryptjs
4. User created in MongoDB
5. JWT token returned
6. Token stored in localStorage
7. User redirected to ChatApp

### Login
1. User enters email & password
2. Backend finds user & verifies password
3. JWT token generated
4. Token stored in localStorage
5. User redirected to ChatApp
6. Welcome message shows username

### Using Protected Routes
1. User sends message in chat
2. JWT token automatically included in header
3. Backend middleware verifies token
4. Request allowed if valid, rejected if expired
5. Invalid/expired tokens trigger re-login

### Logout
1. User clicks logout button
2. Confirmation dialog appears
3. logout() function called
4. Token removed from localStorage
5. State cleared
6. User redirected to login

## 🛡️ Security Features

✅ **Password Security**
- Hashed with bcryptjs (10 salt rounds)
- Never stored in plain text
- Never sent back to client

✅ **Token Security**
- JWT tokens expire after 7 days
- Verified on every protected request
- Automatically cleared on expiration
- Token stored in localStorage (consider httpOnly cookies for production)

✅ **API Security**
- /invoke endpoint requires valid token
- CORS configured for frontend origin only
- Proper error messages (no info leakage)

✅ **Error Handling**
- Graceful degradation if MongoDB unavailable
- User-friendly error messages
- No app crashes
- Proper HTTP status codes

## 🧪 Testing the Authentication

### Test Registration
1. Open http://localhost:5173
2. Click "Sign up"
3. Fill form with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm: `password123`
4. You should be logged in

### Test Login
1. After registration, logout
2. Fill login form with:
   - Email: `test@example.com`
   - Password: `password123`
3. You should be logged in

### Test Protected Route
1. After login, try sending a message
2. Should work with your authentication
3. If token invalid, you'll get error

### Test Logout
1. Click logout button (top right)
2. Confirm logout
3. Redirected to login page
4. String "Bearer localStorage" note removed from header

## ⚙️ Configuration

### Change JWT Expiration
Edit `.env`:
```
JWT_EXPIRE=30d  # Change to desired duration
```

### Change MongoDB URI
Edit `.env`:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

### Change JWT Secret (Production)
Edit `.env`:
```
JWT_SECRET=your_super_secret_key_here_make_it_long_and_random
```

## 📁 Files Created/Modified

### Backend
- ✅ `src/models/user.model.ts` - User schema
- ✅ `src/routes/auth.routes.ts` - Auth endpoints
- ✅ `src/middleware/auth.middleware.ts` - Token verification
- ✅ `src/config/config.ts` - Configuration
- ✅ `src/app.ts` - Updated with auth routes
- ✅ `.env` - Updated with JWT config

### Frontend
- ✅ `src/context/AuthContext.jsx` - Auth state management
- ✅ `src/components/Login.jsx` - Login form
- ✅ `src/components/Register.jsx` - Register form
- ✅ `src/components/ChatApp.jsx` - Added logout button
- ✅ `src/components/ChatInput.jsx` - Added token to requests
- ✅ `src/app/App.jsx` - Auth check & routing
- ✅ `src/main.jsx` - AuthProvider wrapper

## ⚠️ Important Notes

1. **MongoDB Required**: Ensure MongoDB is running before starting backend
   - If not available, backend will log warning but continue
   - Auth endpoints will fail gracefully

2. **CORS Configured**: Frontend must be on `http://localhost:5173`
   - Update CORS in `src/app.ts` if frontend URL changes

3. **Token Storage**: Currently using localStorage
   - For production, consider httpOnly cookies

4. **Environment Variables**: Change JWT_SECRET in production!
   - Current secret is for development only

5. **No Crashes**: 
   - All errors are caught and handled
   - Graceful fallbacks implemented
   - User-friendly error messages shown

## 🔍 Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env matches your setup
- Backend will still run but auth will not work

### "Token expired"
- User needs to login again
- Token expires after 7 days (configurable)

### "Invalid token"
- Token might be corrupted
- Try clearing localStorage and logging in again
- Check browser console for errors

### "CORS Error"
- Ensure frontend is on http://localhost:5173
- Update CORS origin in `src/app.ts` if needed

### "Login/Register not working"
- Check MongoDB is running
- Check network tab in browser DevTools
- Check backend console for errors

## 📚 How It Works

### JWT Token Flow
```
User Login
    ↓
POST /api/auth/login {email, password}
    ↓
Backend: Find user & verify password
    ↓
Generate JWT: jwt.sign({userId}, SECRET, {expiresIn: 7d})
    ↓
Send token to frontend
    ↓
Frontend: Store in localStorage & state
    ↓
All protected requests include: Authorization: Bearer TOKEN
    ↓
Backend: Middleware verifies token with jwt.verify()
    ↓
Allow or reject request based on token validity
```

## 🎉 You're All Set!

Your authentication system is now ready:
- ✅ Users can register
- ✅ Users can login
- ✅ Users can logout
- ✅ Protected routes require authentication
- ✅ No crashes or breaking changes
- ✅ Secure password hashing
- ✅ JWT token management
- ✅ Beautiful UI for auth flows

Try it out! Register a new account and start using the AI Battle Arena! 🚀
