# ADR 0006 — Faire du compte le tenant, et non de la maison

- Statut : accepté
- Date : 2026-09-12

## Contexte

L'usage principal est personnel et familial, en auto-hébergement, sur deux
maisons. Une ouverture ultérieure à d'autres foyers reste une hypothèse, pas un
objectif. Or le cloisonnement des données se conçoit au départ ou jamais.

Le propriétaire possède deux maisons avec, très probablement, les mêmes membres.

## Décision

Le tenant est le **compte**. Il porte les membres, les rôles et, le jour venu,
l'abonnement. Il contient N **maisons**, chacune racine de son propre arbre.

Une adhésion porte une **portée** (le compte entier, ou une seule maison) et une
**fenêtre de validité**. La famille est membre du compte sans date de fin.

Toutes les tables portent `account_id`. Le cloisonnement est doublé par du
Row Level Security PostgreSQL adossé à une variable de session.

## Alternatives écartées

- **Le tenant est la maison.** Rejetée : obligerait à inviter deux fois les mêmes
  personnes et à basculer sans cesse d'un espace à l'autre, pour le cas d'usage
  du propriétaire lui-même.
- **Mono-tenant, avec ajout du cloisonnement plus tard.** Rejetée : une migration
  de cloisonnement sur une base déjà remplie est un des chantiers les plus
  pénibles et les plus risqués qui soient.
- **Cloisonnement par filtre applicatif seul.** Rejetée : sur un projet mené par
  une seule personne, un `WHERE` oublié suffit à exposer la maison d'un autre
  foyer. Le Row Level Security est le filet qui rattrape l'erreur humaine.

## Conséquences

- Une colonne de portée sur chaque table, et une variable de session à poser à
  chaque requête.
- Le cloisonnement devient testable dès qu'existent deux comptes de test.
- Construire un SaaS reste un projet distinct, non engagé : inscription publique,
  facturation, courriels, support.
