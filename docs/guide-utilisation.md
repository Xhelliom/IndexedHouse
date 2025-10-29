# Guide d’utilisation

---

Sommaire

- [Introduction](#introduction)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Navigation et fonctionnalités](#navigation-et-fonctionnalités)
- [Commandes utiles](#commandes-utiles)
- [FAQ](#faq)
- [Dépannage](#dépannage)

---

## Introduction

Ce guide explique comment installer, configurer et utiliser l’application.

## Prérequis

- Node.js LTS et npm (ou un environnement déjà déployé par votre équipe)

## Installation

```bash
cd web
npm install
```

## Configuration

- Variables d’environnement: créer un fichier `web/.env.local` si nécessaire, par exemple:

```bash
# Exemple — à adapter selon vos besoins
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## Démarrage

En développement:

```bash
npm run dev
```

En production locale (après build):

```bash
npm run build
npm run start
```

## Navigation et fonctionnalités

- Accédez à l’application via `http://localhost:3000`
- Parcourez l’interface principale (sections et pages selon votre usage)

## Commandes utiles

```bash
npm run dev      # démarrage en mode développement
npm run build    # build de production
npm run start    # exécution en mode production
npm run lint     # analyse de code
```

## FAQ

- L’application ne démarre pas?
  - Vérifiez Node.js et l’installation des dépendances.
  - Vérifiez les variables d’environnement.

- Les styles ne s’appliquent pas?
  - Assurez-vous que Tailwind est bien configuré et que `web/app/globals.css` est importé par `web/app/layout.tsx`.

## Dépannage

- Réinstaller les dépendances:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

- Nettoyer le cache de Next.js (si applicable):

```bash
rm -rf .next
```

Si le problème persiste, ouvrez une issue avec un extrait de logs et les étapes de reproduction.


