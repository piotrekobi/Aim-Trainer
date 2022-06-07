use aim_trainer::cursor_inside;
use aim_trainer::randint;
use wasm_bindgen_test::wasm_bindgen_test;

#[wasm_bindgen_test]
pub fn test_randint() {
    let num = randint(0, 10);
    assert!((0..10).contains(&num));
}

#[wasm_bindgen_test]
pub fn test_cursor_inside() {
    assert_eq!(cursor_inside(10, 10, 0, 0, 20, 20), true);
}

#[wasm_bindgen_test]
pub fn is_hit() {
    assert_eq!(is_hit(0, 0, 10, 10, 20, 1), true);
}

#[wasm_bindgen_test]
pub fn is_hit() {
    assert_eq!(is_hit(10, 10, 0, 0, 20, 1), true);
}

#[wasm_bindgen_test]
pub fn is_hit() {
    assert_eq!(is_hit(0, 0, -10, -10, 20, 1), true);
}

#[wasm_bindgen_test]
pub fn is_hit() {
    assert_eq!(is_hit(0, 0, 10, 10, 20, 0.5), false);
}

#[wasm_bindgen_test]
pub fn is_hit() {
    assert_eq!(is_hit(0, 0, 10, 10, 10, 1), false);
}
