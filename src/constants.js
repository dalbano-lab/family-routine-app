// ─── Paleta de cores dos membros ────────────────────────────
export const PALETTE = [
  { bg: '#FF6B6B', light: '#FFE5E5', emoji: '👩' },
  { bg: '#4ECDC4', light: '#E0FAF8', emoji: '👨' },
  { bg: '#FFD93D', light: '#FFF8DC', emoji: '👦' },
  { bg: '#6C63FF', light: '#EAE9FF', emoji: '👧' },
  { bg: '#FF8C42', light: '#FFE8D6', emoji: '👴' },
  { bg: '#95D1CC', light: '#E3F7F5', emoji: '👵' },
  { bg: '#F687B3', light: '#FFE4F0', emoji: '👶' },
  { bg: '#68D391', light: '#E0FFF0', emoji: '🧑' },
];

// ─── Períodos do dia ─────────────────────────────────────────
export const PERIODS = [
  { id: 'manha', label: 'Manhã',  icon: '🌅' },
  { id: 'tarde', label: 'Tarde',  icon: '☀️' },
  { id: 'noite', label: 'Noite',  icon: '🌙' },
];

// ─── Tarefas padrão ──────────────────────────────────────────
export const DEFAULT_TASKS = {
  manha: ['Escovar os dentes', 'Tomar banho', 'Tomar café da manhã'],
  tarde: ['Almoçar', 'Descansar 20 min', 'Estudar / Trabalhar'],
  noite: ['Jantar', 'Preparar roupas', 'Dormir cedo'],
};

// ─── Níveis de rank ───────────────────────────────────────────
export const RANKS = [
  { min: 0,  label: 'Iniciante', icon: '🌱' },
  { min: 5,  label: 'Dedicado',  icon: '⭐' },
  { min: 15, label: 'Campeão',   icon: '🏆' },
  { min: 30, label: 'Lendário',  icon: '👑' },
];

export const getRank = (pts) =>
  [...RANKS].reverse().find(r => pts >= r.min) || RANKS[0];

// ─── IDs de AdMob ─────────────────────────────────────────────
// SUBSTITUA pelos seus IDs reais do Google AdMob
export const AD_UNIT_IDS = {
  // Durante desenvolvimento, use sempre os IDs de teste
  BANNER_ANDROID: __DEV__
    ? 'ca-app-pub-3940256099942544/6300978111'   // test
    : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',  // produção
  BANNER_IOS: __DEV__
    ? 'ca-app-pub-3940256099942544/2934735716'   // test
    : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',  // produção
};

// ─── Fábrica de membro ────────────────────────────────────────
export const mkMember = (id, name, colorIdx, tasks = null) => ({
  id,
  name,
  colorIdx,
  photo: null,
  tasks: tasks || {
    manha: [...DEFAULT_TASKS.manha],
    tarde: [...DEFAULT_TASKS.tarde],
    noite: [...DEFAULT_TASKS.noite],
  },
  alarms: { manha: '07:00', tarde: '12:00', noite: '20:00' },
});

export const INITIAL_FAMILY = {
  name: 'Nossa Família',
  photo: null,
  members: [
    mkMember(1, 'Mamãe', 0),
    mkMember(2, 'Papai',  1),
    mkMember(3, 'Filho',  2, {
      manha: ['Acordar cedo', 'Escovar os dentes', 'Tomar café'],
      tarde: ['Almoçar', 'Lição de casa', 'Brincar'],
      noite: ['Jantar', 'Tomar banho', 'Ler antes de dormir'],
    }),
  ],
};
