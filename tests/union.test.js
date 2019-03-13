import expect from 'expect';

import Union from '../src';
import { create } from 'microstates';

describe('Using a union type to construct a Maybe value', ()=> {
  function Maybe(Type) {
    let MaybeType = Union({
      Just: Maybe => class extends Maybe {
        value = Type;
      },
      Nothing: Maybe => class extends Maybe {}
    });
    return MaybeType;
  }

  let Type;
  beforeEach(()=> {
    Type = Maybe(Number);
  });

  it('cannot construct a type directly without passing it a valid serialized form', ()=> {
    expect(()=> create(Type)).toThrow('[Just,Nothing]');
  });

  it('has a constructor for each member of the union', ()=> {
    expect(Type).toBeDefined();
    expect(Type).toBeInstanceOf(Function);
    expect(Type.Just).toBeInstanceOf(Function);
    expect(Type.Nothing).toBeInstanceOf(Function);
  });

  it('creates each member as a subclass of union type', ()=> {
    let { Just, Nothing } = Type;
    expect(Just.prototype).toBeInstanceOf(Type);
    expect(Nothing.prototype).toBeInstanceOf(Type);
  });

  it('sets the name of the union members', ()=> {
    let { Just, Nothing } = Type;
    expect(Just.name).toEqual('Just');
    expect(Nothing.name).toEqual('Nothing');
  });


  describe('constructing an instance of Just', ()=> {
    let just;
    beforeEach(()=> {
      let { Just } = Type;
      just = Just.create(5);
    });
    it('gives you a value that is an instance of Just, and also contains the attributes.', ()=> {
      expect(just).toBeInstanceOf(Type.Just);
      expect(just.isJust).toEqual(true);
      expect(just.isNothing).toEqual(false)
    });
    it('it has as its value, an instance of Number', ()=> {
      expect(just.value.state).toEqual(5);
    });
    it('has the type string available on the type attribute', ()=> {
      expect(just.type.state).toEqual('Just');
    });

    describe('transitioning the value', ()=> {
      let next;
      beforeEach(()=> {
        next = just.value.increment();
      });
      it('properly updates the whole structure', ()=> {
        expect(next).toBeInstanceOf(Type.Just);
        expect(next.value.state).toEqual(6);
      });
    });

    describe('transitioning to another state', () => {
      let next;

      beforeEach(()=> {
        next = just.toNothing()
      });

      it('returns the nothing', ()=> {
        let { Nothing } = Type;
        expect(next).toBeInstanceOf(Nothing);
      });
    })
  });

  describe('transitioning from one type to the next', ()=> {
    let maybe;
    beforeEach(()=> {
      let { Just } = Type;
      maybe = Just.create(5).toNothing();
    });

    it('takes on the transitioned type', ()=> {
      expect(maybe).toBeInstanceOf(Type.Nothing);
    });
  });

  describe('transitioning from one type to the next and then back again', ()=> {
    it('remains of the correct type.', ()=> {
      expect(Type.Just.create(5).toNothing().toJust()).toBeInstanceOf(Type.Just);
    });
    it('retains its value', ()=> {
      expect(Type.Just.create(5).toNothing().toJust().value.state).toEqual(5);

    });
  });

  describe('transitioning from the same type', ()=> {
    it('is a no-oop', ()=> {
      let just = Type.Just.create();
      expect(just.toJust()).toBe(just);
    });
  });
});
