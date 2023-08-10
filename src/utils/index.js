module.exports = {
  filterReferenceOther: (iteratee, target) =>
    iteratee.filter((each) => each.rel !== target),

  sleep: (ms) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    }),

  getBackOff: (attempts) => 2 ** (attempts - 1) * 1000,
};
