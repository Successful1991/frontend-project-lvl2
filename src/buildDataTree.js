import _ from 'lodash';

function sortKeys(value1 = {}, value2 = {}) {
  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);
  return _.sortBy(_.union(keys1, keys2));
}

export default function buildDataTree(file1, file2) {
  const iter = (data1, data2) => {
    const tree = sortKeys(data1, data2).map((key) => {
      const value1 = data1[key];
      const value2 = data2[key];
      const areBothObjects = (_.isObject(value1) && _.isObject(value2));

      if (!_.has(data2, key)) {
        return { name: key, type: 'deleted', value: value1 };
      }

      if (!_.has(data1, key)) {
        return { name: key, type: 'added', value: value2 };
      }

      if (areBothObjects) {
        return { name: key, type: 'nested', children: iter(value1, value2) };
      }

      if (value1 !== value2) {
        return {
          name: key, type: 'changed', value1, value2,
        };
      }

      return { name: key, type: 'unchanged', value: value1 };
    });
    return tree;
  };
  return iter(file1, file2, []);
}
