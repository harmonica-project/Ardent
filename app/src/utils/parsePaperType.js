export default (paperType = '') => {
  if (paperType === 'article-journal') {
    return 'Journal article';
  }
  if (paperType === 'inproceedings') {
    return 'Conference paper';
  }
  if (paperType === 'book') {
    return 'Book';
  }

  return 'Other';
};
