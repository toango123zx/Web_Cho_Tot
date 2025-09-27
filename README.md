# Web_Cho_Tot

ChoTot Clone is a modern online marketplace for posting and browsing listings, searching with filters, chatting, and receiving realtime notifications. The platform integrates on-chain transactions on Solana, using a custom unit called Đồng Tốt for deposits, secure payments, and escrow-like guarantees between buyers and sellers.

## 🚀 Features

- **Marketplace Platform**: Post and browse listings with advanced search and filtering capabilities
- **Real-time Communication**: Live chat system with instant messaging
- **Real-time Notifications**: Push notifications for new messages, offers, and updates
- **Solana Blockchain Integration**: On-chain transactions using custom Đồng Tốt tokens
- **Secure Payments**: Escrow-like payment system for buyer-seller protection
- **User Authentication**: Secure login with Google OAuth integration
- **Modern UI/UX**: Responsive design with dark/light theme support

## 🛠️ Tech Stack

### Backend

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Real-time**: Socket.IO for live chat and notifications
- **Blockchain**: Solana Web3.js integration
- **Email**: Nodemailer for notifications
- **API Documentation**: Swagger/OpenAPI

### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Blockchain**: Solana Wallet Adapter
- **Real-time**: Socket.IO Client
- **UI Components**: Custom components with Radix UI primitives

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 17.2
- **Package Manager**: pnpm
- **Code Quality**: ESLint, Prettier

## 📁 Project Structure

```
Web_Cho_Tot/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   ├── common/          # Shared utilities
│   │   ├── configs/         # Configuration files
│   │   └── models/          # Prisma-generated DTOs
│   ├── prisma/
│   │   └── schemas/         # Database schemas
│   └── docker-compose.yml   # Development environment
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── services/        # API services
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript definitions
│   └── public/             # Static assets
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Web_Cho_Tot
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd backend
   pnpm install

   # Install frontend dependencies
   cd ../frontend
   pnpm install
   ```

3. **Set up environment variables**

   Create `.env` files in both backend and frontend directories:

   **Backend (.env)**

   ```env
   # Database Configuration
   DATABASE_URL="postgresql://root:root@localhost:5434/trip"

   # Server Configuration
   PORT=3000
   NODE_ENV="development"
   API_VERSION="1.0.0"

   # Security & Authentication
   COOKIE_SECRET="your-cookie-secret-key"
   JWT_SECRET_ACCESS_KEY="your-jwt-access-secret"
   JWT_SECRET_REFRESH_KEY="your-jwt-refresh-secret"
   EXPIRES_IN_ACCESS_KEY="15m"
   EXPIRES_IN_REFRESH_KEY="7d"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GOOGLE_REDIRECT_URI="http://localhost:3001/auth/google/callback"

   # Email Configuration
   MAIL_HOST="smtp.gmail.com"
   MAIL_PORT=587
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   MAIL_SENDER_ADDRESS="your-email@gmail.com"
   MAIL_SENDER_NAME="ChoTot Clone"

   # OTP Configuration
   OTP_EXPIRES_IN=5

   # API Configuration
   DEFAULT_PAGE=1
   DEFAULT_LIMIT_PAGE=10

   # CORS Configuration
   CORS_ORIGIN="http://localhost:5173,http://localhost:3000"

   # Solana Blockchain Configuration
   SOL_RECEIVE_ADDRESS="your-solana-wallet-address"
   SOL_RPC_ENDPOINT="https://api.devnet.solana.com"
   ```

   **Frontend (.env)**

   ```env
   # Backend API Configuration
   VITE_BACKEND_URL="http://localhost:3001"

   # Solana Configuration
   VITE_SOL_RPC_ENDPOINT="https://api.devnet.solana.com"
   VITE_SOL_RECEIVE_ADDRESS="your-solana-wallet-address"

   # Cloudinary Configuration (for image uploads)
   VITE_CLOUD_NAME="your-cloudinary-cloud-name"
   VITE_UPLOAD_ASSET_NAME="your-cloudinary-upload-preset"
   ```

4. **Start the development environment**

   ```bash
   # Start database and backend
   cd backend
   docker-compose up -d

   # Run database migrations
   pnpm run db:push

   # Start backend in development mode
   pnpm run start:dev
   ```

   ```bash
   # Start frontend (in a new terminal)
   cd frontend
   pnpm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api

## 🔧 Available Scripts

### Backend

```bash
pnpm run start:dev      # Start development server
pnpm run build          # Build for production
pnpm run start:prod     # Start production server
pnpm run test           # Run unit tests
pnpm run db:push        # Push database schema changes
pnpm run db:gen-dto     # Generate Prisma DTOs
```

### Frontend

```bash
pnpm run dev            # Start development server
pnpm run build          # Build for production
pnpm run preview        # Preview production build
pnpm run lint           # Run ESLint
```

## 🏗️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **Users**: User accounts with authentication
- **Posts**: Marketplace listings
- **Transactions**: Solana blockchain transactions with Đồng Tốt tokens
- **Chat**: Real-time messaging system
- **Notifications**: Push notification system

## 🔐 Authentication & Security

- JWT-based authentication
- Google OAuth integration
- Password hashing with bcrypt
- CORS configuration
- Input validation with class-validator

## 🌐 Blockchain Integration

- **Solana Network**: Devnet for development, Mainnet for production
- **Custom Token**: Đồng Tốt (Dong Tot) for marketplace transactions
- **Wallet Integration**: Solana Wallet Adapter for frontend
- **Transaction Types**: Deposits, usage payments, escrow transactions
- **Security**: Transaction signatures for verification

## 📱 Real-time Features

- **Live Chat**: Socket.IO-powered messaging
- **Notifications**: Real-time push notifications
- **Live Updates**: Instant updates for listings and transactions

## 🚀 Deployment

### Using Docker

1. **Build and run with Docker Compose**

   ```bash
   cd backend
   docker-compose up --build
   ```

2. **Deploy frontend**
   ```bash
   cd frontend
   pnpm run build
   # Deploy dist/ folder to your hosting service
   ```

### Environment Setup

- Configure production environment variables
- Set up PostgreSQL database
- Configure Solana RPC endpoints
- Set up email service for notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: This is a development version. For production deployment, ensure proper security configurations and environment setup.
