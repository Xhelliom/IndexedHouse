# ADR 0005 — Concevoir hors-ligne d'abord

- Statut : accepté
- Date : 2026-09-12

## Contexte

Cave, garage, grenier, fond de placard : les endroits où l'on range sont
précisément ceux où le réseau ne passe pas. Une application qui échoue là est
inutile.

## Décision

Le téléphone écrit localement la photo, le code QR, l'horodatage et un
identifiant généré côté client, puis synchronise quand il le peut. L'ingestion
côté serveur est **idempotente** par cet identifiant. Aucun écran n'attend le
réseau.

## Alternatives écartées

- **Ajouter le hors-ligne après coup.** Rejetée : impose de réécrire la couche de
  données, la gestion d'état et la moitié des écrans. C'est le genre de choix qui
  ne se rattrape pas.
- **Application native pour bénéficier de la synchronisation en arrière-plan.**
  Rejetée : coût de développement et de distribution disproportionné pour un
  usage familial, et un magasin d'applications à traverser pour chaque mise à
  jour.

## Conséquences

- C'est le principal poste d'effort du projet.
- Limite connue et acceptée : une application web installée sur iOS ne dispose
  pas de synchronisation en arrière-plan. Elle se déclenchera à l'ouverture.
- Les identifiants d'observation sont générés par le client, donc en `uuid`, et
  non par la base.
- Il faut une file locale visible par l'utilisateur : savoir ce qui reste à
  envoyer évite l'angoisse de la photo perdue.
