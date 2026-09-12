# IndexedHouse — Document d'architecture

> Statut : décisions de conception arrêtées, avant écriture du code.
> Ce document décrit **ce qu'est** le système. Le **pourquoi** de chaque choix,
> avec les alternatives écartées, est dans `decisions/`. Le plan de travail est
> dans `plan/roadmap.md`. Voir `README.md` pour la méthode.

---

## 1. Objectif

Indexer sans friction le contenu physique d'une maison, puis le retrouver.

### 1.1 Pour qui, et dans quel ordre

L'usage principal est **personnel et familial** : le propriétaire et les siens,
sur deux maisons, en auto-hébergement. C'est cet usage qui décide de tout.

| Priorité | Besoin | Horizon |
|---|---|---|
| 1 | Rangement : qu'est-ce qui est où | V1 |
| 2 | Documentation technique : tableau électrique, équipements, entretien | V1 |
| 3 | Partage temporaire avec un occupant, locataire ou invité | V2 |
| 4 | Mise à disposition en SaaS | hypothèse |

Les niveaux 3 et 4 sont des extensions crédibles, pas des objectifs. Ils
n'existent dans ce document que sous la forme des quelques choix de schéma qui
seraient coûteux à rattraper après coup.

**Règle d'arbitrage.** Quand un besoin de V2 entre en conflit avec la simplicité
de la V1, la V1 gagne, sans discussion. On ne retient par anticipation que ce qui
relève de la forme des données : une colonne, une portée, une clé étrangère. Ni
écran, ni parcours, ni abstraction supplémentaire ne sont construits pour un
usage que personne n'a encore.

### 1.2 Deux domaines

Deux domaines cohabitent, avec des usages très différents :

