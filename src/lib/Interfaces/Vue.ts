export interface IVueInstance {
    $root: {
        $on: ({key, value}: { key: string, value?: any[] }) => void,
        $emit: (key: string, value: any) => void
    }
}

export interface IVueEvent {
    func(...args: any[]): void;
}
