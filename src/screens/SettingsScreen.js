import React, { useState, useContext } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Image, SafeAreaView, StatusBar, Alert, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { AppContext } from '../AppContext';
import { PALETTE, getRank, mkMember } from '../constants';
import AdBanner from '../components/AdBanner';

// ── Photo picker helper (câmera ou galeria) ───────────────────
async function pickPhoto(fromCamera = false) {
  if (fromCamera) {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permissão necessária', 'Precisamos acessar sua câmera.'); return null; }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled) return result.assets[0].uri;
  } else {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria.'); return null; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled) return result.assets[0].uri;
  }
  return null;
}

// ── Photo source modal ────────────────────────────────────────
function PhotoSourceModal({ visible, onClose, onSelect }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.modalSheet}>
          <Text style={s.modalTitle}>📸 Escolher foto</Text>
          <TouchableOpacity style={s.photoOption} onPress={() => onSelect(true)}>
            <Text style={s.photoOptionIcon}>📷</Text>
            <Text style={s.photoOptionText}>Tirar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.photoOption} onPress={() => onSelect(false)}>
            <Text style={s.photoOptionIcon}>🖼️</Text>
            <Text style={s.photoOptionText}>Escolher da galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.photoCancel} onPress={onClose}>
            <Text style={s.photoCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Settings ──────────────────────────────────────────────────
export function SettingsScreen({ navigation }) {
  const { family, updFamily, updMember, addMember, getpts } = useContext(AppContext);

  const [familyName,   setFamilyName]   = useState(family.name);
  const [familyPhoto,  setFamilyPhoto]  = useState(family.photo);
  const [saved,        setSaved]        = useState(false);
  const [photoModal,   setPhotoModal]   = useState(false);
  const [photoTarget,  setPhotoTarget]  = useState(null); // 'family' or setter fn

  const [addOpen,  setAddOpen]  = useState(false);
  const [newName,  setNewName]  = useState('');
  const [newColor, setNewColor] = useState(0);
  const [newPhoto, setNewPhoto] = useState(null);

  const saveFamily = () => {
    updFamily({ name: familyName, photo: familyPhoto });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const handlePhotoSelect = async (fromCamera) => {
    setPhotoModal(false);
    const uri = await pickPhoto(fromCamera);
    if (uri && photoTarget) photoTarget(uri);
  };

  const openPhotoModal = (setter) => {
    setPhotoTarget(() => setter);
    setPhotoModal(true);
  };

  const doAddMember = () => {
    if (!newName.trim()) return;
    const m = mkMember(Date.now(), newName.trim(), newColor);
    if (newPhoto) m.photo = newPhoto;
    addMember(m);
    setNewName(''); setNewColor(0); setNewPhoto(null); setAddOpen(false);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" />

      <PhotoSourceModal
        visible={photoModal}
        onClose={() => setPhotoModal(false)}
        onSelect={handlePhotoSelect}
      />

      <LinearGradient colors={['#6C63FF', '#4ECDC4']} style={s.header}>
        <View style={s.headerCircle} />
        <View style={s.headerTop}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backText}>← Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.backBtn, { backgroundColor: 'rgba(255,255,255,0.35)' }]}
            onPress={() => navigation.navigate('SelectUser')}>
            <Text style={s.backText}>🚪 Trocar usuário</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.title}>Configurações ⚙️</Text>
        <Text style={s.subtitle}>Personalize sua família</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        {/* FAMILY */}
        <View style={s.card}>
          <Text style={s.sectionLabel}>FAMÍLIA</Text>
          <View style={s.row}>
            <TouchableOpacity onPress={() => openPhotoModal(setFamilyPhoto)} style={s.photoBtn}>
              <View style={s.familyPhotoCircle}>
                {familyPhoto
                  ? <Image source={{ uri: familyPhoto }} style={s.photoImg} />
                  : <Text style={{ fontSize: 28 }}>🏠</Text>}
              </View>
              <View style={s.editDot}><Text style={{ fontSize: 11 }}>📷</Text></View>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={s.fieldLabel}>NOME DA FAMÍLIA</Text>
              <TextInput value={familyName} onChangeText={setFamilyName}
                style={s.input} placeholderTextColor="#ccc" />
            </View>
          </View>
          <TouchableOpacity style={[s.saveBtn, saved && s.savedBtn]} onPress={saveFamily}>
            <Text style={s.saveBtnText}>{saved ? '✓ Salvo!' : '💾 Salvar família'}</Text>
          </TouchableOpacity>
        </View>

        {/* MEMBERS */}
        <Text style={s.sectionLabelOut}>INTEGRANTES</Text>
        {family.members.map(m => {
          const c = PALETTE[m.colorIdx];
          const pts = getpts(m);
          return (
            <View key={m.id} style={s.memberRow}>
              <View style={[s.memberAvatar, { backgroundColor: c.bg }]}>
                {m.photo
                  ? <Image source={{ uri: m.photo }} style={s.photoImg} />
                  : <Text style={{ fontSize: 20 }}>{c.emoji}</Text>}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.memberName}>{m.name}</Text>
                <Text style={s.memberSub}>{pts} pts · {getRank(pts).icon} {getRank(pts).label}</Text>
              </View>
              <TouchableOpacity
                style={[s.editBtn, { backgroundColor: c.light }]}
                onPress={() => navigation.navigate('EditMember', { memberId: m.id })}
              >
                <Text style={[s.editBtnText, { color: c.bg }]}>✏️ Editar</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* ADD MEMBER */}
        {!addOpen ? (
          <TouchableOpacity style={s.addMemberBtn} onPress={() => setAddOpen(true)}>
            <Text style={s.addMemberText}>➕ Adicionar integrante</Text>
          </TouchableOpacity>
        ) : (
          <View style={s.addCard}>
            <Text style={s.sectionLabel}>NOVO INTEGRANTE</Text>
            <View style={s.row}>
              <TouchableOpacity onPress={() => openPhotoModal(setNewPhoto)} style={s.photoBtn}>
                <View style={[s.familyPhotoCircle, { backgroundColor: PALETTE[newColor].bg }]}>
                  {newPhoto
                    ? <Image source={{ uri: newPhoto }} style={s.photoImg} />
                    : <Text style={{ fontSize: 26 }}>{PALETTE[newColor].emoji}</Text>}
                </View>
                <View style={s.editDot}><Text style={{ fontSize: 11 }}>📷</Text></View>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={s.fieldLabel}>NOME</Text>
                <TextInput value={newName} onChangeText={setNewName}
                  placeholder="Ex: Vovó, Lucas..." style={s.input} placeholderTextColor="#ccc" />
              </View>
            </View>
            <Text style={[s.fieldLabel, { marginTop: 12, marginBottom: 8 }]}>COR DO PERFIL</Text>
            <View style={s.colorRow}>
              {PALETTE.map((p, i) => (
                <TouchableOpacity key={i} onPress={() => setNewColor(i)}
                  style={[s.colorDot, { backgroundColor: p.bg }, newColor === i && s.colorDotActive]}>
                  <Text style={{ fontSize: 16 }}>{p.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={s.addActions}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => { setAddOpen(false); setNewName(''); setNewPhoto(null); }}>
                <Text style={s.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.confirmBtn} onPress={doAddMember}>
                <Text style={s.confirmText}>Adicionar ✓</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
}

// ── EditMemberScreen ──────────────────────────────────────────
export function EditMemberScreen({ route, navigation }) {
  const { memberId } = route.params;
  const { family, updMember, delMember } = useContext(AppContext);
  const member = family.members.find(m => m.id === memberId);

  const [name,      setName]      = useState(member?.name || '');
  const [photo,     setPhoto]     = useState(member?.photo || null);
  const [colorIdx,  setColorIdx]  = useState(member?.colorIdx ?? 0);
  const [photoModal, setPhotoModal] = useState(false);

  if (!member) { navigation.goBack(); return null; }
  const c = PALETTE[colorIdx];

  const handlePhotoSelect = async (fromCamera) => {
    setPhotoModal(false);
    const uri = await pickPhoto(fromCamera);
    if (uri) setPhoto(uri);
  };

  const save = () => {
    updMember(memberId, { name, photo, colorIdx });
    navigation.goBack();
  };

  const remove = () => {
    Alert.alert('Remover integrante', `Deseja remover ${member.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => { delMember(memberId); navigation.navigate('Home'); } },
    ]);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" />

      <PhotoSourceModal
        visible={photoModal}
        onClose={() => setPhotoModal(false)}
        onSelect={handlePhotoSelect}
      />

      <LinearGradient colors={[c.bg, c.bg + 'AA']} style={s.header}>
        <View style={s.headerCircle} />
        <View style={s.headerTop}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backText}>← Voltar</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.title}>Editar Integrante ✏️</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.card}>
          <View style={s.row}>
            <TouchableOpacity onPress={() => setPhotoModal(true)} style={s.photoBtn}>
              <View style={[s.familyPhotoCircle, { width: 80, height: 80, borderRadius: 40, backgroundColor: c.bg }]}>
                {photo
                  ? <Image source={{ uri: photo }} style={s.photoImg} />
                  : <Text style={{ fontSize: 32 }}>{c.emoji}</Text>}
              </View>
              <View style={s.editDot}><Text style={{ fontSize: 12 }}>📷</Text></View>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={s.fieldLabel}>NOME</Text>
              <TextInput value={name} onChangeText={setName} style={[s.input, { fontSize: 18, fontWeight: '900' }]} />
            </View>
          </View>

          <Text style={[s.fieldLabel, { marginTop: 16, marginBottom: 10 }]}>COR DO PERFIL</Text>
          <View style={s.colorRow}>
            {PALETTE.map((p, i) => (
              <TouchableOpacity key={i} onPress={() => setColorIdx(i)}
                style={[s.colorDot, { backgroundColor: p.bg }, colorIdx === i && s.colorDotActive]}>
                <Text style={{ fontSize: 18 }}>{p.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[s.saveBtn, { backgroundColor: c.bg, marginTop: 0 }]} onPress={save}>
          <Text style={s.saveBtnText}>💾 Salvar alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.deleteBtn} onPress={remove}>
          <Text style={s.deleteBtnText}>🗑️ Remover integrante</Text>
        </TouchableOpacity>
        <View style={{ height: 24 }} />
      </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: '#F5F0EB' },
  header:           { paddingTop: 8, paddingHorizontal: 22, paddingBottom: 28, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, overflow: 'hidden' },
  headerCircle:     { position: 'absolute', top: -40, right: -40, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.1)' },
  headerTop:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  backBtn:          { backgroundColor: 'rgba(255,255,255,0.22)', alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  backText:         { color: '#fff', fontSize: 13, fontWeight: '800' },
  title:            { fontSize: 26, fontWeight: '900', color: '#fff' },
  subtitle:         { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '700', marginTop: 4 },
  body:             { padding: 18 },
  card:             { backgroundColor: '#fff', borderRadius: 22, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
  sectionLabel:     { fontSize: 11, fontWeight: '900', color: '#bbb', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 },
  sectionLabelOut:  { fontSize: 11, fontWeight: '900', color: '#bbb', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  row:              { flexDirection: 'row', alignItems: 'center', gap: 16 },
  photoBtn:         { position: 'relative' },
  familyPhotoCircle:{ width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(108,99,255,0.2)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  photoImg:         { width: '100%', height: '100%' },
  editDot:          { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  fieldLabel:       { fontSize: 11, color: '#bbb', fontWeight: '700', marginBottom: 6 },
  input:            { borderWidth: 2, borderColor: '#eee', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, fontWeight: '900', color: '#333' },
  saveBtn:          { backgroundColor: '#6C63FF', borderRadius: 16, padding: 14, alignItems: 'center', marginTop: 14 },
  savedBtn:         { backgroundColor: '#4ECDC4' },
  saveBtnText:      { color: '#fff', fontWeight: '800', fontSize: 15 },
  memberRow:        { backgroundColor: '#fff', borderRadius: 20, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  memberAvatar:     { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  memberName:       { fontSize: 16, fontWeight: '900', color: '#333' },
  memberSub:        { fontSize: 11, color: '#bbb', fontWeight: '700' },
  editBtn:          { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  editBtnText:      { fontWeight: '800', fontSize: 13 },
  addMemberBtn:     { backgroundColor: '#fff', borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed', borderRadius: 20, padding: 14, alignItems: 'center', marginBottom: 8 },
  addMemberText:    { color: '#aaa', fontWeight: '700', fontSize: 14 },
  addCard:          { backgroundColor: '#fff', borderRadius: 22, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
  colorRow:         { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  colorDot:         { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'transparent' },
  colorDotActive:   { borderColor: '#333', shadowColor: '#333', shadowOpacity: 0.4, shadowRadius: 4, elevation: 4 },
  addActions:       { flexDirection: 'row', gap: 10, marginTop: 18 },
  cancelBtn:        { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 16, padding: 13, alignItems: 'center' },
  cancelText:       { color: '#666', fontWeight: '800', fontSize: 15 },
  confirmBtn:       { flex: 2, backgroundColor: '#FF6B6B', borderRadius: 16, padding: 13, alignItems: 'center' },
  confirmText:      { color: '#fff', fontWeight: '800', fontSize: 15 },
  deleteBtn:        { backgroundColor: '#fff', borderWidth: 2, borderColor: '#FFE5E5', borderRadius: 16, padding: 13, alignItems: 'center', marginTop: 10 },
  deleteBtnText:    { color: '#FF6B6B', fontWeight: '800', fontSize: 14 },
  // Photo modal
  modalOverlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet:       { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingBottom: 48 },
  modalTitle:       { fontSize: 20, fontWeight: '900', color: '#333', marginBottom: 20, textAlign: 'center' },
  photoOption:      { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, backgroundColor: '#f8f8f8', borderRadius: 16, marginBottom: 10 },
  photoOptionIcon:  { fontSize: 28 },
  photoOptionText:  { fontSize: 16, fontWeight: '800', color: '#333' },
  photoCancel:      { padding: 14, alignItems: 'center', marginTop: 6 },
  photoCancelText:  { fontSize: 15, fontWeight: '800', color: '#aaa' },
});
