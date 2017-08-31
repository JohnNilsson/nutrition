VERSION     := 20170314
BASE_URI    := http://www7.slv.se/apilivsmedel/LivsmedelService.svc/Livsmedel
URI         := $(BASE_URI)/Naringsvarde/$(VERSION)
XML         := xml/Naringsvarde.xml
TRANSFORMS  := 6NF
TRANSFORMED := dist/Naringsvarde.6NF.json
COMPRESSION := brotli snappy lzma
COMPRESSED  := $(foreach algorithm,$(COMPRESSION),$(foreach json,$(TRANSFORMED),$(json).$(algorithm)))

.PHONY: all
.DELETE_ON_ERROR:

all: $(COMPRESSED)

$(COMPRESSED): $(TRANSFORMED)
	./compress $(subst .,,$(suffix $@)) < $< > $@

$(TRANSFORMED): $(XML)
	./transform < $< > $@

$(XML):
	curl $(URI) --output $@
