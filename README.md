# Diamond Marketplace

A modern web application for managing and showcasing individual and wholesale diamonds, built with React, TypeScript, and Supabase.

## Features

- Individual and wholesale diamond listings
- User authentication and authorization
- Admin dashboard for managing diamonds
- Multi-image support with primary image selection
- Responsive design with Tailwind CSS
- Real-time data with Supabase

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd diamond-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the migrations from the `supabase/migrations` folder
   - Set up the storage bucket (see [STORAGE_SETUP.md](./STORAGE_SETUP.md))

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
├── src/
│   ├── components/     # Reusable React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Library configurations
│   ├── pages/         # Page components
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── supabase/
│   └── migrations/    # Database migrations
└── public/           # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Database Schema

The application uses the following main tables:
- `profiles` - User profiles and roles
- `individual_diamonds` - Individual diamond listings
- `wholesale_diamonds` - Wholesale diamond listings
- `diamond_images` - Images for individual diamonds
- `wholesale_diamond_images` - Images for wholesale diamonds

## Authentication

The application uses Supabase Authentication with email/password sign-in. Users can be either regular users or administrators.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
