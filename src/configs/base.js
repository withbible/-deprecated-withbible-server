function BaseConfig() {
  this.init = async () => {
    throw new Error("구현체에서 호출해주세요.");
  };

  this.retry = () => {
    throw new Error("구현체에서 호출해주세요.");
  };

  this.get = () => {
    throw new Error("구현체에서 호출해주세요.");
  };
}

module.exports = BaseConfig;
