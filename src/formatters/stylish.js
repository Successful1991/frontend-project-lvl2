import _ from 'lodash';

function parseObj(node, spacesCount = 2, startOffsetCount = 0) {
  const iter = (obj, depth) => {
    const keys = Object.keys(obj);
    const indentSize = depth * spacesCount;
    const currentIndent = ' '.repeat(indentSize);
    const bracketIndent = ' '.repeat(indentSize - spacesCount);

    const result = keys.map((key) => {
      const value = obj[key];
      if (_.isObject(value)) {
        return [`${currentIndent}  ${key}: ${iter(value, depth + spacesCount)}`];
      }
      return [`${currentIndent}  ${key}: ${value}`];
    });
    return ['{', ...result, `${bracketIndent}}`].join('\n');
  };
  return iter(node, 1 + startOffsetCount);
}

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
        case 'nested':
          return [`${currentIndent}  ${node.name}: ${iter(node.children, depth + spacesCount)}`];
        case 'unchanged':
          return [`${currentIndent}  ${node.name}: ${node.value}`];
        default:
          throw new Error(`Unknown node state: '${node.type}'`);
      }
    });
    return ['{', ...result, `${bracketIndent}}`].join('\n');
  };
  return iter(dataTree, 1);
}
