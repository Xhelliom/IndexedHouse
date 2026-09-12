# Lot 0 — Socle

- Statut : à faire
- Décisions applicables : ADR 0006, 0009, 0012, 0013, 0014, 0015, 0018, 0020

## But

Faire fonctionner la chaîne complète de bout en bout : je m'authentifie depuis
mon téléphone, sur le vrai domaine, en HTTPS valide, je vois mes deux maisons, et
le cloisonnement entre comptes est démontré par des tests.

Aucune fonctionnalité d'inventaire. C'est un squelette qui marche, pas un
produit. Sa valeur est de prouver que rien de structurel ne bloque, au moment où
c'est encore facile à corriger.

## Périmètre

**Dépôt.** Suppression de la tentative antérieure (`api/`, `web/`,
`indexed-house/`), dans le même commit que la mise en place du socle. Dépôt
unique en espaces de travail : interface, serveur, paquet partagé.

**Construction et déploiement.** Une seule image contenant l'interface compilée
et le serveur qui la sert. Deux déploiements sur le cluster, avec deux commandes
de démarrage : le service web et le worker. Un service, une entrée. Intégration
continue qui vérifie le style, les types et les tests, puis construit et pousse
l'image.

**Accès.** Nom de domaine, entrée, certificat obtenu par défi DNS. Le même nom
est utilisé depuis la maison et depuis l'extérieur.

**Base.** Postgres par l'opérateur CloudNativePG, avec sa sauvegarde vers
stockage objet. Migrations Drizzle en SQL, appliquées par un travail éphémère
avant le démarrage, en avant seulement. Row Level Security posé **dès la première
migration**.

**Modèle.** Utilisateurs, comptes, maisons, adhésions.

**Accès base.** La fonction unique qui ouvre la transaction et pose le compte
courant, et le test qui échoue si on la contourne.

**Authentification.** Courriel et mot de passe, session longue durée sur
l'appareil, invitation d'un membre par lien.

**Interface.** Écran de connexion, sélecteur de maison, liste des membres,
invitation. Manifeste d'application installable et coquille mise en cache par un
service worker.

**Page de diagnostic.** Affiche l'état du contexte sécurisé, la disponibilité de
la caméra, l'enregistrement du service worker, et la version de l'image. Elle
existe pour lever tout doute sur l'ADR 0015 avant d'avoir écrit la moindre
fonctionnalité qui en dépend.

**Bac à sable.** Commande de semis reproductible, type de compte, commande de
remise à zéro.

**Exploitation.** Point de santé, journaux structurés, deux alertes seulement, le
disque et la sauvegarde manquante. Travail mensuel qui restaure la sauvegarde
dans un compte de bac à sable, vérifie et détruit.

## Parcours

1. J'ouvre l'adresse sur mon téléphone. L'application s'installe sur l'écran
   d'accueil.
2. Je me connecte. Je ne me reconnecterai plus.
3. J'arrive sur le sélecteur de maison, qui liste mes deux maisons. Chacune est
   vide, et l'écrit.
4. J'ouvre les membres, j'invite quelqu'un par lien. Il définit son mot de passe
   et rejoint le compte.
5. Je bascule d'une maison à l'autre. Le choix est mémorisé.
6. J'ouvre la page de diagnostic et je vérifie que tout est vert.
7. Je coupe le réseau et je rouvre l'application. Elle s'affiche et indique
   qu'elle est hors-ligne.

## Règles

- Une session dure un an et se renouvelle à l'usage. Aucun membre de la famille
  ne doit avoir à se reconnecter.
- Tout accès à la base passe par la fonction unique, dans une transaction, avec
  le compte courant posé. Aucune exception.
- Une adhésion porte une portée et une fenêtre de validité. Une adhésion expirée
  ne donne aucun accès, même si aucune interface ne permet encore d'en créer une
  temporaire.
- Seuls les rôles propriétaire et administrateur peuvent inviter.
- Les mots de passe sont hachés avec argon2id.
- La remise à zéro refuse de s'exécuter sur un compte de type `real`.
- Les migrations ne se rejouent pas et ne reviennent pas en arrière.
- Le worker démarre, se connecte à la file et n'a rien à consommer. C'est normal.

## Modèle de données touché

Créé : `user`, `account`, `place`, `membership`, et les politiques de sécurité
associées. Voir la section 3.1 du document d'architecture et l'ADR 0006.

L'arbre des nœuds n'est **pas** créé dans ce lot. Il appartient au lot 1, qui le
mettra à l'épreuve avec de vraies données.

## Critères d'acceptation

1. Sur un téléphone réel, l'application s'ouvre sur le domaine public en HTTPS
   avec un certificat valide, et s'installe sur l'écran d'accueil.
2. La page de diagnostic indique un contexte sécurisé, une caméra accessible et
   un service worker enregistré.
3. Réseau coupé, l'application s'ouvre et affiche son état hors-ligne.
4. Deux déploiements tournent depuis la même image, avec deux commandes
   différentes.
5. Un déploiement neuf applique la migration ; un second déploiement ne la
   rejoue pas.
6. Un test échoue si du code accède à la base sans passer par la fonction unique.
7. Pour chaque route existante, un test vérifie qu'un membre du compte A n'obtient
   aucune ligne appartenant au compte B.
8. Une adhésion dont la validité est dépassée n'ouvre aucun accès.
9. La commande de semis crée un compte de bac à sable avec deux maisons et
   plusieurs membres, de façon reproductible.
10. La remise à zéro échoue explicitement sur un compte `real`.
11. Après suppression d'un compte de bac à sable, un test compte zéro ligne
    restante dans chaque table et zéro objet restant sous son préfixe de
    stockage.
12. Une sauvegarde de base existe dans le stockage objet, et le travail de
    restauration mensuel s'exécute et réussit.
13. Une sauvegarde absente depuis quarante-huit heures déclenche une alerte.
14. Connecté une fois sur un téléphone, je le suis encore une semaine plus tard.

## Hors périmètre assumé

- **L'arbre, les étiquettes, les photos, MinIO.** Rien ne produit encore d'image,
  donc rien à stocker. Lots 1 et 2.
- **Le fournisseur de vision factice** prévu par l'ADR 0009. Il n'a rien à
  simuler tant qu'aucun appel de vision n'existe. Reporté au lot 2, où il sera
  écrit en même temps que l'interface qu'il remplace.
- **La recherche vectorielle**, ADR 0017.
- **Toute brique de synchronisation**, ADR 0016. Un service worker qui met la
  coquille en cache n'est pas de la synchronisation, et n'engage rien.
- **L'interface d'accès invité.** Seules la portée et la validité existent en
  base, et sont respectées par le contrôle d'accès.
- **Inscription publique, facturation, courriels transactionnels.** Les comptes
  sont créés à la main ou par semis.
- **Le double horizon DNS.** On démarre avec un seul chemin d'accès. Les envois
  locaux qui repassent par l'extérieur ne gênent personne avant le lot 2, où les
  photos apparaissent.
