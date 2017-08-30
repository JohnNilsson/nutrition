.PHONY : all
all: dist/Naringsvarde.6NF.json.brotli dist/Naringsvarde.6NF.json.snappy dist/Naringsvarde.6NF.json.lzma

dist/Naringsvarde.6NF.json.brotli: dist/Naringsvarde.6NF.json
	scripts/compress brotli < $< > $@

dist/Naringsvarde.6NF.json.snappy: dist/Naringsvarde.6NF.json
	scripts/compress snappy < $< > $@

dist/Naringsvarde.6NF.json.lzma: dist/Naringsvarde.6NF.json
	scripts/compress lzma < $< > $@

dist/Naringsvarde.6NF.json: xml/Naringsvarde.xml
	scripts/transform < $< > $@

xml/Naringsvarde.xml:
	curl http://www7.slv.se/apilivsmedel/LivsmedelService.svc/Livsmedel/Naringsvarde/20170314 --output $@
