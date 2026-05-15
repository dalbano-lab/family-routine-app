# 🚀 Guia Completo — Publicar Rotina da Família nas Stores

## Visão geral do processo
```
Criar contas → Configurar AdMob → Instalar ferramentas → Testar → Build → Publicar
     1h              30min             30min             2h       1h       1-3 dias
```

---

## PASSO 1 — Criar contas de desenvolvedor

### 🤖 Google Play Console (Android)
1. Acesse: https://play.google.com/console
2. Clique em **"Criar conta de desenvolvedor"**
3. Pague a taxa única de **US$ 25** (~R$ 130)
4. Preencha dados pessoais e aceite os termos
5. ✅ Conta ativa em instantes

### 🍎 Apple Developer Program (iOS)
1. Acesse: https://developer.apple.com/programs/
2. Clique em **"Enroll"**
3. Pague a anuidade de **US$ 99/ano** (~R$ 510)
4. Aguarde aprovação: **2-5 dias úteis**
5. ✅ Conta ativa após aprovação

---

## PASSO 2 — Configurar Google AdMob

1. Acesse: https://admob.google.com
2. Crie uma conta (gratuito)
3. Clique em **"Adicionar app"**
4. Adicione o app Android:
   - Plataforma: Android
   - Publicado na Play Store? **Não ainda**
   - Nome do app: **Rotina da Família**
5. Copie o **App ID** (formato: `ca-app-pub-XXXX~XXXX`)
6. Crie um **Ad Unit** do tipo **Banner**
7. Copie o **Ad Unit ID** do banner
8. Repita os passos 4-7 para iOS

### Substituir nos arquivos:
```
app.json:
  "GADApplicationIdentifier": "SEU_APP_ID_IOS"
  "androidAppId": "SEU_APP_ID_ANDROID"
  "iosAppId": "SEU_APP_ID_IOS"

src/constants.js:
  BANNER_ANDROID: 'SEU_AD_UNIT_ID_ANDROID'
  BANNER_IOS:     'SEU_AD_UNIT_ID_IOS'
```

---

## PASSO 3 — Instalar ferramentas

### Node.js e npm
```bash
# Acesse https://nodejs.org e instale a versão LTS
node --version   # deve mostrar v18+
npm --version
```

### Expo CLI e EAS CLI
```bash
npm install -g expo-cli eas-cli
```

### Instalar dependências do projeto
```bash
cd FamilyRoutineApp
npm install
```

---

## PASSO 4 — Testar no celular (sem cabo!)

```bash
# Instale o app "Expo Go" no seu celular (gratuito na Play Store / App Store)
npx expo start

# Escaneie o QR code com o Expo Go
# O app abre no seu celular em segundos! 📱
```

> ⚠️ AdMob NÃO funciona no Expo Go — use os IDs de teste em `src/constants.js`
> durante o desenvolvimento (já configurado por padrão com `__DEV__`).

---

## PASSO 5 — Configurar EAS (serviço de build da Expo)

```bash
# Login na conta Expo (crie em expo.dev se não tiver)
eas login

# Criar projeto
eas init

# Configurar builds
eas build:configure
```

Isso cria o arquivo `eas.json`. Use esta configuração:
```json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "preview": {
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "aab" },
      "ios":     {}
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## PASSO 6 — Criar ícone e splash screen

Crie as imagens abaixo e coloque na pasta `assets/`:

| Arquivo               | Tamanho  | Descrição              |
|-----------------------|----------|------------------------|
| `icon.png`            | 1024×1024| Ícone do app           |
| `adaptive-icon.png`   | 1024×1024| Ícone Android adaptável|
| `splash.png`          | 1284×2778| Tela de carregamento   |

> 💡 Use https://canva.com para criar gratuitamente
> Dica: fundo laranja (#FF6B6B) com o emoji 🏠 grande no centro

---

## PASSO 7 — Build para Android (APK de teste)

```bash
# Build APK para testar (gratuito)
eas build --platform android --profile preview

