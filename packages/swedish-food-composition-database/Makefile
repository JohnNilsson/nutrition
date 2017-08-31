XML         := xml/Naringsvarde.xml
TRANSFORMS  := 6NF
TRANSFORMED := dist/Naringsvarde.6NF.json
COMPRESSION := brotli snappy lzma
COMPRESSED  := $(foreach algorithm,$(COMPRESSION),$(foreach json,$(TRANSFORMED),$(json).$(algorithm)))

.PHONY: all
.DELETE_ON_ERROR:

all: $(COMPRESSED)

$(COMPRESSED): $(TRANSFORMED)
	scripts/compress $(subst .,,$(suffix $@)) < $< > $@

$(TRANSFORMED): $(XML)
	scripts/transform < $< > $@

$(XML):
	curl http://www7.slv.se/apilivsmedel/LivsmedelService.svc/Livsmedel/Naringsvarde/20170314 --output $@
