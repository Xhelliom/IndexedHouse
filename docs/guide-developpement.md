# Guide de développement

---

Sommaire

- [Vue d’ensemble](#vue-densemble)
- [Stack et dossiers clés](#stack-et-dossiers-clés)
- [Mise en place de l’environnement](#mise-en-place-de-lenvironnement)
- [Lancer le projet en local](#lancer-le-projet-en-local)
- [Conventions de code](#conventions-de-code)
- [Qualité: lint, formatage, tests](#qualité-lint-formatage-tests)
- [Workflow Git](#workflow-git)
- [Configuration et secrets](#configuration-et-secrets)
- [Build, run et déploiement](#build-run-et-déploiement)
- [Check-list de revue de code](#check-list-de-revue-de-code)

---

## Vue d’ensemble

Ce guide décrit comment développer, tester et contribuer au projet. Il complète le README et le guide d’utilisation.

## Stack et dossiers clés

- Frontend: Next.js/React (TypeScript)
- Style: Tailwind CSS
- Dossiers importants:
  - `web/app/`: pages, layouts
  - `web/lib/`: utilitaires partagés
  - `web/tailwind.config.ts`: configuration Tailwind
  - `web/tsconfig.json`: configuration TypeScript

## Mise en place de l’environnement

1. Installer Node.js LTS et npm (ou pnpm)
2. Installer les dépendances:

```bash
cd web
npm install
```

3. Variables d’environnement (optionnel): créer `web/.env.local` si nécessaire.

## Lancer le projet en local

```bash
cd web
npm run dev
```

Application disponible par défaut sur `http://localhost:3000`.

## Conventions de code

- TypeScript strict lorsque possible
- Nommage explicite et lisible (éviter les abréviations)
- Préférer des fonctions pures et des early-returns
- Commentaires: uniquement pour les cas non évidents et décisions d’architecture
- Style utilitaire via Tailwind (voir `web/tailwind.config.ts`)

## Qualité: lint, formatage, tests

- Lint:

```bash
npm run lint
```

- Formatage: respecter la configuration du projet (Prettier/ESLint). Si un script de formatage est ajouté, l’exécuter avant commit.
- Tests: si une stack de tests est ajoutée (Jest/Playwright/Cypress), placer les tests dans un dossier cohérent (`__tests__` ou `tests/`).

## Workflow Git

- Branches:
  - `master` (ou `main`): stable
  - `feature/xxx`, `fix/xxx`: travail en cours
- Commits: messages clairs (ex: Conventional Commits si adopté)
- Pull Requests:
  - Petites PRs, description claire, capture d’écran si UI
  - Lint/Tests verts avant revue

## Configuration et secrets

- Ne pas committer de secrets
- Utiliser `.env.local` en dev, variables d’environnement en CI/CD et prod

## Build, run et déploiement

```bash
npm run build
npm run start
```

Le déploiement dépend de l’infrastructure (à documenter si nécessaire).

## Check-list de revue de code

- Le code compile et passe le lint
- Nommage clair, fonctions courtes et testables
- Pas de secrets, pas de logs sensibles
- UI accessible et responsive si applicable


