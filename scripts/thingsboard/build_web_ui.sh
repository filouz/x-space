#!/bin/bash
set -e

DOCKER_REPO=$1
DOCKER_NAME=$2


apk add git nodejs yarn

mvn clean package \
    -Dmaven.test.skip=true \
    -Ddockerfile.skip=false \
    -pl msa/web-ui -am

cd msa/web-ui
mvn dockerfile:build@build-docker-image \
    -Dmaven.test.skip=true -Ddockerfile.skip=false \
    -Ddocker.repo=$DOCKER_REPO \
    -Ddocker.name=$DOCKER_NAME
