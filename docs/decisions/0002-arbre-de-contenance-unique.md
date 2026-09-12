# ADR 0002 — N'utiliser qu'un seul arbre de contenance

- Statut : accepté
- Date : 2026-09-12

## Contexte

Un inventaire domestique fait intervenir des pièces, des meubles, des boîtes et
des objets. La modélisation spontanée consiste à créer une table par notion.

Or une caisse à outils est un objet **et** un contenant. Un carton dans un carton
est courant. Et la question « où est X » est exactement la même à tous les
niveaux de profondeur.

## Décision

Un seul type d'entité, le **nœud**, avec un parent et un type
(`zone`, `piece`, `meuble`, `contenant`, `objet`). La profondeur est libre. Un
chemin matérialisé accompagne chaque nœud.

## Alternatives écartées

- **Trois tables pièce / contenant / objet** (le schéma de la tentative
  antérieure présente dans le dépôt). Rejetée : oblige à dupliquer la logique de
  hiérarchie, et bloque dès qu'un objet doit contenir quelque chose.
- **Profondeur fixe.** Rejetée : aucune maison ne s'y conforme.

## Conséquences

- Les requêtes de sous-arbre sont uniformes, quel que soit le niveau.
- Les attributs propres à chaque type vivent dans un champ `jsonb`, plutôt que
  dans des tables séparées.
- Il faut se garder d'une sur-généralisation : le type du nœud reste contraint
  par une énumération, pas par une table d'entités libre.
