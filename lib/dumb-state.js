
// This is a very dumb store, do not use this in production. It's just convenient for demos.
export default class DumbState {
  constructor (def) {
    this.data = def || {};
    this.subs = [];
  }
  sub (fn) {
    this.subs.push(fn);
  }
  get () {
    return this.data;
  }
  update (data) {
    Object.assign(this.data, data);
    this.subs.forEach(fn => setTimeout(() => fn(this.data), 0));
  }
}
