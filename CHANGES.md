# Changes Made — bhetau.com Frontend Fixes

---

## Fix 1: Backend Wake-Up & Fast Page Load

### Problem

Render.com (hobby tier) puts the backend to sleep after ~15 minutes of inactivity.
When a user visits bhetau.com while the backend is asleep:

1. The React app mounts and `AuthContext` immediately fires `getUser()` (GET `/api/auth/user`)
2. The backend is sleeping — the request just hangs for up to **2 minutes** while Render wakes it up
3. React Query keeps `isLoading: true` the entire time
4. `App.jsx` sees `loading === true` and shows the full-screen spinner: "Connecting to server..."
5. After ~2 minutes the backend responds with `401 Unauthorized` (no session cookie)
6. React Query resolves the user as `null`, and only then does the homepage appear

**The user stares at a spinner for 2 minutes before seeing anything.**

### Solution — Three coordinated changes

---

### File: `src/services/api.js`

#### Before
```js
export const getUser = ({signal}) => api.get("/auth/user", {signal}).then(res => res.data);
```

#### After
```js
export const getUser = ({signal, timeout} = {}) =>
  api.get("/auth/user", {signal, ...(timeout && {timeout})}).then(res => res.data);

// Fire-and-forget: silently wakes the Render backend without affecting UI state
export const warmupBackend = () => {
  api.get("/auth/user", {timeout: 180000}).catch(() => {});
};
```

#### Why
- `getUser` now accepts an optional `timeout` (in milliseconds) passed through to Axios.
- `warmupBackend` is a silent, fire-and-forget function. It hits the same endpoint with a
  3-minute timeout. It does NOT return a promise to the caller and swallows all errors with
  `.catch(() => {})`. Its only purpose is to keep an HTTP connection open to the Render server
  so it continues waking up, even after the UI-side call has already given up.

---

### File: `src/context/AuthContext.jsx`

#### Before
```js
queryFn: async ({signal}) => {
  try {
    const response = await getUser(signal);   // BUG: passes AbortSignal directly
    return { ...response, id: response.userId }
  } catch(err) {
    console.log("X User fetch error: ", err);
    console.log(err.response?.data);
    console.log(err.message);
    if (err.response?.status === 401) {
      return null;
    }
    throw err;
  }
},
```

#### After
```js
queryFn: async ({signal}) => {
  try {
    // 8-second timeout: if Render backend is sleeping, fail fast and show
    // the page as unauthenticated rather than blocking for ~2 minutes.
    // warmupBackend() in App.jsx keeps the wake-up request alive in background.
    const response = await getUser({signal, timeout: 8000});
    return { ...response, id: response.userId }
  } catch(err) {
    if (err.response?.status === 401) {
      return null;
    }
    // Timeout or cancelled while backend sleeps — treat as unauthenticated
    if (err.code === 'ECONNABORTED' || err.name === 'CanceledError') {
      return null;
    }
    throw err;
  }
},
```

#### Why

**Bug fix — signal was broken:**
The original code called `getUser(signal)` where `signal` is a raw `AbortSignal` object.
But `getUser` has signature `({signal})` — it expects an object with a `signal` property.
Passing a raw `AbortSignal` means destructuring gives `undefined`, so React Query's
query cancellation (e.g. when the component unmounts) was silently ignored. Fixed to
`getUser({signal, timeout: 8000})`.

**Timeout = fast page load:**
The `timeout: 8000` (8 seconds) makes Axios abort the request if the backend hasn't
responded. When the backend is asleep, the request times out after 8 seconds instead of
hanging for 2 minutes. The `catch` block now handles two new error codes:
- `ECONNABORTED` — Axios's code for a request that exceeded its `timeout` option
- `CanceledError` — thrown when an `AbortSignal` fires (e.g. React Query cancellation)

Both cases return `null`, which means "user is not logged in" — the page renders immediately.

**Removed noisy console logs:**
The three `console.log` lines for the 401 error were removed. The 401 is expected behaviour
(unauthenticated visitor), not an error worth logging to the console every page load.

---

### File: `src/App.jsx`

