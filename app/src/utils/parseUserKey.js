export default (userId = '') => {
  if (userId === 'six') {
    return 'Nicolas Six';
  }
  if (userId === 'herbaut') {
    return 'Nicolas Herbaut';
  }
  if (userId === 'negri') {
    return 'Claudia Negri Ribalta';
  }

  return 'Anonymous';
};
