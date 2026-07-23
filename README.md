Here's a comprehensive README for your frontend application:

```markdown
# 🎯 Task Management System - Frontend

A modern, responsive task management dashboard built with React, TypeScript, and Tailwind CSS. This frontend application provides role-based interfaces for Admin, Manager, and Employee users to manage tasks efficiently.

---

## 📸 Preview

![Task Management Dashboard](https://via.placeholder.com/800x400?text=Task+Management+Dashboard)

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Admin, Manager, Employee)
- Protected routes with automatic redirects
- Persistent login sessions

### 👨‍💼 Admin Dashboard
- **User Management**: Create, view, and manage users
- **Task Management**: Create, edit, delete, and view all tasks
- **Statistics Dashboard**: Real-time task statistics and analytics
- **Team Overview**: View all team members and their task assignments

### 👔 Manager Dashboard
- **Team Tasks**: View all team tasks
- **Task Updates**: Edit task details and status
- **Team Performance**: Track team member progress
- **Task Analytics**: Completion rates and performance metrics

### 👷 Employee Dashboard
- **My Tasks**: View assigned tasks only
- **Task Updates**: Update task status (TODO → IN_PROGRESS → COMPLETED)
- **Personal Statistics**: Track personal task completion

### 🎨 UI/UX Features
- **Dark/Light Mode**: Modern dark theme for reduced eye strain
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: Real-time feedback for actions
- **Interactive Tables**: Sort, filter, and search functionality
- **Pagination**: Efficient data handling for large datasets

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Styling |
| **React Router v6** | Navigation |
| **Axios** | HTTP Client |
| **React Hook Form** | Form Management |
| **Zod** | Validation |
| **Lucide React** | Icons |
| **Date-fns** | Date formatting |
| **React Helmet** | SEO & Meta Tags |
| **Vite** | Build Tool |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   └── TaskManagement.tsx
│   │   ├── employee/
│   │   │   ├── EmployeeDashboard.tsx
│   │   │   ├── EmployeeLayout.tsx
│   │   │   └── EmployeeTasks.tsx
│   │   ├── manager/
│   │   │   ├── ManagerDashboard.tsx
│   │   │   ├── ManagerLayout.tsx
│   │   │   └── ManagerTasks.tsx
│   │   └── shared/
│   │       ├── Navbar.tsx
│   │       ├── Sidebar.tsx
│   │       └── LoadingSpinner.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Home.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── validation.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── favicon.ico
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see main README)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/tincaty/task-management-frontend.git
cd task-management-system/frontend
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Create environment file**

```bash
# Create .env file
cp .env.example .env

# Edit with your backend URL
echo "VITE_API_BASE=http://localhost:8888/api" > .env
```

4. **Start development server**

```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**

```
http://localhost:8080
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
VITE_API_BASE=http://localhost:8888/api

# Optional: App name
VITE_APP_NAME=Task Management System
```

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |

---

## 🎯 Pages & Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page |
| `/login` | Login | User login |
| `/register` | Register | User registration |

### Protected Routes (Requires Authentication)
| Route | Component | Role |
|-------|-----------|------|
| `/user/admin` | AdminDashboard | Admin |
| `/user/admin/task` | TaskManagement | Admin |
| `/user/manager` | ManagerDashboard | Manager |
| `/user/manager/tasks` | ManagerTasks | Manager |
| `/user/employee` | EmployeeDashboard | Employee |
| `/user/employee/tasks` | EmployeeTasks | Employee |

---

## 🎨 Styling

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Color Schemes

