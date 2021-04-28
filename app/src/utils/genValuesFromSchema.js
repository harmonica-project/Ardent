export default (item, defaultValues) => {
  Object.keys(item).forEach((key) => {
    if (item[key] === null || item[key] === undefined) {
      item[key] = defaultValues[key];
    }
  });

  return item;
};
