
ESPACE_PATH=$(LIBRARY_PATH)/espace
TAG_DEV=dev

ESPACE_ARTIFACT=$(REGISTRY)/espace:$(TAG)
ARTIFACT_NETHOPS=${REGISTRY_ROOT}/nethops/client:local


############################################
############################################

espace:	espace_build espace_push 

espace_build:
	docker build $(ESPACE_PATH) -f $(ESPACE_PATH)/docker/Dockerfile -t $(REGISTRY)/espace/webapp:$(TAG)

espace_push:
	docker push $(REGISTRY)/espace/webapp:$(TAG)

#####################

espace_shell:
	kubectl -n ${NAMESPACE} exec -it $(shell kubectl get pods -n espace -l app=lab-espace -o name) -c espace -- zsh

espace_compose: 
	docker build $(ESPACE_PATH) -f $(ESPACE_PATH)/docker/Dockerfile.dev -t $(REGISTRY)/espace:$(TAG_DEV)
	docker push $(REGISTRY)/espace:$(TAG_DEV)

ifdef INC_VERSION
	$(MAKE) increment_version target=espace
endif

	$(MAKE) check

	kubectl apply -f $(DEPLOYMENT_NS)/lab/espace.yaml

espace_compose_clean:
	@-kubectl delete -f $(DEPLOYMENT_NS)/lab/espace.yaml

espace_stopvpn:
	-curl -x "" http://localhost:8080/stop
	unset http_proxy
	unset https_proxy


###############################################################

espace_bridge: espace_bridge_build espace_bridge_push

espace_bridge_build:
	docker build $(ESPACE_PATH) -f $(ESPACE_PATH)/docker/bridge.Dockerfile -t $(REGISTRY)/espace/cmd/bridge:$(TAG)

espace_bridge_push:
	docker push $(REGISTRY)/espace/cmd/bridge:$(TAG)


################################################################

espace_deploy_services_with_build: espace espace_bridge

	$(MAKE) increment_version target=ESPACE
	$(MAKE) check
	
	kubectl apply -k $(DEPLOYMENT_NS)/espace


espace_deploy_services:

	$(MAKE) increment_version target=ESPACE
	$(MAKE) check
	
	kubectl apply -k $(DEPLOYMENT_NS)/espace