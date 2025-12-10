# DocuMint - نظام المعاملات الإلكترونية

نظام إدارة المعاملات الإلكترونية مع دعم كامل للغة العربية

## Overview

DocuMint is a modern document management system built with React and Material-UI, featuring complete RTL support for Arabic language. The system provides a comprehensive solution for managing electronic transactions, workflow automation, and digital signatures.

## Features

- 🌐 Complete Arabic language support with RTL layout
- 🔐 Role-based authentication system
- 📝 Electronic transaction management
- ⚡ Smart workflow automation
- ✍️ Digital signature integration
- 📱 Responsive design (mobile & desktop)
- 🔔 Real-time notifications
- 👥 User management

## Tech Stack

- **Frontend Framework:** React + Vite
- **UI Library:** Material-UI v7
- **Routing:** React Router v7
- **State Management:** React Context
- **Styling:** Emotion + MUI Styled
- **RTL Support:** stylis-plugin-rtl
- **Icons:** @mui/icons-material
- **HTTP Client:** Axios
- **Real-time:** Socket.io
- **Digital Signatures:** react-signature-canvas
- **PDF Handling:** pdfjs-dist

## Getting Started

### Prerequisites

- Node.js (Latest LTS version)
- npm or yarn

### Installation & running locally

1. Clone the repository:

```bash
git clone <your-repo-url>
cd DocuMint
```

2. Install dependencies:

```bash
npm install
```

3. Start the mock API server (recommended for frontend development):

```bash
npm run mock
```

4. Start the Vite dev server in a separate terminal:

```bash
npm run dev
```

You can also run both in parallel via the start script:

```bash
npm start
```

The frontend will be available at `http://localhost:5173` and the mock API at `http://localhost:3001`.

### Mock Users (Development)

Use the mock users in `mock/db.json` for testing authentication flows and role-based UI.

Example (for local testing only):

```
Email: manager@example.com
Password: password123
```

### Continuous Integration

This repository includes a GitHub Actions workflow that runs lint and build checks on push and pull requests. See `.github/workflows/ci.yml` for details.

## Project Structure

```
DocuMint/
├── src/
│   ├── components/
│   │   ├── common/       # Reusable components
│   │   ├── layout/       # Layout components
│   │   ├── pages/        # Page components
│   │   ├── signature/    # Signature related components
│   │   ├── styled/       # Styled components
│   │   └── workflow/     # Workflow components
│   ├── context/         # React Context providers
│   ├── services/        # API services
│   ├── theme/          # MUI theme configuration
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
└── public/            # Static assets
```

## Features in Detail

### Authentication System
- Role-based access control
- Session management
- Secure token handling
- Password protection

### Transaction Management
- Create new transactions
- Upload documents
- Track transaction status
- View transaction history
- Add comments and notes

### Digital Signatures
- Draw signatures
- Save and verify signatures
- View signature history
- Multi-party signing

### Workflow System
- Dynamic workflow routing
- Automatic escalation
- Deadline tracking
- Status updates

### Notification System
- Real-time notifications
- Email notifications (to be implemented)
- Custom notification preferences
- Mark as read/unread

## Development Guidelines

### Code Style
- Use functional components
- Follow React Hooks best practices
- Maintain consistent file structure
- Use proper component composition

### RTL Support
- Use `dir="rtl"` attribute
- Use MUI's RTL-aware components
- Test layouts in both RTL and LTR

### Security
- Input validation
- XSS prevention
- CSRF protection
- Secure session handling

## Future Enhancements

- [ ] Backend API integration
- [ ] Email notifications
- [ ] Advanced document preview
- [ ] Bulk operations
- [ ] Export functionality
- [ ] Advanced search
- [ ] Activity logging
- [ ] User preferences

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project used GNU v3.0 As It's licensing.

## Support

For support and inquiries, please contact |baraa-hazaa00@hotmail.com|
