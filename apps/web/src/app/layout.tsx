import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/common/Toast';

export const metadata = {
  title: 'SDA Matrimony | Faith-Aligned Seventh-day Adventist Matchmaking',
  description: 'Enterprise-grade, faith-aligned digital matchmaking ecosystem designed specifically for the global Seventh-day Adventist community.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
          <ToastContainer />
        </div>
      </body>
    </html>
  );
}
