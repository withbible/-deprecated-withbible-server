class DefaultDict extends Object {
  constructor(getDefaultValue, ...objectConstructorArgs) {
    super(objectConstructorArgs);

    if (typeof getDefaultValue !== 'function') {
      throw new Error('getDefaultValue must be a function');
    }

    return new Proxy(this, {
      get: function (target, key) {
        if (!Reflect.has(target, key)) {
          Reflect.set(target, key, getDefaultValue(key));
        }

        return Reflect.get(target, key);
      },
    });
  }
};

module.exports = DefaultDict;