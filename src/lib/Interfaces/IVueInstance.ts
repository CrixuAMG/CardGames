interface IVueInstance {
    $root: {
        $on: (event: string, ...any: []) => void,
        $emit: (event: string, ...any: []) => void
    }
}

export default IVueInstance;
