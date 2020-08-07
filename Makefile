.PHONY: build
build: build-dar build-jscodegen build-ui


### DAR ###

DAR=target/app.dar
DAML_SRC=$(shell find src/ -name '*.daml')

$(DAR): $(DAML_SRC)
	daml build --output $@

.PHONY: build-dar
build-dar: $(DAR)

### JS Codegen ###

JS_CODEGEN_DIR=target/daml.js
JS_CODEGEN_ARTIFACT=$(JS_CODEGEN_DIR)/supplychain-1.0.0/package.json

$(JS_CODEGEN_ARTIFACT): $(DAR)
	daml codegen js -o $(JS_CODEGEN_DIR) $<

.PHONY: build-jscodegen
build-jscodegen: $(JS_CODEGEN_ARTIFACT)


### UI Install ###

UI_INSTALL_ARTIFACT=ui/node_modules

$(UI_INSTALL_ARTIFACT): ui/package.json ui/yarn.lock $(JS_CODEGEN_ARTIFACT)
	cd ui && yarn install --force --frozen-lockfile

.PHONY: build-ui
build-ui: $(UI_INSTALL_ARTIFACT)


### UI Build for deployment ###

UI_DEPLOY_ARTIFACT=deploy/ui.zip
UI_BUILD_ARTIFACT=ui/build/index.html
TS_SRC=$(shell find ui/src/ -name '*.ts*')

$(UI_BUILD_ARTIFACT): $(UI_INSTALL_ARTIFACT) $(TS_SRC)
	cd ui && yarn build

deploy: build $(UI_BUILD_ARTIFACT)
	mkdir -p deploy
	cp -pr $(DAR) ui/build/ deploy/


.PHONY: clean
clean:
	rm -rf .daml
	rm -rf daml.js
	rm -rf ui/node_modules
	rm -rf ui/build
	rm -rf deploy
	rm -rf target
