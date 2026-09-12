# ADR 0017 — Reporter la recherche vectorielle

- Statut : accepté
- Date : 2026-09-12
- Révise la ligne « pgvector » de l'ADR 0008

## Contexte

Le modèle de vision nommera le même objet « chargeur », « adaptateur secteur » et
« bloc d'alimentation ». L'ADR 0008 prévoyait pgvector pour absorber cette
variabilité, ce qui a été inscrit un peu vite.

## Décision

Pas de pgvector en V1. La recherche s'appuie sur la recherche plein texte en
configuration française, les trigrammes pour la tolérance aux fautes de frappe,
et le travail de canonicalisation avec alias.

La question est réexaminée **au lot 3**, sur la qualité mesurée des recherches
réelles.

## Alternatives écartées

- **pgvector dès le départ.** Écarté : ajoute une extension, un pipeline
  d'embeddings, un coût par objet et une seconde représentation à maintenir, pour
  un gain que rien ne permet d'estimer avant d'avoir des données.
- **Base vectorielle dédiée.** Écartée, voir ADR 0008.

## Conséquences

- La canonicalisation et les alias deviennent le vrai sujet de la recherche, et
  non un travail préparatoire. C'est là qu'il faut mettre l'effort.
- La décision se prend au lot 3 avec des mesures, pas des intuitions. Si la
  recherche échoue sur les synonymes, l'extension s'ajoute sans rien casser.
