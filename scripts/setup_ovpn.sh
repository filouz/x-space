#!/bin/bash

NAMESPACE=$1
OVPN_DIR=$2
CMD=$3  # New argument for the command, either 'kubectl' or 'kd'

if [ -z "$CMD" ]; then
    echo "No command specified, defaulting to 'kubectl'"
    CMD="kubectl"
fi

echo "NAMESPACE: $NAMESPACE"
echo "OVPN_DIR: $OVPN_DIR"
echo "Using command: $CMD"

# Declare an associative array for secrets
declare -A secrets
secrets["ovpn-client-pass"]="client.pwd"
secrets["ovpn-client"]="client.ovpn"

# Iterate over the secrets array
for secret in "${!secrets[@]}"
do
  file="${secrets[$secret]}"

  # Check if the secret exists and delete it if it does
  if $CMD --namespace=${NAMESPACE} get secret ${secret} &> /dev/null; then
      echo "Secret ${secret} exists, deleting..."
      $CMD --namespace=${NAMESPACE} delete secret ${secret}
  fi

  # Create the secret
  $CMD --namespace=${NAMESPACE} create secret generic ${secret} --from-file=${file}=${OVPN_DIR}/${file}
done
