#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════╗
# ║   ROTINA DA FAMÍLIA — BUILD ANDROID                     ║
# ║   Uso: bash scripts/build.sh [preview|production]       ║
# ╚══════════════════════════════════════════════════════════╝
set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✅ $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; exit 1; }
step() { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n${YELLOW}▶ $1${NC}"; }

PROFILE="${1:-preview}"
[ "$PROFILE" != "preview" ] && [ "$PROFILE" != "production" ] && \
  fail "Uso: bash scripts/build.sh [preview|production]"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗"
if [ "$PROFILE" = "preview" ]; then
echo -e "║  🔨  Build PREVIEW (APK para teste)      ║"
else
echo -e "║  🚀  Build PRODUÇÃO (AAB para Play Store) ║"
fi
echo -e "╚══════════════════════════════════════════╝${NC}"
echo ""

# ── Verificar login ────────────────────────────────────────────
step "Verificando autenticação"
eas whoami || fail "Não logado. Rode: eas login"
ok "Autenticado"

# ── Bump version ───────────────────────────────────────────────
if [ "$PROFILE" = "production" ]; then
  step "Atualizando versionCode"
  # Lê versionCode atual e incrementa
  CURRENT=$(node -e "const a=require('./app.json'); console.log(a.expo.android.versionCode)")
  NEW=$((CURRENT + 1))
  # Atualiza app.json
  node -e "
    const fs = require('fs');
    const app = JSON.parse(fs.readFileSync('app.json','utf8'));
    app.expo.android.versionCode = ${NEW};
    fs.writeFileSync('app.json', JSON.stringify(app, null, 2));
  "
  info "versionCode: $CURRENT → $NEW"
  ok "Version bumped"
fi

# ── Iniciar build na nuvem EAS ────────────────────────────────
step "Iniciando build na nuvem EAS (~10 minutos)"
info "O build roda na nuvem Expo — você não precisa do Android Studio!"
echo ""

if [ "$PROFILE" = "preview" ]; then
  info "Gerando APK para instalar diretamente no celular..."
  eas build --platform android --profile preview --non-interactive
else
  info "Gerando AAB para publicar na Play Store..."
  eas build --platform android --profile production --non-interactive
fi

# ── Resultado ─────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗"
echo -e "║         ✅  BUILD CONCLUÍDO!             ║"
echo -e "╚══════════════════════════════════════════╝${NC}"
echo ""

if [ "$PROFILE" = "preview" ]; then
  echo "  📲 Baixe o APK no link acima e instale no celular"
  echo "     (Ative 'Fontes desconhecidas' nas configurações Android)"
else
  echo "  🚀 Próximo passo — publicar na Play Store:"
  echo "     bash scripts/deploy.sh"
fi
echo ""
