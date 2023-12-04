// Custom Svelte store that auto-syncs with LocalStorage
// https://stackoverflow.com/questions/56488202/how-to-persist-svelte-store

import { writable } from 'svelte/store';
import Cryo from 'cryo';

export const store = (id, defaultValue) => {
  // id is a String
  // defaultValue (optional) is a default value for the store

  // This Svelte store syncs with localStorage
  const myStore = writable(
    (localStorage[id] && Cryo.parse(localStorage[id])) || defaultValue,
  );
  myStore.subscribe((value) => {
    localStorage.setItem(id, Cryo.stringify(value));
  });
  return myStore;
};
