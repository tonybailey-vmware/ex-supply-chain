.PHONY: build
build: build-dar build-triggers-dar build-jscodegen installui


### DAR ###

MODELS_DAR=target/supplychain.dar
DAML_SRC=$(shell find src/ -name '*.daml')

$(MODELS_DAR): $(DAML_SRC) daml.yaml
	daml build --output $@

.PHONY: build-dar
build-dar: $(MODELS_DAR)


TRIGGERS_DAR=target/triggers.dar
TRIGGERS_DAML_SRC=$(shell find triggers/src/ -name '*.daml')

$(TRIGGERS_DAR): $(TRIGGERS_DAML_SRC) triggers/daml.yaml $(MODELS_DAR)
	daml build --project-root triggers --output ../$@

.PHONY: build-dar
build-triggers-dar: $(TRIGGERS_DAR)

### JS Codegen ###

JS_CODEGEN_DIR=target/daml.js
JS_CODEGEN_ARTIFACT=$(JS_CODEGEN_DIR)/supplychain-1.0.0/package.json

$(JS_CODEGEN_ARTIFACT): $(MODELS_DAR)
	daml codegen js -o $(JS_CODEGEN_DIR) $<

.PHONY: build-jscodegen
build-jscodegen: $(JS_CODEGEN_ARTIFACT)


### UI Install ###

UI_INSTALL_ARTIFACT=ui/node_modules

$(UI_INSTALL_ARTIFACT): ui/package.json ui/yarn.lock $(JS_CODEGEN_ARTIFACT)
	cd ui && yarn install --force --frozen-lockfile

.PHONY: installui
installui: $(UI_INSTALL_ARTIFACT)

.PHONY: packui
packui: installui
	cd ui && yarn build && mkdir -p ../target && zip -r ../target/bondui.zip build/

.PHONY: clean
clean:
	rm -rf .daml
	rm -rf daml.js
	rm -rf ui/node_modules
	rm -rf target
