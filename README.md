# Baarez AI Sales Dashboard

Baarez is a high-performance, AI-driven sales analytics dashboard built with Next.js, TypeScript, and Recharts. It provides real-time visualizations, KPI monitoring, and an intelligent AI Sales Assistant for deep data analysis.

![Baarez Dashboard](https://images.unsplash.com/photo-1551288049-bbda38a5fbd5?auto=format&fit=crop&q=80&w=2070)

## 🚀 Features

- **Intelligence-First Analytics**: Recharts-powered Bar, Line, and Donut charts with currency-aware tooltips.
- **AI Sales Assistant**: Powered by OpenAI's `gpt-4o-mini`, providing context-aware insights based on your sales data.
- **Dynamic Data Mobility**: Bring your own data with the custom CSV upload tool or explore with built-in sample sets.
- **Elite Dark Mode**: Persistent theme management with system preference detection and smooth transitions.
- **Responsive Mastery**: Pixel-perfect layouts for Mobile, Tablet, and Desktop views.
- **Safety First**: Integrated simulation mode for testing AI components without an API key.

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Visuals**: Recharts
- **AI**: OpenAI SDK

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd barez

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🤖 Simulation vs. Live Mode

Baarez is designed for flexibility during review:
- **Live AI Mode**: Requires a valid `OPENAI_API_KEY`. Provides real-time, context-aware sales analysis.
- **Simulation Mode**: If the API key is missing, the system automatically enters Simulation Mode. The AI Assistant will still respond with structured mock data, allowing you to test the "Thinking" UI and interaction flow without cost.

## 📂 Data Model (CSV Schema)

To upload your own data, ensure your CSV follows this format:
`date, product, revenue, units_sold, region`

Example:
`2024-03-01, CloudSync Pro, 125000, 450, North`

## 📄 License
Baarez is a proprietary product of the development team. All rights reserved.
