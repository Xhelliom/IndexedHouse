# ADR 0011 — N'écrire qu'un seul moteur de score, pour ranger et pour retrouver

- Statut : accepté
- Date : 2026-09-12

## Contexte

Deux fonctionnalités ont été pensées séparément :

- suggérer où ranger un objet que l'on tient en main (lot 4) ;
- proposer les emplacements probables d'un objet que l'on cherche, quand l'index
  est incertain ou ancien.

Elles ont la même entrée, un objet, et la même sortie, une liste de contenants
classés. Seuls le verbe et le moment diffèrent.

## Décision

Un seul moteur de score, appelé depuis deux entrées :

| Entrée | Question | Formulation |
|---|---|---|
| Rangement | où est-ce que ça va ? | « range-le plutôt ici » |
| Recherche | où est-ce que c'est ? | « cherche ici en premier » |

Mêmes signaux, même pondération, **même format d'explication**. Un contenant
proposé est toujours accompagné de sa raison, dans les deux sens.

## Alternatives écartées

- **Deux implémentations séparées.** Rejetée : deux fois le travail, deux fois
  les réglages à accorder, et une divergence garantie au premier ajustement.
- **Une carte de chaleur sur un plan de la maison.** Rejetée comme interface,
  pas seulement par coût. Elle suppose de dessiner un plan par maison et d'y
  positionner chaque meuble, pour un résultat *moins* utilisable : une couleur ne
  se lit pas comme une probabilité, et pour aller ouvrir un tiroir il faut son
  nom, pas sa position sur une image. La liste ordonnée et justifiée n'est pas un
  repli, c'est la bonne réponse.

## Conséquences

- Le lot 4 livre l'essentiel du classement probabiliste à la recherche. Ce
  dernier devient un second appelant, pas un chantier.
- L'explication est partagée, donc travaillée une fois. C'est elle qui porte la
  confiance : « vu cinq fois ici, la dernière il y a trois mois ».
- Les signaux qui demandent de l'historique améliorent les deux entrées en même
  temps.
- L'idée de plan de maison est abandonnée, sauf demande explicite et pour un
  autre motif que celui-ci.
