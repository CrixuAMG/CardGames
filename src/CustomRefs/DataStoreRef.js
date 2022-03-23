import { customRef } from 'vue';

const persist = (key, value) => {
    let dataStoreValue = value;

    if (typeof value === 'object' || Array.isArray(value)) {
        dataStoreValue = JSON.stringify(value);
    }

    localStorage.setItem(key, dataStoreValue);

    return value;
};

export function useDataStoreRef (key, value) {
    return customRef((track, trigger) => {
        return {
            get () {
                track();

                let localStorageValue = localStorage.getItem(key);
                if (localStorageValue) {
                    if (localStorageValue === 'null') {
                        localStorageValue = '';
                    }

                    try {
                        return JSON.parse(localStorageValue);
                    } catch (e) {
                        return localStorageValue;
                    }
                }

                return persist(key, value);
            },
            set (newValue) {
                persist(key, newValue);

                trigger();
            }
        };
    });
};
