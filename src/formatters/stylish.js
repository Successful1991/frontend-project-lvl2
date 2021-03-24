import _ from 'lodash';

function stylish(ast, spacesCount = 2) {
  const iter = (coll, depth) => {
    const parseValue = (value) => (_.isArray(value) ? iter(value, depth + 2) : value);
    const indentSize = depth * spacesCount;
    const currentIndent = _.repeat(' ', indentSize);
    const bracketIndent = _.repeat(' ', indentSize - spacesCount);
    const result = coll.flatMap((obj) => {
      switch (obj.status) {
        case 'add':
          return [`${currentIndent}+ ${obj.name}: ${parseValue(obj.newValue)}`];
        case 'remove':
          return [`${currentIndent}- ${obj.name}: ${parseValue(obj.prevValue)}`];
        case 'update':
          return [
            `${currentIndent}- ${obj.name}: ${parseValue(obj.prevValue)}`,
            `${currentIndent}+ ${obj.name}: ${parseValue(obj.newValue)}`,
          ];
        default:
          return [`${currentIndent}  ${obj.name}: ${parseValue(obj.newValue)}`];
      }
    });
    return ['{', ...result, `${bracketIndent}}`].join('\n');
  };
  return iter(ast, 1);
}

export default stylish;
