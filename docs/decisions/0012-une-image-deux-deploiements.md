# ADR 0012 — Livrer une seule image et deux déploiements sur le cluster existant

- Statut : accepté
- Date : 2026-09-12
- Révise la ligne « empaquetage » implicite de l'ADR 0008

## Contexte

Un cluster Kubernetes est déjà en service et administré. Le coût marginal d'y
déployer une application de plus est proche de zéro, et l'on y gagne le
certificat, les sauvegardes et le redémarrage automatique.

L'application comporte **trois** charges de travail, et non deux : l'interface,
l'API, et le worker de vision. Ce dernier consomme une file au long cours, doit
survivre à un déploiement de l'interface et monter en charge séparément. Un
conteneur unique pour tout est donc exclu d'office.

## Décision

**Une seule image, deux déploiements.** L'image contient l'interface compilée en
fichiers statiques et le serveur qui les sert en plus de l'API. Elle est déployée
deux fois, avec deux commandes de démarrage différentes : le service web et le
worker.

Un seul dépôt, en espaces de travail, avec un paquet partagé entre client et
serveur.

Postgres est fourni par l'opérateur CloudNativePG, pour la sauvegarde vers
stockage objet et la restauration à l'instant près.

## Alternatives écartées

- **docker compose sur une machine dédiée.** Écartée : le cluster existe déjà, et
  refaire à la main ce qu'il fournit serait du travail en pure perte.
- **Kubernetes pour un seul déploiement tout-en-un.** Impossible : le worker doit
  vivre indépendamment de l'interface.
- **Trois images séparées.** Écartée : trois artefacts à construire, versionner et
  accorder, pour aucun gain. L'interface et l'API partagent leurs types, le
  worker partage l'accès base.
- **Interface servie par une entrée séparée ou un stockage objet.** Écartée : le
  service worker met déjà le paquet en cache côté client, donc le gain de
  performance est nul, et cela ajoute un déploiement.

## Conséquences

- Deux déploiements, un service, une entrée. La topologie tient sur une page.
- Le paquet partagé n'est pas cosmétique : la fonction de score de l'ADR 0011
  doit s'exécuter sur le téléphone hors-ligne **et** sur le serveur. Écrite une
  fois, exécutée aux deux endroits. C'est le principal argument en faveur de
  TypeScript de bout en bout.
- Un téléphone hors-ligne depuis deux semaines synchronisera vers une API plus
  récente que son application en cache. **Le décalage de version est structurel,
  pas accidentel.** L'endpoint d'ingestion doit rester stable et tolérant aux
  clients anciens, quel que soit l'empaquetage.
- Les migrations s'exécutent dans un travail éphémère avant le démarrage, en
  avant seulement. Aucune mise à jour automatique d'image : le moment où une
  migration tourne se choisit.
