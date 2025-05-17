# React Comfy Zone - TypeScript Edition

This is a TypeScript rewrite of the original [comfy-zone](https://github.com/Freemasoid/react-comfy-zone) project, featuring a full-stack implementation with a React frontend and Express backend. The project includes server-side integration with a fully TypeScript API.

Hosting: [Live Demo](https://ts-react-comfy-zone.onrender.com)

## Technologies Used

### Frontend

- **Framework**: React 19, TypeScript, Vite
- **Routing**: React Router v7
- **State Management**: Redux Toolkit
- **API Communication**: tRPC
- **Authentication**: Clerk
- **Data Fetching**: TanStack React Query
- **Styling**: TailwindCSS v4, shadcn/ui, Radix UI, Lucide icons

### Backend

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: Clerk
- **API Layer**: tRPC (also there are REST endpoints as alternative, left them because why not)
- **Type Safety**: Zod

### API Architecture

The project uses a tRPC-first API approach:

- **tRPC**: Used for most data operations (products, orders, users, reviews) to provide type-safe, end-to-end typings between client and server.

- **REST API**: Used specifically for file uploads (product/review images) where REST's multipart/form-data handling and streaming capabilities offer better performance and compatibility with file processing libraries.

## Current Status

- **Frontend**: Complete - Includes product browsing, filtering, cart management, checkout, user profile and admin dashboard with functional product/order management.
- **Backend**: Complete - Full TypeScript API with both tRPC and REST endpoints.
- **Authentication**: Implemented with Clerk, including webhook integration.

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/Freemasoid/ts-react-comfy-zone.git
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the root and server directories with the following variables:

     ```
     PORT
     MONGO_URI
     CLIENT_URL
     ORG // clerk organization

     NODE_ENV

     CLERK_PUBLISHABLE_KEY
     VITE_CLERK_PUBLISHABLE_KEY
     CLERK_SECRET_KEY
     CLERK_WEBHOOK_SECRET
     CLERK_SIGN_IN_DEMO_USER_EMAIL
     CLERK_SIGN_IN_DEMO_USER_PASSWORD
     VITE_CLERK_SIGN_IN_DEMO_USER_EMAIL
     VITE_CLERK_SIGN_IN_DEMO_USER_PASSWORD
     VITE_DEEPL_API_KEY

     SIGNIN_URL="/sign-in" // front end router

     CLOUDINARY_CLOUD_NAME
     CLOUDINARY_API_KEY
     CLOUDINARY_API_SECRET
     ```

4. Development mode:

   - For frontend only:
     ```
     pnpm dev
     ```
   - For backend only:
     ```
     pnpm dev:server
     ```
   - For both concurrently:
     ```
     pnpm dev:all
     ```

5. Production build and start:

   ```
   pnpm build
   pnpm start
   ```

## Project Structure

- `src/` - Frontend React application

  - `pages/` - Route components
  - `shared/` - Shared UI components and utilities
  - `store/` - Redux store configuration
  - `trpc/` - tRPC client setup
  - `features/` - Feature-based components and logic
  - `utils/` - Utility functions
  - `i18n/` - Internationalization support

- `server/` - Backend API
  - `tRPC/` - tRPC router and procedures
  - `routes/` - REST API routes
  - `controllers/` - Route handlers
  - `models/` - MongoDB schemas
  - `middleware/` - Express middleware
  - `utils/` - Utility functions
  - `config/` - Configuration files
  - `errors/` - Error handling
  - `db/` - Database connection

## Features

- Product browsing with filtering and search
- Shopping cart functionality
- User authentication and profile management
- Order creation and history
- Admin dashboard for product management
- Responsive design for various device sizes
- Dark/light mode support
- Internationalization

## Contributing

Feel free to open issues or submit pull requests if you want to contribute.
