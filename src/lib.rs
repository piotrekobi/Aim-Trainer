mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct Target {
    radius: f32,
}

#[wasm_bindgen]
impl Target {
    pub fn new() -> Target {
        return Target { radius: 10.0 };
    }

    pub fn get_radius(&mut self) -> f32 {
        return self.radius;
    }
}
