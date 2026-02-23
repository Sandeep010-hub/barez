# Baarez AI Sales Dashboard
Live Demo: [https://barez-ai.vercel.app/](https://barez-ai.vercel.app/)

Baarez is a high-performance, AI-driven sales analytics suite built with Next.js, TypeScript, and Tailwind CSS. Designed for the "AI-Native" era, it transforms raw sales data into actionable intelligence through interactive visualizations and a context-aware AI Assistant.

## 💎 Core Features

- **Intelligence-First Analytics**: Recharts-powered Bar, Line, and Donut charts with currency-aware tooltips and responsive scaling.
- **AI Sales Assistant**: Powered by OpenAI's `gpt-4o-mini`, providing deep insights based on real-time dataset summaries.
- **The "Neural Experience"**: Implemented the specific `Promise.all` logic pattern ensuring a minimum 1.5s "reassuring thinking" delay on every request.
- **Dynamic Data Mobility**: Features a custom CSV upload engine allowing users to visualize and analyze their own datasets instantly.
- **Elite UI/UX**: A full-width "Intelligence Hub" vertical layout that eliminates horizontal scrolling and optimizes readability across all devices.
- **Production Resilience**: Features a "Simulation Mode" fallback, allowing the full UI and interaction flow to be tested even without an OpenAI API key.

## 🤖 AI Interaction & Logic Flow
This application strictly follows the Baarez Backend POC interaction pattern:

1.  **Context Building**: The app generates a `dataSummary` string (Total Revenue, Product list, Regions) from the current CSV rows.
2.  **Parallel Execution**: Upon submission, the app triggers a real API call and a 1500ms minimum timeout simultaneously.
3.  **State Locking**: The input and "Ask AI" buttons are disabled during processing to prevent race conditions.
4.  **Resolution**: The response is displayed in a styled `InsightCard` only after both the API and the minimum delay have resolved.

## 🛠️ Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Visuals**: Recharts (ResponsiveContainer)
- **Icons**: Lucide React
- **AI Integration**: OpenAI SDK

## 🏁 Getting Started

### 1. Live Deployment
Access the production build at: [https://barez-ai.vercel.app/](https://barez-ai.vercel.app/).

### 2. Installation (Local)
```bash
# Clone the repository
git clone https://github.com/Sandeep010-hub/barez.git
cd barez

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory. This project includes an API Fallback; if no key is provided, it will function in Simulation Mode.
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Access the dashboard at `http://localhost:3000`.

## 📊 Evaluation Checkpoints

- **Layout**: Follows the 3-part vertical stack (Navbar, Dashboard, AI Panel).
- **KPI Accuracy**: Dynamically calculates Total Revenue ($1,243,500), Units Sold (3,363), Best Product (CloudSync Pro), and Best Region (West) from the 17-record sample set.
- **Responsiveness**: Tested for Desktop (1280px+), Tablet, and Mobile (375px).
- **Bonus Implementation**: Includes Dark Mode, CSV Upload, Copy-to-Clipboard, and Auto-scroll history.

---
📄 **License**
Confidential Assessment Project for Baarez Technology Solutions.
