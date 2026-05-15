# ⚡ Automação — Rotina da Família no Google Play

## Como funciona

```
Você faz git push  →  GitHub Actions roda automaticamente  →  App publicado na Play Store
```

Ou manualmente, em qualquer terminal:
```bash
bash scripts/deploy.sh internal    # envia para testadores internos (instantâneo)
bash scripts/deploy.sh beta        # teste aberto
bash scripts/deploy.sh production  # publica para o mundo
```

---

## CONFIGURAÇÃO ÚNICA (fazer só 1 vez)

### Passo 1 — Criar conta de serviço no Google Play

1. Acesse https://play.google.com/console
2. Vá em **Configuração → Acesso à API**
3. Clique em **"Criar conta de serviço"**
4. Clique no link do **Google Cloud Console** que aparecer
5. Crie a conta com qualquer nome (ex: `play-deploy`)
6. Clique em **"Chaves" → "Adicionar chave" → "Criar nova chave"**
7. Escolha **JSON** e baixe o arquivo
8. Renomeie para `google-service-account.json`

De volta no Play Console:
9. Clique em **"Conceder acesso"** na conta de serviço criada
10. Permissão: **Lançamentos → Gerenciar** ✅

---

### Passo 2 — Criar conta Firebase (para google-services.json)

1. Acesse https://console.firebase.google.com
2. Crie um projeto (ou use existente)
3. Adicione app Android:
   - Package: `com.seuapp.familyroutine`
4. Baixe o `google-services.json`
5. Coloque na raiz do projeto

---

### Passo 3 — Configurar GitHub Secrets

1. Acesse seu repositório no GitHub
2. Vá em **Settings → Secrets and variables → Actions**
3. Crie estes 3 secrets clicando em **"New repository secret"**:

| Secret name              | Valor                                              |
|--------------------------|----------------------------------------------------|
| `EXPO_TOKEN`             | Token da sua conta Expo (veja abaixo)              |
| `GOOGLE_SERVICES_JSON`   | Conteúdo do arquivo google-services.json           |
| `GOOGLE_SERVICE_ACCOUNT` | Conteúdo do arquivo google-service-account.json    |

#### Como obter o EXPO_TOKEN:
```bash
# No terminal, após eas login:
eas whoami          # confirma que está logado
# Acesse https://expo.dev/settings/access-tokens
# Clique em "Create Token"
# Copie e cole como secret EXPO_TOKEN
```

#### Como copiar o conteúdo dos arquivos JSON:
```bash
cat google-services.json        # copie tudo e cole no secret
cat google-service-account.json # copie tudo e cole no secret
```

---

### Passo 4 — Criar app na Play Console (1x)

Antes do primeiro deploy, crie o app manualmente:

1. https://play.google.com/console → **"Criar app"**
2. Preencha: nome, idioma, tipo, gratuito
3. Aceite as políticas
4. Pronto — o deploy automático cuida do resto

---

## USANDO A AUTOMAÇÃO

### Opção A — Deploy automático (Git push)

```bash
# Qualquer push na branch main dispara o deploy
git add .
git commit -m "nova funcionalidade"
git push origin main
# ↑ isso já faz o deploy automático para 'internal' track
```

### Opção B — Deploy manual pelo GitHub

1. Acesse seu repositório no GitHub
2. Vá em **Actions → 🚀 Deploy — Google Play Store**
3. Clique em **"Run workflow"**
4. Escolha o track:
   - `internal` — testadores internos (disponível em minutos)
   - `beta` — teste aberto (disponível em horas)
   - `production` — loja pública (revisão Google 1-3 dias)
5. Clique em **"Run workflow"** verde

### Opção C — Terminal local

```bash
# Setup inicial (só 1x)
bash scripts/setup.sh

# Build de teste (APK para instalar no celular)
bash scripts/build.sh preview

# Deploy para Play Store
bash scripts/deploy.sh internal    # teste interno
bash scripts/deploy.sh beta        # beta pública
bash scripts/deploy.sh production  # produção
```

---

## Fluxo recomendado para cada atualização

```
1. Desenvolve a mudança
2. git push → deploy automático para 'internal'
3. Testa no celular (você como testador interno)
4. Se OK → GitHub Actions → Run workflow → 'production'
5. Aguarda revisão do Google (1-3 dias)
6. ✅ Atualização publicada para todos!
```

---

## Visualizar progresso do deploy

Após fazer push ou rodar o workflow:

1. Acesse seu repositório no GitHub
2. Clique na aba **"Actions"**
3. Clique no workflow em execução
4. Acompanhe cada passo em tempo real

---

## Troubleshooting

### "Build failed: versionCode already exists"
```bash
# Incremente manualmente o versionCode no app.json
# "versionCode": 2  →  "versionCode": 3
```

### "Unauthorized: service account"
- Confirme que a conta de serviço tem permissão de **Gerenciar lançamentos**
- Verifique se o secret `GOOGLE_SERVICE_ACCOUNT` está correto

### "EXPO_TOKEN invalid"
```bash
eas logout
eas login
# Gere novo token em https://expo.dev/settings/access-tokens
```

### Build demora muito
- Builds na nuvem EAS levam 10-20 minutos — é normal
- O GitHub Actions aguarda automaticamente (timeout: 60 min)
