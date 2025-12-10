# Release Notes

This initial development snapshot includes:

- Frontend React app (Vite + MUI) with Arabic RTL support
- Mock API server using json-server + Socket.IO for notifications
- Mock data in `mock/db.json`
- GitHub Actions CI to lint and build on push/PR
- Contributor guidelines and PR template

How it works:
- Run `npm run mock` to start the local mock API (port 3001)
- Run `npm run dev` to start Vite dev server (port 5173)
- Use `npm start` to run both concurrently

Notes:
- This release is for development/testing only. Do not use mock server for production.
