import _ from 'lodash';

const parseValue = (value) => {
  switch (true) {
    case (_.isArray(value)):
      return '[complex value]';
    case (typeof value === 'string'):
      return `'${value}'`;
    default:
      return `${value}`;
  }
};

function plain(ast) {
  const iter = (children, keys) => {
    const result = children.flatMap((obj) => {
      const keyPath = [...keys, obj.name];
      const objPath = keyPath.join('.');
      switch (obj.status) {
        case 'update':
          return `Property '${objPath}' was updated. From ${parseValue(obj.prevValue)} to ${parseValue(obj.newValue)}`;
        case 'add':
          return `Property '${objPath}' was added with value: ${parseValue(obj.newValue)}`;
        case 'remove':
          return `Property '${objPath}' was removed`;
        default:
          return _.isArray(obj.newValue) ? iter(obj.newValue, keyPath) : '';
      }
    });
    return result.filter((val) => val !== '').join('\n');
  };
  return iter(ast, []);
}

export default plain;
