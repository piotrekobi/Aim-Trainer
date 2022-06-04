use rand::Rng;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn message(text: &str) {
    alert(text);
}

#[wasm_bindgen]
pub fn randint(min: i32, max: i32) -> i32 {
    let mut rng = rand::thread_rng();
    rng.gen_range(min..max)
}

#[wasm_bindgen]
pub fn cursor_inside(
    cursor_x: i32,
    cursor_y: i32,
    button_x: i32,
    button_y: i32,
    button_width: i32,
    button_height: i32,
) -> bool {
    cursor_x >= button_x
        && cursor_x <= button_x + button_width
        && cursor_y >= button_y
        && cursor_y <= button_y + button_height
}
