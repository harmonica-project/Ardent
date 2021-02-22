export default (paperType = '') => {
  if (paperType === 'article') {
    return 'Article';
  }
  if (paperType === 'inproceedings') {
    return 'Conference paper';
  }
  if (paperType === 'book') {
    return 'Book';
  }

  return 'Other';
};
