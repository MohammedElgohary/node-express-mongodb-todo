module.exports = (params) => {
  if (params) {
    return Object?.fromEntries(
      Object?.entries(params)?.filter(([key, value]) => {
        if (typeof value) {
          return value;
        }
      })
    );
  } else {
    return {};
  }
};
