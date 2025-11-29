<div align="center">

# 🧃 NutriGo

### Smart Packaged Food Scanning Made Simple

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://nutrigo-kappa.vercel.app/)
[![GitHub](https://img.shields.io/badge/github-repository-blue.svg)](https://github.com/tung-programming/nutrigo)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Stop guessing what's in your packaged foods.** Scan any packaged product with AI-powered precision to reveal hidden sugars, calories, and ingredients. Make informed choices instantly.

[Live Demo](https://nutrigo-kappa.vercel.app/) · [Report Bug](https://github.com/tung-programming/nutrigo/issues) · [Request Feature](https://github.com/tung-programming/nutrigo/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Keys Setup](#-api-keys-setup)
- [Troubleshooting](#-troubleshooting)
- [Our Team](#-our-team)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About the Project

In a world where food labels confuse more than they clarify, **NutriGo** brings clarity. We're India's AI-powered nutrition companion, making every food choice an informed one.

With 101 million Indians living with diabetes and childhood obesity rates rising, we knew something had to change. NutriGo was born from the belief that everyone deserves to know what's in their food, without needing a nutrition degree to figure it out.

### 🚀 Our Mission

To democratize nutrition knowledge through AI-powered technology, empowering every Indian to make informed food choices that improve their health and well-being.

### 🌟 Our Vision

A future where food transparency is the norm, not the exception. Where every Indian has instant access to clear, reliable nutrition information that helps them live healthier lives.

---

## ✨ Features

### 🔍 **AI-Powered Scanner**
Instantly scan any packaged food product with advanced AI to decode sugar levels, calories, and hidden ingredients. Crystal-clear visual insights at your fingertips.

### 📊 **Smart Health Score**
Every packaged product gets an intelligent Health Score based on comprehensive analysis of sugar, calories, additives, and nutritional value. Know what's truly healthy.

### 🔄 **Better Alternatives**
Discover healthier packaged food substitutes instantly. Compare products side-by-side and make smarter swaps for your everyday nutrition goals.

### 📈 **Progress Tracking**
Monitor your nutrition journey with detailed analytics, personalized recommendations, and AI-driven insights based on your dietary preferences.

### ⚡ **Instant Analysis**
Get real-time nutrition breakdown of packaged products in milliseconds. Our AI processes complex data instantly, giving you immediate actionable insights.

### 🤖 **Smart AI Chatbot**
Ask questions about nutrition, ingredients, and healthy eating. Get instant AI-powered answers and personalized recommendations 24/7.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** [Next.js 14](https://nextjs.org/) - React framework with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) - Re-usable component library
- **State Management:** React Hooks (useState, useEffect)
- **HTTP Client:** Fetch API
- **Deployment:** [Vercel](https://vercel.com/)

### **Backend**
- **Runtime:** [Node.js](https://nodejs.org/) (v18+)
- **Framework:** [Express.js](https://expressjs.com/) - Web application framework
- **Language:** JavaScript
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer - Middleware for handling multipart/form-data
- **CORS:** cors - Cross-Origin Resource Sharing middleware

### **Database**
- **Primary Database:** [Supabase](https://supabase.com/) - PostgreSQL database
- **ORM:** Supabase Client SDK
- **Tables:** 
  - `scans` - Stores nutrition scan history and analysis

### **AI & Machine Learning**
- **AI Model:** [Google Gemini AI](https://deepmind.google/technologies/gemini/) - Advanced AI for image recognition and nutrition analysis
- **Image Processing:** AI-powered food product recognition
- **Natural Language Processing:** Chatbot for nutrition queries

### **Development Tools**
- **Package Manager:** npm / pnpm
- **Version Control:** Git & GitHub
- **Code Editor:** VS Code (recommended)
- **Environment Variables:** dotenv

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **npm or pnpm** - Comes with Node.js
- **Supabase Account** - [Sign up](https://supabase.com/)
- **Google Cloud Account** - [Sign up](https://console.cloud.google.com/) (for Gemini AI API)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tung-programming/nutrigo.git
   cd nutrigo
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables** (see [Environment Variables](#environment-variables) section)

5. **Set up Supabase database**
   
   Create the following table in your Supabase project:
   
   ```sql
   create table scans (
     id text primary key,
     user_id text,
     detected_name text,
     brand text,
     nutrition jsonb,
     warnings text[],
     health_score integer,
     created_at timestamp with time zone default timezone('utc'::text, now()),
     barcode text,
     source text
   );
   ```

6. **Run the development servers**
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:3000`

---

## 🔐 Environment Variables

### Frontend Environment Variables

Create a `.env.local` file in the **root directory**:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
BACKEND_URL=http://localhost:4000
```

### Backend Environment Variables

Create a `.env` file in the **backend** directory:

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

#### Variable Descriptions

**Frontend Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key (public)
- `BACKEND_URL` - The URL where your backend is running

**Backend Variables:**
- `PORT` - Backend server port (default: 4000)
- `FRONTEND_URL` - Frontend application URL
- `JWT_SECRET` - Secret key for JWT tokens (generate a random string)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase service role key
- `GEMINI_API_KEY` - Google Gemini AI API key

---

## 🔑 API Keys Setup

### Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once created, go to **Project Settings → API**
3. You'll find:
   - **Project URL** → Use for `SUPABASE_URL`
   - **anon public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → Use for `SUPABASE_KEY`

### Google Gemini AI Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **Gemini API**
4. Navigate to **APIs & Services → Credentials**
5. Create an API key
6. Copy the API key and use it for `GEMINI_API_KEY`

---

## 💻 Usage

1. **Sign up/Login** - Create an account or log in to access features
2. **Scan Products** - Upload an image of any packaged food product
3. **View Analysis** - Get instant nutrition breakdown and health score
4. **Track Progress** - Monitor your nutrition journey over time
5. **Ask Questions** - Use the AI chatbot for personalized nutrition advice
6. **Find Alternatives** - Discover healthier substitutes for your favorite products

---

## 📁 Project Structure

```
nutrigo/
├── app/                    # Next.js pages and routes
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main application pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── backend/               # Express backend server
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # Uploaded images
│   ├── .env               # Backend environment variables
│   └── server.js          # Express server entry point
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── ...                # Custom components
├── lib/                   # Shared utilities
│   ├── supabase.ts        # Supabase client
│   └── utils.ts           # Helper functions
├── public/                # Static assets
│   ├── team/              # Team member images
│   └── ...                # Other static files
├── styles/                # Global CSS styles
├── .env.local             # Frontend environment variables
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── package.json           # Frontend dependencies
└── README.md              # Project documentation
```

---

## 🐛 Troubleshooting

### Common Issues

#### "supabaseUrl is required" Error
- Check if you've created the `.env` file in the backend directory
- Verify that `SUPABASE_URL` is correctly set
- Ensure there are no extra spaces or quotes in the environment variable

#### Backend Connection Issues
- Ensure backend is running on port 4000
- Check if `BACKEND_URL` is correctly set in frontend `.env.local`
- Verify CORS settings allow your frontend URL

#### Image Upload Errors
- Ensure the `uploads` directory exists in the backend folder
- Check file permissions on the uploads directory
- Verify file size limits in multer configuration

#### Database Errors
- Verify Supabase table schema matches the provided SQL
- Check if all required columns exist
- Ensure Supabase service role key has proper permissions

### Still Need Help?

If you encounter any issues:
1. Check the [common issues](#common-issues) section above
2. Verify all environment variables are correctly set
3. Ensure all required dependencies are installed
4. [Create an issue](https://github.com/tung-programming/nutrigo/issues) on GitHub with detailed information

---

## 👥 Our Team

Meet the dedicated team of innovators building the future of food transparency in India:

<table>
  <tr>
    <td align="center">
      <img src="/team/AR.png" width="100px;" alt="Arjun Bhat"/><br />
      <b>Arjun Bhat</b><br />
      Frontend Developer
    </td>
    <td align="center">
      <img src="/team/PR.jpg" width="100px;" alt="Pranav Rao K"/><br />
      <b>Pranav Rao K</b><br />
      Frontend Developer
    </td>
    <td align="center">
      <img src="/team/TU.png" width="100px;" alt="Tushar P"/><br />
      <b>Tushar P</b><br />
      Backend Developer
    </td>
    <td align="center">
      <img src="/team/AM.jpg" width="100px;" alt="Amogha K A"/><br />
      <b>Amogha K A</b><br />
      Backend Developer
    </td>
  </tr>
</table>

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

---

## 🌟 Star History

If you find NutriGo helpful, please consider giving it a ⭐ on GitHub!

---

## 📞 Contact & Support

- **Website:** [nutrigo-kappa.vercel.app](https://nutrigo-kappa.vercel.app/)
- **GitHub:** [tung-programming/nutrigo](https://github.com/tung-programming/nutrigo)
- **Issues:** [Report a bug or request a feature](https://github.com/tung-programming/nutrigo/issues)

---

<div align="center">

**Together, we're building a healthier India, one scan at a time. 🇮🇳**

Made with ❤️ by the NutriGo Team

</div>