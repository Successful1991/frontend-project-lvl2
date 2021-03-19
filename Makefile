lint:
	npx eslint .

gendiff:
	node src/gendiff.js -f json src/file1.json src/file2.json
