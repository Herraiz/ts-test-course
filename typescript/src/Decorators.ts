const someObject = { someProperty: "initial" };
class Manager {
  //   @watchChange
  @linkValue(someObject)
  someProperty: string = undefined as any;
}

// watchChange(Manager.prototype, "someProperty"); // we can also call it manually

const manager: Manager = new Manager();

manager.someProperty = "123";
console.log(someObject.someProperty);
manager.someProperty = "456";

function watchChange(target: any, key: string) {
  let property = target[key];
  const getter = () => {
    return property;
  };
  const setter = (value: string) => {
    console.log(`${key as string} changed from ${property} to ${value}`);
    property = value;
  };

  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}

function linkValue(otherObjet: any) {
  return function (target: any, key: string) {
    let property = target[key];
    const getter = () => {
      return property;
    };
    const setter = (value: string) => {
      console.log(`${key as string} changed from ${property} to ${value}`);
      property = value;
      otherObjet[key] = value;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}
