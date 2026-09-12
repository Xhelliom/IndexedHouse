# Spécifications

Une spécification par lot, écrite **avant** la première ligne de code, et
corrigée si le code s'en écarte pour de bonnes raisons.

Une spécification n'est pas un document d'architecture : elle décrit un
comportement observable, pas une structure. Si elle contient surtout des noms de
classes, elle est au mauvais niveau.

## Gabarit

```markdown
# Lot N — Titre

## But
Une phrase. Ce que l'utilisateur peut faire après, qu'il ne pouvait pas avant.

## Périmètre
Ce qui est dedans. Et, tout aussi important, ce qui est explicitement dehors.

## Parcours
Le déroulé vu de l'utilisateur, écran par écran, geste par geste.

## Règles
Les règles métier, énoncées de façon vérifiable.

## Modèle de données touché
Tables créées ou modifiées. Renvoi aux décisions concernées.

## Critères d'acceptation
Une liste de phrases vraies ou fausses. Pas d'appréciation qualitative.

## Hors périmètre assumé
Ce que l'on sait ne pas traiter, et pourquoi c'est acceptable maintenant.
```

## État

| Lot | Spécification | Statut |
|---|---|---|
| 0 | `lot-0-socle.md` | écrite, à faire |
