import _ from 'lodash';

function getSortKeys(value1 = {}, value2 = {}) {
  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);
  return _(keys1).union(keys2).sortBy();
}

function createNode(value, type, name, createNodeChild) {
  if (type === 'added') {
    if (_.isObject(value)) {
      return { name, type, children: createNodeChild() };
    }
    return { name, type, value };
  }
  if (type === 'delete') {
    if (_.isObject(value)) {
      return { name, type, oldChildren: createNodeChild() };
    }
    return { name, type, oldValue: value };
  }
  throw new Error(`No valid type: '${type}'`);
}

function buildAst(file1, file2) {
  const iter = (before, after, keyPath) => {
    const keys = getSortKeys(before, after);
    const tree = keys.map((key) => {
      const nodeBefore = before[key];
      const nodeAfter = after[key];
      const newKeyPath = [...keyPath, key];
      switch (true) {
        case (_.has(before, [key]) && _.has(after, [key])):
          if (
            (_.isObject(nodeBefore) && _.isObject(nodeAfter))
            || Object.is(nodeBefore, nodeAfter)
          ) {
            const newNode = createNode(nodeAfter, 'added', key, iter.bind(null, nodeBefore, nodeAfter, newKeyPath));
            return { ...newNode, ...{ type: 'no change' } };
          }
          return {
            ...createNode(nodeBefore, 'delete', key, iter.bind(null, nodeBefore, nodeBefore, newKeyPath)),
            ...createNode(nodeAfter, 'added', key, iter.bind(null, nodeAfter, nodeAfter, newKeyPath)),
            ...{ type: 'update' },
          };

        case _.has(before, [key]):
          return createNode(nodeBefore, 'delete', key, iter.bind(null, nodeBefore, nodeBefore, newKeyPath));

        case _.has(after, [key]):
          return createNode(nodeAfter, 'added', key, iter.bind(null, nodeAfter, nodeAfter, newKeyPath));

        default:
          throw new Error(`no data found in files by keys: '${newKeyPath.join('.')}'`);
      }
    });
    return tree;
  };
  return iter(file1, file2, []);
}

export default buildAst;
