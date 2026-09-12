# Décisions

Une décision par fichier, numérotée dans l'ordre d'acceptation.

## Règles

- Une décision acceptée n'est **jamais modifiée**. Si le contexte change, on en
  écrit une nouvelle qui la remplace, et on marque l'ancienne « remplacée par ».
- On n'écrit une décision que pour un choix **difficile à défaire** : forme des
  données, frontière de sécurité, dépendance structurante. Le choix d'une
  bibliothèque de dates n'en est pas une.
- La section des alternatives écartées est la plus utile du document. C'est elle
  qui évite de refaire le même débat dans six mois.

## Gabarit

```markdown
# ADR NNNN — Titre à l'impératif

- Statut : accepté | remplacé par ADR NNNN
- Date : AAAA-MM-JJ

## Contexte
Ce qui rend le choix nécessaire, et les contraintes en jeu.

## Décision
Ce que l'on fait, énoncé sans ambiguïté.

## Alternatives écartées
Ce qui a été envisagé, et la raison précise du rejet.

## Conséquences
Ce que cela impose ensuite, y compris ce que cela rend plus difficile.
```

## Index

| N° | Titre | Statut |
|---|---|---|
| 0001 | L'identité vient du QR, le contenu vient de la vision | accepté |
| 0002 | Un seul arbre de contenance | accepté |
| 0003 | Stocker des observations, dériver l'état | accepté |
| 0004 | La reconnaissance d'image ne bloque jamais l'utilisateur | accepté |
| 0005 | Hors-ligne d'abord | accepté |
| 0006 | Le tenant est le compte, pas la maison | accepté |
| 0007 | Un invité ne voit rien par défaut | accepté |
| 0008 | Pile technique | accepté |
| 0009 | Tout cascade depuis le compte | accepté |
| 0010 | La suggestion de rangement s'appuie d'abord sur un a priori sémantique | accepté |
