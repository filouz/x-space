NAMESPACE=espace
SERVICE_ACCOUNT=espace

PUBLIC_DOMAIN_NAME=espace.example.com
LAB_DOMAIN_NAME=lab.example.com

REGISTRY_ROOT = ghcr.io/filouz
REGISTRY = ${REGISTRY_ROOT}/espace
REGISTRY_AUTH=Zmlsb3V6OmdocF9qVVNsN1ZYdUZETHFHcHp2TXQ2bzQ2RjhnRUxOYmozeGtzME8=
TAG = local

mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
ROOT_PATH := $(dir $(mkfile_path))
LIBRARY_PATH := $(dir $(ROOT_PATH))/library
OVPN_DIR := $(dir $(ROOT_PATH))/scripts/ovpn
TOOLCHAIN_PATH := $(dir $(ROOT_PATH))/toolchain

DEPLOYMENT_DIR=$(ROOT_PATH)/deployment
DEPLOYMENT_NS=${ROOT_PATH}/.cache/deployment/.${NAMESPACE}

KUBE_CONFIG_PATH_LOCAL=/root/.kube/config_local
KUBECTL_DEV=kubectl --kubeconfig=$(KUBE_CONFIG_PATH)


############################################
############################################

export 

check: 
	@-bash ./scripts/kustomize_deployment.sh

increment_version:
	@bash ./scripts/increment_version.sh -t $(target)

#############################

helm_thingsboard:
	cd $(TOOLCHAIN_PATH)/thingsboard-chart && \
		rm -f index.yaml && rm -f *.tgz && \
		helm dependency update && \
		helm package . && \
		helm repo index . 

	-helm repo add helm-local http://localhost:8080/
	-helm repo update

install_thingsboard: check helm_thingsboard
	-helm install -n $(NAMESPACE) thingsboard helm-local/thingsboard -f $(DEPLOYMENT_NS)/values/thingsboard-values.yaml --debug

debug_thingsboard: check helm_thingsboard
	-helm template -n $(NAMESPACE) thingsboard helm-local/thingsboard -f $(DEPLOYMENT_NS)/values/thingsboard-values.yaml --debug


uninstall_thingsboard:
	-@helm uninstall -n $(NAMESPACE) thingsboard  


upgrade_thingsboard: check
	helm upgrade -n $(NAMESPACE) thingsboard helm-local/thingsboard --debug -f $(DEPLOYMENT_NS)/values/thingsboard-values.yaml 

#############################

setup_storage: check
	kubectl apply -k $(DEPLOYMENT_NS)/storage

	# kubectl -n $(NAMESPACE) patch serviceaccount default -p '{"imagePullSecrets": [{"name": "regcred"}]}'

remove_storage: check
	kubectl delete -k $(DEPLOYMENT_NS)/storage

install_base: check
	$(MAKE) increment_version target=BASE
	kubectl apply -k $(DEPLOYMENT_NS)/base

uninstall_base: check
	-kubectl delete -k $(DEPLOYMENT_NS)/base




#############################

install_ovpn:
	@bash ./scripts/setup_ovpn.sh "$(NAMESPACE)" "$(OVPN_DIR)"


#############################

helper_clean_pods:
	kubectl -n espace get pods | grep $(status) | awk '{print $$1}' | xargs kubectl -n espace delete pod --force


helper_finalize_terminating_resources:
	-kubectl patch pvc $(H_NAME)-pvc -n espace -p '{"metadata":{"finalizers": []}}' --type=merge

	-kubectl patch pv $(H_NAME)-pv -n espace -p '{"metadata":{"finalizers": []}}' --type=merge

helper_run_local_helm:
	python -m http.server 8080 -d $(TOOLCHAIN_PATH)/thingsboard-chart


############################################
############################################

uninstall: 
	$(MAKE) uninstall_espace uninstall_base

install : 
	$(MAKE) install_espace install_base 

############################################
############################################

deploy_lab: check
	kubectl apply -k $(DEPLOYMENT_NS)/lab


remove_lab: check
	@-kubectl delete -k $(DEPLOYMENT_NS)/lab


############################################
############################################


thingsboard_dev_build:
	
	docker run -it --rm \
		-w /app \
		-v $(shell pwd)/toolchain/thingsboard:/app \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-v $(shell pwd)/scripts/thingsboard:/scripts \
		intension/docker-dind-maven \
		/scripts/build_web_ui.sh "$(REGISTRY)" "thingsboard/tb-web-ui"

	docker push $(REGISTRY)/thingsboard/tb-web-ui


include $(LIBRARY_PATH)/espace/makefile
