VERSION     := 20170314
BASE_URI    := http://www7.slv.se/apilivsmedel/LivsmedelService.svc/Livsmedel
URI         := $(BASE_URI)/Naringsvarde/$(VERSION)
XML         := data/Naringsvarde.xml
TRANSFORMS  := 6NF
TRANSFORMED := $(foreach transform,$(TRANSFORMS),data/Naringsvarde.$(transform).json)
TOCOMPRESS  := $(TRANSFORMED)
COMPRESSION := brotli
COMPRESSED  := $(foreach algorithm,$(COMPRESSION),$(foreach file,$(TOCOMPRESS) $(XML),$(file).$(algorithm)))

.PHONY: all tools
.DELETE_ON_ERROR:
.SECONDEXPANSION:

PATH  := .:$(shell npm bin):$(PATH)
SHELL := /bin/bash

all: npm_install $(COMPRESSED)

$(COMPRESSED): $$(basename $$@)
	@mkdir -p $(@D)
	compress $(subst .,,$(suffix $@)) < $< > $@

$(TRANSFORMED): data/Naringsvarde.%.json: $(XML)
	@mkdir -p $(@D)
	transform $* < $< > $@

%.proto.js: %.proto
	pbjs -t static-module -w commonjs --keep-case -o $@ $<

$(XML):
	@mkdir -p $(@D)
	curl $(URI) --output $@

npm_install: package-lock.json

package-lock.json: package.json
	npm install
	@touch package-lock.json