| Domaine | Volume | Fréquence | Interface |
|---|---|---|---|
| Rangement (qu'est-ce qui est où) | élevé | permanente | mobile, appareil photo |
| Documentation technique (tableau électrique, équipements, entretien) | faible | rare | formulaires et fiches |

Le rangement porte toute la difficulté et toute la valeur. Il constitue le MVP.
La documentation technique réutilisera le même arbre et vient juste après : elle
fait pleinement partie de la V1, c'est elle qui répond aux questions que l'on se
pose une fois par an et au pire moment, du genre où couper l'eau.

Critère d'acceptation qui prime sur tous les autres : **ranger un objet ne doit
jamais coûter plus d'un geste et d'une photo.** Toute fonctionnalité qui ajoute
une étape au moment du rangement est reportée ou supprimée.

---

## 2. Décisions structurantes

### 2.1 L'identité vient du QR, le contenu vient de la vision

> ADR 0001

La reconnaissance visuelle d'un *contenant* est peu fiable : deux tiroirs blancs
identiques dans la même pièce sont indistinguables pour un modèle de vision, et
c'est le cas le plus fréquent dans une maison.

Une étiquette QR collée sur chaque contenant donne une identité certaine pour
quelques euros. Le geste reste identique : une seule photo qui cadre l'étiquette
et les objets. Le système décode le QR (identité) et envoie l'image au modèle de
vision (contenu).

La photo seule reste un repli acceptable pour les gros contenants visuellement
distinctifs, mais ce n'est pas le chemin nominal.

### 2.2 Un seul arbre de contenance

> ADR 0002

Maison, zone, pièce, meuble, tiroir, boîte, objet : un seul type de nœud, avec un
parent. Une caisse à outils est un objet *et* un contenant. « Où est X » est la
même requête à tous les niveaux.

C'est une simplification majeure par rapport à trois tables séparées
pièce / contenant / objet, qui obligent à dupliquer la logique de hiérarchie.

### 2.3 La base stocke des observations, pas un état

> ADR 0003

Chaque photo est un événement : « à cette date, ces objets étaient dans ce
contenant ». L'emplacement courant d'un objet est une **valeur dérivée**, pas une
vérité écrite en dur.

Conséquences directes :

- l'historique est gratuit (« où était-ce avant ? ») ;
- la confiance décroît avec le temps (« vu il y a 2 ans ») ;
- une erreur du modèle de vision se corrige sans rien casser ;
- et surtout, cela règle le vrai mode d'échec des inventaires domestiques.

**Le problème de la sortie d'objet.** Personne ne déclare jamais qu'il sort
quelque chose. Avec des observations, une nouvelle photo d'un contenant
*re-calibre* automatiquement son contenu : ce qui n'apparaît plus passe en
« plus vu depuis ». On ne déclare jamais une sortie, on re-photographie de temps
en temps, et l'index se corrige seul.

### 2.4 La vision ne bloque jamais

> ADR 0004

La photo part en file d'attente. Les objets sont créés en brouillon avec la
proposition du modèle. Une boîte de réception permet de corriger plus tard en un
geste. La recherche fonctionne sur les brouillons, simplement marqués comme non
confirmés.

Si l'utilisateur doit valider sur le moment, la friction revient et l'application
est abandonnée en trois semaines.

### 2.5 Hors-ligne d'abord

> ADR 0005

Cave, garage, murs épais : c'est précisément là que l'on range. Le téléphone
écrit localement (photo, code QR, horodatage, identifiant généré côté client),
puis synchronise quand il peut. L'ingestion est idempotente par identifiant
client. Aucun écran n'attend le réseau.

C'est le poste d'effort principal du projet. Il est dans l'architecture dès le
premier jour, pas ajouté après coup.

Limite connue : la synchronisation en arrière-plan n'existe pas pour une PWA sur
iOS. Elle se déclenchera à l'ouverture de l'application. C'est acceptable.

### 2.6 Multi-tenant dès le départ, SaaS plus tard

> ADR 0006

Le tenant est le **compte**, pas la maison : un même foyer possède souvent
plusieurs lieux (résidence principale, maison secondaire, cave louée) avec les
mêmes membres. Un compte porte les membres, les rôles et, le jour venu,
l'abonnement. Il contient N maisons, chacune racine de son propre arbre.

Concevoir multi-tenant coûte presque rien maintenant (une colonne de portée, une
entité racine, des compteurs d'usage) et est pratiquement impossible à rattraper
ensuite. En revanche **construire** un SaaS (inscription publique, facturation,
emails transactionnels, support) est un projet distinct qui n'est pas engagé ici.
La porte reste ouverte, on ne la franchit pas.

Corollaire : une adhésion porte une **portée** (le compte entier, ou une seule
maison) et une **fenêtre de validité**. La famille est membre du compte sans date
de fin ; un invité temporaire est rattaché à une maison et expire tout seul.
Voir § 8.

---

## 3. Modèle de données

Toutes les tables portent `account_id`. L'isolation est doublée par du
Row Level Security PostgreSQL adossé à une variable de session : pour un
développeur seul, un filtre oublié dans une requête suffirait à exposer la
maison d'un autre foyer. Toutes les clés étrangères cascadent jusqu'au compte,
de sorte qu'un compte se supprime ou se réinitialise intégralement (voir § 7).

### 3.1 Comptes et accès

```
user        id, email, password_hash, display_name
account     id, name, kind (real | sandbox), created_at, plan
place       id, account_id, name, address, timezone          -- une maison

membership  id, account_id, user_id,
            scope (account | place), place_id,
            role (owner | admin | member | guest),
            valid_from, valid_until, created_by
```

Session longue durée sur le téléphone : aucun membre de la famille n'acceptera
de se reconnecter. Invitation par lien.

### 3.2 L'arbre

```
node  id, account_id, place_id, parent_id, path,
      kind (zone | piece | meuble | contenant | objet),
      name, canonical_name, aliases[],
      quantity, notes, attrs (jsonb), cover_photo_id,
      status (active | archived),
      guest_visible (défaut faux, hérité par le sous-arbre),
      last_seen_at, location_confidence,
      created_at, created_by
```

`parent_id`, `last_seen_at` et `location_confidence` sont un **cache** de l'état
courant, recalculé par le pipeline d'observations. La vérité reste les
observations. `attrs` en jsonb porte les champs propres à chaque type (marque,
modèle, numéro de série, fin de garantie) sans multiplier les tables.

`path` matérialisé donne le fil d'Ariane et la recherche descendante en une
requête.

### 3.3 Étiquettes

```
label  code (PK, court et non devinable), account_id, node_id,
       batch_id, printed_at, bound_at
```

Les codes sont pré-alloués à un compte au moment de l'impression d'une planche,
et rattachés à un nœud au premier scan. On colle d'abord, on nomme ensuite.

Le QR encode une URL courte, pas un identifiant brut : scanné avec l'appareil
photo natif du téléphone, il ouvre directement la fiche du contenant. N'importe
qui dans la famille voit le contenu d'un carton sans rien installer. C'est le
principal levier d'adoption. Un code court lisible est imprimé sous le QR, pour
le cas où l'étiquette est abîmée et pour pouvoir le dire à voix haute.

L'URL n'est pas une capacité d'accès : elle ne résout que pour un membre du
compte. Les codes restent non devinables par défense en profondeur.

### 3.4 Observations

```
photo        id, account_id, place_id, storage_key, thumb_key,
             width, height, taken_at, uploaded_at, created_by

observation  id (uuid généré par le client), account_id, place_id,
             photo_id, container_node_id, observed_at, created_by,
             source (qr_photo | manuel | import),
             status (pending | processed | failed),
             vision_model, vision_raw (jsonb)

detection    id, observation_id, node_id, label_text, canonical_key,
             confidence, bbox, state (draft | confirmed | rejected | merged)
```

Règle de re-calibrage : à l'issue d'une observation sur un contenant, les nœuds
enfants qui n'apparaissent dans aucune détection ne sont pas supprimés. Ils
conservent leur `last_seen_at` et voient leur `location_confidence` baisser. Au
delà d'un seuil, ils sont présentés comme « plus vu ici depuis ».

### 3.5 Recherche

```
node_search  node_id, account_id, tsv (configuration française),
             embedding (pgvector), aliases[]
```

Le modèle de vision nommera le même objet « chargeur », « adaptateur secteur » et
« bloc d'alimentation ». Une étape de canonicalisation avec alias est
indispensable, complétée par la recherche vectorielle et la tolérance aux fautes
de frappe (trigrammes). Sans cela la recherche échoue et l'outil perd sa raison
d'être.

### 3.6 Pièces jointes et volet technique (phase ultérieure)

```
attachment        id, account_id, node_id, kind (manuel | facture | garantie), storage_key
circuit           id, place_id, panel_node_id, breaker_label, amperage, feeds[]
maintenance_task  id, node_id, label, period, last_done_at, next_due_at
```

---

## 4. Parcours

**Ranger.** Scanner l'étiquette, photographier le contenant ouvert, c'est fini.
L'écran se ferme immédiatement. Tout le reste est asynchrone.

**Retrouver.** Une barre de recherche en langage naturel. La réponse affiche le
chemin complet (Garage > Étagère métal > Bac bleu 3), la date de dernière
observation, et **la photo où l'objet a été vu**, objet encadré. La photo est ce
qui crée la confiance : elle prouve la réponse au lieu de l'affirmer.

**Corriger.** Une boîte de réception des détections non confirmées, traitable par
lots, jamais bloquante.

---

## 5. Choix techniques

| Élément | Choix | Raison |
|---|---|---|
| Front | PWA React + Vite, Workbox, Dexie | hors-ligne et appareil photo sans passer par les stores |
| API | Node + Fastify | séparée du front, consommée aussi par la PWA hors-ligne |
| Base | PostgreSQL + pgvector + RLS | une seule dépendance pour données, vecteurs et isolation |
| File d'attente | pg-boss | évite d'ajouter Redis pour une charge domestique |
| Stockage photo | MinIO, API compatible S3 | auto-hébergé, migrable vers S3 sans changer le code |
| Vision | API Claude derrière une interface | remplaçable par un modèle local plus tard |
| Accès externe | tunnel Cloudflare | aucun port ouvert, marche depuis tout navigateur |

Coût de la vision, pour environ 2000 tokens d'entrée et 300 de sortie par photo :

| Modèle | Par photo | 2000 photos |
|---|---|---|
| Claude Opus 5 | 1,8 c | 36 $ |
| Claude Sonnet 5 | 0,7 c | 14 $ |
| Claude Haiku 4.5 | 0,35 c | 7 $ |

Le rattrapage initial passe par l'API Batch, à moitié prix, puisque rien ne
presse. Le provider reste derrière une interface pour permettre de router les
photos simples vers un modèle rapide et d'escalader en cas d'incertitude.

Un modèle local reste possible mais sera lent et nettement moins bon en français
sans GPU dédié.

---

## 6. Découpage

Le plan de travail détaillé vit dans `plan/roadmap.md`, qui fait foi et suit
l'avancement. En résumé : les lots 0 à 5 constituent la V1, le lot 1 est
délibérément livrable sans aucune reconnaissance d'image, et rien au delà du lot
5 n'est planifié.

---

## 7. Bac à sable et développement

Le découpage par compte n'est pas qu'une préparation au SaaS : il donne
gratuitement un environnement de développement réaliste. Un compte de test avec
sa propre maison, ses membres et ses étiquettes vit à côté des données réelles
sans jamais les toucher.

Pour que ce soit vrai, trois contraintes en découlent, à tenir dès le lot 0 :

- **Tout cascade depuis le compte.** Clés étrangères en `ON DELETE CASCADE`
  jusqu'à la racine, et photos rangées sous un préfixe de stockage par compte.
  Supprimer un compte doit tout effacer, base et objets, sans orphelin. Sans
  cela la remise à zéro devient un script fragile que l'on n'ose plus lancer.
- **Un jeu de données semé et reproductible.** Une commande qui crée un compte
  de démonstration, deux maisons, un arbre crédible, des étiquettes et des
  observations réparties dans le temps pour que la logique de re-calibrage et de
  « plus vu depuis » ait de quoi travailler. C'est aussi ce qui permet de
  développer sans photographier sa propre maison.
- **Un compte porte son type** (`real` ou `sandbox`). La remise à zéro refuse de
  s'exécuter sur un compte réel, et l'interface marque visiblement un compte de
  démonstration. Une colonne, et une confusion coûteuse évitée.

Deux bénéfices qui suivent :

**L'isolation devient testable.** Avec deux comptes de test, on écrit le test
qui compte vraiment : le compte A ne voit rien du compte B, sur chaque route.
Sans bac à sable, le Row Level Security est une intention ; avec, c'est une
propriété vérifiée à chaque exécution de la suite de tests.

**La vision se bouchonne.** Un fournisseur de vision factice, choisi par variable
d'environnement, renvoie des détections figées pour les photos semées. Le
développement ne consomme aucun appel payant et les tests deviennent
déterministes. L'interface prévue pour changer de modèle sert exactement à ça.

Plus tard, un compte de démonstration en lecture seule pour une page de
présentation publique tombe du même mécanisme, sans travail supplémentaire.

---

## 8. Accès invité temporaire (V2)

Extension envisagée, hors périmètre V1. Cette section ne décrit rien à
construire : elle justifie trois colonnes posées dès maintenant, et sert de
garde-fou pour ne pas fermer la porte par inadvertance.

Cas d'usage : une maison louée, en courte durée ou non. Le propriétaire veut que
l'occupant sache comment la maison fonctionne et où les choses sont rangées,
pendant son séjour et pas au delà. Un usage familial ponctuel en découle aussi,
par exemple les amis qui gardent la maison pendant les vacances.

Trois propriétés le définissent.

**Il est borné dans le temps.** L'adhésion porte une fenêtre de validité et
s'éteint seule. Rien à révoquer manuellement, donc rien à oublier de révoquer.

**Il est borné dans l'espace.** Un invité est rattaché à une maison, jamais au
compte. C'est la raison pour laquelle l'adhésion porte une portée.

**Il est borné dans le contenu, et par défaut il ne voit rien.** La visibilité
invité est une autorisation explicite, nœud par nœud, héritée par le sous-arbre :
on ouvre « Cuisine » ou « Placard à balais » et tout ce qu'il contient devient
visible. Tout le reste demeure invisible.

Ce défaut n'est pas négociable. L'inverse, tout montrer sauf une liste
d'exclusions, expose les papiers, les objets de valeur et les effets personnels
du propriétaire à la première chose qu'il oublie de masquer. Une autorisation
oubliée prive l'invité d'une information ; une exclusion oubliée le renseigne sur
l'endroit où trouver les bijoux.

**Entrée sans compte.** Un lien d'invitation, transmis avec la réservation, ouvre
une session légère sur le téléphone de l'invité, valable jusqu'à la fin du
séjour. Ni mot de passe, ni inscription. Les étiquettes QR fonctionnent alors
pour lui comme pour la famille, filtrées par la visibilité invité.

**Prévisualisation obligatoire.** Le propriétaire doit pouvoir afficher sa maison
telle que l'invité la verra, avant l'arrivée. Sans ce miroir, personne ne fera
jamais confiance au filtrage, et la fonctionnalité ne sera pas utilisée.

Ce que l'invité cherche n'est d'ailleurs pas un inventaire mais un mode d'emploi :
code du wifi, fonctionnement du chauffage, jour des poubelles, emplacement de
l'aspirateur, consignes de départ. Une vue « guide » ordonnée par le
propriétaire, pointant vers des nœuds ou du texte libre, sert mieux que la
recherche. C'est le point où le volet documentation technique et le volet
rangement se rejoignent.

Remarque, sans que cela pèse sur les priorités : si l'outil devait un jour
s'ouvrir à d'autres, c'est par là qu'il aurait le plus de chances. Un inventaire
familial se vend mal, chacun pensant pouvoir s'en passer, alors qu'un guide de
maison en location s'adresse à quelqu'un dont c'est le métier. Cela ne change
rien à la V1 et ne doit rien y changer.

Rien de tout cela n'est construit. Seules trois décisions sont prises maintenant,
parce qu'elles coûtent une colonne chacune aujourd'hui et une migration
douloureuse plus tard : la portée de l'adhésion, sa fenêtre de validité, et le
drapeau de visibilité invité sur les nœuds. Tout le reste, liens d'invitation,
vue guide, prévisualisation, attend d'être réellement nécessaire.

---

## 9. Points ouverts

- Matériau des étiquettes : le papier ne survivra pas au garage et à la cave,
  prévoir du synthétique ou une plastification.
- Profils enfants : compte simplifié ou accès en lecture seule, à trancher à
  l'usage.
- Détection des doublons lorsqu'un même objet est photographié dans deux
  contenants successifs sans re-calibrage intermédiaire.
- Purge et durée de conservation des photos, qui dimensionnent le stockage.
- Coût de curation de la visibilité invité : marquer nœud par nœud serait
  rédhibitoire, l'héritage par sous-arbre doit suffire dans la pratique.
- Traçabilité des consultations invité : utile en location, à ne pas
  sur-construire.

---

## 10. Reprise de l'existant

Le dépôt contient une tentative antérieure inachevée : schéma Prisma, worker de
vision, deux applications Next.js concurrentes. Rien n'est repris. Le schéma
d'origine avait cependant identifié correctement la notion d'événement de
localisation, reprise ici sous forme d'observations.
