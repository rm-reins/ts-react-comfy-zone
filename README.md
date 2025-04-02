# React Comfy Zone - New Version

This is a new version of the old React project [comfy-zone](https://github.com/Freemasoid/react-comfy-zone). The project is being updated with server-side integration and a TypeScript conversion of the backend API.

## Technologies Used

### Frontend

- **Functionality**: React, Typescript, ReactRouter, ReduxToolKit, Axios, Clerk, tRPC
- **Styling**: TailwindCSS, RadixUI, Lucide, shadcn/ui

### Backend

- Node.js, TypeScript, Express.js, MongoDB, Clerk, tRPC

### API Architecture

This project uses a hybrid API approach:

- tRPC: Used for most data operations (products, orders, users, reviews) to provide type-safe, end-to-end typings between client and server.

- REST API: Used specifically for file uploads (product/review images) where REST's multipart/form-data handling and streaming capabilities offer better performance and compatibility with file processing libraries.

## Current Status

- **Frontend**: In progress. The front-end application is actively being developed with TypeScript.
- **Server Integration**: Done. Backend has been integrated and converted to TypeScript from the original [node-e-commerce-api](https://github.com/Freemasoid/node-e-commerce-api). Minor improvements and tweaks may be added in future updates.

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

   - Create a `.env` file in the root directory with the following variables:

     ```
     # Database
     MONGO_URI=your_mongodb_connection_string

     # Clerk Authentication
     CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
     CLERK_SECRET_KEY=your_clerk_secret_key
     CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
     # Add this for dev
     VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

     # Server
     PORT=5174
     CLIENT_URL=http://localhost:5173
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

## Structure Overview

- The **frontend** React app is located in the `src` directory.
- The **server** API is in the `server` folder, which is being refactored into TypeScript.

## Contributing

Feel free to open issues or submit pull requests if you want to contribute.
