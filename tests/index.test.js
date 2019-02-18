import Union from '../index';

import expect from 'expect';

describe('index.js', ()=> {
  it('has the Union function as its default export', ()=> {
    expect(Union).toBeInstanceOf(Function);
  });
});
