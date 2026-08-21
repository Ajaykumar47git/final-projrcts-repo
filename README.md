# CivicFix

> **Report local problems. Improve your community.**

CivicFix is a civic technology platform that allows residents to report local problems such as potholes, broken streetlights, overflowing garbage bins, damaged roads, water leaks, and more. Local authorities or administrators can review, assign, track, update, and resolve reported issues.

![CivicFix](https://img.shields.io/badge/CivicFix-Civic%20Tech-0D9488) ![React](https://img.shields.io/badge/React-19-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4)

## Features

### For Residents
- **Report Issues** — Submit reports with photos, location, category, and severity
- **Track Progress** — Follow real-time status updates through a visual timeline
- **Explore Issues** — View community reports on an interactive map or list
- **Notifications** — Receive updates when your reports are reviewed or resolved
- **Profile Management** — Edit personal information and notification preferences

### For Administrators
- **Dashboard** — Overview of all reports with summary cards and charts
- **Report Management** — Search, filter, sort, and paginate through reports
- **Status Updates** — Change report status, assign departments, add notes
- **Analytics** — Charts for reports by category, status, neighborhood, and month
- **Public Updates** — Post progress updates visible to residents

### General
- Responsive design (mobile, tablet, desktop)
- Accessible (semantic HTML, keyboard navigation, ARIA labels)
- Light mode with professional civic-tech visual identity
- Mock data layer with 12+ realistic reports
- Ready for Supabase integration

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| TypeScript 5 | Type safety |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Styling |
| Supabase | Auth, database, storage (mock mode available) |
| Leaflet / Mapbox | Interactive maps |
| Recharts | Charts and analytics |
| Lucide React | Icons |
| React Router | Client-side routing |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/civicfix.git
cd civicfix

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will be running at [http://localhost:5173](http://localhost:5173).

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Resident | demo@resident.com | demo123 |
| Administrator | demo@admin.com | demo123 |

You can also sign up for a new account and choose your role.

## Project Structure

```
civicfix/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── layout/           # Layout components (Navbar, Sidebar, etc.)
│   │   └── ui/               # Reusable UI components
│   ├── context/              # React context providers
│   ├── data/                 # Mock data
│   ├── pages/                # Page components
│   ├── services/             # API services (mock + Supabase ready)
│   ├── types/                # TypeScript types
│   ├── App.tsx               # Main app with routing
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles + Tailwind config
├── supabase/
│   ├── schema.sql            # Database schema
│   └── rls-policies.sql      # Row-level security policies
├── .env.example              # Environment variable template
└── README.md                 # This file
```

## Supabase Setup (Optional)

The app works out of the box with local mock data and localStorage. To connect to Supabase:

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Run `supabase/rls-policies.sql` in the SQL Editor
4. Create a storage bucket named `report-images` (public)
5. Copy your project URL and anon key to `.env`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profiles with roles |
| `reports` | Issue reports |
| `report_images` | Uploaded images per report |
| `report_comments` | Public and internal comments |
| `report_status_history` | Status change log |
| `departments` | Government departments |
| `notifications` | User notifications |

## Security

- Row-level security (RLS) policies for all tables
- Residents can only view/manage their own reports
- Administrators can manage all reports
- Private information (email, phone) is never displayed publicly
- Image uploads validated for type and size
- Passwords stored securely via Supabase Auth

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`

### Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run linter |

## License

MIT

---

Built with ❤️ for communities everywhere.
