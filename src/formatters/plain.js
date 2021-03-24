import _ from 'lodash';

const parseValue = (node, type = 'new') => {
  if (type === 'old') {
    if (_.has(node, 'oldChildren')) {
      return '[complex value]';
    }
    return _.isString(node.oldValue) ? `'${node.oldValue}'` : `${node.oldValue}`;
  }
  if (_.has(node, 'children')) {
    return '[complex value]';
  }
  return _.isString(node.value) ? `'${node.value}'` : `${node.value}`;
};

function plain(ast) {
  const iter = (nodes, keys) => {
    const result = nodes.flatMap((node) => {
      const keysPath = [...keys, node.name];
      const objPath = keysPath.join('.');
      switch (node.type) {
        case 'update':
          return `Property '${objPath}' was updated. From ${parseValue(node, 'old')} to ${parseValue(node)}`;
        case 'added':
          return `Property '${objPath}' was added with value: ${parseValue(node)}`;
        case 'delete':
          return `Property '${objPath}' was removed`;
        case 'no change':
          return _.has(node, 'children') ? iter(node.children, keysPath) : '';
        default:
          throw new Error(`Unknown node state: '${node.type}'`);
      }
    });
    return result.filter((val) => val !== '').join('\n');
  };
  return iter(ast, []);
}

export default plain;
