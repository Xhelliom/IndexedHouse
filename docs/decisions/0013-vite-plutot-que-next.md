# ADR 0013 — Construire l'interface avec Vite plutôt qu'avec Next.js

- Statut : accepté
- Date : 2026-09-12

## Contexte

Next.js serait le choix par défaut, et c'est celui de la tentative antérieure
présente dans le dépôt. La question mérite d'être tranchée explicitement, car
elle engage toute la structure de l'interface.

## Décision

Interface construite avec Vite et React, service worker géré avec Workbox, base
locale du navigateur via Dexie. Pas de framework à rendu serveur.

## Alternatives écartées

- **Next.js.** Écarté, et l'argument est propre à ce projet, pas une préférence.
  L'application est hors-ligne d'abord : elle doit démarrer depuis le cache,
  s'afficher depuis la base locale et fonctionner sans serveur. Le rendu serveur,
  les composants serveur et les actions serveur, c'est-à-dire exactement ce qui
  justifie Next.js, sont inutilisables dans ce mode. Il faudrait désactiver le
  rendu serveur route par route et reprendre la main sur le service worker :
  payer la complexité du framework pour n'en garder aucun bénéfice.
  Son seul avantage réel serait de n'avoir qu'un déploiement, or l'ADR 0012
  en impose deux de toute façon.
- **SvelteKit.** Écarté sans grief technique : l'écosystème React est mieux pourvu
  pour ce dont ce projet a besoin, à savoir la caméra, le décodage de codes-barres
  et les enveloppes autour de la base locale.
- **Application native.** Écartée, voir ADR 0005.

## Conséquences

- Le serveur est Fastify, et sert à la fois l'API et les fichiers statiques.
- Tout le rendu est côté client. Aucun référencement à espérer, ce qui est sans
  objet pour une application privée.
- Le décodage des codes QR passe par l'API native du navigateur là où elle
  existe, avec une repli en WebAssembly ailleurs.
