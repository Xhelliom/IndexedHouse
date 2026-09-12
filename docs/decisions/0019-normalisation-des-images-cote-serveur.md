# ADR 0019 — Réduire l'image sur le téléphone, la normaliser sur le serveur, ne pas conserver l'original

- Statut : accepté
- Date : 2026-09-12

## Contexte

Les photos constituent l'essentiel du volume de stockage et la partie
irremplaçable des données. Une photo d'un mur avant la fermeture d'une cloison ne
se reprend pas.

Conserver les originaux de téléphone multiplie le volume par un ordre de
grandeur sans rien apporter à cet usage. Mais réduire l'image sur le téléphone
signifie que **le seul exemplaire** passe par du code de compression dans un
navigateur mobile, avec ses difficultés habituelles sur l'orientation EXIF et la
mémoire des appareils anciens. Un défaut à cet endroit détruit définitivement la
donnée.

## Décision

- Le téléphone réduit largement avant l'envoi, autour de 2048 pixels sur le grand
  côté, en haute qualité. Objectif : le temps d'envoi, pas le stockage final.
- **La normalisation finale et la vignette se font sur le serveur**, à partir de
  ce qu'il a reçu.
- Le téléphone conserve son exemplaire local **jusqu'à l'accusé de réception** du
  serveur, pas avant.
- L'original de l'appareil n'est jamais conservé, ni sur le téléphone par nos
  soins, ni sur le serveur. Choix conscient.

## Alternatives écartées

- **Réduction sur le téléphone seulement, sans reprise serveur.** Écartée : place
  la seule transformation irréversible à l'endroit le moins contrôlable et le
  moins testable.
- **Envoi de l'original et traitement intégral sur le serveur.** Écartée : envois
  très lents, souvent sur un réseau mobile médiocre, pour un bénéfice nul.
- **Conserver l'original.** Écartée : volume multiplié pour un usage qui n'en a
  pas besoin, y compris pour une future ré-analyse par un meilleur modèle, que
  2048 pixels servent très bien.

## Conséquences

- Deux étapes de traitement d'image à écrire et à tester, dont une côté client.
- L'orientation EXIF doit être vérifiée explicitement par un test, sur des
  fichiers réels issus de plusieurs téléphones.
- La file locale du téléphone doit être visible par l'utilisateur : savoir ce
  qu'il reste à envoyer évite l'angoisse de la photo perdue.
