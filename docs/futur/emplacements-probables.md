# Classement des emplacements probables

Statut : idée, non planifiée. Prérequis déjà satisfaits par la conception.

Cette note ne couvre plus que la **recherche** : proposer où chercher un objet
quand l'index est incertain ou ancien. L'autre usage, suggérer où ranger, en est
sorti pour devenir le lot 4 du plan.

## L'idée

Un objet a un historique. S'il a été vu cinq fois dans le meuble A et deux fois
dans le meuble B, et qu'il n'est pas dans B, il est probablement dans A.

Plutôt que de répondre « vu il y a deux ans dans B », le système répond par une
liste ordonnée d'emplacements, chacun justifié, et dit par où commencer.

## Ce n'est pas une carte

Le mot « carte de chaleur » a d'abord servi à décrire cette idée, et il
l'égarait. Une couleur sur un plan ne se lit pas comme une probabilité, et pour
aller ouvrir un tiroir il faut son nom, pas sa position sur une image. La liste
ordonnée et justifiée n'est pas un pis-aller en l'absence de plan : c'est la
bonne interface. Voir ADR 0011.

## Le travail est en grande partie déjà fait

Le lot 4 construit le moteur de score. Cette note n'en est qu'un second
appelant : mêmes signaux, même pondération, même format d'explication, seule la
formulation change, « cherche ici en premier » au lieu de « range-le plutôt
ici ».

Ce qui reste propre à cette note est la part qui a besoin d'historique, et qui
n'a donc de sens qu'après plusieurs mois d'usage réel.

## Les signaux qui demandent de l'historique

**Historique de l'objet, pondéré par la récence.** Les trois derniers mois pèsent
plus que l'an dernier. Un objet a des habitudes récentes.

**Affinité de catégorie.** Apprise sur l'ensemble du corpus : les vis vont dans
le tiroir de l'établi parce que toutes les autres vis y sont. Ce signal renforce
l'a priori sémantique du lot 4 avec les habitudes réelles de la maison, et finit
par le remplacer.

**Co-occurrence.** Les objets qui voyagent ensemble. Si la perceuse est dans B,
son chargeur y est sans doute aussi.

**Habitudes des personnes.** Les observations sont attribuées. Si quelqu'un range
systématiquement les outils au mauvais endroit, le système le sait, et c'est
souvent la vraie réponse à « où est passé le… ».

## Boucle de retour

Sur un résultat de recherche, deux boutons : trouvé ici, pas là. Chaque réponse
est une observation de plus, gratuite, au moment exact où l'utilisateur détient
l'information. C'est aussi un traitement partiel du problème de la sortie
d'objet.

## Pas d'apprentissage automatique

Une fonction de score transparente suffit. L'argument décisif est
l'explicabilité : « vu cinq fois ici, la dernière il y a trois mois » se vérifie
et se corrige. Une probabilité sans justification est du bruit, et l'utilisateur
cesse d'y croire à la première erreur. Un modèle appris n'apporterait rien à
cette échelle de données, et retirerait cela.

## Ce que cela impose dès maintenant

Rien. Aucune colonne, aucune table, aucune abstraction.

Une seule vigilance : ne jamais purger les observations anciennes sans y
réfléchir, car elles sont le carburant. Purger une photo n'oblige pas à purger
l'observation qui l'accompagne.
