# Feuille de route

Les lots 0 à 5 constituent la V1, qui sert l'usage personnel et familial.
Au delà, rien n'est planifié.

| Lot | Contenu | Livrable seul | État |
|---|---|---|---|
| 0 | Socle : dépôt propre, compose, migrations, comptes, maisons, membres, jeu de données de test | non | à faire |
| 1 | Étiquettes QR, arbre, scan vers fiche contenant, saisie manuelle | **oui** | à faire |
| 2 | Capture hors-ligne, synchronisation, pipeline vision, boîte de réception | oui | à faire |
| 3 | Recherche en langage naturel avec preuve photo | oui | à faire |
| 4 | Re-calibrage et « plus vu depuis » | oui | à faire |
| 5 | Volet technique : tableau électrique, équipements, entretien | oui | à faire |
| 6 | V2 — Accès invité temporaire | oui | non planifié |
| 7 | Hypothèse — SaaS | non | non planifié |

## Pourquoi cet ordre

Le lot 1 est délibérément livrable **sans aucune reconnaissance d'image**. Un
inventaire manuel avec étiquettes QR est déjà utile, et il met le modèle de
données à l'épreuve avant tout investissement dans le pipeline d'images. Si le
modèle est mauvais, on l'apprend là, pour presque rien.

Le lot 4 dépend du lot 2 pour les données et du lot 3 pour être visible. Il n'a
de sens qu'une fois que plusieurs mois d'observations se sont accumulés.

## Prochaine étape

Lot 0. Il inclut la suppression de la tentative antérieure présente dans le
dépôt (`api/`, `web/`, `indexed-house/`), dans le même commit que la mise en
place du nouveau socle, pour garder un historique lisible.
