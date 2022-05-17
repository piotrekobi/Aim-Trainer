# Aim Trainer

Aim trainer to gra napisana w języku Rust + WebAssembly pozwalająca na trenowanie celności w grach typu FPS.

## Uruchamianie

Zainstaluj cargo za pomocą polecenia:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Zainstaluj wasm-pack za pomocą polecenia:

```bash
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

Wykonaj następującą komendę w folderze głównym, w celu zbudowania projektu:

```bash
wasm-pack build
```

Wykonaj następujące komendy, w celu zainstalowania wymaganych pakietów i uruchomienia aplikacji:

```bash
cd www
npm install
npm start
```

Aplikacja powinna być dostępna pod adresem [http://localhost:8080/](http://localhost:8080/)

## Uruchamianie serwera

Serwer uruchamiany poleceniem &uvicorn server:app

(Należy zainstalować uvicorn: &pip install uvicorn)

Api zostanie wystawione pod adresem localhost:8000, localhost:8000/docs - lista dostępnych operacji

## Testy serera

Testy uruchamiamy poleceniem &pytest

(Należy zainstalować pytest: &pip install pytest)