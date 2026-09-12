# Feuille de route

Les lots 0 à 6 constituent la V1, qui sert l'usage personnel et familial.
Au delà, rien n'est planifié.

| Lot | Contenu | Livrable seul | État |
|---|---|---|---|
| 0 | Socle : dépôt propre, compose, migrations, comptes, maisons, membres, jeu de données de test | non | à faire |
| 1 | Étiquettes QR, arbre, scan vers fiche contenant, saisie manuelle | **oui** | à faire |
| 2 | Capture hors-ligne, synchronisation, pipeline vision, boîte de réception | oui | à faire |
| 3 | Recherche en langage naturel avec preuve photo | oui | à faire |
| 4 | Suggestion de rangement : « où est-ce que ça va ? » | oui | à faire |
| 5 | Re-calibrage et « plus vu depuis » | oui | à faire |
| 6 | Volet technique : tableau électrique, équipements, entretien | oui | à faire |
| 7 | V2 — Accès invité temporaire | oui | non planifié |
| 8 | Hypothèse — SaaS | non | non planifié |

## Pourquoi cet ordre

Le lot 1 est délibérément livrable **sans aucune reconnaissance d'image**. Un
inventaire manuel avec étiquettes QR est déjà utile, et il met le modèle de
données à l'épreuve avant tout investissement dans le pipeline d'images. Si le
modèle est mauvais, on l'apprend là, pour presque rien.

Le lot 5 dépend du lot 2 pour les données. Il n'a de sens qu'une fois que
plusieurs mois d'observations se sont accumulés.

## Le lot 4 mérite une explication

Il inverse le sens de l'application. Jusque là, l'utilisateur sait où il range et
l'application enregistre. Avec la suggestion, l'utilisateur tient un objet, ne
sait pas où il va, et l'application répond. Elle cesse d'être un outil qui
**enregistre** pour devenir un outil qui **aide**.

C'est ce qui décide de l'adoption par le reste de la famille. Le mode d'échec
habituel est qu'une seule personne tient l'inventaire pendant que les autres
posent les choses au hasard. Une application qui dit « les piles vont dans le
tiroir de l'entrée » ne demande plus un effort, elle en épargne un.

Il complète aussi le lot 2 : une photo prise **sans** étiquette dans le cadre n'a
aujourd'hui aucune réponse. La suggestion est cette réponse, ce qui en fait la
moitié manquante de la capture plutôt qu'un ajout.

Enfin, grâce à l'a priori sémantique (ADR 0010), il fonctionne dès le premier
jour, sans historique. C'est la seule fonctionnalité d'inférence dans ce cas.

**Ordre à trancher.** Il pourrait passer avant le lot 3 : il alimente le corpus,
donc il rend la recherche utile plus vite. L'ordre actuel donne la priorité à la
recherche parce qu'elle est la promesse d'origine du projet.

## Prochaine étape

Lot 0. Il inclut la suppression de la tentative antérieure présente dans le
dépôt (`api/`, `web/`, `indexed-house/`), dans le même commit que la mise en
place du nouveau socle, pour garder un historique lisible.

À ne pas oublier au lot 1, du fait de l'ADR 0010 : encourager des noms de
contenants signifiants au moment de l'étiquetage. « Bac 1, Bac 2, Bac 3 » rendrait
le lot 4 inopérant.
