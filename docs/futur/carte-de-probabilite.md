# Carte de probabilité de localisation

Statut : idée, non planifiée. Prérequis déjà satisfaits par la conception.

## L'idée

Un objet a un historique. S'il a été vu cinq fois dans le meuble A et deux fois
dans le meuble B, et qu'il n'est pas dans B, il est probablement dans A.

Plutôt que de répondre « vu il y a deux ans dans B », le système répond par une
liste ordonnée d'emplacements probables, et dit par où commencer à chercher.

## Pourquoi c'est déjà possible

La décision de stocker des observations plutôt qu'un état (ADR 0003) fournit
exactement la donnée nécessaire : un historique horodaté et attribué, par objet
et par contenant. **Aucune collecte supplémentaire n'est à prévoir.** C'est la
raison principale pour laquelle cette note existe si tôt : elle confirme que le
choix de conception fait aujourd'hui paie plus tard, et qu'il ne faut rien y
ajouter maintenant.

En revanche l'inférence ne vaut rien sans historique. Elle n'a de sens qu'après
plusieurs mois d'usage réel, ce qui la place naturellement loin dans le plan.

## Quatre signaux, pas un seul

La fréquence brute n'est que le premier signal, et le plus faible.

**Historique de l'objet, pondéré par la récence.** Où il a été vu, avec une
décroissance dans le temps : les trois derniers mois pèsent plus que l'année
dernière. Un objet a des habitudes récentes.

**Affinité de catégorie.** Apprise sur l'ensemble du corpus : les vis vont dans
le tiroir de l'établi parce que toutes les autres vis y sont. Ce signal répond
même pour un objet **jamais indexé**, ce que la fréquence ne peut pas faire.
C'est probablement le plus utile des quatre.

**Co-occurrence.** Les objets qui voyagent ensemble. Si la perceuse est dans B,
son chargeur y est sans doute aussi.

**Habitudes des personnes.** Les observations sont attribuées. Si quelqu'un range
systématiquement les outils au mauvais endroit, le système le sait, et c'est
souvent la vraie réponse à « où est passé le… ».

## Trois usages, dont deux inattendus

1. **Classer les réponses de recherche.** Une liste d'emplacements probables au
   lieu d'une réponse unique potentiellement périmée.
2. **Suggérer où ranger.** ~~Idée à mûrir.~~ **Promu au lot 4** du plan : c'est
   la fonctionnalité qui fait passer l'application d'un outil qui enregistre à un
   outil qui aide, et l'a priori sémantique (ADR 0010) lui permet de fonctionner
   sans historique. Voir `plan/roadmap.md`. Ce qui reste dans la présente note
   est la part qui a besoin d'historique : le raffinement progressif de la
   suggestion par les habitudes réelles.
3. **Guider la fouille.** « Commence par ici, puis là. » C'est la formulation
   d'origine de l'idée, et la plus directement utile.

## Comment le construire, le jour venu

**Ne pas commencer par de l'apprentissage automatique.** Une fonction de score
transparente suffit : fréquence pondérée par la récence, plus une prime
d'affinité de catégorie, plus une prime de co-occurrence.

L'argument décisif est l'**explicabilité**. « Vu cinq fois ici, la dernière il y
a trois mois » se vérifie et se corrige. Une probabilité sans justification est
du bruit, et l'utilisateur cesse d'y croire à la première erreur. Un modèle
appris n'apporterait rien de plus à cette échelle de données, et retirerait cela.

**Boucle de retour.** Sur un résultat de recherche, deux boutons : trouvé ici,
pas là. Chaque réponse est une observation de plus, gratuite, au moment exact où
l'utilisateur a l'information. C'est aussi un traitement partiel du problème de
la sortie d'objet.

## Distinguer l'inférence de la carte

Le mot « carte » recouvre deux choses de valeur très différente.

L'**inférence** classée est utile, peu coûteuse, et ne demande aucune donnée
nouvelle.

La **visualisation** en carte de chaleur sur un plan de la maison est séduisante
mais suppose de dessiner un plan par maison et de positionner chaque meuble
dessus. C'est un projet en soi, pour un gain surtout esthétique. À traiter
séparément, ou jamais.

## Ce que cela impose dès maintenant

Rien. Aucune colonne, aucune table, aucune abstraction. C'est exactement le genre
d'idée que la règle d'arbitrage autorise à noter sans rien construire.

Une seule vigilance : ne jamais purger les observations anciennes sans y
réfléchir, car elles sont le carburant de cette fonctionnalité. Le point de purge
des photos est déjà listé dans les points ouverts du document d'architecture ;
purger une image n'oblige pas à purger l'observation qui l'accompagne.
