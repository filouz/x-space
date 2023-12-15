#!/bin/bash


sudo apt-get update -y

sudo apt upgrade -y

sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    git \
    nano \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor --yes -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null


sudo apt-get update -y

sudo apt-get install -y docker-ce docker-ce-cli containerd.io

sudo apt install zsh -y

sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="ys"/g' /root/.zshrc

rm -r /root/.oh-my-zsh/plugins/zsh-autocomplete
git clone --depth 1 -- https://github.com/marlonrichert/zsh-autocomplete.git /root/.oh-my-zsh/plugins/zsh-autocomplete
sed -i 's/plugins=(/plugins=(zsh-autocomplete /g' /root/.zshrc


#### K9S 
K9S_URL="https://github.com/derailed/k9s/releases/download/v0.27.4/k9s_Linux_amd64.tar.gz"
TMP_DIR=$(mktemp -d)
curl -L "$K9S_URL" -o "$TMP_DIR/k9s.tar.gz"
tar -xvf "$TMP_DIR/k9s.tar.gz" -C "$TMP_DIR"
sudo mv "$TMP_DIR/k9s" /usr/local/bin/k9s
sudo chmod +x /usr/local/bin/k9s
rm -rf "$TMP_DIR"


## Subctl
curl -Ls https://get.submariner.io | bash

# kubectl
KUBECTL_VERSION=$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)
curl -LO "https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
echo "kubectl installed successfully"



# helm
if ! [ -x "$(command -v helm)" ]; then
    echo 'Helm is not installed. Installing now...' >&2
    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
else
    echo 'Helm is already installed.' >&2
fi