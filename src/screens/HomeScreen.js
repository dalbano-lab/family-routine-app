import React, { useState, useContext } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Image, SafeAreaView, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../AppContext';
import { PALETTE, getRank } from '../constants';
import AdBanner from '../components/AdBanner';
import RankingModal from '../components/RankingModal';

export default function HomeScreen({ navigation }) {
  const { family, checked, nowTime } = useContext(AppContext);
  const [showRanking, setShowRanking] = useState(false);

  const getpts = (m) =>
    Object.keys(checked).filter(k => k.startsWith(`${m.id}-`) && checked[k]).length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#FF6B6B', '#FF8C42', '#FFD93D']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Decorative circles */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.appOf}>🏠 Rotina da Família</Text>
            <Text style={styles.familyName}>{family.name}</Text>
          </View>
          <View style={styles.topButtons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowRanking(true)}>
              <Text style={styles.iconBtnText}>🏆</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.iconBtnText}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: 'rgba(255,255,255,0.35)' }]} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.iconBtnText}>🚪</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Family photo + time */}
        <View style={styles.heroRow}>
          <View style={styles.familyPhoto}>
            {family.photo
              ? <Image source={{ uri: family.photo }} style={styles.familyPhotoImg} />
              : <Text style={{ fontSize: 32 }}>🏠</Text>}
          </View>
          <View>
            <Text style={styles.heroSub}>Quem é você hoje? 👇</Text>
            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>⏰ {nowTime || '--:--'}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Member grid */}
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {family.members.map(m => {
          const c   = PALETTE[m.colorIdx];
          const pts = getpts(m);
          const rk  = getRank(pts);
          const tot = Object.values(m.tasks).flat().length;
          const dn  = Object.entries(m.tasks)
            .flatMap(([pd, t]) => t.map((_, i) => `${m.id}-${pd}-${i}`))
            .filter(k => checked[k]).length;
          const pct = tot ? (dn / tot) * 100 : 0;

          return (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.85}
              style={[styles.card, { shadowColor: c.bg }]}
              onPress={() => navigation.navigate('Tasks', { memberId: m.id })}
            >
              <View style={styles.avatarWrap}>
                <View style={[styles.avatar, { backgroundColor: c.bg }]}>
                  {m.photo
                    ? <Image source={{ uri: m.photo }} style={styles.avatarImg} />
                    : <Text style={{ fontSize: 26 }}>{c.emoji}</Text>}
                </View>
                {pts > 0 && (
                  <View style={styles.ptsBadge}>
                    <Text style={styles.ptsBadgeText}>⭐{pts}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.memberName}>{m.name}</Text>
              <Text style={[styles.rankLabel, { color: c.bg }]}>{rk.icon} {rk.label}</Text>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { backgroundColor: c.bg, width: `${pct}%` }]} />
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.taskCount}>{dn}/{tot} tarefas</Text>
                <Text style={styles.ptsCount}>⭐ {pts} pts</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Add member */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addCard}
          onPress={() => navigation.navigate('Settings')}
        >
          <View style={styles.addCircle}><Text style={{ fontSize: 24 }}>➕</Text></View>
          <Text style={styles.addLabel}>Novo membro</Text>
        </TouchableOpacity>
      </ScrollView>

      <AdBanner />
      <RankingModal visible={showRanking} onClose={() => setShowRanking(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: '#F5F0EB' },
  header:      { paddingTop: 16, paddingHorizontal: 22, paddingBottom: 32, borderBottomLeftRadius: 44, borderBottomRightRadius: 44, overflow: 'hidden' },
  circle1:     { position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.1)' },
  circle2:     { position: 'absolute', bottom: -30, left: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.07)' },
  topBar:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  appOf:       { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
  familyName:  { fontSize: 28, color: '#fff', fontWeight: '900', marginTop: 2 },
  topButtons:  { flexDirection: 'row', gap: 8 },
  iconBtn:     { backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  iconBtnText: { fontSize: 16 },
  heroRow:     { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 18 },
  familyPhoto: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)', overflow: 'hidden' },
  familyPhotoImg: { width: '100%', height: '100%' },
  heroSub:     { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '700' },
  timeBadge:   { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5, marginTop: 6, alignSelf: 'flex-start' },
  timeText:    { color: '#fff', fontWeight: '900', fontSize: 13 },
  grid:        { padding: 18, flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  card:        { width: '47%', backgroundColor: '#fff', borderRadius: 24, padding: 16, alignItems: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 5 },
  avatarWrap:  { position: 'relative', marginBottom: 10 },
  avatar:      { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImg:   { width: '100%', height: '100%' },
  ptsBadge:    { position: 'absolute', top: -6, right: -10, backgroundColor: '#FFD93D', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  ptsBadgeText:{ fontSize: 10, fontWeight: '900', color: '#333' },
  memberName:  { fontSize: 17, fontWeight: '900', color: '#333' },
  rankLabel:   { fontSize: 11, fontWeight: '800', marginTop: 2 },
  progressBg:  { backgroundColor: '#f0f0f0', borderRadius: 8, height: 4, width: '100%', marginTop: 8, overflow: 'hidden' },
  progressFill:{ height: '100%', borderRadius: 8 },
  cardFooter:  { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 5 },
  taskCount:   { fontSize: 10, color: '#ccc', fontWeight: '700' },
  ptsCount:    { fontSize: 10, color: '#E6A800', fontWeight: '900' },
  addCard:     { width: '47%', backgroundColor: '#fff', borderRadius: 24, padding: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed', minHeight: 148 },
  addCircle:   { width: 52, height: 52, borderRadius: 26, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  addLabel:    { fontSize: 13, color: '#aaa', fontWeight: '700' },
});
