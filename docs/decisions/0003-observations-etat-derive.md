# ADR 0003 — Stocker des observations et dériver l'état courant

- Statut : accepté
- Date : 2026-09-12

## Contexte

Le mode d'échec de tous les inventaires domestiques est connu : personne ne
déclare jamais qu'il **sort** un objet. L'index diverge du réel en quelques
semaines, l'utilisateur perd confiance, puis abandonne.

Par ailleurs le modèle de vision se trompera, et il faut pouvoir corriger sans
détruire ce qui a été enregistré.

## Décision

La base stocke des **observations** : « à cette date, ces objets étaient dans ce
contenant ». L'emplacement courant d'un objet est une valeur **dérivée**, mise en
cache sur le nœud, jamais une vérité écrite directement.

Règle de re-calibrage : après une observation sur un contenant, les nœuds enfants
absents des détections ne sont pas supprimés. Leur confiance de localisation
baisse, et au delà d'un seuil ils sont présentés comme « plus vu ici depuis ».

## Alternatives écartées

- **Mise à jour destructive de l'emplacement.** Rejetée : perd l'historique,
  rend toute correction risquée, et n'offre aucune réponse au problème de la
  sortie d'objet.
- **Déclaration explicite des sorties.** Rejetée : personne ne le fera, et
  l'exiger ajoute une étape au moment le moins propice.

## Conséquences

- L'historique est acquis sans effort : « où était-ce avant », « qui l'a rangé ».
- La confiance décroît avec le temps, ce qui est une information utile en soi.
- C'est **la** condition qui rend possible toute inférence probabiliste
  ultérieure. Voir `futur/carte-de-probabilite.md`.
- Coût : un volume de lignes plus élevé, et un pipeline de dérivation à écrire.
