# ADR 0009 — Faire cascader toutes les données depuis le compte

- Statut : accepté
- Date : 2026-09-12

## Contexte

Le découpage par compte donne gratuitement un environnement de développement
réaliste : un compte de test avec sa maison, ses membres et ses étiquettes, à
côté des données réelles sans jamais les toucher.

Cela ne vaut que si la remise à zéro est fiable. Un script de nettoyage fragile
est un script que l'on n'ose plus lancer.

## Décision

- Toutes les clés étrangères cascadent jusqu'au compte, en `ON DELETE CASCADE`.
- Les photos sont rangées sous un préfixe de stockage par compte, pour que la
  suppression efface aussi les objets.
- Un compte porte son type, `real` ou `sandbox`. La remise à zéro refuse de
  s'exécuter sur un compte réel.
- Une commande sème un jeu de données reproductible : deux maisons, un arbre
  crédible, des étiquettes, des observations réparties dans le temps.
- Un fournisseur de vision factice, choisi par variable d'environnement, renvoie
  des détections figées pour les photos semées.

## Alternatives écartées

- **Suppression logique.** Rejetée pour cet usage : laisse traîner des données
  qui faussent les tests de cloisonnement et gonflent le stockage.
- **Base de développement séparée.** Rejetée : ne teste pas la cohabitation de
  plusieurs comptes, qui est précisément ce qui doit être vérifié.

## Conséquences

- Le cloisonnement devient une propriété **vérifiée** par la suite de tests, et
  non une intention : le compte A ne voit rien du compte B, sur chaque route.
- Le développement ne consomme aucun appel payant et les tests sont
  déterministes.
- On peut développer sans photographier sa propre maison.
- Un compte de démonstration en lecture seule découlerait du même mécanisme, sans
  travail supplémentaire.
