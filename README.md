# GeoBooks — Library Management System (Client)

**Live Demo:** [https://geo-seminar-client.vercel.app/](https://geo-seminar-client.vercel.app/)

**geo-seminar-client** is the frontend application of the GeoBooks library management platform. It provides a responsive web interface for browsing a book catalog and managing library operations such as borrowing, returning, and administering books. Authentication is handled with Firebase, while all data operations are served by a REST API hosted on Vercel.

## Features

- **Public Catalog** — browse all library books with cover images, availability badges, and instant search by name or code.
- **Authentication** — email/password sign-up and login powered by Firebase Authentication, with protected routes and automatic auth-state persistence.
- **Role-Based Dashboard** — the dashboard adapts its menu based on the user's role (`admin` vs. standard user).
- **Admin Operations**
  - **Add Book** — validated form with cover-image upload via imgBB and copy-count tracking.
  - **Edit / Manage Books** — update or delete existing entries, with search filtering and confirmation dialogs.
  - **Borrow Book** — search-and-select book picker, student roll verification, and stock availability checks.
  - **Return Book** — mark borrow records as returned, restore stock, and filter pending returns by roll.
- **User Operations** — view personal borrowing history with return status (desktop tables and mobile card views).
- **Server State** — data fetching, caching, and refetching handled by TanStack React Query.
- **Responsive UI** — Tailwind CSS v4 with daisyUI components; collapsible drawer navigation on the dashboard.

## Tech Stack

| Category        | Technology                                            |
| --------------- | ----------------------------------------------------- |
| Framework       | React 19 + Vite (rolldown-vite)                       |
| Routing         | React Router DOM v7 (nested & protected routes)       |
| Server State    | TanStack React Query v5                               |
| HTTP            | Axios (public & credentialed "secure" instances)      |
| Auth            | Firebase Authentication (email/password)              |
| Forms           | React Hook Form                                       |
| Styling         | Tailwind CSS v4 + daisyUI 5                           |
| Feedback        | SweetAlert2                                           |
| Image Hosting   | imgBB API                                             |

## Project Structure

```
src/
├── firebase/            # Firebase initialization (auth)
├── hooks/               # AuthContext/AuthProvider, useAuth, axios hooks
├── layouts/             # RootLayout (Navbar + Outlet + Footer)
├── Router/              # Application router & protected routes
├── Shared/              # Navber, Footer
├── Home/                # Public book catalog
└── Pages/
    ├── Authtincation/   # Login & Signup
    └── Dashboard/
        ├── Dashboard.jsx                 # Role-aware sidebar layout
        ├── Page/                         # Admin pages
        │   ├── AddBook/                  # AddBook & EditBook
        │   ├── BorrowBook/
        │   ├── ReturnBook/
        │   └── ManageBook/
        └── User/MyBorrowedBook/          # Borrowing history
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Firebase project (for authentication credentials)
- An imgBB API key (for cover-image uploads)
- Access to the backend API (`geo-seminar-server`)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root (the file is git-ignored via `*.local`):

```env
VITE_apiKey=<firebase-api-key>
VITE_authDomain=<firebase-auth-domain>
VITE_projectId=<firebase-project-id>
VITE_storageBucket=<firebase-storage-bucket>
VITE_messagingSenderId=<firebase-sender-id>
VITE_appId=<firebase-app-id>
VITE_IMGBB_API_KEY=<imgbb-api-key>
```

### Development

```bash
npm run dev       # Start the dev server (default http://localhost:5173)
npm run build     # Production build
npm run preview   # Preview the production build
npm run lint      # Run ESLint
```

## Backend API

The client communicates with the deployed backend at `https://geo-seminar-server-flame.vercel.app` through the credentialed Axios instance (`useAxiosSecure`). Endpoints consumed by the client:

| Method   | Endpoint              | Purpose                                  |
| -------- | --------------------- | ---------------------------------------- |
| `GET`    | `/books`              | List all books                           |
| `GET`    | `/books/:id`          | Fetch a single book (edit form)          |
| `POST`   | `/books`              | Add a new book                           |
| `DELETE` | `/books/:id`          | Delete a book                            |
| `GET`    | `/users`              | List users / verify student roll         |
| `GET`    | `/users?email=`       | Fetch current user profile & role        |
| `POST`   | `/borrows`            | Create a borrow record                   |
| `GET`    | `/borrows?email=`     | Borrow records for a user                |
| `GET`    | `/borrowsall`         | All borrow records (admin)               |
| `PATCH`  | `/borrows/return/:id` | Mark a borrow as returned & restock book |

## Routing

| Route                    | Access    | Description                    |
| ------------------------ | --------- | ------------------------------ |
| `/`                      | Public    | Book catalog with search       |
| `/login`, `/signup`      | Public    | Firebase authentication        |
| `/dashboard`             | Protected | Role-based sidebar             |
| `/dashboard/addbook`     | Admin     | Add a new book                 |
| `/dashboard/managebook`  | Admin     | Search, edit & delete books    |
| `/dashboard/borrowbook`  | Admin     | Borrow a book to a student     |
| `/dashboard/returnbook`  | Admin     | Process pending returns        |
| `/dashboard/myborrowedbook` | User   | Personal borrowing history     |
| `/dashboard/editbook/:id`| Admin     | Edit book details              |

## License

Private project — all rights reserved.
