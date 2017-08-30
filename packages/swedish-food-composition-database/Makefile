dist/Naringsvarde.6NF.json.br: dist/Naringsvarde.6NF.json
	scripts/compress < $< > $@

dist/Naringsvarde.6NF.json: xml/Naringsvarde.xml
	scripts/transform < $< > $@

xml/Naringsvarde.xml:
	curl http://www7.slv.se/apilivsmedel/LivsmedelService.svc/Livsmedel/Naringsvarde/20170314 --output $@
