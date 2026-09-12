# ADR 0001 — Faire porter l'identité par le QR et le contenu par la vision

- Statut : accepté
- Date : 2026-09-12

## Contexte

L'idée fondatrice est de photographier un meuble pour créer son identifiant, puis
de photographier meuble et objet ensemble pour enregistrer un rangement.

La reconnaissance visuelle d'un contenant est peu fiable dans une maison. Deux
tiroirs blancs identiques dans la même pièce sont indistinguables pour un modèle
de vision, et c'est le cas le plus fréquent, pas le cas limite. L'angle, la
lumière et l'ouverture du meuble font varier l'image bien plus que sa différence
avec son voisin identique.

## Décision

L'identité d'un contenant vient d'une **étiquette QR** collée dessus. Le contenu
vient du **modèle de vision**. Une seule photo cadre l'étiquette et les objets :
le geste de l'utilisateur reste celui envisagé au départ.

## Alternatives écartées

- **Reconnaissance visuelle du contenant.** Rejetée : consommerait l'essentiel de
  l'effort pour la part la moins fiable du système, avec des erreurs
  silencieuses qui rangent un objet dans le mauvais meuble sans signal.
- **Étiquettes NFC.** Rejetées pour l'instant : plus chères, nécessitent un geste
  de contact précis, et ne fonctionnent pas avec l'appareil photo natif.
- **Saisie manuelle du contenant.** Rejetée : ajoute une étape au moment du
  rangement, ce qui contrevient au critère d'acceptation principal.

## Conséquences

- Il faut produire, imprimer et coller des étiquettes. Coût matériel réel mais
  faible, et travail d'amorçage à prévoir.
- Le support doit résister au garage et à la cave : synthétique ou plastifié.
- Un contenant sans étiquette n'existe pas dans le système. La saisie manuelle
  reste possible en repli.
- En contrepartie, l'emplacement enregistré est certain, ce qui rend toute la
  chaîne aval exploitable.
