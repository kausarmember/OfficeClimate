# OfficeClimate

## 1. Project Overview

OfficeClimate is a web-based application that allows employees to report how the temperature feels at their workspace using simple comfort options: **Too Cold**, **Comfortable**, or **Too Warm**.  
The application aggregates this feedback and presents it in a heatmap-style dashboard for Facilities Management (FM), enabling quick identification of temperature problem areas across the office.

### Target Audience
- **Office workers** – to quickly report comfort levels with minimal disruption.
- **Facilities Management (FM)** – to monitor temperature trends and prioritise action.
- **Senior Leadership (SLT)** – to understand workplace comfort trends and improve office utilisation.

### Problem Statement
Temperature issues are currently reported informally and inconsistently, leading to repeated complaints, slow response times, and inefficient use of office space.  
OfficeClimate provides structured, real-time data so that Facilities Management can act proactively and employees can work more comfortably.

---

## 2. Setup & Deployment Instructions

### Clone the repository
```bash
git clone https://github.com/kausarmember/OfficeClimate.git
cd OfficeClimate
```
### Install dependencies
```bash
npm install
```
### Run the app locally
```bash
npm run dev
```
The application will be available at:
[http://localhost:3000/](https://redesigned-space-waffle-97gq694p775vh7rxr-3000.app.github.dev/login)

---

## 3. Dependencies & SDKs

### Main Frameworks & Tools
- **Next.js** – React framework for routing and rendering
- **React** – UI component library
- **TypeScript** – Static typing for improved code quality
- **Tailwind CSS** – Utility-first styling framework
- **Node.js** – Runtime environment
- **Git & GitHub** – Version control and repository hosting

### Storage & APIs
- Web Storage API (localStorage) – Used for storing user roles and comfort reports (MVP approach)

### AWS/ Cloud Services
- AWS Amplify: Not used in this project. Local storage was selected to keep the MVP lightweight and aligned with the module scope.

---

## 4. Known Issues & Future Improvements

### Known Issues
- Data is stored in localStorage, meaning reports are not shared across devices or browsers.
- Authentication is simulated using an email allowlist rather than real organisational SSO.

### Future Improvements
- Integrate real authentication (e.g. organisational SSO).
- Replace localStorage with a backend database for persistence and scalability.
- Add long-term analytics and trend reporting for SLT.
- Enhance accessibility further through keyboard-only navigation testing.
