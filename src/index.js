import { create, valueOf } from 'microstates';

export default function Union(members, Base = class {}) {
  let types = Object.keys(members);

  let UnionType = class extends Base {

    get state() {
      return valueOf(this.value);
    }

    type = String;
    value = Object;

    initialize(value) {
      let { type } = value == null ? {} : value;
      assert(type != null && types.includes(type),
             `when re-structuring a Union type, the 'type' field must be one of [${types}], but it was '${JSON.stringify(type) }'`);

      return create(UnionType[type], value);
    }
  };

  types.forEach(type => {
    let Constructor = members[type](UnionType);

    Object.defineProperty(UnionType.prototype, `is${type}`, {
      enumerable: false,
      value: false
    })

    Object.defineProperty(Constructor.prototype, `is${type}`, {
      enumerable: false,
      value: true
    });

    Object.defineProperty(Constructor.prototype, `initialize`, {
      enumerable: false,
      configurable: true,
      writable: true,
      value(...args) {
        if (valueOf(this).type === type) {
          return this;
        } else {
          return UnionType.prototype.initialize(...args);
        }
      }
    });

    Object.defineProperty(Constructor,  'name', {
      enumerable: false,
      configurable: true,
      value: type
    });


    types.forEach(type => {
      Object.defineProperty(Constructor.prototype, `to${type}`, {
        enumerable: false,
        configurable: true,
        writable: true,
        value(attrs) {
          let transitioned = this.type.set(type);
          if (attrs != null) {
            let value = this.value.state;
            if (typeof value !== 'object') {
              return transitioned.value.assign(attrs);
            } else {
              return transitioned.value.set(attrs);
            }
          } else {
            return transitioned;
          }
        }
      });
    });

    Constructor.create = (value) => {
      return create(Constructor, { type, value });
    };
    UnionType[type] = Constructor;
  });

  return UnionType;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
