# Event Sharing  Platform

A modern event sharing web application built with React and vite.


## ⚠️ Important Note: Backend Dependency

**This frontend application requires a backend server to be running for full functionality.** The backend API is available in a separate repository.

### Backend Repository 
#### 🔗 The backend repository link: [lex-events-backend](https://github.com/rameshpokharel21/lex-events-backend)
    
## 📦 Prerequisite

Before running this project, make sure to have the following  
1. **Backend API** running locally or deployed  
2. Node.js (version 16 or higher)

## 🌟 Features

**Event Management**: Create, update, and view events  
**Form Validation**: Client-side form validations  
**Responsive Design**: Works on desktop and mobile devices  
**Modern UI**: Clean and intutive user interface

## 🛠️ Tech Stack

**Frontend**: React 19  
**Build Tool**: Vite  
**Styling**: Tailwind CSS  
**State Management**: React Context

## ⚡Quick Setup

### Step 1: Set up the Backend  
Clone and run the backend server first: [lex-events-backend](https://github.com/rameshpokharel21/lex-events-backend)  
### Step 2: Clone this repository  
```bash  
git clone https://github.com/rameshpokharel21/lex-events-frontend.git
```  
### Step 3:  Install dependencies 
`npm install` or `yarn install` or `pnpm install`  
### Step 4: Create .env file in the root directory and add your backend url:  
```env
VITE_API_URL=http://localhost:9000/api
```
(See `.env.example`. In production Vercel uses `VITE_API_URL=https://events-api.lexnepali.com/api`.)
### Step 5: Start development server:  
`npm run dev`

## 🔌API Integration

The frontend communicates with the backend API for:  
- ✅ User authentication and authorization (HttpOnly access + refresh cookies; an expired access token is refreshed automatically)
- ✅ Event create, read, update, and delete operation
- ✅ Data persistence and storage
- ✅ Sending otp through email

## 🐛 Common Issues

- 503 Error: verify VITE_API_URL in .env file for correct backend url.  
- CORS Errors: the backend `ALLOWED_ORIGINS` must contain the frontend URL (http://localhost:5173 locally, https://events.lexnepali.com in production)
- Logged out right after login: the backend cookie settings must match the environment (`COOKIE_SECURE=false` on http://localhost, `true` on https)
- Form submission Failures: checkFrontend or Backend validation erros in dev tools




