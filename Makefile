install:
	npm install
lint:
	npx eslint .

gendiff S?=stylish:
	node bin/gendiff.js -f $(S) after.json before.json

publish:
	npm publish --dry-run

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8
