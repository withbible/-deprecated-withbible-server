function BaseThirdPartyConfig() {
  return {
    init,
    retry,
    get,
  };

  async function init() {
    throw new Error("구현체에서 호출해주세요.");
  }

  async function retry() {
    throw new Error("구현체에서 호출해주세요.");
  }

  function get() {
    throw new Error("구현체에서 호출해주세요.");
  }
}

module.exports = BaseThirdPartyConfig;
