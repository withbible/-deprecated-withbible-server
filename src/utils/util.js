module.exports = {
  filterReferenceOther: (iteratee, target) => {
    return iteratee.filter((each) => each.rel !== target);
  },

  filterReferenceMe: (iteratee, target) => {
    return iteratee.filter((each) => each.rel === target);
  },
};
