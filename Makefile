install:
	npm install
lint:
	npx eslint .

gendiff S?=stylish:
	node index.js -f $(S) after.json before.json

publish:
	npm publish --dry-run

test:
	npx jest

test-coverage:
	npm test -- --coverage --coverageProvider=v8
