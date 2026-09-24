import emitter from 'tiny-emitter/instance';

const eventHub = {
    $on:   (...args) => emitter.on(...args),
    $once: (...args) => emitter.once(...args),
    $off:  (...args) => emitter.off(...args),
    $emit: (...args) => emitter.emit(...args),
};

export default eventHub;
export { eventHub };