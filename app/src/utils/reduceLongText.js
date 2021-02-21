export default (desc, length) => {
  if (desc.length < length) return desc;

  return `${desc.substring(0, length)} [...]`;
};
