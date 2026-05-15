#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════╗
# ║   ROTINA DA FAMÍLIA — DEPLOY GOOGLE PLAY                ║
# ║   Uso: bash scripts/deploy.sh [internal|beta|production]║
# ╚══════════════════════════════════════════════════════════╝
set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✅ $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; exit 1; }
step() { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n${YELLOW}▶ $1${NC}"; }

TRACK="${1:-internal}"   # internal | beta | production
VALID_TRACKS=("internal" "beta" "production")
[[ ! " ${VALID_TRACKS[*]} " =~ " ${TRACK} " ]] && \
  fail "Track inválido. Use: internal | beta | production"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗"
echo -e "║  🚀  Deploy → Google Play [$TRACK]       ║"
echo -e "╚══════════════════════════════════════════╝${NC}"
echo ""

# ── Verificar google-service-account.json ──────────────────────
step "Verificando credenciais da Play Store"
if [ ! -f "google-service-account.json" ]; then
  fail "google-service-account.json não encontrado!

  Como obter:
  1. Acesse: https://play.google.com/console
  2. Configuração → Acesso à API → Criar conta de serviço
  3. No Google Cloud Console: crie chave JSON
  4. Baixe e renomeie para: google-service-account.json
  5. Coloque na raiz do projeto
  
  IMPORTANTE: Não commite este arquivo no git! (já está no .gitignore)"
fi
ok "Credenciais encontradas"

# ── Verificar se tem build recente ────────────────────────────
step "Verificando último build de produção"
LAST_BUILD=$(eas build:list --platform android --status finished --limit 1 --json 2>/dev/null | \
  node -e "try{const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(d[0]?.id||'')}catch(e){console.log('')}" || echo "")

if [ -z "$LAST_BUILD" ]; then
  warn "Nenhum build encontrado. Gerando novo build primeiro..."
  bash scripts/build.sh production
else
  info "Build recente encontrado: $LAST_BUILD"
  read -p "  Usar este build? (s/N): " USE_LAST
  if [[ ! "$USE_LAST" =~ ^[sS]$ ]]; then
    info "Gerando novo build..."
    bash scripts/build.sh production
  fi
fi
ok "Build pronto"

# ── Submit para a Play Store ──────────────────────────────────
step "Enviando para Google Play ($TRACK)"
info "Isso pode levar alguns minutos..."
echo ""

eas submit \
  --platform android \
  --track "$TRACK" \
  --non-interactive

# ── Resultado ─────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════╗"
echo -e "║    🎉  ENVIADO PARA O GOOGLE PLAY!           ║"
echo -e "╚═══════════════════════════════════════════════╝${NC}"
echo ""

case "$TRACK" in
  "internal")
    echo "  📱 Track: Teste interno"
    echo "     Acesse a Play Console para adicionar testadores"
    echo "     Disponível em: ~minutos"
    ;;
  "beta")
    echo "  🔬 Track: Teste aberto (beta)"
    echo "     Qualquer usuário pode entrar"
    echo "     Disponível em: ~horas"
    ;;
  "production")
    echo "  🌍 Track: Produção"
    echo "     Revisão do Google em 1-3 dias"
    echo "     Disponível em: https://play.google.com"
    ;;
esac

echo ""
echo -e "  ${BLUE}Play Console:${NC} https://play.google.com/console"
echo ""
