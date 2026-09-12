# ADR 0007 — Refuser par défaut toute visibilité à un invité

- Statut : accepté
- Date : 2026-09-12

## Contexte

Une extension envisagée en V2 consiste à donner un accès temporaire à un
occupant : locataire de courte durée, ami qui garde la maison. Il doit savoir
comment la maison fonctionne et où les choses sont rangées, pendant son séjour
seulement.

Rien n'est construit maintenant. Mais le sens du défaut de visibilité est une
décision de sécurité, et il figera la forme des données.

## Décision

Un nœud porte un drapeau `guest_visible`, **faux par défaut**, hérité par le
sous-arbre. La visibilité pour un invité est une autorisation explicite : on
ouvre « Cuisine » ou « Placard à balais » et tout le contenu devient visible.
Tout le reste demeure invisible.

## Alternatives écartées

- **Tout montrer sauf une liste d'exclusions.** Rejetée, et c'est le cœur de la
  décision. Une autorisation oubliée prive l'invité d'une information ; une
  exclusion oubliée lui indique où trouver les bijoux, les papiers ou les effets
  personnels. Les deux erreurs n'ont pas le même coût, donc le défaut n'est pas
  symétrique.
- **Visibilité nœud par nœud sans héritage.** Rejetée : le coût de curation
  rendrait la fonctionnalité inutilisable.

## Conséquences

- Une colonne booléenne dès maintenant, et rien d'autre.
- Le jour où la fonctionnalité sera construite, il faudra une prévisualisation
  « voir ma maison comme un invité ». Sans ce miroir, personne ne fera confiance
  au filtrage et la fonctionnalité ne servira pas.
- Reste ouvert : vérifier à l'usage que l'héritage par sous-arbre suffit, sans
  réglage fin.
