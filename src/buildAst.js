import _ from 'lodash';

function getSortKeys(value1 = {}, value2 = {}) {
  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);
  return _(keys1).union(keys2).sortBy();
}

function createNode(name, type, values) {
  return {
    name,
    type,
    ...values,
  };
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
          switch (true) {
            case (_.isObject(nodeBefore) && _.isObject(nodeAfter)):
              return createNode(key, 'no change', { children: iter(nodeBefore, nodeAfter, newKeyPath) });

            case _.isObject(nodeBefore):
              return createNode(key, 'update', { value: nodeAfter, oldChildren: iter(nodeBefore, nodeBefore, newKeyPath) });

            case _.isObject(nodeAfter):
              return createNode(key, 'update', { children: iter(nodeAfter, nodeAfter, newKeyPath), oldValue: nodeBefore });

            case (Object.is(nodeBefore, nodeAfter)):
              return createNode(key, 'no change', { value: nodeAfter, oldValue: nodeBefore });

            default:
              return createNode(key, 'update', { value: nodeAfter, oldValue: nodeBefore });
          }

        case _.has(before, [key]):
          if (_.isObject(nodeBefore)) {
            return createNode(key, 'delete', { oldChildren: iter(nodeBefore, nodeBefore, newKeyPath) });
          }
          return createNode(key, 'delete', { oldValue: nodeBefore });

        case _.has(after, [key]):
          if (_.isObject(nodeAfter)) {
            return createNode(key, 'added', { children: iter(nodeAfter, nodeAfter, newKeyPath) });
          }
          return createNode(key, 'added', { value: nodeAfter });

        default:
          throw new Error(`no data found in files by keys: '${newKeyPath.join('.')}'`);
      }
    });
    return tree;
  };
  return iter(file1, file2, []);
}

export default buildAst;
