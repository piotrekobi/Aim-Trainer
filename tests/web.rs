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
