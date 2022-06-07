use aim_trainer::cursor_inside;
use aim_trainer::randint;
use aim_trainer::is_hit;
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
pub fn test_is_hit_1() {
    assert_eq!(is_hit(0.0, 0.0, 10.0, 10.0, 20.0, 1.0), true);
}

#[wasm_bindgen_test]
pub fn test_is_hit_2() {
    assert_eq!(is_hit(10.0, 10.0, 0.0, 0.0, 20.0, 1.0), true);
}

#[wasm_bindgen_test]
pub fn test_is_hit_3() {
    assert_eq!(is_hit(0.0, 0.0, -10.0, -10.0, 20.0, 1.0), true);
}

#[wasm_bindgen_test]
pub fn test_is_hit_4() {
    assert_eq!(is_hit(0.0, 0.0, 10.0, 10.0, 20.0, 0.5), false);
}

#[wasm_bindgen_test]
pub fn test_is_hit_5() {
    assert_eq!(is_hit(0.0, 0.0, 10.0, 10.0, 10.0, 1.0), false);
}
