exports.pagination = (items, limit = 10, page = 1) => {
  const firstIndex = (page - 1) * limit;
  const lastIndex = page * limit;

  return items.slice(firstIndex, lastIndex);
};
