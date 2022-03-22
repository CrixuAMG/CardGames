import { customRef } from 'vue';

export function useDataStoreRef (key, value) {
    return customRef((track, trigger) => {
        return {
            get () {
                track();

                const localStorageValue = localStorage.getItem(key);
                if (localStorageValue) {
                    return JSON.parse(localStorageValue) || value;
                }
                
                let dataStoreValue = value;

                if (typeof value === 'object' || Array.isArray(value)) {
                    dataStoreValue = JSON.stringify(value);
                }

                localStorage.setItem(key, dataStoreValue);
                
                return value;
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
