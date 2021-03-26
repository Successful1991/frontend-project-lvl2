install:
	npm install
lint:
	npx eslint .

gendiff S?=stylish:
	node bin/index.js -f $(S) __fixtures__/before.json __fixtures__/after.json

publish:
	npm publish --dry-run

test:
	npm test --watch


test-coverage:
	npm test -- --coverage --coverageProvider=v8
