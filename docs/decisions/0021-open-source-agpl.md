# ADR 0021 — Publier le projet en open source sous AGPL-3.0

- Statut : accepté
- Date : 2026-09-13

## Contexte

Le projet est publié en open source, avec des images de conteneur publiques.

Une licence se change difficilement une fois que des contributions extérieures
sont arrivées, car il faut alors l'accord de chaque auteur. Tant que l'auteur est
seul, le choix est libre. Ensuite, non. C'est donc maintenant qu'il faut trancher.

Par ailleurs le plan conserve une hypothèse d'ouverture en SaaS (§ 1.1 du
document d'architecture), qui n'est pas un objectif mais que rien ne doit fermer.

## Décision

Licence AGPL-3.0. L'auteur conserve l'intégralité du droit d'auteur tant qu'il
est seul contributeur.

## Alternatives écartées

- **MIT.** Écartée : diffusion plus large, mais permettrait à quiconque d'en
  faire un service commercial fermé. Comme le projet est précisément une
  application que l'on héberge, c'est le scénario que la licence doit couvrir.
- **Rester privé.** Écarté : le projet n'a rien de confidentiel, et une
  publication impose une discipline saine sur les secrets et la configuration.
- **Ne pas choisir maintenant.** Écarté : c'est le seul moment où le choix est
  encore libre.

## Conséquences

- Quiconque héberge une version modifiée doit publier ses modifications.
- L'auteur restant seul détenteur des droits, il pourra toujours accorder une
  licence différente en parallèle. Cette liberté disparaît dès la première
  contribution extérieure : il faudra alors soit l'accepter, soit demander une
  cession de droits aux contributeurs.
- Le dépôt étant public, aucun secret ne doit y figurer. Un contrôle de fuite de
  secrets entre dans l'intégration continue du lot 0, et le fichier
  d'environnement hérité de l'ancienne tentative disparaît avec elle.
- Les images publiées sont construites pour amd64 et arm64.
