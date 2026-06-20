# OfficeClimate

A web-based temperature feedback system that allows employees to report workspace comfort and helps Facilities Management identify temperature problem areas.

---

## 1. Project Overview

OfficeClimate enables employees to quickly report how the temperature feels at their workspace using three comfort options: Too Cold, Comfortable, or Too Warm. 
Facilities Management uses the aggregated data in a heatmap dashboard to identify recurring temperature issues and prioritise maintenance actions.

**Key Features:**
- Simple one-click comfort reporting (< 1 minute)
- Real-time heatmap by floor and zone
- Historical data filtering by date
- Keyboard accessible (Enter, Escape support)
- Mobile-responsive design

### Target Audience
- **Office workers** – to quickly report comfort levels with minimal disruption.
- **Facilities Management (FM)** – to monitor temperature trends and prioritise action.
- **Senior Leadership (SLT)** – to understand workplace comfort trends and improve office utilisation.

### Problem Statement
Temperature complaints are typically reported informally through multiple channels, leading to:
- Inconsistent data collection
- Delayed response times
- Repeated complaints about the same areas
- Inefficient resource allocation

OfficeClimate centralises this feedback, providing structured data that enables Facilities Management to:
- Identify recurring problem zones quickly
- Prioritise maintenance actions
- Measure intervention effectiveness
- Improve overall workplace comfort
  
---

## 2. Setup & Deployment Instructions

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation
```bash
git clone https://github.com/yourusername/OfficeClimate.git
cd OfficeClimate
npm install
npm run dev
```

The application will be available at 'http://localhost:3000'

### Test Credentials (MVP)

**Office Worker:**
- Email: `john@accenture.com`
- Password: `password123`

**FM User:**
- Email: `fm.john@accenture.com`
- Password: `password123`
  
---

## 3. Tech Stack & Dependencies 

### Frontend Framework
- **Next.js** – React framework for routing, rendering, and API routes
- **React** – UI component library for building interactive interfaces
- **TypeScript** – Static typing for improved code quality and developer experience

### Styling & UI
- **Tailwind CSS** – Utility-first CSS framework for responsive design

### State Management & Storage
- **React Hooks** – Built-in state management (useState, useEffect, useMemo)
- **Web Storage API (localStorage)** – Client-side data persistence for MVP

### Development & Version Control
- **Node.js** – JavaScript runtime environment
- **npm** – Package manager
- **Git & GitHub** – Version control and repository hosting

### Cloud Services (Considered but Not Used)

AWS Amplify was considered but not implemented for the MVP phase. Instead, I chose **localStorage** for the following reasons:
- Reduces infrastructure complexity and cost
- Appropriate for MVP scope (learning project, small user base)
- Enables faster development and deployment
- Can be easily upgraded to cloud database (Firebase/PostgreSQL) in Phase 2

**Future consideration:** Migration to AWS Amplify or equivalent is planned when scaling beyond MVP.

---

## 4. Known Limitations 

- Data stored in browser only – not shared across devices/browsers
- Authentication via email allowlist (not real SSO)
- Password validation basic (8+ characters minimum)
- No database backups or recovery

---

## 5. Future Improvements

- Migrate to real database (PostgreSQL/Firebase)
- Implement organisational SSO (Azure AD)
- Enhanced password security (require uppercase, numbers, special characters)
- Add long-term analytics for leadership
- Build mobile app (iOS/Android)
- Real-time notifications for FM