| Role | Primary Color | Accent Color |
|------|---------------|--------------|
| Admin | Blue (#3b82f6) | Purple (#8b5cf6) |
| Manager | Orange (#f97316) | Red (#ef4444) |
| Employee | Green (#22c55e) | Emerald (#10b981) |

---

## 🔐 Authentication Flow

1. User submits login credentials
2. Backend validates credentials
3. JWT token is returned
4. Token is stored in localStorage
5. User is redirected to their dashboard
6. Token is included in all API requests
7. Token is validated on each request
8. Expired token triggers logout

### API Interceptor

```typescript
// services/api.ts
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Watch mode
npm run test -- --watch
```

### Test Structure
```
src/__tests__/
├── components/
│   ├── AdminDashboard.test.tsx
│   ├── Login.test.tsx
│   └── TaskManagement.test.tsx
├── hooks/
│   └── useAuth.test.ts
└── utils/
    └── validation.test.ts
```

---

## 📱 Responsive Design

The application is fully responsive across all devices:

| Device | Breakpoint | Features |
|--------|------------|----------|
| Mobile | < 640px | Collapsed sidebar, stacked cards |
| Tablet | 640px - 1024px | Reduced padding, adjusted layouts |
| Desktop | > 1024px | Full sidebar, multi-column layouts |

---

## 🚢 Deployment

### Build for Production

```bash
# Build the application
npm run build

# The build output will be in the 'dist' directory
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to Railway

1. Push code to GitHub
2. Connect repository to Railway
3. Add environment variables
4. Deploy

---

## 🔧 Troubleshooting

### Common Issues

**1. "API not responding"**
```bash
# Check if backend is running
curl http://localhost:8888/api/docs

# Update .env with correct URL
VITE_API_BASE=http://localhost:8888
```

**2. "Module not found"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**3. "CORS errors"**
```bash
# Make sure backend allows your frontend URL
# Check CORS configuration in backend
```

**4. "404 on refresh"**
```bash
# Add fallback route in your server configuration
# For Vite: Use history fallback in vite.config.ts
```

---

## 📚 API Integration

### Task API Calls

```typescript
// Fetch all tasks
const response = await axios.get(`${API_BASE}/get/task`);

// Create task
const response = await axios.post(`${API_BASE}/create/task`, {
  name: 'Task name',
  description: 'Task description',
  assign_to: 'user_id'
});

// Update task
const response = await axios.patch(`${API_BASE}/update/task/${taskId}`, {
  status: 'IN_PROGRESS'
});

// Delete task
const response = await axios.delete(`${API_BASE}/delete/task/${taskId}`);
```

---

## 🎯 Performance Optimizations

- **Lazy Loading**: Routes are lazy loaded
- **Code Splitting**: Vendor chunks separated
- **Image Optimization**: SVG icons, optimized images
- **Memoization**: Use React.memo for expensive components
- **Virtualization**: For large lists
- **Caching**: API responses cached
- **Debouncing**: Search inputs debounced

---

## 📊 State Management

The application uses React Context API for state management:

```typescript
// AuthContext.tsx
const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth logic
  // ...

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🛡️ Security

- **XSS Prevention**: React escapes content by default
- **CSRF Protection**: Token-based authentication
- **HTTPS**: Enforced in production
- **Input Validation**: All forms validated
- **Environment Variables**: Sensitive data not exposed

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

```bash
# Development workflow
git checkout -b feature/your-feature
npm run dev
# Make changes
npm run lint
npm run test
git commit -m "Description"
git push origin feature/your-feature
```

---

## 📄 License

This project is for educational and organizational task management purposes.

---

## 👨‍💻 Author

**Thomas Robert Mihayo**  
Bachelor of Cyber Security

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)

---

## 🔗 Links

- [Backend Repository](https://github.com/tincaty/task-management-system)
- [Live Demo](https://task-management-system.up.railway.app)
- [API Documentation](https://task-management-system.up.railway.app/api/docs)

---

## 📞 Support

For support, email: thomas@example.com

---

**Happy Task Managing! 🚀**
```

## Additional Files to Create:

### 1. `.env.example`

```env
# API Configuration
VITE_API_BASE=http://localhost:8888

# App Configuration
VITE_APP_NAME=Task Management System
```

### 2. `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### 3. `package.json` (Frontend)

```json
{
  "name": "task-management-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-helmet-async": "^2.0.4",
    "react-hook-form": "^7.47.0",
    "react-router-dom": "^6.20.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.0.4",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "prettier": "^3.0.3",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^4.5.0"
  }
}
```
Here's a comprehensive README for your frontend application:

```markdown
# 🎯 Task Management System - Frontend

A modern, responsive task management dashboard built with React, TypeScript, and Tailwind CSS. This frontend application provides role-based interfaces for Admin, Manager, and Employee users to manage tasks efficiently.

---

## 📸 Preview

![Task Management Dashboard](https://via.placeholder.com/800x400?text=Task+Management+Dashboard)

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Admin, Manager, Employee)
- Protected routes with automatic redirects
- Persistent login sessions

### 👨‍💼 Admin Dashboard
- **User Management**: Create, view, and manage users
- **Task Management**: Create, edit, delete, and view all tasks
- **Statistics Dashboard**: Real-time task statistics and analytics
- **Team Overview**: View all team members and their task assignments

### 👔 Manager Dashboard
- **Team Tasks**: View all team tasks
- **Task Updates**: Edit task details and status
- **Team Performance**: Track team member progress
- **Task Analytics**: Completion rates and performance metrics

### 👷 Employee Dashboard
- **My Tasks**: View assigned tasks only
- **Task Updates**: Update task status (TODO → IN_PROGRESS → COMPLETED)
- **Personal Statistics**: Track personal task completion

### 🎨 UI/UX Features
- **Dark/Light Mode**: Modern dark theme for reduced eye strain
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: Real-time feedback for actions
- **Interactive Tables**: Sort, filter, and search functionality
- **Pagination**: Efficient data handling for large datasets

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Styling |
| **React Router v6** | Navigation |
| **Axios** | HTTP Client |
| **React Hook Form** | Form Management |
| **Zod** | Validation |
| **Lucide React** | Icons |
| **Date-fns** | Date formatting |
| **React Helmet** | SEO & Meta Tags |
| **Vite** | Build Tool |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   └── TaskManagement.tsx
│   │   ├── employee/
│   │   │   ├── EmployeeDashboard.tsx
│   │   │   ├── EmployeeLayout.tsx
│   │   │   └── EmployeeTasks.tsx
│   │   ├── manager/
│   │   │   ├── ManagerDashboard.tsx
│   │   │   ├── ManagerLayout.tsx
│   │   │   └── ManagerTasks.tsx
│   │   └── shared/
│   │       ├── Navbar.tsx
│   │       ├── Sidebar.tsx
│   │       └── LoadingSpinner.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Home.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── validation.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── favicon.ico
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see main README)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/tincaty/task-management-system.git
cd task-management-system/frontend
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Create environment file**

```bash
# Create .env file
cp .env.example .env

# Edit with your backend URL
echo "VITE_API_BASE=http://localhost:8888" > .env
```

4. **Start development server**

```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**

```
http://localhost:5173
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
VITE_API_BASE=http://localhost:8888

# Optional: App name
VITE_APP_NAME=Task Management System
```

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |

---

## 🎯 Pages & Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page |
| `/login` | Login | User login |
| `/register` | Register | User registration |

### Protected Routes (Requires Authentication)
| Route | Component | Role |
|-------|-----------|------|
| `/user/admin` | AdminDashboard | Admin |
| `/user/admin/task` | TaskManagement | Admin |
| `/user/manager` | ManagerDashboard | Manager |
| `/user/manager/tasks` | ManagerTasks | Manager |
| `/user/employee` | EmployeeDashboard | Employee |
| `/user/employee/tasks` | EmployeeTasks | Employee |

---

## 🎨 Styling

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Color Schemes

| Role | Primary Color | Accent Color |
|------|---------------|--------------|
| Admin | Blue (#3b82f6) | Purple (#8b5cf6) |
| Manager | Orange (#f97316) | Red (#ef4444) |
| Employee | Green (#22c55e) | Emerald (#10b981) |

---

## 🔐 Authentication Flow

1. User submits login credentials
2. Backend validates credentials
3. JWT token is returned
4. Token is stored in localStorage
5. User is redirected to their dashboard
6. Token is included in all API requests
7. Token is validated on each request
8. Expired token triggers logout

### API Interceptor

```typescript
// services/api.ts
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Watch mode
npm run test -- --watch
```

### Test Structure
```
src/__tests__/
├── components/
│   ├── AdminDashboard.test.tsx
│   ├── Login.test.tsx
│   └── TaskManagement.test.tsx
├── hooks/
│   └── useAuth.test.ts
└── utils/
    └── validation.test.ts
```

---

## 📱 Responsive Design

The application is fully responsive across all devices:

| Device | Breakpoint | Features |
|--------|------------|----------|
| Mobile | < 640px | Collapsed sidebar, stacked cards |
| Tablet | 640px - 1024px | Reduced padding, adjusted layouts |
| Desktop | > 1024px | Full sidebar, multi-column layouts |

---

## 🚢 Deployment

### Build for Production

```bash
# Build the application
npm run build

# The build output will be in the 'dist' directory
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to Railway

1. Push code to GitHub
2. Connect repository to Railway
3. Add environment variables
4. Deploy

---

## 🔧 Troubleshooting

### Common Issues

**1. "API not responding"**
```bash
# Check if backend is running
curl http://localhost:8888/api/docs

# Update .env with correct URL
VITE_API_BASE=http://localhost:8888
```

**2. "Module not found"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**3. "CORS errors"**
```bash
# Make sure backend allows your frontend URL
# Check CORS configuration in backend
```

**4. "404 on refresh"**
```bash
# Add fallback route in your server configuration
# For Vite: Use history fallback in vite.config.ts
```

---

## 📚 API Integration

### Task API Calls

```typescript
// Fetch all tasks
const response = await axios.get(`${API_BASE}/get/task`);

// Create task
const response = await axios.post(`${API_BASE}/create/task`, {
  name: 'Task name',
  description: 'Task description',
  assign_to: 'user_id'
});

// Update task
const response = await axios.patch(`${API_BASE}/update/task/${taskId}`, {
  status: 'IN_PROGRESS'
});

// Delete task
const response = await axios.delete(`${API_BASE}/delete/task/${taskId}`);
```

---

## 🎯 Performance Optimizations

- **Lazy Loading**: Routes are lazy loaded
- **Code Splitting**: Vendor chunks separated
- **Image Optimization**: SVG icons, optimized images
- **Memoization**: Use React.memo for expensive components
- **Virtualization**: For large lists
- **Caching**: API responses cached
- **Debouncing**: Search inputs debounced

---

## 📊 State Management

The application uses React Context API for state management:

```typescript
// AuthContext.tsx
const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth logic
  // ...

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🛡️ Security

- **XSS Prevention**: React escapes content by default
- **CSRF Protection**: Token-based authentication
- **HTTPS**: Enforced in production
- **Input Validation**: All forms validated
- **Environment Variables**: Sensitive data not exposed

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

```bash
# Development workflow
git checkout -b feature/your-feature
npm run dev
# Make changes
npm run lint
npm run test
git commit -m "Description"
git push origin feature/your-feature
```

---

## 📄 License

This project is for educational and organizational task management purposes.

---

## 👨‍💻 Author

**Thomas Robert Mihayo**  
Bachelor of Cyber Security

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)

---

## 🔗 Links

- [Backend Repository](https://github.com/tincaty/task-management-system)
- [Live Demo](https://task-management-system.up.railway.app)
- [API Documentation](https://task-management-system.up.railway.app/api/docs)

---

## 📞 Support

For support, email: thomas@example.com

---

**Happy Task Managing! 🚀**
```

## Additional Files to Create:

### 1. `.env.example`

```env
# API Configuration
VITE_API_BASE=http://localhost:8888

# App Configuration
VITE_APP_NAME=Task Management System
```

### 2. `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### 3. `package.json` (Frontend)

```json
{
  "name": "task-management-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-helmet-async": "^2.0.4",
    "react-hook-form": "^7.47.0",
    "react-router-dom": "^6.20.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.0.4",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "prettier": "^3.0.3",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^4.5.0"
  }
}
```

This README provides everything needed for developers and users to understand, set up, and use your frontend application!
