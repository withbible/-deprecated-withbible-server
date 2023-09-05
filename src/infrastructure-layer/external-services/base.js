function BaseThirdPartyConfig() {}

BaseThirdPartyConfig.prototype.init = async function() {
  throw new Error("구현체에서 호출해주세요.");
}

BaseThirdPartyConfig.prototype.retry = async function () {
  throw new Error("구현체에서 호출해주세요.");
}

BaseThirdPartyConfig.prototype.get = async function (){
  throw new Error("구현체에서 호출해주세요.");
}

module.exports = BaseThirdPartyConfig;
