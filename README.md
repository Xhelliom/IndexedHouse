IndexedHouse — Documentation du Projet

---

Sommaire

- [Aperçu](#aperçu)
- [Guides](#guides)
  - [Guide d’utilisation](docs/guide-utilisation.md)
  - [Guide de développement](docs/guide-developpement.md)
- [Architecture rapide](#architecture-rapide)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Démarrage rapide](#démarrage-rapide)
- [Scripts utiles](#scripts-utiles)
- [Qualité et CI](#qualité-et-ci)
- [Support](#support)

---

## Aperçu

IndexedHouse est une application web. Ce dépôt contient notamment le dossier `web/` (application, configuration TypeScript, Tailwind, etc.).

## Guides

- Guide d’utilisation: voir `docs/guide-utilisation.md`.
- Guide de développement: voir `docs/guide-developpement.md`.

## Architecture rapide

- `web/`: application front (Next.js/React) et configuration associée.
- `web/app/`: pages et mises en page.
- `web/lib/`: utilitaires partagés.
- `web/tailwind.config.ts`: configuration Tailwind.
- `web/tsconfig.json`: configuration TypeScript.

## Prérequis

- Node.js LTS (recommandé) et npm ou pnpm.
- Accès aux variables d’environnement si nécessaire (fichier `.env.local`).

## Installation

1. Cloner le dépôt
2. Installer les dépendances dans `web/`

```bash
cd web
npm install
```

## Démarrage rapide

```bash
cd web
npm run dev
```

L’application est alors accessible en local (par défaut sur `http://localhost:3000`).

## Scripts utiles

```bash
npm run dev      # démarrage en mode développement
npm run build    # build de production
npm run start    # démarrage en mode production (après build)
npm run lint     # analyse lint
```

## Qualité et CI

- Linting TypeScript et style via ESLint/Tailwind (voir `web/tailwind.config.ts`).
- Tests: à compléter selon le stack de test retenu.

## Support

En cas de question, ouvrez une issue ou contactez les mainteneurs du dépôt.


