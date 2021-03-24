import _ from 'lodash';

function getSortKeys(value1 = {}, value2 = {}) {
  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);
  return _.union(keys1, keys2).sort();
}

function buildAst(file1, file2) {
  const iter = (after, before) => {
    const keys = getSortKeys(after, before);
    const result = keys.map((key) => {
      switch (true) {
        case (_.has(after, [key]) && _.has(before, [key])):
          switch (true) {
            case (_.isObject(after[key]) && _.isObject(before[key])):
              return {
                name: key,
                status: 'noChange',
                prevValue: iter(after[key], before[key]),
                newValue: iter(after[key], before[key]),
              };
            case _.isObject(after[key]):
              return {
                name: key,
                status: 'update',
                prevValue: iter(after[key], after[key]),
                newValue: before[key],
              };
            case _.isObject(before[key]):
              return {
                name: key,
                status: 'update',
                prevValue: after[key],
                newValue: iter(before[key], before[key]),
              };
            default:
              return {
                name: key,
                status: (after[key] === before[key]) ? 'noChange' : 'update',
                prevValue: after[key],
                newValue: before[key],
              };
          }
        case _.has(after, [key]):
          if (_.isObject(after[key])) {
            return { name: key, status: 'remove', prevValue: iter(after[key], after[key]) };
          }
          return { name: key, status: 'remove', prevValue: after[key] };
        case _.has(before, [key]):
          if (_.isObject(before[key])) {
            return { name: key, status: 'add', newValue: iter(before[key], before[key]) };
          }
          return { name: key, status: 'add', newValue: before[key] };
        default:
          return { name: key, status: 'undefined', value: undefined };
      }
    });
    return result;
  };
  return iter(file1, file2);
}

export default buildAst;
