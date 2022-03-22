import { customRef } from 'vue';

export function useDataStoreRef (key, value) {
    return customRef((track, trigger) => {
        return {
            get () {
                track();

                const localStorageValue = localStorage.getItem(key);
                if (localStorageValue) {
                    return JSON.parse(localStorageValue) || [];
                }

                return localStorage.setItem(key, value) || [];
            },
            set (newValue) {
                let dataStoreValue = newValue;

                if (typeof newValue === 'object' || Array.isArray(newValue)) {
                    dataStoreValue = JSON.stringify(newValue);
                }

                localStorage.setItem(key, dataStoreValue);

                trigger();
            }
        };
    });
};
