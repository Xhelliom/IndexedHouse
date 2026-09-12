# Documentation IndexedHouse

## Comment lire ce dossier

| Dossier | Rôle | Durée de vie |
|---|---|---|
| `architecture.md` | La vue d'ensemble du système. Point d'entrée. | vivant, réécrit quand il le faut |
| `decisions/` | Une décision structurante par fichier, datée et numérotée. | **immuable** une fois acceptée |
| `plan/` | Feuille de route, lots, état d'avancement. | vivant |
| `specs/` | Une spécification par lot, écrite **avant** le code. | vivant jusqu'à la livraison du lot |
| `futur/` | Idées non planifiées, mûries mais pas engagées. | vivant |

## Comment on travaille

1. Une idée arrive : elle va dans `futur/`, sans engagement de date.
2. Elle est retenue : elle devient un lot dans `plan/roadmap.md`.
3. Avant d'écrire la moindre ligne : une spécification dans `specs/`.
4. Un choix difficile ou irréversible apparaît : une décision dans `decisions/`.
5. Le code suit la spécification. S'il s'en écarte, on corrige la spécification.

## La règle qui tranche

Quand un besoin futur entre en conflit avec la simplicité de la version en
cours, la version en cours gagne. On n'anticipe que ce qui relève de la forme
des données, car c'est la seule chose réellement coûteuse à rattraper. Jamais un
écran, jamais un parcours, jamais une abstraction pour un usage que personne n'a.

## Différence entre une décision et l'architecture

Le document d'architecture décrit **ce qu'est** le système aujourd'hui, et il est
réécrit à mesure. Une décision décrit **pourquoi** un choix a été fait à une
date, avec ce qui a été écarté et pour quelles raisons. On ne modifie jamais une
décision acceptée : on en écrit une nouvelle qui la remplace.
