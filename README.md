# Tic Tac Toe Security App

Una aplicación web segura que presenta un juego de Tic Tac Toe con autenticación de usuarios y gestión de sesiones, desarrollada para análisis de seguridad.

## Features

- **Secure User Registration**: 
  - Age validation (18+ years only)
  - Strong password policy (8+ chars, uppercase, lowercase, numbers, special characters)
  - Dominican Republic phone number validation (809/829/849)
  - Email validation

- **Authentication & Sessions**:
  - Secure login system with bcrypt password hashing
  - Session management with secure cookies
  - Rate limiting for login attempts

- **Game Features**:
  - Tic Tac Toe vs CPU with 3 difficulty levels (Easy, Medium, Hard)
  - Game statistics tracking (wins, losses, ties)
  - Win rate calculation

- **Security Features**:
  - Helmet.js for security headers
  - Rate limiting
  - Input validation and sanitization
  - SQL injection prevention
  - XSS protection

## Quick Start

### Using Docker (Recommended)

```bash
# Pull and run the container
docker run -p 3000:3000 [your-dockerhub-username]/tic-tac-toe-security-app

# Access the application
open http://localhost:3000
```

### Local Development

```bash
# Install dependencies
npm install

# Start the application
npm start

# Access the application
open http://localhost:3000
```

## Test Credentials

For testing purposes, you can register a new account with:
- Username: testuser
- Email: test@example.com
- Password: TestPass123!
- Phone: 8091234567
- Birth Date: Any date making the user 18+ years old

## Application Structure

```
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── Dockerfile         # Docker configuration
├── public/
│   ├── index.html     # Login/Register page
│   ├── game.html      # Game interface
│   ├── styles.css     # Styling
│   ├── auth.js        # Authentication logic
│   └── game.js        # Game logic and AI
└── database.sqlite    # SQLite database (created automatically)
```

## Security Analysis

This application was developed for security testing and analysis purposes. It includes:

- **Input validation** on both client and server side
- **Password hashing** using bcryptjs
- **Session security** with secure cookie settings
- **Rate limiting** to prevent brute force attacks
- **Security headers** via Helmet.js
- **SQL injection prevention** using parameterized queries

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Security**: bcryptjs, express-session, helmet, express-rate-limit
- **Containerization**: Docker

## License

MIT License - Desarrollado para propósitos educativos y análisis de seguridad.