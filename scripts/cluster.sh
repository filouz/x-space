#!/bin/bash

HOSTNAME="lab.in.example.com"
HOST_URI="https://$HOSTNAME:6443"
KUBE_PATH="$HOME/.kube"
KUBECONFIG_PATH_DEV="$HOME/.kube/config"
KUBECONFIG_PATH_LOCAL="$HOME/.kube/config_local"

# Function to install K3s
install_k3s() {
    export INSTALL_K3S_VERSION="v1.27.5+k3s1"
    curl -sfL https://get.k3s.io | sh -
    mkdir -p $(dirname $KUBECONFIG_PATH_DEV)
    ln -sf /etc/rancher/k3s/k3s.yaml $KUBECONFIG_PATH_DEV

    TOKEN=$(cat /var/lib/rancher/k3s/server/node-token)
    echo "To add worker nodes, run the following on each worker node:"
    echo "export INSTALL_K3S_VERSION="$INSTALL_K3S_VERSION"; curl -sfL https://get.k3s.io | K3S_URL=$HOST_URI K3S_TOKEN=$TOKEN sh -"
}

# Function to uninstall K3s
uninstall_k3s() {
    /usr/local/bin/k3s-uninstall.sh || true
    /usr/local/bin/k3s-agent-uninstall.sh || true
}

# Function to show K3s config
show_k3s_config() {
    if [ ! -f $KUBECONFIG_PATH_DEV ]; then
        echo "The k3s kubeconfig file does not exist."
        return 1
    fi

    # Replace the default localhost address with the actual server address and display it
    sed "s|127.0.0.1|$HOSTNAME|g" $KUBECONFIG_PATH_DEV
}



create_edit_kubeconfig() {
    mkdir -p $KUBE_PATH
    rm $KUBECONFIG_PATH_DEV
    nano $KUBECONFIG_PATH_DEV
    chmod 600 $KUBECONFIG_PATH_DEV

}

# Main logic for script arguments
case "$1" in
    -i|--install)
        install_k3s
        ;;
    -u|--uninstall)
        uninstall_k3s
        ;;
    -s|--show-config)
        show_k3s_config
        ;;
    -c|--create-config)
        create_edit_kubeconfig
        ;;
    *)
        echo "Usage: $0 {-i|--install|-u|--uninstall|-s|--show-config|-c|--create-config}"
        exit 1
        ;;
esac

exit 0