#### Before
```js
function App() {
  const { isAuthenticated, loading, error, fetchUser } = useAuth();
  ...
```

#### After
```js
import { useEffect } from "react";
import { warmupBackend } from "./services/api";

function App() {
  const { isAuthenticated, loading, error, fetchUser } = useAuth();

  useEffect(() => {
    warmupBackend();
  }, []);
  ...
```

#### Why
`useEffect` with `[]` runs exactly once, immediately after the first render.
This fires `warmupBackend()` the moment any user visits the site. The flow is now:

1. User visits bhetau.com
2. App renders → `warmupBackend()` fires (starts waking Render, no UI effect)
3. `getUser()` also fires (with 8-second timeout)
4. After ≤8 seconds, `getUser` gives up → page shows immediately (unauthenticated)
5. Meanwhile `warmupBackend()` is still running in background, keeping Render awake
6. User reads the page, navigates to /login, types credentials (~1-2 minutes)
7. By the time they click "Log In", the backend has fully woken up
8. Login succeeds without the extra 2-minute wait

---

## Fix 2: Chrome Extension / Google Fonts Console Error

### Problem

`index.html` contained these three lines:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Chrome extensions like **uBlock Origin**, **Brave Shields**, **Privacy Badger**, or
**Ghostery** treat requests to `fonts.googleapis.com` and `fonts.gstatic.com` as
third-party Google tracking domains and block or intercept them. This causes errors like:

```
net::ERR_BLOCKED_BY_CLIENT
GET https://fonts.googleapis.com/css2?... (blocked)
```

or generic extension errors in the DevTools console. You cannot fix this from your own
code — it is the extension reacting to the presence of Google's CDN domains.

Additionally, every page load required a network round-trip to Google's servers to
fetch the font, which adds latency.

### Solution

#### Installed
```
npm install @fontsource-variable/noto-sans-devanagari
```

This is the official self-hosted version of the same font, published by the Fontsource
project. It ships the `.woff2` files as npm assets — Vite bundles them into `dist/`
at build time, so the font is served from your own domain (vercel.app / bhetau.com),
not Google's servers.

---

### File: `index.html`

#### Before
```html
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Event Hub</title>
</head>
```

#### After
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Event Hub</title>
</head>
```

#### Why
All three Google Fonts lines removed. The font is now imported via npm instead.
No external network requests to Google at all.

---

### File: `src/main.jsx`

#### Before
```js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
```

#### After
```js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/noto-sans-devanagari";
import "./index.css";
```

#### Why
`@fontsource-variable/noto-sans-devanagari` exports a CSS file that declares the
`@font-face` rule pointing to the bundled `.woff2` files. Importing it in `main.jsx`
makes Vite include the font in the production bundle. The `font-family` name stays
`'Noto Sans Devanagari'` — unchanged — so all existing CSS classes continue to work
with zero further modifications.

The build output confirms the three `.woff2` files are now bundled locally:
```
dist/assets/noto-sans-devanagari-devanagari-wght-normal-DWI_L5Cu.woff2   121 kB
dist/assets/noto-sans-devanagari-latin-wght-normal-Bxfr4UJH.woff2         25 kB
dist/assets/noto-sans-devanagari-latin-ext-wght-normal-CLkupaxV.woff2     14 kB
```

---

## Summary Table

| File | What changed | Why |
|------|-------------|-----|
| `src/services/api.js` | `getUser` accepts `timeout`; added `warmupBackend()` | Enable fast-fail on UI, keep background wake-up alive |
| `src/context/AuthContext.jsx` | Fixed signal bug; added 8s timeout; removed noisy logs | Page loads in ≤8s instead of ≤2min when backend sleeps |
| `src/App.jsx` | Added `useEffect` calling `warmupBackend()` on mount | Starts waking Render the moment user hits the site |
| `index.html` | Removed 3 Google Fonts CDN links | Eliminates Chrome extension console errors |
| `src/main.jsx` | Added `@fontsource-variable/noto-sans-devanagari` import | Self-hosts font from your own domain instead of Google CDN |
| `package.json` | Added `@fontsource-variable/noto-sans-devanagari` dependency | Fontsource npm package for self-hosted font |
