install:
	npm install
lint:
	npx eslint .

gendiff:
	node index.js -f json file1.json file2.json
publish:
	npm publish --dry-run

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8
