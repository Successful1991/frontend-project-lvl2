install:
	npm install
lint:
	npx eslint .

gendiff:
	node index.js -f json after.json before.json
publish:
	npm publish --dry-run

test:
	npm test --colors

test-coverage:
	npm test -- --coverage --coverageProvider=v8 --colors
