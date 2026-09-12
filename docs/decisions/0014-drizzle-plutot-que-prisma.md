# ADR 0014 — Accéder à la base avec Drizzle plutôt qu'avec Prisma

- Statut : accepté
- Date : 2026-09-12

## Contexte

Le schéma repose sur des fonctions propres à PostgreSQL : `jsonb`, chemin
matérialisé ou `ltree`, recherche plein texte en configuration française, index
partiels, et surtout **Row Level Security piloté par une variable de session**
(ADR 0006).

## Décision

Drizzle, avec des migrations en fichiers SQL versionnés.

## Alternatives écartées

- **Prisma**, l'outil de la tentative antérieure. Écarté : obligerait à écrire du
  SQL brut pour une bonne moitié de ce schéma, devenant un intermédiaire
  encombrant plutôt qu'une aide. Le point décisif est le cloisonnement : il repose
  sur un `SET LOCAL` dans la transaction, que la gestion de connexions de Prisma
  rend malaisé.
- **SQL brut avec un simple pilote.** Écarté : on perd la vérification de types
  entre le schéma et les requêtes, qui est l'essentiel du bénéfice sur un projet
  mené par une seule personne.

## Conséquences

- Les migrations sont des fichiers SQL éditables, ce qui permet de créer une
  extension, un index exotique ou une politique de sécurité sans contorsion.
- Les types du schéma sont dérivés du code, et partagés avec le client via le
  paquet commun.
- Il faut se discipliner sur un chemin d'accès unique à la base, voir ADR 0018.
