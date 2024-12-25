'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

const LoginContent = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const router = useRouter();

  return <LoginForm error={error} router={router} />;
};

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
};

export default LoginPage;
