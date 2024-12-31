import BackgroundIcons from '@/components/BackgroundIcons';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="h-screen relative bg-background overflow-hidden">
      {/* Hintergrund mit Icons */}
      <div className="absolute inset-0 z-0">
        <BackgroundIcons />
      </div>

      {/* Login Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-[#0095FF]">
              Admin-Bereich
            </h1>
            <p className="text-gray-400 text-lg">
              Bitte melden Sie sich mit Ihren Admin-Zugangsdaten an
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
