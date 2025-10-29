#!/usr/bin/env bash

# Script de génération d'un JWT_SECRET et mise à jour de votre fichier .env
# Usage: ./generate-jwt-secret.sh [CHEMIN_VERS_ENV]
# - Si aucun chemin n'est fourni, /home/swetterwald/git/IndexedHouse/.env est utilisé.
# - Définit JWT_SECRET_LENGTH pour changer la taille (en octets base64) si besoin.

set -euo pipefail

ENV_FILE="${1:-/home/swetterwald/git/IndexedHouse/.env}"
SECRET_LENGTH="${JWT_SECRET_LENGTH:-48}"

# Génère un secret aléatoire base64 et safe URL (remplace / et +)
generate_secret() {
	if command -v openssl >/dev/null 2>&1; then
		openssl rand -base64 "$SECRET_LENGTH" | tr -d '\n' | tr '/+' '-_'
	else
		# Fallback sans openssl
		head -c 64 /dev/urandom | base64 | tr -d '\n' | tr '/+' '-_'
	fi
}

NEW_SECRET="$(generate_secret)"

if [ ! -f "$ENV_FILE" ]; then
	echo "Fichier $ENV_FILE introuvable, création..."
	touch "$ENV_FILE"
fi

# Remplace la ligne existante ou ajoute à la fin
if grep -q '^JWT_SECRET=' "$ENV_FILE"; then
	sed -i.bak "s/^JWT_SECRET=.*/JWT_SECRET=$NEW_SECRET/" "$ENV_FILE"
else
	printf "\nJWT_SECRET=%s\n" "$NEW_SECRET" >> "$ENV_FILE"
fi

echo "JWT_SECRET mis à jour dans $ENV_FILE"


