import AllyTemplate from '@/components/template/Ally';
import { getDirectoryAllies } from '@/services/directoryService';
import React from 'react';

export default async function DirectoryAliadosPage() {
  const allies = await getDirectoryAllies();
  
  return (
    <AllyTemplate initialAllies={allies} />
  );
}

