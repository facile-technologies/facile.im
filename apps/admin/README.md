# Fecile Admin Portal

A modern, responsive Admin Portal built with React, Vite, TailwindCSS, and Redux Toolkit.

## Features
- **Authentication**: Login, Signup, Forgot Password, OTP Screens.
- **Theming**: Dark/Light mode support with persistent state.
- **Responsive Layout**: Mobile-friendly Sidebar and Header.
- **State Management**: Redux Toolkit configuration.

## Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS (v3), clsx, tailwind-merge, Lucide React (Icons)
- **State**: Redux Toolkit + React Redux
- **Routing**: React Router DOM v6
- **Validation**: Zod (installed for form validation)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production
To create a production build:
```bash
npm run build
```
The output will be in the `dist` directory.

## Project Structure
- `src/components`: Reusable UI components (Layout, Common).
- `src/pages`: Application pages (Auth, Dashboard).
- `src/store`: Redux store and slices.
- `src/theme.js`: Shared theme constants.
