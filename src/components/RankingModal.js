import React, { useContext } from 'react';
import {
  View, Text, Modal, TouchableOpacity, ScrollView,
  StyleSheet, Image,
} from 'react-native';
import { AppContext } from '../AppContext';
import { PALETTE, getRank } from '../constants';

export default function RankingModal({ visible, onClose }) {
  const { family, getpts } = useContext(AppContext);

  const ranking = [...family.members]
    .map(m => ({ ...m, pts: getpts(m) }))
    .sort((a, b) => b.pts - a.pts);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.header}>
            <Text style={s.title}>🏆 Ranking da Família</Text>
            <TouchableOpacity style={s.closeBtn} onPress={onClose}>
              <Text style={s.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {ranking.map((m, i) => {
              const c  = PALETTE[m.colorIdx];
              const rk = getRank(m.pts);
              return (
                <View key={m.id} style={[s.row, i === 0 && s.rowGold]}>
                  <Text style={s.medal}>{medals[i] || `${i + 1}`}</Text>
                  <View style={[s.avatar, { backgroundColor: c.bg }]}>
                    {m.photo
                      ? <Image source={{ uri: m.photo }} style={s.avatarImg} />
                      : <Text style={{ fontSize: 20 }}>{c.emoji}</Text>}
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={s.name}>{m.name}</Text>
                    <Text style={s.rank}>{rk.icon} {rk.label}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[s.pts, { color: c.bg }]}>{m.pts}</Text>
                    <Text style={s.ptsLabel}>pontos</Text>
                  </View>
                </View>
              );
            })}
            <View style={{ height: 16 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet:    { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 48, maxHeight: '80%' },
  header:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  title:    { fontSize: 22, fontWeight: '900', color: '#333' },
  closeBtn: { backgroundColor: '#f0f0f0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  closeTxt: { fontWeight: '800', color: '#666' },
  row:      { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 18, padding: 13, marginBottom: 9, borderWidth: 2, borderColor: 'transparent' },
  rowGold:  { backgroundColor: '#FFFBEA', borderColor: '#FFD93D' },
  medal:    { fontSize: 24, width: 32, textAlign: 'center' },
  avatar:   { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImg:{ width: '100%', height: '100%' },
  name:     { fontSize: 16, fontWeight: '900', color: '#333' },
  rank:     { fontSize: 11, color: '#aaa', fontWeight: '700' },
  pts:      { fontSize: 22, fontWeight: '900' },
  ptsLabel: { fontSize: 10, color: '#bbb', fontWeight: '700' },
});
