
# Requirements

- An operational Kubernetes cluster. Example: [https://k3s.io/](https://k3s.io/)
- An operational MQTT as a source of data for your actual devices. (In my case, I'm using Home Assistant, which exposes an MQTT service acting as a relay for my Zigbee devices.)

You need to modify the following parameters in the Makefile:

```bash
PUBLIC_DOMAIN_NAME=espace.example.com
LAB_DOMAIN_NAME=lab.example.com
REGISTRY_ROOT=ghcr.io/filouz
REGISTRY_AUTH=__BASE64_ENCODE('USERNAME:PASSWORD')__
```

Run the below automated Makefile scripts on a host equipped with the `kubectl` CLI:

```bash
make setup_storage
```

# Deploy ThingsBoard

To run a temporary Helm chart local server, use:

```bash
make helper_run_local_helm
```

Keep the Helm server running and install the ThingsBoard chart:

```bash
make install_thingsboard
```

Demo Credentials:

System Administrator: 
sysadmin@thingsboard.org / sysadmin

# Deploy Bridge & Mini-Webapp

For this demonstration, the bridge connects to the MQTT of Home Assistant, which is behind a proxy as it was deployed in a private home network.
In this case, you must provide an OVPN profile and password to the following folder: `./scripts/ovpn`.

```bash
# ./scripts/ovpn/client.ovpn

client
nobind
dev tun
remote-cert-tls server

remote internal.example.com 24558 udp

script-security 2

<key>
-----BEGIN ENCRYPTED PRIVATE KEY-----
xxxx...
```

```bash
# ./scripts/ovpn/client.pwd

strong_password
```

Then execute:

```bash
make install_ovpn install_base espace_deploy_services
```

# Note
Before deploying or running the bridge and webapp services, delve into `library/packages/cmd/bridge` & `library/packages/webapp` to edit some configuration files.
