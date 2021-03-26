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

const isEverObject = (...rest) => rest.every((val) => _.isObject(val));

function buildAst(file1, file2) {
  const iter = (data1, data2) => {
    const keys = getSortKeys(data1, data2);
    const tree = keys.map((key) => {
      const value1 = data1[key];
      const value2 = data2[key];

      switch (true) {
        case (_.has(data1, [key]) && _.has(data2, [key])):
          if (isEverObject(value1, value2) || Object.is(value1, value2)) {
            const newNode = createNode('added', key, value1, value2, iter);
            return { ...newNode, ...{ type: 'no change' } };
          }
          return {
            ...createNode('delete', key, value1, value1, iter),
            ...createNode('added', key, value2, value2, iter),
            ...{ type: 'update' },
          };

        case _.has(data1, [key]):
          return createNode('delete', key, value1, value1, iter);

        case _.has(data2, [key]):
          return createNode('added', key, value2, value2, iter);

        default:
          throw new Error(`no data found in files by keys: '${key}'`);
      }
    });
    return tree;
  };
  return iter(file1, file2, []);
}

export default buildAst;
