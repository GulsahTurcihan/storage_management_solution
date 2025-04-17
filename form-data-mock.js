class FormDataMock {
  constructor() {
    this.fields = {};
  }

  append(key, value) {
    this.fields[key] = value;
  }

  get(key) {
    return this.fields[key];
  }

  entries() {
    return Object.entries(this.fields);
  }
}

module.exports = FormDataMock;
