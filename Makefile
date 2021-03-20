lint:
	npx eslint .

gendiff:
	node index.js -f json src/file1.json src/file2.json
publish:
	npm publish --dry-run
