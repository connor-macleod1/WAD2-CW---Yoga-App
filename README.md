# Yoga and Mindfulness Studio Booking System

A web-based booking system for a Yoga and Mindfulness Studio built with Node.js, Express, NeDB-promises, and Mustache templates.

## Prerequisites

- Node.js v18 or higher
- npm

## Installation

Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd WAD2_posscw_2526---Start-main
npm install
```

## Environment Setup

Create a `.env` file in the root directory of the project:

## Database Setup

Seed the database with demo data:
```bash
npm run seed
```

This creates the following demo accounts:

| Name | Email | Password | Role |
|---|---|---|---|
| Fiona | fiona@student.local | password123 | Student |
| Organiser | organiser@yoga.local | password123 | Organiser |
| Ava | ava@yoga.local | password123 | Instructor |
| Ben | ben@yoga.local | password123 | Instructor |

It also creates two demo courses with sessions:
- **Winter Mindfulness Workshop** — beginner, weekend workshop, no drop-ins
- **12-Week Vinyasa Flow** — intermediate, weekly block, drop-ins allowed

## Running the Application
```bash
npm start
```

Or with auto-restart on file changes during development:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Running the Tests
```bash
npm test
```

## Features

### Public (Not Logged In)
- View the organisation about page with location and opening hours
- Browse all current and upcoming courses including name, description, level, and type
- View session details including date, time, duration, location, and price
- Filter and search courses by level, type, and drop-in availability
- Register for an account as a student or instructor

### Registered Users
- Sign in and out securely using session-based authentication
- Enrol in a full course — confirmed or waitlisted based on capacity
- Book attendance at an individual drop-in session
- View session details before booking
- View booking confirmation after enrolling or booking
- Protection against double booking a session or double enrolling on a course

### Organisers
- Automatically redirected to organiser dashboard on login
- Add new courses with title, level, type, dates, and description
- Edit existing course details
- Delete courses
- Add sessions to courses with date, time, location, price, and capacity
- Edit and delete individual sessions
- View all sessions for a course with capacity and booking information
- Generate a participant class list for any session
- Manage users — promote students to organiser, demote organisers, and delete users
- Protected from accidentally deleting or demoting their own account

## Project Structure
├── controllers/        Route handler functions
├── middlewares/        Authentication and session middleware
├── models/             Database access layer (NeDB)
├── public/             Static assets (CSS)
├── routes/             Express route definitions
├── seed/               Database seeding script
├── services/           Business logic layer
├── utils/              Shared utility functions (date formatting)
├── views/              Mustache templates
│   ├── organiser/      Organiser-specific pages
│   └── partials/       Shared layout partials (head, header, footer)
├── .env                Environment variables
├── index.js            Application entry point
└── package.json        Project dependencies and scripts
