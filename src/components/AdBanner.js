import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Publicidade</Text>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>📢 Anúncio</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 14 },
  label: { fontSize: 9, color: '#bbb', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, alignSelf: 'flex-start' },
  banner: { width: '100%', height: 50, backgroundColor: '#f8f8f8', borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderStyle: 'dashed' },
  bannerText: { fontSize: 12, color: '#bbb', fontWeight: '700' },
});