# Blog Management Application

BlogSpace is a full-stack blogging platform with three access levels — guest, registered user, and admin. It pairs a Next.js (App Router) frontend (**blogspace**) with an Express + Sequelize + MySQL REST API (**blog-management-api**). All data — users, blogs, sessions, profile images — is real, persisted in MySQL, and served through the API; there is no mock data, hardcoded users, or frontend-only authentication anywhere in the app.

## Project overview

BlogSpace lets anyone browse published blog posts without an account. Once someone registers, they get a personal dashboard where they can write, edit, and delete their own posts, manage their profile (name, avatar, password), and — if they forget their password — reset it themselves through a secure, emailed reset link. Admin accounts see everything every user can, plus platform-wide controls: moderating any blog on the site and activating or deactivating any user's account.

The two halves of the project are cleanly separated by responsibility:

- **blogspace** (frontend) owns the UI, form validation, and role-aware navigation. It holds no data of its own — every read and write flows through the API.
- **blog-management-api** (backend) owns authentication, authorization, and data. It's the only part of the system with database credentials, and it enforces every permission rule (who can edit which blog, who can see the admin panel) independently of anything the frontend does — the frontend's route guards and hidden menus are a convenience layer, not the actual security boundary.

What it can do, end to end:

- **Guests** can browse the full list of published blogs, search by title, filter by category, read any individual post, and register or log in.
- **Registered users** get a dashboard summarizing their post count and account info, and can create, edit, and delete their own blog posts; update their first/last name; upload a profile photo; change their password while logged in; and recover access via **Forgot password** if they're locked out.
- **Admins** can do everything a user can, plus see and moderate *every* user's blogs (edit or delete any post), view the full list of registered users, and activate or deactivate any account.
- **Forgot / reset password** (new): a user who can't log in requests a reset link by email; the link carries a single-use, time-limited token that lets them set a new password without needing an admin's help.

Authentication uses JSON Web Tokens issued at login and stored client-side; every protected API route re-validates that token and the caller's role on the server, so UI restrictions (like a user only seeing an "Edit" button on their own posts) are a UX nicety, not the actual enforcement.

## Main features

- Guest: browse/search/filter blogs, read a blog, register, login
- User: view/edit profile (name), upload avatar, change password, **forgot/reset password via email**, create/edit/delete own blogs
- Admin: everything a user can do, plus manage all blogs and activate/deactivate any user
- Protected and role-based routing, loading states, empty states, inline validation, confirmation dialogs for destructive actions
- Responsive layout (mobile sidebar becomes a drawer)

## Technologies

**Frontend (blogspace)**
- Next.js 14 (App Router), React 18
- Tailwind CSS
- Axios (with a token-injecting request interceptor and a 401-handling response interceptor)
- lucide-react for icons

**Backend (blog-management-api)**
- Node.js, Express 5
- Sequelize ORM + MySQL (mysql2)
- JSON Web Tokens (jsonwebtoken) for auth
- bcrypt for password hashing
- multer for profile image uploads
- nodemailer for sending password reset emails
- dotenv for configuration

## Installation

Install dependencies for both projects:

```bash
cd blog-management-api
npm install

cd ../blogspace
npm install
```

## Environment variables

**blog-management-api** — create a `.env` file (see `.env.example`):

```
PORT=5000
DB_NAME=blogdb
DB_USER=YourDatabaseUser
DB_PASSWORD=YourDatabasePassword
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=YOUR_JWT_SECRET_KEY
JWT_EXPIRES_IN=3600
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=YourSmtpUsername
SMTP_PASS=YourSmtpPassword
MAIL_FROM=no-reply@blogspace.local
```

`FRONTEND_URL` is used to build the link inside password reset emails (e.g. `http://localhost:3000/reset-password/<token>`), so it must point at wherever `blogspace` is actually served. The `SMTP_*` / `MAIL_FROM` variables configure the mail server used to send those emails. If `SMTP_HOST` is left unset, the backend doesn't fail — it logs the reset link to the server console instead, which is convenient for local development without a real mail account.

**blogspace** — copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Do not commit `.env`, `.env.local`, or any file containing real secrets.

## How to run the application

1. Create a MySQL database matching `DB_NAME`.
2. Start the backend (it syncs the Sequelize models automatically on boot):

   ```bash
   cd blog-management-api
   npm run dev
   # → http://localhost:5000
   ```

3. Start the frontend in a separate terminal:

   ```bash
   cd blogspace
   npm run dev
   # → http://localhost:3000
   ```

   Production build: `npm run build` then `npm start`.

4. To test the password reset flow without setting up real SMTP credentials, leave `SMTP_HOST` unset in the backend `.env` — the reset link will be printed to the backend's terminal output whenever **Forgot password** is used.

## Backend dependency

The frontend has no data of its own — every page reads from and writes to the REST API at `NEXT_PUBLIC_API_URL`. If a page looks empty or shows a connection error, confirm the backend is running and that `NEXT_PUBLIC_API_URL` matches its address. The frontend never calls an endpoint the API doesn't expose.

### API endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/forgot-password` | Public |
| PATCH | `/api/auth/reset-password/:token` | Public (requires a valid, unexpired reset token) |
| GET | `/api/users/profile` | Authenticated |
| PUT | `/api/users/profile/update` | Authenticated |
| PATCH | `/api/users/profile/image` | Authenticated |
| PATCH | `/api/users/password` | Authenticated |
| GET | `/api/users` | Admin |
| GET | `/api/users/:id` | Admin |
| PATCH | `/api/users/:id/status` | Admin |
| GET | `/api/blogs` | Public |
| GET | `/api/blogs/:id` | Public |
| POST | `/api/blogs/create` | Authenticated |
| PUT | `/api/blogs/update/:id` | Authenticated (owner or admin) |
| DELETE | `/api/blogs/:id` | Authenticated (owner or admin) |

`forgot-password` always responds with the same generic message regardless of whether the email is registered, so the endpoint can't be used to check which emails have accounts. The reset token itself is a random value, stored server-side only as a one-way hash, and expires one hour after it's issued.

## Application routes (frontend)

| Route | Access |
|---|---|
| `/` | Public — browse/search/filter blogs |
| `/blogs/[id]` | Public — blog detail |
| `/login` | Public |
| `/register` | Public |
| `/forgot-password` | Public |
| `/reset-password/[token]` | Public |
| `/dashboard` | User/Admin |
| `/dashboard/blogs` | User/Admin — own blogs (all blogs if admin) |
| `/dashboard/blogs/create` | User/Admin |
| `/dashboard/blogs/[id]/edit` | User/Admin — own blog, or any blog as admin |
| `/dashboard/profile` | User/Admin |
| `/dashboard/change-password` | User/Admin |
| `/admin/users` | Admin only |
| `/admin/users/[id]` | Admin only |

## User / Admin functionality

**User:** login, view/edit profile, upload avatar, change password, forgot/reset password, create/update/delete own blogs, logout.

**Admin:** everything a user can do, plus view all users, activate/deactivate any user, and update/delete any user's blog.

## Screenshots

screenshots of the homepage, a blog detail page, dashboard, profile, forgot/reset password flow, and admin users page here
