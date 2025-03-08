# Language Learning Platform

A modern, interactive language learning platform built with React, TypeScript, and Supabase. This application provides a beautiful, intuitive interface for learning multiple languages through flashcards, progress tracking, and interactive exercises.

![Language Learning Platform](screenshot.png)

## 🌟 Features

- **Multi-language Support**
  - Chinese 🇨🇳
  - German 🇩🇪
  - Turkish 🇹🇷
  - Japanese 🇯🇵
  - English 🇬🇧

- **Interactive Learning Tools**
  - Flashcard system with spaced repetition
  - Progress tracking and analytics
  - Daily activity monitoring
  - Category-based learning paths

- **User Experience**
  - Beautiful glass-morphism UI design
  - Smooth animations and transitions
  - Responsive layout for all devices
  - Dark mode support

- **Progress Tracking**
  - Words learned counter
  - Study streak tracking
  - Review accuracy metrics
  - Time studied analytics

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd language-learning-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Initialize the database:
```bash
npm run db:init
```

5. Start the development server:
```bash
npm run dev
```

### Database Setup

The application requires a Supabase database with the following tables:
- profiles
- daily_activity
- user_progress

To set up the database schema:

1. Run the database initialization script:
```bash
npm run db:init
```

2. If the automatic setup fails, manually execute the SQL commands provided in the console output.

## 🛠️ Built With

- [React](https://reactjs.org/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [Vite](https://vitejs.dev/) - Build Tool
- [Supabase](https://supabase.io/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Framer Motion](https://www.framer.com/motion/) - Animation Library
- [Zustand](https://zustand-demo.pmnd.rs/) - State Management
- [React Router](https://reactrouter.com/) - Routing
- [date-fns](https://date-fns.org/) - Date Utility Library

## 📝 Project Structure

```
language-learning-platform/
├── src/
│   ├── components/        # Reusable UI components
│   ├── lib/              # Utility functions and API clients
│   ├── pages/            # Page components
│   ├── store/            # State management
│   ├── types/            # TypeScript type definitions
│   └── App.tsx           # Main application component
├── public/               # Static assets
└── ...config files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run db:init` - Initialize database schema
- `npm run db:test` - Test database connection

## 🔐 Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify Supabase credentials in `.env`
   - Check if Supabase project is active
   - Run `npm run db:test` to diagnose connection issues

2. **Missing Tables**
   - Run `npm run db:init` to create required tables
   - Check Supabase dashboard for table creation errors

3. **Authentication Problems**
   - Ensure proper RLS policies are set up
   - Verify email confirmation settings in Supabase

## 📞 Support

For support, please:
1. Check the [issues](https://github.com/yourusername/language-learning-platform/issues) page
2. Create a new issue if your problem isn't already listed
3. Provide as much detail as possible about your problem

## ✨ Acknowledgments

- Thanks to all contributors
- Inspired by modern language learning platforms
- UI design inspired by glass-morphism trends 