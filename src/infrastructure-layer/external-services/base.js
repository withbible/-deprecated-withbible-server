function BaseExternalService() {}

BaseExternalService.prototype.init = async function () {
  throw new Error("구현체에서 호출해주세요.");
};

BaseExternalService.prototype.retry = async function () {
  throw new Error("구현체에서 호출해주세요.");
};

BaseExternalService.prototype.get = async function () {
  throw new Error("구현체에서 호출해주세요.");
};

module.exports = BaseExternalService;
