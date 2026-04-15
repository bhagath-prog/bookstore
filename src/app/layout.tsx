"use client";
import Header from "./components/Header/header";


import "./globals.css";
import Footer from "./components/Footer/footer";
import { AdminProvider } from './AdminContext';
import { usePathname } from 'next/navigation';
import { useAdmin } from './AdminContext';


// Client component to check admin status
function AdminContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAdmin } = useAdmin();

  // Check if current route is admin route
  const isAdminRoute = pathname?.startsWith('/admin');

  // Don't show Header/Footer for admin routes or when admin is logged in
  const showHeaderFooter = !isAdminRoute && !isAdmin;

  return (
    <>
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <Footer />}
    </>
  );
}

function AdminCheck({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminContent>{children}</AdminContent>
    </AdminProvider>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
        <meta name="description" content="Next.js App" />
      </head>
      <body>
        <AdminCheck>
          {children}
        </AdminCheck>
      </body>
    </html>
  );
}