PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash
js_file = $(shell find ./assets/js/ -iname '*.js')

lint: $(js_file)
	@jshint $? --config ./jshint.json

.PHONY: lint
