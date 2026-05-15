import React, { useState, useContext } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Image, SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../AppContext';
import { PALETTE, PERIODS, getRank } from '../constants';
import AdBanner from '../components/AdBanner';

export default function TasksScreen({ route, navigation }) {
  const { memberId } = route.params;
  const { family, checked, toggleCheck, updMember, getpts } = useContext(AppContext);

  const member = family.members.find(m => m.id === memberId);
  const pal    = PALETTE[member.colorIdx];

  const [period,   setPeriod]  = useState('manha');
  const [addMode,  setAddMode] = useState(false);
  const [newTask,  setNewTask] = useState('');
  const [plusShow, setPlusShow]= useState(false);
  const [allDone,  setAllDone] = useState(false);

  if (!member) { navigation.goBack(); return null; }

  const memPts = getpts(member);
  const tasks  = member.tasks[period];
  const isChk  = (i) => !!checked[`${memberId}-${period}-${i}`];
  const done   = tasks.filter((_, i) => isChk(i)).length;
  const pct    = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const handleToggle = (i) => {
    const newVal = toggleCheck(memberId, period, i);
    if (newVal) {
      setPlusShow(true);
      setTimeout(() => setPlusShow(false), 900);
      // check if all done
      const newDone = tasks.filter((_, j) => (j === i ? true : isChk(j))).length;
      if (newDone === tasks.length) {
        setAllDone(true);
        setTimeout(() => setAllDone(false), 3000);
      }
    }
  };

  const doAddTask = () => {
    if (!newTask.trim()) return;
    updMember(memberId, {
      tasks: { ...member.tasks, [period]: [...tasks, newTask.trim()] },
    });
    setNewTask(''); setAddMode(false);
  };

  const removeTask = (idx) => {
    updMember(memberId, {
      tasks: { ...member.tasks, [period]: tasks.filter((_, i) => i !== idx) },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* +1 float */}
      {plusShow && (
        <View style={styles.plusFloat} pointerEvents="none">
          <Text style={styles.plusText}>+1 ⭐</Text>
        </View>
      )}

      {/* All done banner */}
      {allDone && (
        <View style={styles.doneBanner}>
          <Text style={styles.doneText}>🎉 +{tasks.length} pontos!</Text>
        </View>
      )}

      {/* Header */}
      <LinearGradient
        colors={[pal.bg, pal.bg + 'CC']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('EditMember', { memberId })}>
            <Text style={styles.backText}>✏️ Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroRow}>
          <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
            {member.photo
              ? <Image source={{ uri: member.photo }} style={styles.avatarImg} />
              : <Text style={{ fontSize: 28 }}>{pal.emoji}</Text>}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.subText}>{done}/{tasks.length} tarefas · {getRank(memPts).icon} {getRank(memPts).label}</Text>
          </View>
          <View style={styles.ptsBadge}>
            <Text style={styles.ptsNum}>{memPts}</Text>
            <Text style={styles.ptsLabel}>PONTOS</Text>
          </View>
        </View>

        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.pctText}>{pct}% completo hoje</Text>
      </LinearGradient>

      {/* Period tabs */}
      <View style={styles.tabs}>
        {PERIODS.map(p => {
          const act = period === p.id;
          const pd  = member.tasks[p.id].filter((_, i) => !!checked[`${memberId}-${p.id}-${i}`]).length;
          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.tab, act && { backgroundColor: pal.bg, shadowColor: pal.bg }]}
              onPress={() => setPeriod(p.id)}
            >
              <Text style={{ fontSize: 17 }}>{p.icon}</Text>
              <Text style={[styles.tabLabel, { color: act ? '#fff' : '#666' }]}>{p.label}</Text>
              <Text style={[styles.tabCount, { color: act ? 'rgba(255,255,255,0.8)' : '#bbb' }]}>
                {pd}/{member.tasks[p.id].length} ⭐
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Alarm row */}
      <View style={styles.alarmRow}>
        <Text style={{ fontSize: 18 }}>⏰</Text>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.alarmLabel}>ALARME — {PERIODS.find(p => p.id === period)?.label.toUpperCase()}</Text>
          <Text style={[styles.alarmTime, { color: pal.bg }]}>{member.alarms[period]}</Text>
        </View>
        <TouchableOpacity
          style={[styles.editAlarmBtn, { backgroundColor: pal.light }]}
          onPress={() => navigation.navigate('EditMember', { memberId, focusAlarm: period })}
        >
          <Text style={[styles.editAlarmText, { color: pal.bg }]}>✏️ Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Tasks */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.taskList} showsVerticalScrollIndicator={false}>
        {tasks.map((task, idx) => {
          const ck = isChk(idx);
          return (
            <View key={idx} style={[styles.taskRow, { opacity: ck ? 0.65 : 1 }]}>
              <TouchableOpacity
                style={[styles.checkbox, { borderColor: pal.bg, backgroundColor: ck ? pal.bg : 'transparent' }]}
                onPress={() => handleToggle(idx)}
              >
                {ck && <Text style={{ color: '#fff', fontSize: 13, fontWeight: '900' }}>✓</Text>}
              </TouchableOpacity>
              <Text style={[styles.taskText, ck && styles.taskDone]}>{task}</Text>
              <View style={[styles.ptChip, { backgroundColor: ck ? pal.bg : pal.light }]}>
                <Text style={[styles.ptChipText, { color: ck ? '#fff' : pal.bg }]}>
                  {ck ? '⭐ +1 pt' : '1 pt'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeTask(idx)} style={styles.removeBtn}>
                <Text style={styles.removeTxt}>✕</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {addMode ? (
          <View style={styles.addRow}>
            <TextInput
              value={newTask}
              onChangeText={setNewTask}
              placeholder="Nova tarefa..."
              style={[styles.addInput, { borderColor: pal.bg }]}
              onSubmitEditing={doAddTask}
              autoFocus
            />
            <TouchableOpacity style={[styles.addOkBtn, { backgroundColor: pal.bg }]} onPress={doAddTask}>
              <Text style={styles.addOkText}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addCancelBtn} onPress={() => setAddMode(false)}>
              <Text style={{ color: '#999', fontWeight: '800' }}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.addTaskBtn, { borderColor: pal.bg + '80', backgroundColor: pal.light }]}
            onPress={() => setAddMode(true)}
          >
            <Text style={[styles.addTaskText, { color: pal.bg }]}>＋ Adicionar tarefa (+1 pt)</Text>
          </TouchableOpacity>
        )}

        {tasks.length > 0 && done === tasks.length && (
          <View style={styles.allDoneBox}>
            <Text style={{ fontSize: 42 }}>🎉</Text>
            <Text style={[styles.allDoneTitle, { color: pal.bg }]}>Período completo!</Text>
            <View style={styles.bonusBox}>
              <Text style={styles.bonusText}>⭐ {tasks.length} pontos ganhos!</Text>
            </View>
            <Text style={styles.totalText}>Total acumulado: {memPts} pts 🌟</Text>
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      <AdBanner />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#F5F0EB' },
  plusFloat:    { position: 'absolute', top: '45%', left: 0, right: 0, zIndex: 99, alignItems: 'center', pointerEvents: 'none' },
  plusText:     { fontSize: 42, fontWeight: '900', color: '#FFD93D', textShadow: '0 3px 14px rgba(0,0,0,.25)' },
  doneBanner:   { position: 'absolute', top: 60, left: 20, right: 20, zIndex: 98, backgroundColor: '#FF6B6B', borderRadius: 16, padding: 14, alignItems: 'center' },
  doneText:     { color: '#fff', fontSize: 20, fontWeight: '900' },
  header:       { paddingTop: 8, paddingHorizontal: 22, paddingBottom: 20, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  headerTop:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  backBtn:      { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  backText:     { color: '#fff', fontSize: 13, fontWeight: '800' },
  heroRow:      { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar:       { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)', overflow: 'hidden' },
  avatarImg:    { width: '100%', height: '100%' },
  memberName:   { fontSize: 26, fontWeight: '900', color: '#fff', lineHeight: 28 },
  subText:      { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '700', marginTop: 2 },
  ptsBadge:     { backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  ptsNum:       { fontSize: 28, fontWeight: '900', color: '#FFD93D', lineHeight: 30 },
  ptsLabel:     { fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: '800', letterSpacing: 1 },
  progressBg:   { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 10, height: 6, marginTop: 14, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 10, backgroundColor: '#FFD93D' },
  pctText:      { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '800', marginTop: 4 },
  tabs:         { flexDirection: 'row', gap: 8, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 4 },
  tab:          { flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 10, alignItems: 'center', gap: 2, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  tabLabel:     { fontSize: 13, fontWeight: '800' },
  tabCount:     { fontSize: 10, fontWeight: '700' },
  alarmRow:     { margin: 18, marginBottom: 0, backgroundColor: '#fff', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  alarmLabel:   { fontSize: 10, color: '#bbb', fontWeight: '700' },
  alarmTime:    { fontSize: 17, fontWeight: '900' },
  editAlarmBtn: { borderRadius: 12, paddingHorizontal: 13, paddingVertical: 7 },
  editAlarmText:{ fontWeight: '800', fontSize: 12 },
  taskList:     { paddingHorizontal: 18, paddingTop: 12 },
  taskRow:      { backgroundColor: '#fff', borderRadius: 16, padding: 13, marginBottom: 9, flexDirection: 'row', alignItems: 'center', gap: 11, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  checkbox:     { width: 28, height: 28, borderRadius: 9, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  taskText:     { flex: 1, fontSize: 15, fontWeight: '700', color: '#333' },
  taskDone:     { textDecorationLine: 'line-through' },
  ptChip:       { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 4 },
  ptChipText:   { fontSize: 11, fontWeight: '900' },
  removeBtn:    { padding: 2 },
  removeTxt:    { color: '#ddd', fontSize: 16 },
  addRow:       { backgroundColor: '#fff', borderRadius: 16, padding: 11, marginBottom: 9, flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  addInput:     { flex: 1, borderWidth: 2, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, fontWeight: '700' },
  addOkBtn:     { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  addOkText:    { color: '#fff', fontWeight: '800' },
  addCancelBtn: { backgroundColor: '#f0f0f0', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  addTaskBtn:   { borderWidth: 2, borderStyle: 'dashed', borderRadius: 16, padding: 13, marginBottom: 9, alignItems: 'center' },
  addTaskText:  { fontWeight: '800', fontSize: 14 },
  allDoneBox:   { alignItems: 'center', paddingVertical: 20 },
  allDoneTitle: { fontSize: 20, fontWeight: '900', marginTop: 6 },
  bonusBox:     { backgroundColor: '#FFF8DC', borderRadius: 14, paddingHorizontal: 20, paddingVertical: 10, marginTop: 8, borderWidth: 2, borderColor: '#FFD93D' },
  bonusText:    { fontSize: 18, fontWeight: '900', color: '#E6A800' },
  totalText:    { color: '#aaa', fontSize: 12, fontWeight: '700', marginTop: 8 },
});
