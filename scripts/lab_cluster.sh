#!/bin/bash

# Define host and other variables
HOSTNAME="lab.in.example.com"
HOST_URI="https://$HOSTNAME:6443"
KUBE_PATH="$HOME/.kube"
KUBECONFIG_PATH_DEV="$HOME/.kube/config"
KUBECONFIG_PATH_LOCAL="$HOME/.kube/config_local"

# Function to install K3s
install_k3s() {
    export INSTALL_K3S_VERSION="v1.27.5+k3s1"
    curl -sfL https://get.k3s.io | sh -s - server \
        --cluster-cidr=15.42.2.0/24 \
        --service-cidr=15.43.2.0/24

    mkdir -p $(dirname $KUBECONFIG_PATH_DEV)
    ln -sf /etc/rancher/k3s/k3s.yaml $KUBECONFIG_PATH_LOCAL

    sed -i "s|127.0.0.1|$HOSTNAME|g" /etc/rancher/k3s/k3s.yaml

    TOKEN=$(cat /var/lib/rancher/k3s/server/node-token)
    echo "To add worker nodes, run the following on each worker node:"
    echo "export INSTALL_K3S_VERSION="$INSTALL_K3S_VERSION" curl -sfL https://get.k3s.io | K3S_URL=$HOST_URI K3S_TOKEN=$TOKEN sh -"
}

# Function to uninstall K3s
uninstall_k3s() {
    /usr/local/bin/k3s-uninstall.sh || true
    /usr/local/bin/k3s-agent-uninstall.sh || true
}

subctl() {
    echo "subctl deploy-broker --kubeconfig '$KUBECONFIG_PATH_LOCAL'"
    echo "subctl join --kubeconfig '$KUBECONFIG_PATH_LOCAL' broker-info.subm --clusterid local-coreader"
    echo "subctl join --kubeconfig '$KUBECONFIG_PATH_DEV' broker-info.subm --clusterid dev-coreader"
}

# Main logic for script arguments
case "$1" in
    -i|--install)
        install_k3s
        ;;
    -u|--uninstall)
        uninstall_k3s
        ;;
    -c|--subctl)
        subctl
        ;;
    
    *)
        echo "Usage: $0 {-i|--install|-u|--uninstall}"
        exit 1
        ;;
esac

exit 0

