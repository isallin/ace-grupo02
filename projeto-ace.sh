#!/bin/bash

set -e

apt-get update -y
apt-get upgrade -y

apt-get install -y 
ca-certificates 
curl 
git 
gnupg 
lsb-release

if ! command -v docker >/dev/null 2>&1; then
curl -fsSL https://get.docker.com | sh
fi

systemctl enable docker
systemctl start docker

apt-get install -y docker-compose-plugin

cd /home/ubuntu

if [ ! -d "etlNovo" ]; then
git clone SEU_REPOSITORIO_GIT etlNovo
fi

cd /home/ubuntu/etlNovo

git pull

docker compose build

docker compose up --abort-on-container-exit

docker compose down

CRON_JOB='0 0 1 1 * cd /home/ubuntu/etlNovo && docker compose up --abort-on-container-exit && docker compose down >> /var/log/ace-etl.log 2>&1'

(crontab -l 2>/dev/null | grep -F "$CRON_JOB") || (
crontab -l 2>/dev/null
) | crontab -
