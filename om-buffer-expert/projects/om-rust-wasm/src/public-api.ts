/*
 * Public API Surface of om-rust-wasm
 */

// export * from './lib/om-rust-wasm.service';
// export * from './lib/om-rust-wasm.component';
// export * from './lib/om-rust-wasm.module';

import init from './lib/rust-buffer-om/pkg';
export { get_factorial } from './lib/rust-buffer-om/pkg';
export { init as initExampleRust };