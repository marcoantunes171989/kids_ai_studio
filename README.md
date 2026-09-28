# Kids AI Studio

Produtora própria de vídeos infantis educativos — desenvolvimento local, motor de animação 2D
(SVG/Canvas), renderização real em MP4 via FFmpeg e preparação para hospedagem futura do painel
na Vercel.

Esta primeira versão não possui áudio, falas, narração ou música.

## Estrutura

```
apps/backend    API Node.js + TypeScript, banco SQLite (node:sqlite), motor de exportação MP4
apps/frontend   Painel React + TypeScript + Vite
packages/engine Motor de animação 2D compartilhado (personagens, cenários, timeline, render SVG)
tools/ffmpeg    Binário local do FFmpeg (não versionado)
data/           Banco de dados, projetos, personagens importados, renderizações e vídeos (não versionado)
scripts/        Scripts PowerShell de instalação, execução, build e testes
```

## Requisitos

- Node.js 20+ (usa o módulo nativo `node:sqlite`, sem dependências nativas para compilar)
- FFmpeg (baixado automaticamente em `tools/ffmpeg` — veja `scripts/install.ps1`)

## Uso rápido

```powershell
scripts\install.ps1     # instala dependências
scripts\start-all.ps1   # inicia backend (4000) e frontend (5173) em uma janela cada
```

Acesse **http://localhost:5173** no navegador.

Outros comandos:

```powershell
scripts\test.ps1        # roda os testes automatizados
scripts\build.ps1       # typecheck + build de produção
scripts\diagnose.ps1    # diagnostica Node, npm, Git, FFmpeg e espaço em disco
```

Episódio demonstrativo ("O leãozinho aprende a compartilhar"):

```powershell
npm run seed:demo    # grava o projeto demonstrativo no banco
npm run render:demo  # renderiza data/videos/demo_leaozinho_aprende_a_compartilhar.mp4 (1080p/30fps)
```

## Repositório

Repositório oficial: https://github.com/marcoantunes171989/kids_ai_studio (branch `main`).
Vídeos, banco de dados e arquivos temporários ficam fora do controle de versão (`data/`, `tools/`).

## Preparação para Vercel

O frontend é compatível com hospedagem estática/SSR na Vercel. O motor de animação e a
renderização via FFmpeg permanecem no Windows Server local — nenhum deploy foi realizado nesta
primeira etapa. Veja a página **Configurações** no painel para detalhes da arquitetura prevista
(autenticação, HTTPS, API protegida, fila de renderização).
