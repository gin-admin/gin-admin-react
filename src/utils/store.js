export const storeKeys = {
  AccessToken: 'Access-Token',
};

export const storeType = {
  localStorage,
  sessionStorage,
};

const defaultStorage = storeType.localStorage;

function set(key, value, ...options) {
  const storage = options.storeType || defaultStorage;
  storage.setItem(key, JSON.stringify(value));
}

function get(key, ...options) {
  const storage = options.storeType || defaultStorage;
  const value = storage.getItem(key);
  return value ? JSON.parse(value) : null;
}

function remove(key, ...options) {
  const storage = options.storeType || defaultStorage;
  storage.removeItem(key);
}

export default {
  set,
  get,
  remove,
};
