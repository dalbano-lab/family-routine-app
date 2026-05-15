import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../constants';

export default function AdBanner() {
  const adUnitId = Platform.OS === 'ios'
    ? AD_UNIT_IDS.BANNER_IOS
    : AD_UNIT_IDS.BANNER_ANDROID;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Publicidade</Text>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        onAdFailedToLoad={(err) => console.log('Ad failed:', err)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  label: {
    fontSize: 9,
    color: '#bbb',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
});
