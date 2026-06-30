import React from 'react';

interface PageProps {
  params: Promise<{
    user_hash: string;
  }>;
}

export default async function ConfirmRecoveryPage({ params }: PageProps) {
  const { user_hash } = await params;
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Cambiar Contraseña</h1>
      <p className="mt-4 text-gray-600">Token de usuario: <code className="bg-gray-100 p-1 rounded">{user_hash}</code></p>
    </div>
  );
}
