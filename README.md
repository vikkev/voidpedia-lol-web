# League Match Analyzer (Web)

React + TypeScript + Vite + shadcn/ui. Consome a API da Riot (LoL).

## Chave da API Riot (não commitar)

O front só funciona com uma chave de desenvolvimento da [Riot Developer Portal](https://developer.riotgames.com/). Duas formas de usar:

### Desenvolvimento local
- Copie `.env.example` para `.env`.
- Use `VITE_RIOT_API_KEY=sua_chave`. A chave fica no bundle do front (não use em produção).

### Produção (deploy sem expor a chave)
- Faça deploy no **Vercel** (ou outro host com serverless).
- No projeto Vercel: **Settings → Environment Variables** → crie `RIOT_API_KEY` com sua chave.
- Na build do front, defina `VITE_RIOT_API_PROXY=https://seu-dominio.vercel.app/api/riot` (variável de ambiente do Vercel).
- O front passa a chamar o proxy em `/api/riot`; a chave fica só no serverless e nunca no cliente.

O repositório já inclui o proxy em `api/riot/[[...path]].ts`. Não coloque a chave em `.env` no repo (o `.gitignore` já ignora `.env`).

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
