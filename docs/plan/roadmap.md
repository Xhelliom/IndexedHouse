# Feuille de route

Les lots 0 à 6 constituent la V1, qui sert l'usage personnel et familial.
Au delà, rien n'est planifié.

| Lot | Contenu | Livrable seul | État |
|---|---|---|---|
| 0 | Socle : voir le détail ci-dessous | non | à faire |
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

Son moteur de score sert aussi la recherche, en retournant la même question
(ADR 0011) : « range-le plutôt ici » et « cherche ici en premier » sont le même
calcul. Le classement probabiliste des emplacements en devient un simple
appelant, et non un chantier séparé.

**Ordre à trancher.** Il pourrait passer avant le lot 3 : il alimente le corpus,
donc il rend la recherche utile plus vite. L'ordre actuel donne la priorité à la
recherche parce qu'elle est la promesse d'origine du projet.

## Détail du lot 0

Contenu, revu après les décisions d'infrastructure :

- Suppression de la tentative antérieure (`api/`, `web/`, `indexed-house/`), dans
  le même commit que la mise en place du socle, pour garder un historique
  lisible.
- Dépôt unique en espaces de travail : interface, serveur, paquet partagé
  (ADR 0012).
- Une seule image, deux commandes de démarrage. Manifestes Kubernetes : deux
  déploiements, un service, une entrée (ADR 0012).
- Postgres par l'opérateur CloudNativePG, avec sa sauvegarde (ADR 0012, 0020).
- Migrations Drizzle en SQL, exécutées par un travail éphémère avant le
  démarrage, en avant seulement (ADR 0014).
- Nom de domaine, entrée et certificat par défi DNS. **C'est un prérequis du lot
  0, pas une finition** : sans contexte sécurisé, ni la caméra ni le hors-ligne
  ne fonctionnent (ADR 0015).
- Comptes, maisons, adhésions avec portée et validité (ADR 0006).
- Le chemin d'accès unique à la base, et le test qui échoue si on le contourne
  (ADR 0018).
- Row Level Security posé dès la première migration, pas ajouté après.
- Jeu de données semé, type de compte, fournisseur de vision factice (ADR 0009).

Explicitement **hors** du lot 0 : pgvector (ADR 0017), toute brique de
synchronisation (ADR 0016), MinIO peut attendre le lot 2 puisque rien ne produit
encore de photo.

## À ne pas oublier plus loin

- **Lot 1** : encourager des noms de contenants signifiants au moment de
  l'étiquetage. « Bac 1, Bac 2, Bac 3 » rendrait le lot 4 inopérant (ADR 0010).
- **Avant le lot 2** : évaluer ElectricSQL et PowerSync sur le schéma réel. Tâche
  explicite, à ne pas escamoter sous la pression de coder (ADR 0016).
- **Lot 2** : plafond mensuel de dépense de vision par compte, dès que le
  pipeline existe (ADR 0020). Et vérifier l'orientation EXIF sur des fichiers
  réels de plusieurs téléphones (ADR 0019).
- **Lot 3** : trancher l'ordre avec le lot 4, et réexaminer pgvector sur des
  mesures de qualité de recherche (ADR 0017).
