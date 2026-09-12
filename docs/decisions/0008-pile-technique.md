# ADR 0008 — Arrêter la pile technique

- Statut : accepté
- Date : 2026-09-12

## Contexte

Projet mené par une seule personne, auto-hébergé, sur du matériel domestique.
Chaque service supplémentaire est un service à installer, surveiller, sauvegarder
et réparer un dimanche soir.

## Décision

| Élément | Choix |
|---|---|
| Interface | Application web installable, React et Vite, Workbox, Dexie |
| API | Node et Fastify, séparée de l'interface |
| Base | PostgreSQL, avec pgvector et Row Level Security |
| File d'attente | pg-boss, adossé à la même base |
| Stockage photo | MinIO, API compatible S3 |
| Vision | API Claude, derrière une interface remplaçable |
| Accès externe | tunnel Cloudflare |

## Alternatives écartées

- **Redis et BullMQ** (le choix de la tentative antérieure). Rejetés : un service
  de plus pour une charge domestique que PostgreSQL absorbe sans effort.
- **Une base vectorielle dédiée.** Rejetée : pgvector suffit très largement à
  cette échelle, et évite une seconde source de vérité.
- **Next.js pour tout.** Rejeté : la gestion fine du service worker et du cache
  hors-ligne y est plus contrainte, alors que c'est le cœur du problème.
- **Application native.** Rejetée, voir ADR 0005.
- **Modèle de vision local.** Rejeté pour l'instant : sans carte graphique
  dédiée, lent et nettement moins bon en français. L'interface laisse la porte
  ouverte.
- **Port ouvert sur la box avec certificat.** Rejeté : surface d'exposition
  inutile quand un tunnel fait le même travail sans port ouvert.

## Conséquences

- Une seule base porte les données, les vecteurs, la file et le cloisonnement.
- Le fournisseur de vision est interchangeable, ce qui sert aussi à le bouchonner
  en développement.
- Le stockage est migrable vers un service S3 sans toucher au code.
