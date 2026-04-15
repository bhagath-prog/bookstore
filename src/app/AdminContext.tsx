"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  checkAdminStatus: () => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = () => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      const isAdminUser = userRole === 'admin';
      setIsAdmin(isAdminUser);
      return isAdminUser;
    }
    return false;
  };

  useEffect(() => {
    checkAdminStatus();
    
    const handleStorageChange = () => {
      checkAdminStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(checkAdminStatus, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin, checkAdminStatus }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}