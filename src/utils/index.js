module.exports = {
  filterReferenceOther(iteratee, target) {
    return iteratee.filter((each) => each.rel !== target);
  },
};
