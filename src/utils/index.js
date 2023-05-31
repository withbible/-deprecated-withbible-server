module.exports = {
  filterReferenceOther(iteratee, target) {
    return iteratee.filter((each) => each.rel !== target);
  },

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  },

  getBackOff(attempts) {
    return 2 ** (attempts - 1) * 1000;
  },
};
