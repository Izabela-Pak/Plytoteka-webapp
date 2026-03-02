import './index.css';
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { AuthProvider } from './context/AuthContext';
import "bootstrap/dist/css/bootstrap.min.css";
import AppRoutes from './routing/AppRoutes';

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
)
