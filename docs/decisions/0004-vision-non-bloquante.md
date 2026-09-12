# ADR 0004 — Ne jamais faire attendre l'utilisateur derrière la reconnaissance d'image

- Statut : accepté
- Date : 2026-09-12

## Contexte

L'appel au modèle de vision prend quelques secondes et peut échouer. Le critère
d'acceptation principal est que ranger un objet ne coûte jamais plus d'un geste
et d'une photo.

## Décision

La photo part en file d'attente et l'écran se ferme immédiatement. Les objets
détectés sont créés en **brouillon**. Une boîte de réception permet de confirmer
ou corriger plus tard, par lots. La recherche fonctionne sur les brouillons, qui
sont simplement signalés comme non confirmés.

## Alternatives écartées

- **Validation immédiate des détections.** Rejetée : réintroduit la friction à
  l'endroit exact où elle est fatale. Une application d'inventaire qui demande
  une confirmation au rangement est abandonnée en quelques semaines.
- **Attente du résultat avec indicateur de progression.** Rejetée pour la même
  raison, aggravée par l'absence de réseau dans une cave ou un garage.

## Conséquences

- Il faut un état de confirmation sur chaque détection, et un écran de
  traitement par lots.
- La qualité perçue dépend de la facilité de correction, pas de la précision du
  modèle. C'est là qu'il faut soigner l'ergonomie.
- Les résultats de recherche doivent distinguer visuellement le confirmé du
  supposé.
