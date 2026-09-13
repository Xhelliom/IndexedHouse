# Environnement cible

Ce que l'on sait de l'infrastructure, pour ne pas avoir à le redemander.

## Cluster

| Élément | Valeur |
|---|---|
| Distribution | k3s |
| Stockage bloc | Longhorn |
| Entrée | Traefik, fourni par k3s |
| Certificats | cert-manager, autorité Let's Encrypt |
| Base | opérateur CloudNativePG, une seule instance |

Longhorn convient tant que Postgres reste en une instance : on y gagne la
résilience à la perte d'un nœud. Si l'on passe un jour à plusieurs instances, il
faudra basculer sur du stockage local, car la réplication de Longhorn et celle de
Postgres feraient alors double emploi.

## Sauvegardes

Destination pendant le développement : MinIO dans le cluster.
Destination réelle : stockage objet Scaleway.

**Règle : la bascule vers Scaleway se fait avant la première photo réelle.** Une
sauvegarde envoyée vers un MinIO hébergé dans le même cluster, sur les mêmes
disques, n'est pas une sauvegarde. C'est acceptable pour mettre au point la
mécanique, jamais pour des données que l'on tient à garder.

## Développement local

Postgres dans un conteneur, même version majeure que le cluster. L'application
tourne depuis le terminal avec rechargement à chaud, sans être conteneurisée.

L'opérateur ne change rien pour l'application : c'est un Postgres standard
derrière une chaîne de connexion. En revanche la sauvegarde et la restauration
ne sont pas testables en local, puisqu'elles relèvent de l'opérateur. Ce test
tourne sur le cluster, avec des comptes de bac à sable.

## Diffusion

Projet open source sous AGPL-3.0 (ADR 0021), images publiques construites pour
amd64 et arm64.

## À trancher

| Sujet | Statut |
|---|---|
| Nom de domaine | bloquant pour la **mise en cluster** seulement, pas pour le développement |
| Type de défi ACME | HTTP-01 si le cluster est joignable publiquement, sinon DNS-01 avec une clé d'API chez l'hébergeur de la zone |

Aucun des deux n'empêche de commencer : `localhost` est un contexte sécurisé par
exception, donc la caméra et le service worker fonctionnent en développement
local sans certificat.
