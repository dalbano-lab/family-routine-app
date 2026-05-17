import React from 'react';
import { View } from 'react-native';

// AdMob insere o banner automaticamente em produção
// Este componente reserva o espaço
export default function AdBanner() {
  return <View style={{ height: 50 }} />;
}
