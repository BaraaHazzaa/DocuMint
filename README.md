# DocuMint - نظام المعاملات الإلكترونية

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![CI](https://github.com/BaraaHazzaa/DocuMint/actions/workflows/ci.yml/badge.svg)](https://github.com/BaraaHazzaa/DocuMint/actions/workflows/ci.yml)

نظام إدارة المعاملات الإلكترونية مع دعم كامل للغة العربية

## 📜 Overview

DocuMint is a modern document management system built with React and Material-UI, featuring complete RTL support for the Arabic language. The system provides a comprehensive solution for managing electronic transactions, workflow automation, and digital signatures in a secure and efficient way.

## ✨ Features

- 🌐 **Complete Arabic Support:** Full RTL layout and Arabic language support.
- 🔐 **Role-Based Authentication:** Secure authentication system with different user roles (Admin, Manager, Employee).
- 📝 **Transaction Management:** Create, track, and manage electronic transactions.
- ⚡ **Workflow Automation:** Smart, automated workflows for approvals and processing.
- ✍️ **Digital Signatures:** Integrated digital signature functionality.
- 📱 **Responsive Design:** Fully responsive for both mobile and desktop devices.
- 🔔 **Real-Time Notifications:** Instant notifications for transaction updates.
- 👥 **User Management:** Admin-only section for user management.

## 🛠️ Tech Stack

- **Frontend:** React, Vite
- **UI:** Material-UI (MUI) v7
- **Routing:** React Router v7
- **State Management:** React Context
- **Styling:** Emotion, MUI Styled Components
- **RTL Support:** `stylis-plugin-rtl`
- **Icons:** `@mui/icons-material`
- **HTTP Client:** Axios
- **Real-time:** Socket.io
- **Digital Signatures:** `react-signature-canvas`
- **PDF Handling:** `pdfjs-dist`

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/BaraaHazzaa/DocuMint
    cd DocuMint
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the mock API server:**
    This is recommended for frontend development without a live backend.
    ```bash
    npm run mock
    ```

4.  **Start the Vite dev server:**
    Run this in a separate terminal.
    ```bash
    npm run dev
    ```

    Alternatively, you can run both servers in parallel:
    ```bash
    npm start
    ```

The application will be available at `http://localhost:5173`, and the mock API server will be at `http://localhost:3001`.

### Mock Users (for Development)

You can use the mock users defined in `mock/db.json` to test authentication and role-based features.

**Example:**
- **Email:** `manager@example.com`
- **Password:** `password123`

## 📂 Project Structure

```
DocuMint/
├── public/            # Static assets
├── src/
│   ├── assets/        # Images, fonts, etc.
│   ├── components/    # Reusable React components
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── notifications/
│   │   ├── pages/
│   │   ├── signature/
│   │   ├── styled/
│   │   ├── transactions/
│   │   └── workflow/
│   ├── context/       # React Context providers
│   ├── hooks/         # Custom React hooks
│   ├── locales/       # i18n translation files
│   ├── services/      # API services and configurations
│   ├── theme/         # MUI theme configuration
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Root component
│   ├── i18n.js        # i18next configuration
│   └── main.jsx       # Application entry point
├── .github/           # GitHub Actions workflows
├── mock/              # Mock server setup
├── package.json
└── README.md
```

## 💡 Development Guidelines

- **Code Style:** Follow functional component patterns with React Hooks. Maintain consistency in file structure and component composition.
- **RTL Support:** Utilize MUI's built-in RTL support and test layouts in both LTR and RTL modes.
- **Security:** Implement input validation, XSS prevention, and secure session handling.

## 🔮 Future Enhancements

- [ ] **Backend API Integration:** Replace the mock server with a full-fledged backend.
- [ ] **Email Notifications:** Implement email notifications for important events.
- [ ] **Advanced Document Preview:** Add more advanced document viewing capabilities.
- [ ] **Bulk Operations:** Allow users to perform actions on multiple transactions at once.
- [ ] **Export Functionality:** Add options to export data to formats like CSV or PDF.
- [ ] **Advanced Search:** Implement a more powerful search with filtering options.
- [ ] **Activity Logging:** Keep a log of all user activities for auditing purposes.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0**. See the [LICENSE](LICENSE) file for details.

## 📧 Support

For any support or inquiries, please contact [baraa-hazaa00@hotmail.com](mailto:baraa-hazaa00@hotmail.com).
