#!/usr/bin/env bash

set -euo pipefail

ACTION=${1:-"start"}

# Path to your Caddyfile
CADDYFILE_PATH="$(pwd)/src/Caddyfile"

# The Docker image of Caddy
CADDY_DOCKER_IMAGE="docker.io/caddy:latest"

#########################
# Functions
#########################

caddy_installed() {
	command -v caddy >/dev/null 2>&1
}

validate_caddyfile() {
	caddy validate --config "${CADDYFILE_PATH}" || {
		echo "Caddyfile is invalid!"
		return 1
	}
}

format_caddyfile() {
	caddy fmt --overwrite "${CADDYFILE_PATH}" || {
		echo "Caddyfile is invalid!"
		return 1
	}
}

reload_caddy_local() {
	caddy reload \
		--config "${CADDYFILE_PATH}" \
		--adapter caddyfile \
		--force ||
		{
			echo "Caddyfile is invalid!"
			return 1
		}
}

start_caddy_local() {

	echo "Starting Caddy Server with local binary..."

	caddy run \
		--config "${CADDYFILE_PATH}" \
		--adapter caddyfile \
		&

	CADDY_PID=$!

	sleep 3
	echo "Caddy Server has started with PID: ${CADDY_PID}"

	return 0

}

start_caddy_docker() {

	echo "Starting Caddy Server with Docker..."

	# Ensure network connectivity
	docker network inspect caddy-net >/dev/null 2>&1 ||
		docker network create caddy-net

	docker run \
		--network caddy-net \
		--name caddy-server \
		--rm \
		--detach \
		-p 9000:9000 \
		-v "$(pwd)/config/Caddyfile:/etc/caddy/Caddyfile" \
		-v caddy_data:/data \
		-v caddy_config:/config \
		--add-host=host.docker.internal:host-gateway \
		"${CADDY_DOCKER_IMAGE}"

	# Wait for Caddy to start
	COUNTER=0
	while [ $COUNTER -lt 30 ]; do
		if curl -s https://localhost:9000/health >/dev/null; then
			echo "Caddy started successfully"
			docker logs -f caddy-server &
			exit 0
		fi
		sleep 1
		COUNTER=$((COUNTER + 1))
	done

	echo "Failed to start Caddy"
	exit 1

}

#########################
# Main
#########################

case $ACTION in
start)

	sudo -v

	validate_caddyfile || exit 1
	format_caddyfile || exit 1

	if caddy_installed; then
		start_caddy_local
	else
		start_caddy_docker
	fi
	;;
stop)
	if caddy_installed; then
		echo "Stopping Caddy Server..."
		pkill caddy || true
	else
		echo "Stopping Caddy Server running in Docker..."
		docker stop caddy-server || true
	fi
	echo "Caddy Server has stopped"
	;;
reload)
	validate_caddyfile || exit 1

	if caddy_installed; then
		reload_caddy_local
	else
		docker stop caddy-server || true
		start_caddy_docker
	fi
	;;
*)
	echo "Invalid action: ${ACTION}"
	exit 1
	;;
esac

exit 0
