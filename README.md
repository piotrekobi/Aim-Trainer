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

Zainstaluj wykorzystywane moduły:

```bash
pip install -r requirements.txt
```

Serwer uruchamiany poleceniem:

```bash
python3 server.py
```

API zostanie wystawione pod adresem [http://localhost:8000/](http://localhost:8000/).

Na [localhost:8000/docs](localhost:8000/docs) znajduje się lista dostępnych operacji.

## Uruchamianie testów jednostkowych

Testy jednostkowe javascript uruchamiane są wewnątrz folderu www/ za pomocą komendy:

```bash
npm test
```

Testy jednostkowe funkcji napisanych w języku Rust można uruchomić za pomocą komendy:

```bash
wasm-pack test --node
```

Testy jednostkowe serwera w Pythonie:

Należy najpierw zainstalować wykorzystywane moduły:

```bash
pip install -r requirements.txt
```

Uruchamiane są komendą:

```bash
pytest
```
