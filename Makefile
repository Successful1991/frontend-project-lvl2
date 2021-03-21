install:
	npm install
lint:
	npx eslint .

gendiff:
	node index.js -f json __fixtures__/file1.json __fixtures__/file2.json
publish:
	npm publish --dry-run

test:
	npm test
