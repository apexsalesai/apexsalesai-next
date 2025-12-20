import React from 'react';
import { SafeAreaView } from 'react-native';
import EchoBreakerPremium from '../components/EchoBreakerPremium';

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <EchoBreakerPremium />
    </SafeAreaView>
  );
}
