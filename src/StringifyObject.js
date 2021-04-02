import _ from 'lodash';

export default function parseObj(node, spacesCount = 2, startOffsetCount = 0) {
  const iter = (obj, depth) => {
    const keys = Object.keys(obj);
    const indentSize = depth * spacesCount;
    const currentIndent = ' '.repeat(indentSize);
    const bracketIndent = ' '.repeat(indentSize - spacesCount);

    const result = keys.map((key) => {
      const value = obj[key];
      if (_.isObject(value)) {
        return [`${currentIndent}  ${key}: ${iter(value, depth + spacesCount)}`];
      }
      return [`${currentIndent}  ${key}: ${value}`];
    });
    return ['{', ...result, `${bracketIndent}}`].join('\n');
  };
  return iter(node, 1 + startOffsetCount);
}
