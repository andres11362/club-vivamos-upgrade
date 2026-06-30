"use client"; // ✅ Este SÍ es un Client Component

import { SavingsProvider } from '@/context/SavingsContext';

interface SavingsProvidersProps {
  readonly children: React.ReactNode;
  readonly initialData: any;
  readonly documentType: string | number;
  readonly documentNumber: string;
}

export function SavingsProviders({
  children,
  initialData,
  documentType,
  documentNumber,
}: SavingsProvidersProps) {
  return (
    <SavingsProvider
      initialData={initialData}
      documentType={documentType}
      documentNumber={documentNumber}
    >
      {children}
    </SavingsProvider>
  );
}