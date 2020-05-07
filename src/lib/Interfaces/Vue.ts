export interface IVueInstance {
    $root: {
        $on: (event: string, ...any: []) => void,
        $emit: (event: string, ...any: []) => void
    }
}

export interface IVueEvent {
    func(...args: any[]): void;
}
