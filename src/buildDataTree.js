import _ from 'lodash';

function getSortKeys(value1 = {}, value2 = {}) {
  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);
  return _(keys1).union(keys2).sortBy();
}

function createNode(type, name, value1, value2, createChildrenNode) {
  if (type !== 'added' && type !== 'delete') {
    throw new Error(`No valid type: '${type}'`);
  }

  if (_.isObject(value1)) {
    const keyValue = (type === 'added') ? 'children' : 'oldChildren';
    return { name, type, [keyValue]: createChildrenNode(value1, value2) };
  }
  const keyValue = (type === 'added') ? 'value' : 'oldValue';
  return { name, type, [keyValue]: value1 };
}

export default function buildDataTree(file1, file2) {
  const iter = (data1, data2) => {
    const keys = getSortKeys(data1, data2);
    const tree = keys.map((key) => {
      const value1 = data1[key];
      const value2 = data2[key];
      const areBothObjects = (_.isObject(value1) && _.isObject(value2));

      if (_.has(data1, [key]) && !_.has(data2, [key])) {
        return createNode('delete', key, value1, value1, iter);
      }

      if (_.has(data2, [key]) && !_.has(data1, [key])) {
        return createNode('added', key, value2, value2, iter);
      }

      if (areBothObjects || value1 === value2) {
        const newNode = createNode('added', key, value1, value2, iter);
        return { ...newNode, ...{ type: 'no change' } };
      }

      return {
        ...createNode('delete', key, value1, value1, iter),
        ...createNode('added', key, value2, value2, iter),
        ...{ type: 'update' },
      };
    });
    return tree;
  };
  return iter(file1, file2, []);
}
