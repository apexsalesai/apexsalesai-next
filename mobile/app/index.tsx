import React from 'react';
import { SafeAreaView } from 'react-native';
import EchoBreakerMobile from '../components/EchoBreakerMobile';

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <EchoBreakerMobile />
    </SafeAreaView>
  );
}
