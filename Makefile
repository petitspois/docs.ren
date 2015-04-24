PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

js_file := $(shell find assets/js/ -iname '*.js')
all_js := $(wildcard assets/js/*/*.js || assets/js/*.js)
min_js := $(all_js:assets/js/%.js=dest/%.min.js)						

dest/%.min.js: assets/js/%.js
	@[ -d $(dir $@) ] || mkdir -p $(dir $@)
	@uglifyjs -cmo $@ $^

minjs: $(min_js) 

lint: $(js_file)
	@jshint $? --config ./jshint.json
.PHONY: lint minjs
