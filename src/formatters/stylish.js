import _ from 'lodash';
import parseObj from '../StringifyObject.js';

function parseValue(node, spacesCount, startOffsetCount) {
  return (_.isObject(node) ? parseObj(node, spacesCount, startOffsetCount) : node);
}

export default function stylish(dataTree, spacesCount = 2) {
  const iter = (nodes, depth) => {
    const indentSize = depth * spacesCount;
    const currentIndent = ' '.repeat(indentSize);
    const bracketIndent = ' '.repeat(indentSize - spacesCount);

    const result = nodes.flatMap((node) => {
      switch (node.type) {
        case 'added':
          return [`${currentIndent}+ ${node.name}: ${parseValue(node.value, spacesCount, depth + 1)}`];
        case 'deleted':
          return [`${currentIndent}- ${node.name}: ${parseValue(node.value, spacesCount, depth + 1)}`];
        case 'changed':
          return [
            `${currentIndent}- ${node.name}: ${parseValue(node.value1, spacesCount, depth + 1)}`,
            `${currentIndent}+ ${node.name}: ${parseValue(node.value2, spacesCount, depth + 1)}`,
          ];
        case 'unchanged':
          if (_.has(node, 'children')) {
            return [`${currentIndent}  ${node.name}: ${iter(node.children, depth + spacesCount)}`];
          }
          return [`${currentIndent}  ${node.name}: ${node.value}`];
        default:
          throw new Error(`Unknown node state: '${node.type}'`);
      }
    });
    return ['{', ...result, `${bracketIndent}}`].join('\n');
  };
  return iter(dataTree, 1);
}
