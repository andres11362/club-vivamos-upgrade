"use client"; // ✅ Este SÍ es un Client Component

import { AuthProvider } from '@/context/AuthContext';
import { DeviceProvider } from '@/context/DeviceContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <DeviceProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </DeviceProvider>
    );
}