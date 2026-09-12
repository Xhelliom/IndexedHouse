# IndexedHouse

Indexer sans friction le contenu physique d'une maison, puis le retrouver.

Usage principal : personnel et familial, en auto-hébergement, sur deux maisons.
Deux domaines : le rangement (qu'est-ce qui est où) et la documentation technique
de la maison (tableau électrique, équipements, entretien).

**Le projet est en conception. Aucun code de la nouvelle version n'est écrit.**
Les répertoires `api/`, `web/` et `indexed-house/` sont les restes d'une
tentative antérieure abandonnée ; ils seront supprimés au démarrage du lot 0.

## Documentation

| Chemin | Contenu |
|---|---|
| [`docs/README.md`](docs/README.md) | Comment le dossier est organisé et comment on travaille |
| [`docs/architecture.md`](docs/architecture.md) | La vue d'ensemble du système |
| [`docs/plan/roadmap.md`](docs/plan/roadmap.md) | Les lots et l'avancement |
| [`docs/decisions/`](docs/decisions/) | Les décisions structurantes, datées et immuables |
| [`docs/specs/`](docs/specs/) | Une spécification par lot, écrite avant le code |
| [`docs/futur/`](docs/futur/) | Idées mûries, non engagées |

## Le principe à retenir

Ranger un objet ne doit jamais coûter plus d'un geste et d'une photo. Toute
fonctionnalité qui ajoute une étape au moment du rangement est reportée ou
supprimée.
