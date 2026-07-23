import { createContext, useContext, useEffect, useState } from "react";
import type { AdminUser } from "@/pages/admin/type/Admin"

interface AdminContextType {
  isLoggedIn: boolean;
  admin: AdminUser | null;
  login: (admin: AdminUser) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const savedAdmin = localStorage.getItem("admin");
    const savedToken = localStorage.getItem("token");

    if (savedAdmin && savedToken) {
      return JSON.parse(savedAdmin);
    }

    return null;
  });

  const isLoggedIn = !!admin;

  const login = (adminData: AdminUser) => {
    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
  };

  return (
    <AdminContext.Provider value={{ isLoggedIn, admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}


export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
