export default (item, schema) => {
  Object.keys(item).forEach((key) => {
    if (item[key] === null || item[key] === undefined) {
      item[key] = '';
    }
  });

  item = schema.cast(item);
  return item;
};
