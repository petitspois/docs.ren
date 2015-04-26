PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

js_file := $(shell find assets/js/ -iname '*.js')
all_js := $(wildcard assets/js/*/*.js || assets/js/*.js)
min_js := $(all_js:assets/js/%.js=assets/dest/js/%.min.js)						
all_css := $(wildcard assets/css/*.css)
min_css := $(all_css:assets/css/%.css=assets/dest/css/%.min.css)

install:
	@npm install

start: install
	@nohup pm2 start app.js -i max --name "docs" --max-memory-restart 460M &>> docs.log &

restart: install build
	@nohup pm2 restart "docs" &>> docs.log &

assets/dest/js/%.min.js: assets/js/%.js
	@[ -d $(dir $@) ] || mkdir -p $(dir $@)
	@uglifyjs -cmo $@ $^

minjs: $(min_js) 

assets/dest/css/%.min.css: assets/css/%.css
	@[ -d $(dir $@) ] || mkdir -p $(dir $@)
	@cleancss -o $@ $^

mincss: $(min_css)

lint: $(js_file)
	@jshint $? --config ./jshint.json
.PHONY: lint minjs
