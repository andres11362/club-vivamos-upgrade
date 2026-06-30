import MySavingsTemplate from '@/components/template/saving';
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchSavingsData } from '@/services/savingsService';
import { SavingsProviders } from '@/providers/savings';

export default async function MySavingsPage() {
  const cookieStore = await cookies();
  const prefix = process.env.COOKIE_PREFIX ?? "";
  const authCookie = cookieStore.get(`${prefix}auth`);

  let user = null;
  if (authCookie) {
    try {
      const session = JSON.parse(decodeURIComponent(authCookie.value));
      if (session.authenticated) {
        user = session.user;
      }
    } catch (e) {
      console.error("Error reading auth cookie on server:", e);
    }
  }

  if (!user) {
    redirect("/login");
  }

  const documentType = user.document_type_id ?? '';
  const documentNumber = user.document ?? '';

  // Fetch initial savings data on the server (12 months default)
  const initialData = await fetchSavingsData(documentType, documentNumber, 12);

  return (
    <SavingsProviders
      initialData={initialData}
      documentType={documentType}
      documentNumber={documentNumber}
    >
      <MySavingsTemplate />
    </SavingsProviders>
  );
}
