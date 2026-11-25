import { Navbar } from '@/components/navbar';
import { CustomCursor } from '@/components/cursor';
import { WhatsAppFab } from '@/components/whatsapp-fab';
import { ToastProvider } from '@/components/ui/toast';
import { Footer } from '@/components/footer';
import { Copyright } from '@/components/copyright';

/** Navbar, footer, WhatsApp button and cursor around a page's <main>. Each page renders its own, so their effects re-run per page. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Navbar />
      {children}
      <Footer copyright={<Copyright />} />
      <WhatsAppFab />
      <CustomCursor />
    </ToastProvider>
  );
}
