# ADR 0016 — Ne pas écrire de moteur de synchronisation sans avoir évalué l'existant

- Statut : accepté
- Date : 2026-09-12

## Contexte

Le hors-ligne est le principal poste d'effort du projet (ADR 0005). C'est aussi
le piège le plus classique : on écrit une file locale, puis la résolution de
conflits, puis la réplication partielle, et six mois plus tard on met au point un
moteur de synchronisation au lieu de construire l'application.

Or ce projet est, sans qu'on l'ait cherché, particulièrement bien taillé pour un
moteur existant :

- les données sont partitionnées par compte, donc la réplication partielle est
  triviale : un téléphone n'a besoin que de l'arbre de son compte ;
- la décision de ne stocker que des observations en ajout seul (ADR 0003)
  supprime presque tous les conflits d'écriture, qui sont la difficulté de ces
  outils.

## Décision

Aucun moteur de synchronisation maison ne sera écrit sans avoir évalué
ElectricSQL et PowerSync sur le schéma réel.

**L'évaluation a lieu avant le lot 2**, pas maintenant : le lot 1 n'a pas besoin
de hors-ligne, et à ce moment-là le schéma et les requêtes existeront pour juger
sur pièces au lieu de parier.

## Alternatives écartées

- **Écrire la synchronisation à la main tout de suite.** Écarté : c'est le choix
  qui consomme le projet.
- **Choisir un moteur dès maintenant.** Écarté : rien ne presse, et la décision
  serait prise sans les éléments qui permettent de la prendre.
- **Approches à types de données répliqués sans conflit.** Écartées : conçues pour
  l'édition collaborative de documents, ce qui n'est pas la forme du problème.

## Conséquences

- Le lot 1 se construit avec une API classique, sans engager la suite.
- Quel que soit le résultat, **les photos restent à notre charge** : aucun de ces
  moteurs ne transporte de fichiers binaires. Il faudra notre propre file
  d'envoi d'images, ce qui est la partie facile car un envoi d'image est
  idempotent et sans conflit.
- Cette évaluation est une tâche explicite du plan, à ne pas escamoter sous la
  pression de commencer à coder.
