# Barcode-Driven Inventory System

A web-based inventory management system built with **Next.js 15**, featuring **barcode scanning**, a **Kanban board** for product categorization, and optional features like authentication, an analytics dashboard, and search functionality.

## Table of Contents
- [Overview](#overview)
- [Live Link](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Documentation](#documentation)
- [Challenges-Faced] (#Challenges-Faced)
## Overview
This project is a barcode-driven inventory system designed to manage products efficiently. It allows users to **scan barcodes to fetch product details**, organize products into categories using a **drag-and-drop Kanban board**, and persist data in a **MongoDB database**. The system is responsive, secure, and includes optional features like authentication and analytics.

## Live Link
The application is hosted at: [[https://barcode-driven-inventory-system.vercel.app](https://barcode-driven-inventory-system.vercel.app)].  

## Features
### Core Features
1. **Barcode Scanning**:
   - Utilizes `@ericblade/quagga2` and `tesseract.js` for accurate barcode detection and scanning.
   - Integrates with an external API (e.g., [Open Food Facts or UPCItemDB](https://products-test-aci.onrender.com/product/{your_barcode})) to fetch product details.
   - Includes error handling for invalid or missing barcode data.
2. **Kanban Board**:
   - Built with `@hello-pangea/dnd` for smooth drag-and-drop functionality.
   - Supports dynamic category creation and persistence in MongoDB.
   - Responsive design for mobile and desktop devices.
3. **Backend APIs**:
   - RESTful APIs for product and category management, implemented in Next.js API routes.
   - Clean, modular code with proper database design using MongoDB.
   

### Bonus Features
1. **Analytics Dashboard**:
   - Displays product counts per category and recently added products.
   - Built with reusable React components for dynamic data visualization.
2. **Search Functionality**:
   - Search bar to filter products by name or category, enhancing usability.

## Tech Stack
- **Framework**: Next.js (`15.3.5`) - For server-side rendering, API routes, and optimized performance.
- **Frontend**: React (`19.0.0`), React DOM (`19.0.0`) - For building reusable UI components.
- **Styling**: Tailwind CSS (`4`) - For responsive and utility-first styling.
- **Barcode Scanning**: `@ericblade/quagga2` (`1.8.4`), `tesseract.js` (`6.0.1`) - For barcode detection and OCR.
- **Drag-and-Drop**: `@hello-pangea/dnd` (`18.0.1`) - For Kanban board functionality.
- **Database**: MongoDB (`6.17.0`) - For persistent storage of products and categories.
- **Authentication**: `next-auth` (`5.0.0-beta.29`), `bcrypt` (`6.0.0`), `bcryptjs` (`3.0.2`) - For secure user authentication.
- **HTTP Client**: `axios` (`1.10.0`) - For making API requests.
- **Validation**: `zod` (`3.25.73`) - For schema validation.
- **TypeScript**: (`5`) - For type safety and better developer experience.
- **Linting**: ESLint (`9.30.1`), `@typescript-eslint` (`8.35.1`) - For code quality and consistency.
- **Build Tools**: Next.js CLI, Webpack (bundled with Next.js).

## Project Structure
```
barcode-inventory/
├── app/
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.ts           # API routes for product management
│   │   │   ├── [barcode]/
│   │   │   │   ├── route.ts      # API route for fetching product by barcode
│   │   ├── categories/
│   │   │   ├── route.ts          # API routes for category management
│   ├── components/
│   │   ├── BarcodeScanner.tsx     # Component for barcode scanning
│   │   ├── KanbanBoard.tsx        # Component for drag-and-drop Kanban board
│   │   ├── ProductCard.tsx        # Component for rendering product cards
│   ├── lib/
│   │   ├── mongodb.ts             # MongoDB connection and utilities
│   │   ├── types.ts               # TypeScript type definitions
│   ├── page.tsx                   # Main page
│   ├── layout.tsx                 # Layout component
├── public/                        # Static assets
├── styles/
│   ├── globals.css                # Global styles with Tailwind CSS
├── .env.local                     # Environment variables
├── next.config.mjs                # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Project dependencies and scripts
```

## Setup Instructions
1. **Prerequisites**:
   - Node.js (v18 or higher)
   - MongoDB (local or cloud instance, e.g., MongoDB Atlas)
   - A barcode API key (e.g., Open Food Facts or UPCItemDB)

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/NajibHossain49/Barcode-Driven-Inventory-System.git
   cd Barcode-Driven-Inventory-System
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Configure Environment Variables**:
   - Create a `.env.local` file in the root directory.
   - Add the following variables:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     NEXT_PUBLIC_API_URL=your_barcode_API_key
     ```

5. **Set Up MongoDB**:
   - Ensure MongoDB is running locally or use a cloud instance.
   - Update `app/lib/mongodb.ts` with the correct connection settings.

## Running the Application
1. **Development Mode**:
   ```bash
   npm run dev
   ```
   - The application will be available at `http://localhost:3000`.

2. **Build and Start Production**:
   ```bash
   npm run build
   npm run start
   ```

3. **Linting**:
   ```bash
   npm run lint
   ```
   - Ensures code quality and adherence to standards.

## Documentation
- **Tools/Libraries Chosen**:
  - **Next.js**: Chosen for its SSR, API routes, and developer-friendly features.
  - **React**: For building modular, reusable components.
  - **Tailwind CSS**: For rapid, responsive styling with minimal custom CSS.
  - **MongoDB**: For scalable, NoSQL data storage.
  - **@ericblade/quagga2 & tesseract.js**: For robust barcode scanning and OCR.
  - **@hello-pangea/dnd**: For smooth drag-and-drop interactions.
  - **next-auth & bcrypt**: For secure authentication.
  - **axios & zod**: For reliable API requests and data validation.
  - **TypeScript & ESLint**: For type safety and code quality.

## Challenges Faced
- **Barcode Scanning Accuracy**: Ensuring reliable barcode detection across devices required fine-tuning Quagga2 and Tesseract.js configurations.
- **Drag-and-Drop Responsiveness**: Achieving smooth drag-and-drop functionality on mobile devices demanded extensive testing and optimization.
- **Database Performance**: Optimizing MongoDB queries for real-time category updates was complex due to dynamic data structures.


## 🧑‍💻 Author

Developed with ❤️ by **Najib Hossain**  
[GitHub](https://github.com/NajibHossain49) | [LinkedIn](https://www.linkedin.com/in/md-najib-hossain) | [Portfolio](https://najib-hossain.web.app)

## 🌟 Show Your Support

If you like this project, please ⭐ the repository and share it with others!