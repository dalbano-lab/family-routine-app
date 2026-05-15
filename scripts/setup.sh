#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════╗
# ║   ROTINA DA FAMÍLIA — SETUP INICIAL (rode 1x apenas)    ║
# ╚══════════════════════════════════════════════════════════╝
set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✅ $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; exit 1; }
step() { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n${YELLOW}▶ $1${NC}"; }

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗"
echo -e "║  🏠  Rotina da Família — Setup Inicial   ║"
echo -e "╚══════════════════════════════════════════╝${NC}"
echo ""

# ── 1. Checar Node.js ────────────────────────────────────────
step "Verificando Node.js"
if ! command -v node &>/dev/null; then
  fail "Node.js não encontrado. Instale em https://nodejs.org (versão LTS)"
fi
NODE_VER=$(node -v)
info "Node.js $NODE_VER encontrado"
[[ "${NODE_VER:1:2}" -lt 18 ]] && fail "Node.js 18+ necessário. Versão atual: $NODE_VER"
ok "Node.js OK"

# ── 2. Instalar EAS CLI ───────────────────────────────────────
step "Instalando EAS CLI"
npm install -g eas-cli expo-cli 2>/dev/null || true
ok "EAS CLI instalado"

# ── 3. Instalar dependências do projeto ───────────────────────
step "Instalando dependências do projeto"
npm install
ok "Dependências instaladas"

# ── 4. Login no Expo ─────────────────────────────────────────
step "Login na conta Expo"
info "Você precisará de uma conta em https://expo.dev (gratuito)"
echo ""
eas whoami 2>/dev/null && ok "Já logado no Expo" || eas login

# ── 5. Inicializar projeto EAS ────────────────────────────────
step "Inicializando projeto EAS"
if grep -q "SEU-PROJECT-ID-AQUI" app.json 2>/dev/null; then
  info "Vinculando projeto ao EAS..."
  eas init --non-interactive || eas init
  ok "Projeto EAS vinculado"
else
  ok "Projeto já vinculado ao EAS"
fi

# ── 6. Checar google-services.json ───────────────────────────
step "Verificando google-services.json"
if [ ! -f "google-services.json" ]; then
  warn "google-services.json não encontrado"
  echo ""
  echo "  Passos para obter:"
  echo "  1. Acesse: https://console.firebase.google.com"
  echo "  2. Crie um projeto (ou use existente)"
  echo "  3. Adicione app Android com o package: com.seuapp.familyroutine"
  echo "  4. Baixe o google-services.json"
  echo "  5. Coloque na raiz do projeto"
  echo ""
  read -p "Pressione ENTER quando tiver colocado o arquivo... "
  [ ! -f "google-services.json" ] && fail "google-services.json ainda não encontrado"
fi
ok "google-services.json encontrado"

# ── 7. Checar IDs do AdMob ────────────────────────────────────
step "Verificando IDs do AdMob"
if grep -q "XXXXXXXXXXXXXXXX" src/constants.js; then
  warn "IDs de AdMob ainda são placeholder"
  echo ""
  echo "  Edite src/constants.js e substitua:"
  echo "    BANNER_ANDROID: 'ca-app-pub-XXXX/XXXX'"
  echo ""
  echo "  Por enquanto, IDs de TESTE serão usados (funciona para desenvolvimento)"
  echo ""
fi

# ── 8. Checar assets ─────────────────────────────────────────
step "Verificando assets (ícone e splash)"
MISSING=()
[ ! -f "assets/icon.png" ]          && MISSING+=("assets/icon.png (1024×1024)")
[ ! -f "assets/adaptive-icon.png" ] && MISSING+=("assets/adaptive-icon.png (1024×1024)")
[ ! -f "assets/splash.png" ]        && MISSING+=("assets/splash.png (1284×2778)")

if [ ${#MISSING[@]} -gt 0 ]; then
  warn "Assets faltando:"
  for f in "${MISSING[@]}"; do echo "  • $f"; done
  echo ""
  echo "  💡 Crie em https://canva.com"
  echo "     Fundo: #FF6B6B | Ícone: emoji 🏠 grande no centro"
  echo ""
  echo "  Por enquanto, usando assets padrão do Expo..."
  mkdir -p assets
fi
ok "Assets verificados"

# ── Resumo ────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗"
echo -e "║         ✅  SETUP CONCLUÍDO!             ║"
echo -e "╚══════════════════════════════════════════╝${NC}"
echo ""
echo "  Próximos passos:"
echo ""
echo -e "  ${YELLOW}Testar no celular:${NC}"
echo "    npx expo start"
echo "    (escaneie o QR code com Expo Go)"
echo ""
echo -e "  ${YELLOW}Build de teste (APK):${NC}"
echo "    bash scripts/build.sh preview"
echo ""
echo -e "  ${YELLOW}Publicar na Play Store:${NC}"
echo "    bash scripts/deploy.sh"
echo ""
