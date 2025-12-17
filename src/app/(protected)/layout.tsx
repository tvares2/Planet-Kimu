import AuthProvider from '@/components/auth-provider';
import MainSidebar from '@/components/main-sidebar';
import { cn } from '@/lib/utils';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-background">
        <MainSidebar />
        <main
          className={cn(
            'flex-1 transition-[margin-left] duration-300 ease-in-out',
            'ml-0 md:ml-64'
          )}
        >
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
