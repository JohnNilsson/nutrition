VERSION     := 20170314
BASE_URI    := http://www7.slv.se/apilivsmedel/LivsmedelService.svc/Livsmedel
URI         := $(BASE_URI)/Naringsvarde/$(VERSION)
XML         := data/Naringsvarde.xml
TRANSFORMS  := 6NF 5NF
TRANSFORMED := $(foreach transform,$(TRANSFORMS),data/Naringsvarde.$(transform).json)
ENCODINGS   := pson
ENCODED     := $(foreach encoding,$(ENCODINGS),$(foreach transform,$(TRANSFORMS),data/Naringsvarde.$(transform).$(encoding)))
TOCOMPRESS  := $(TRANSFORMED) $(ENCODED)
COMPRESSION := brotli snappy lzma lzf
COMPRESSED  := $(foreach algorithm,$(COMPRESSION),$(foreach file,$(TOCOMPRESS) $(XML),$(file).$(algorithm)))

.PHONY: all tools
.DELETE_ON_ERROR:
.SECONDEXPANSION:

export PATH := .:node_modules/.bin:$(PATH)

all: npm_install $(COMPRESSED)

$(COMPRESSED): $$(basename $$@)
	@mkdir -p $(@D)
	compress $(subst .,,$(suffix $@)) < $< > $@

$(ENCODED): $$(basename $$@).json
	@mkdir -p $(@D)
	encode $(subst .,,$(suffix $@)) < $< > $@

$(TRANSFORMED): data/Naringsvarde.%.json: $(XML)
	@mkdir -p $(@D)
	transform $* < $< > $@

$(XML):
	@mkdir -p $(@D)
	curl $(URI) --output $@

npm_install: package-lock.json

package-lock.json: package.json
	npm install
	@touch package-lock.json
