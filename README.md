## @microstates/union

Crisply represent state machines using union types.

``` javascript

import Union from '@microstates/union';

const Task = Union({
  Pending: Task => class extends Task {
    resolve(result) {
      return this.toResolved(result);
    }
    reject(error) {
      return this.toRejected(error);
    }
  },
  Resolved: Task => class extends Task {},
  Rejected: Task => class extends Task {}
});

let pending = Task.Pending.create();
pending instanceof Task //=> true
pending instanceof Task.Pending //=> true
pending.isPending //=> true
pending.isResolved //=> false
pending.isRejected //=> false;


let resolved = pending.resolve('here is some data');
resolved instanceof Task //=> true
resolved instanceof Task.Resolved //=> true
resolved.isPending //=> false
resolved.isResolved //=> true
resolved.isRejected //=> false


let rejected = pending.reject(new Error('something not good happened'));
resolved instanceof Task //=> true
resolved instanceof Task.Rejected //=> true
resolved.isPending //=> false
resolved.isResolved //=> false
resolved.isRejected //=> true
```
