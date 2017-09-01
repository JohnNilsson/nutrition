VERSION     := 20170314
BASE_URI    := http://www7.slv.se/apilivsmedel/LivsmedelService.svc/Livsmedel
URI         := $(BASE_URI)/Naringsvarde/$(VERSION)
XML         := data/Naringsvarde.xml
TRANSFORMS  := 6NF 5NF
TRANSFORMED := $(foreach transform,$(TRANSFORMS),data/Naringsvarde.$(transform).json)
COMPRESSION := brotli snappy lzma lzf
COMPRESSED  := $(foreach algorithm,$(COMPRESSION),$(foreach json,$(TRANSFORMED) $(XML),$(json).$(algorithm)))

.PHONY: all
.DELETE_ON_ERROR:
.SECONDEXPANSION:

all: $(COMPRESSED)

$(COMPRESSED): $$(basename $$@)
	@mkdir -p $(@D)
	./compress $(subst .,,$(suffix $@)) < $< > $@

data/Naringsvarde.%.json: $(XML)
	@mkdir -p $(@D)
	./transform $* < $< > $@

$(XML):
	@mkdir -p $(@D)
	curl $(URI) --output $@
