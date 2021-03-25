install:
	npm install
lint:
	npx eslint .

gendiff S?=stylish:
	node bin/gendiff.js -f $(S) __fixtures__/after.json __fixtures__/before.json

publish:
	npm publish --dry-run

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8
