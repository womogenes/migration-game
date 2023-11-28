// Custom Svelte store that auto-syncs with LocalStorage
// https://stackoverflow.com/questions/56488202/how-to-persist-svelte-store

import { writable } from 'svelte/store';

export const store = (id, defaultValue) => {
  // id is a String
  // defaultValue (optional) is a default value for the store

  // This Svelte store syncs with localStorage
  const myStore = writable(
    (localStorage[id] && JSON.parse(localStorage[id])) || defaultValue,
  );
  myStore.subscribe((value) => localStorage.setItem(id, JSON.stringify(value)));
  return myStore;
};
