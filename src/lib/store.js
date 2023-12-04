// Custom Svelte store that auto-syncs with LocalStorage
// https://stackoverflow.com/questions/56488202/how-to-persist-svelte-store

import { writable } from 'svelte/store';

export const store = (id, defaultValue) => {
  // id is a String
  // defaultValue (optional) is a default value for the store

  // This Svelte store syncs with localStorage
  const myStore = writable(
    (localStorage[id] && deserialize(localStorage[id])) || defaultValue,
  );
  myStore.subscribe((value) => {
    localStorage.setItem(id, serialize(value));
  });
  return myStore;
};

function serialize(obj) {
  return JSON.stringify(obj, function (key, value) {
    if (typeof value === 'function') {
      return value.toString();
    }
    return value;
  });
}

function deserialize(str) {
  return JSON.parse(str, function (key, value) {
    if (
      typeof value === 'string' &&
      (value.indexOf('() =>') === 0 || value.indexOf('function') === 0)
    ) {
      return new Function(`return ${value}`);
    }
    let x = /.+\(\) (\{(?:.|\s)+\})/g.exec(value);
    if (x) {
      return new Function(`return function() ${x[1]}`);
    }
    return value;
  });
}
