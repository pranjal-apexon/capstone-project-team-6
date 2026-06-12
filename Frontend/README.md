# StoreHub Frontend

A modern React + TypeScript application for an Inventory & Order Management System.

## 🚀 Features

- **Authentication**: User registration and login with JWT tokens
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add products to cart and manage quantities
- **Order Management**: Place orders and track order history
- **Admin Dashboard**: Manage products and orders (admin users only)
- **Low Stock Alerts**: Real-time alerts for low inventory items
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📁 Project Structure

```
src/
├── api/                    # API service layer
│   ├── authApi.ts         # Authentication endpoints
│   ├── productApi.ts      # Product management endpoints
│   ├── orderApi.ts        # Order management endpoints
│   └── axiosClient.ts     # Axios configuration with interceptors
├── components/            # Reusable UI components
│   ├── Auth/              # Authentication components
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── Products/          # Product components
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProductSearch.tsx
│   │   └── ProductForm.tsx
│   ├── Orders/            # Order components
│   │   ├── Cart.tsx
│   │   ├── OrderHistory.tsx
│   │   └── OrderStatusBadge.tsx
│   ├── Admin/             # Admin dashboard components
│   │   ├── AdminProductPanel.tsx
│   │   ├── AdminOrderPanel.tsx
│   │   └── LowStockAlert.tsx
│   ├── Layout/            # Layout components
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   └── styles/            # Component-specific CSS
├── pages/                 # Page components (routed)
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProductsPage.tsx
│   ├── OrderPage.tsx
│   └── AdminPage.tsx
├── store/                 # Redux store configuration
│   ├── authSlice.ts       # Auth state management
│   ├── cartSlice.ts       # Cart state management
│   ├── productSlice.ts    # Product state management
│   ├── hooks.ts           # Custom Redux hooks
│   └── store.ts           # Store configuration
├── types/                 # TypeScript type definitions
│   ├── auth.types.ts
│   ├── product.types.ts
│   └── order.types.ts
├── App.tsx                # Main app component with routing
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## 🛠 Installation

### Prerequisites

- Node.js 16+ and npm
- Backend API running on `http://localhost:5000`

### Setup Steps

1. **Install Dependencies**

```bash
cd Frontend
npm install
```

2. **Configure API Base URL**

Update the `API_BASE_URL` in `src/api/axiosClient.ts` if your backend runs on a different port:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

3. **Start Development Server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📋 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm lint
```

## 🔐 Authentication

The app uses JWT (JSON Web Token) for authentication:

- Tokens are stored in `localStorage` under the key `token`
- User data is stored in `localStorage` under the key `user`
- Protected routes require authentication via the `ProtectedRoute` component
- Admin routes additionally require the `isAdmin` flag

## 🛍️ Key Features Explained

### Product Browsing

- View all available products on the Products page
- Search products by name
- Filter by category and price range
- Low stock items are visually highlighted
- Add products to cart for purchase

### Shopping Cart

- Add/remove items from cart
- Update quantities
- View cart summary with subtotal, tax, and total
- Persist cart data in `localStorage`
- Proceed to checkout to place an order

### Order Management

- Place orders from cart contents
- View complete order history
- Track order status (Pending, Processing, Shipped, Delivered, Cancelled)
- View detailed order information including items and prices

### Admin Features

- Access admin dashboard (for users with `isAdmin: true`)
- Manage product catalog (CRUD operations)
- View low stock alerts
- Manage all orders and update their status
- Delete products from inventory

## 🎨 Styling

The project uses CSS for styling organized by component:

- Each component has its own CSS file in `components/styles/`
- Global styles are in `index.css`
- Colors use a consistent palette with primary color `#667eea`
- Responsive design works on screens from 320px and up

## 🔄 State Management

Redux Toolkit is used for state management with three slices:

### Auth Slice

- Stores current user and authentication token
- Handles login, logout, and registration actions
- Manages authentication state and error messages

### Cart Slice

- Manages shopping cart items
- Handles add/remove/update quantity operations
- Persists cart state to localStorage

### Product Slice

- Stores product list
- Manages product filters and search
- Handles loading and error states

## 📡 API Integration

All API calls are made through the `api/` directory:

- **Authentication**: `authApi.login()`, `authApi.register()`, `authApi.logout()`
- **Products**: `productApi.getAll()`, `productApi.getById()`, `productApi.create()`, `productApi.update()`, `productApi.delete()`
- **Orders**: `orderApi.create()`, `orderApi.getMyOrders()`, `orderApi.getAll()`, `orderApi.updateStatus()`

Axios is configured with:

- Automatic JWT token injection in request headers
- Automatic redirect to login on 401 response
- Consistent base URL configuration

## 🚨 Error Handling

- API errors are caught and displayed to users
- Form validation prevents invalid submissions
- Loading states prevent multiple submissions
- Error messages from backend are displayed in user-friendly format

## 📱 Responsive Design

The application is fully responsive with breakpoints for:

- Desktop (1024px and up)
- Tablet (768px to 1023px)
- Mobile (below 768px)

## 🔧 Environment Variables

No environment variables are required for development. If needed, create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Then update `src/api/axiosClient.ts` to use:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

## 📚 Dependencies

Key dependencies include:

- **react**: UI library
- **react-router-dom**: Client-side routing
- **@reduxjs/toolkit**: State management
- **react-redux**: React bindings for Redux
- **axios**: HTTP client
- **typescript**: Type safety

## 🤝 Contributing

Follow these guidelines when contributing:

1. Create feature branches from `main`
2. Use descriptive commit messages
3. Ensure code is typed with TypeScript
4. Keep components focused and reusable
5. Organize CSS by component

## 📝 License

This project is part of the StoreHub Platform.

## 🆘 Troubleshooting

### API Connection Issues

- Verify backend is running on `http://localhost:5000`
- Check `src/api/axiosClient.ts` for correct API_BASE_URL
- Check browser console for CORS errors
- Ensure JWT token is being sent in Authorization header

### Authentication Issues

- Clear localStorage if stuck in login loop: `localStorage.clear()`
- Verify user credentials match those created in backend
- Check JWT token expiration

### Styling Issues

- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server (npm run dev)
- Check that component CSS files are imported correctly

## 📞 Support

For issues or questions, refer to the main project README.md at the repository root.
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
