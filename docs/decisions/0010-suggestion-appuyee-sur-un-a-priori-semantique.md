# ADR 0010 — Fonder la suggestion de rangement sur un a priori sémantique avant les habitudes

- Statut : accepté
- Date : 2026-09-12

## Contexte

Suggérer où ranger un objet que l'on tient en main est la fonctionnalité qui
change la nature du produit : elle le fait passer d'un outil qui **enregistre**
ce que l'on fait à un outil qui **aide** à le faire.

Le premier réflexe est de la fonder sur l'historique : l'objet a été vu là, donc
il y retourne. Mais l'historique n'existe pas au démarrage, et il n'existe jamais
pour un objet qui entre dans la maison pour la première fois, qui est justement
le cas où l'on hésite le plus.

## Décision

La suggestion s'appuie d'abord sur un **a priori sémantique** : à partir du nom
de l'objet reconnu et de la liste nommée des contenants de la maison, proposer
un emplacement plausible. Des piles vont dans un tiroir à bazar, des décorations
de Noël à la cave, des vis près de l'établi. Ce raisonnement ne demande aucun
historique.

Les signaux tirés de l'usage (historique de l'objet pondéré par la récence,
affinité de catégorie, co-occurrence, habitudes des personnes) **raffinent**
progressivement cet a priori et finissent par le dominer.

La suggestion propose trois candidats, jamais un seul, chacun accompagné de sa
raison. Elle n'est jamais imposée : l'utilisateur scanne le contenant de son
choix, et ce choix est la confirmation.

## Alternatives écartées

- **Fonder la suggestion sur le seul historique.** Rejetée : inutilisable
  pendant les premiers mois, et muette précisément sur les objets nouveaux.
- **Attendre d'avoir des données pour construire la fonctionnalité.** Rejetée :
  reviendrait à priver l'application de son principal levier d'adoption au
  moment où elle en a le plus besoin.
- **Suggérer un emplacement unique.** Rejetée : une suggestion unique et fausse
  détruit la confiance bien plus vite que trois candidats dont un est bon.

## Conséquences

- **Le nom des contenants devient porteur de sens.** « Bac 1, Bac 2, Bac 3 » ne
  permet aucun raisonnement. Le lot 1 doit donc encourager des noms signifiants
  au moment de l'étiquetage, et c'est la raison pour laquelle cette décision est
  prise maintenant plutôt qu'au moment de construire la fonctionnalité.
- Le classement des contenants déjà connus doit pouvoir s'exécuter **localement**
  sur les données en cache, pour rester utilisable dans un garage sans réseau.
  Seul l'a priori sémantique sur un objet inconnu nécessite le réseau, et son
  absence dégrade la suggestion sans la supprimer.
- Chaque suggestion acceptée ou ignorée est un signal. La boucle se referme sans
  rien demander de plus à l'utilisateur.
- Un objet pour lequel aucun candidat ne convient est une information utile :
  cet objet n'a pas de place attribuée dans la maison.
