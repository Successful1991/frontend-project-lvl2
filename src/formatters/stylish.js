import _ from 'lodash';

function createIndents(spacesCount, depth) {
  const indentSize = depth * spacesCount;
  const currentIndent = ' '.repeat(indentSize);
  const bracketIndent = ' '.repeat(indentSize - spacesCount);
  return { currentIndent, bracketIndent };
}
function joinObject(lines, bracketIndent) {
  return ['{', ...lines, `${bracketIndent}}`].join('\n');
}
function parseValue(value, spacesCount, depth) {
  if (!_.isObject(value)) {
    return value;
  }

  const { currentIndent, bracketIndent } = createIndents(spacesCount, depth);
  const lines = Object.entries(value)
    .map(([key, val]) => [`${currentIndent}  ${key}: ${parseValue(val, spacesCount, depth + 2)}`]);

  return joinObject(lines, bracketIndent);
}

export default function stylish(dataTree, spacesCount = 2) {
  const iter = (nodes, depth) => {
    const { currentIndent, bracketIndent } = createIndents(spacesCount, depth);

    const lines = nodes.flatMap((node) => {
      switch (node.type) {
        case 'added':
          return [`${currentIndent}+ ${node.name}: ${parseValue(node.value, spacesCount, depth + 2)}`];
        case 'deleted':
          return [`${currentIndent}- ${node.name}: ${parseValue(node.value, spacesCount, depth + 2)}`];
        case 'changed':
          return [
            `${currentIndent}- ${node.name}: ${parseValue(node.value1, spacesCount, depth + 2)}`,
            `${currentIndent}+ ${node.name}: ${parseValue(node.value2, spacesCount, depth + 2)}`,
          ];
        case 'nested':
          return [`${currentIndent}  ${node.name}: ${iter(node.children, depth + 2)}`];
        case 'unchanged':
          return [`${currentIndent}  ${node.name}: ${node.value}`];
        default:
          throw new Error(`Unknown node state: '${node.type}'`);
      }
    });
    return joinObject(lines, bracketIndent);
  };
  return iter(dataTree, 1);
}
