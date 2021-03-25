import _ from 'lodash';

function stylish(ast, spacesCount = 2) {
  const iter = (nodes, depth) => {
    const parseValue = (node, type = 'new') => {
      if (type === 'old') {
        return _.has(node, 'oldValue') ? node.oldValue : iter(node.oldChildren, depth + 2);
      }
      return _.has(node, 'value') ? node.value : iter(node.children, depth + 2);
    };

    const indentSize = depth * spacesCount;
    const currentIndent = _.repeat(' ', indentSize);
    const bracketIndent = _.repeat(' ', indentSize - spacesCount);

    const result = nodes.flatMap((node) => {
      switch (node.type) {
        case 'added':
          return [`${currentIndent}+ ${node.name}: ${parseValue(node)}`];
        case 'delete':
          return [`${currentIndent}- ${node.name}: ${parseValue(node, 'old')}`];
        case 'update':
          return [
            `${currentIndent}- ${node.name}: ${parseValue(node, 'old')}`,
            `${currentIndent}+ ${node.name}: ${parseValue(node)}`,
          ];
        case 'no change':
          return [`${currentIndent}  ${node.name}: ${parseValue(node)}`];
        default:
          throw new Error(`Unknown node state: '${node.type}'`);
      }
    });
    return ['{', ...result, `${bracketIndent}}`].join('\n');
  };
  return iter(ast, 1);
}

export default stylish;
