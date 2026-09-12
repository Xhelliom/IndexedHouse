# ADR 0018 — N'autoriser qu'un seul chemin d'accès à la base, et le vérifier par un test

- Statut : accepté
- Date : 2026-09-12

## Contexte

Le cloisonnement entre comptes repose sur du Row Level Security piloté par une
variable posée dans la transaction (ADR 0006). Il suffit d'une requête émise hors
transaction, ou sans la variable, pour que le cloisonnement ne s'applique pas.

L'échec est **silencieux** : la requête réussit et renvoie trop de lignes.

## Décision

Une fonction unique ouvre la transaction, pose le compte courant, et exécute le
travail. Aucun autre accès à la base n'est permis.

Un test échoue si le client brut est utilisé ailleurs dans le code. Et, grâce aux
comptes de bac à sable (ADR 0009), un test vérifie route par route que le compte
A ne voit rien du compte B.

## Alternatives écartées

- **La discipline seule.** Écartée : « on fera attention » n'est pas une mesure de
  sécurité, surtout sur un projet mené par une seule personne sur plusieurs
  années avec des interruptions.
- **Filtrage applicatif sans Row Level Security.** Écarté, voir ADR 0006.
- **Row Level Security sans garde-fou applicatif.** Écarté : protège la base mais
  n'empêche pas d'oublier de poser la variable, ce qui est le mode de défaillance
  réel.

## Conséquences

- Un peu de cérémonie à chaque accès, assumée.
- Le cloisonnement devient une propriété vérifiée à chaque exécution de la suite
  de tests, et non une intention.
- Le worker de vision passe par le même chemin, avec le compte propriétaire de
  l'observation traitée.