# Aguarde ~10 minutos
# Baixe o .apk e instale no celular para teste final
```

---

## PASSO 8 — Build de produção

```bash
# Android (.aab para Play Store)
eas build --platform android --profile production

# iOS (.ipa para App Store)  ← precisa de conta Apple ativa
eas build --platform ios --profile production
```

---

## PASSO 9 — Publicar no Google Play

1. Acesse https://play.google.com/console
2. Clique em **"Criar app"**
3. Preencha:
   - Nome: **Rotina da Família**
   - Idioma padrão: Português (Brasil)
   - App ou Jogo: **App**
   - Gratuito ou pago: **Gratuito** (com ads)
4. Vá em **Produção → Criar nova versão**
5. Faça upload do arquivo `.aab` gerado pelo EAS
6. Escreva as notas da versão
7. Adicione screenshots (mínimo 2, recomendado 4-8)
8. Preencha a ficha do app (descrição, categoria, etc.)
9. Clique em **"Enviar para revisão"**
10. ✅ Aprovação em **1-3 dias**

### Texto sugerido para a Play Store:
```
📱 Rotina da Família — Despertador & Checklists

Organize a rotina de toda a família de forma divertida!
Cada integrante tem seu próprio checklist de tarefas para 
manhã, tarde e noite, com alarmes personalizados.

✅ Cada tarefa concluída = 1 ponto
🏆 Ranking para incentivar a família
📸 Foto personalizada para cada integrante
⭐ Sistema de níveis: Iniciante → Dedicado → Campeão → Lendário
⏰ Alarmes por período do dia

Perfeito para famílias com crianças!
```

---

## PASSO 10 — Publicar na App Store (iOS)

```bash
# Submeter automaticamente via EAS
eas submit --platform ios
```

1. Acesse https://appstoreconnect.apple.com
2. Crie o app em **"Meus Apps → +"**
3. Preencha metadados (mesma descrição acima)
4. Adicione screenshots para iPhone
5. Submeta para revisão
6. ✅ Aprovação em **1-7 dias**

---

## 📁 Estrutura final do projeto

```
FamilyRoutineApp/
├── App.js                    ← Entrada principal + navegação
├── app.json                  ← Config Expo (IDs AdMob aqui)
├── package.json              ← Dependências
├── babel.config.js
├── eas.json                  ← Config de build (gerado no passo 5)
├── assets/
│   ├── icon.png              ← Ícone 1024×1024
│   ├── adaptive-icon.png     ← Ícone Android
│   └── splash.png            ← Splash screen
└── src/
    ├── AppContext.js          ← Estado global + persistência
    ├── constants.js           ← Cores, tarefas, ranks, IDs AdMob
    ├── screens/
    │   ├── HomeScreen.js      ← Tela inicial (membros)
    │   ├── TasksScreen.js     ← Checklist de tarefas
    │   └── SettingsScreen.js  ← Config família + editar membros
    └── components/
        ├── AdBanner.js        ← Banner AdMob
        └── RankingModal.js    ← Ranking da família
```

---

## 💰 Custos totais

| Item                      | Valor       | Frequência    |
|---------------------------|-------------|---------------|
| Google Play Console       | US$ 25      | Taxa única    |
| Apple Developer Program   | US$ 99      | Anual         |
| EAS Build (Expo)          | Gratuito*   | —             |
| AdMob                     | Gratuito    | —             |
| **Total inicial (Android)**| **~R$ 130** | —            |
| **Total inicial (iOS+Android)** | **~R$ 640** | —        |

*EAS Free: 30 builds/mês grátis — suficiente para começar.

---

## 🆘 Precisa de ajuda?

- Documentação Expo: https://docs.expo.dev
- Documentação EAS: https://docs.expo.dev/eas/
- AdMob React Native: https://rnfirebase.io/admob/usage
- Fórum Expo: https://forums.expo.dev
