# ADR 0020 — Sauvegarder selon la nature des données, et vérifier la restauration

- Statut : accepté
- Date : 2026-09-12

## Contexte

L'auto-hébergement déplace le risque : ce n'est pas la panne du serveur, c'est
l'absence de sauvegarde éprouvée. Deux natures de données cohabitent, et elles ne
méritent pas le même traitement.

La base se reconstruit en partie. Les photos, non.

## Décision

- **Base** : sauvegarde par l'opérateur CloudNativePG vers un stockage objet, avec
  restauration à l'instant près. C'est fourni, autant s'en servir.
- **Photos** : copie hors-site chiffrée, avec restic ou rclone, vers un stockage
  objet peu coûteux ou la machine d'un proche.
- **Restauration vérifiée tous les mois, automatiquement** : la sauvegarde est
  restaurée dans un compte de bac à sable, un contrôle vérifie que les données
  attendues sont là, puis le compte est détruit.
- **Deux alertes, pas dix** : le disque qui se remplit, et la sauvegarde qui n'a
  pas tourné, par interrupteur d'homme mort.
- **Plafond mensuel de dépense de vision par compte**, appliqué côté serveur.

## Alternatives écartées

- **Sauvegarde unique de tout, au même rythme.** Écartée : traite de la même
  façon ce qui se reconstruit et ce qui est irremplaçable.
- **Se fier à une sauvegarde jamais restaurée.** Écartée : ce n'est pas une
  sauvegarde, c'est une intention. Le test de restauration est la décision utile
  de cette fiche.
- **Supervision complète avec métriques et tableaux de bord.** Écartée : c'est un
  loisir, pas un besoin, pour une application familiale. Deux alertes suffisent.

## Conséquences

- Le bac à sable (ADR 0009) sert une deuxième fois, et c'est ce qui rend le test
  de restauration automatisable au lieu d'être une bonne intention.
- Le plafond de dépense évite qu'une boucle de retraitement des photos coûte
  cher pendant la nuit. À prévoir dès que le pipeline de vision existe, au lot 2.
- Le volume à provisionner est dominé par les photos, et la décision de l'ADR
  0019 le divise par un ordre de grandeur.
