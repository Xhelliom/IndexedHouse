# ADR 0015 — Servir l'application en HTTPS partout, y compris sur le réseau local

- Statut : accepté
- Date : 2026-09-12
- Révise la ligne « accès externe » de l'ADR 0008

## Contexte

L'appareil photo et le service worker exigent un **contexte sécurisé**. Un accès
en clair sur une adresse locale ne donne ni la caméra ni le fonctionnement
hors-ligne, c'est-à-dire précisément les deux fonctions qui font l'application.

C'est un piège que l'on découvre en général après avoir monté toute
l'infrastructure.

## Décision

Un vrai nom de domaine et un certificat valide, utilisés **aussi depuis la
maison**. Sur le cluster : entrée standard et cert-manager, certificat obtenu par
défi DNS, donc sans exposer de service au public pour la validation.

Un DNS à double horizon résout le même nom vers l'adresse interne à la maison et
vers l'extérieur ailleurs. Les envois de photos depuis la maison restent donc
locaux.

## Alternatives écartées

- **Tunnel Cloudflare seul**, retenu initialement dans l'ADR 0008. Écarté comme
  cible : l'envoi d'une photo depuis le salon sortirait sur Internet pour
  revenir. Reste une solution de démarrage acceptable si le double horizon tarde.
- **Accès en clair sur le réseau local.** Impossible, voir le contexte.
- **Certificat auto-signé.** Écarté : à installer sur chaque téléphone de la
  famille, et rejeté par certaines interfaces du navigateur malgré cela.
- **Port ouvert sur la box avec défi HTTP.** Écarté : surface d'exposition
  inutile quand le défi DNS fait le même travail sans rien ouvrir.

## Conséquences

- Un nom de domaine est un prérequis du lot 0, pas un détail de fin de parcours.
- L'environnement de développement passe par `localhost`, qui est un contexte
  sécurisé par exception, donc sans certificat à gérer.
- Tester sur un téléphone réel depuis le début, car c'est là que ces contraintes
  se manifestent.
