import _ from 'lodash';

const parseValue = (node) => {
  if (_.isObject(node)) {
    return '[complex value]';
  }
  return _.isString(node) ? `'${node}'` : `${node}`;
};

export default function plain(dataTree) {
  const iter = (nodes, keys) => {
    const result = nodes.flatMap((node) => {
      const keysPath = [...keys, node.name];
      const objPath = keysPath.join('.');
      switch (node.type) {
        case 'changed':
          return `Property '${objPath}' was updated. From ${parseValue(node.value1)} to ${parseValue(node.value2)}`;
        case 'added':
          return `Property '${objPath}' was added with value: ${parseValue(node.value)}`;
        case 'deleted':
          return `Property '${objPath}' was removed`;
        case 'unchanged':
          return _.has(node, 'children') ? iter(node.children, keysPath) : '';
        default:
          throw new Error(`Unknown node state: '${node.type}'`);
      }
    });
    return result.filter((val) => val !== '').join('\n');
  };
  return iter(dataTree, []);
}
