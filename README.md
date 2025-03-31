# IoC Container for MacroApps

A lightweight, extensible and fully TypeScript-based Inversion of Control (IoC) container for managing dependencies across the MacroApps architecture.

## 🚀 Features

- ✅ Class, Factory, and Value providers
- ✅ Singleton and Transient scopes
- ✅ Dependency resolution via constructor injection
- ✅ Decorators: `@Injectable`, `@Inject`
- ✅ Module auto-loading with `@Injectable` detection
- ✅ Scoped containers
- ✅ Type-safe API
- ✅ 100% tested with Japa + TSX

---

## 📦 Installation

> ⚠️ This package is not yet available on `npm`. Installation instructions will be updated when published.

For now, clone or copy the source files into your project

```bash
git clone https://github.com/MacroappsIO/Ioc/
```

> This project uses [Japa](https://japa.dev/) as the test runner and [Reflect Metadata](https://rbuckton.github.io/reflect-metadata/).

---

## 🧠 Core Concepts

### 📌 Providers

The container supports three types of providers:

| Type    | Description                                |
| ------- | ------------------------------------------ |
| Class   | Uses a constructor to create instances     |
| Factory | Uses a custom function to create instances |
| Value   | Uses a static value                        |

### 🔄 Scopes

| Scope     | Behavior                            |
| --------- | ----------------------------------- |
| Singleton | A single instance per container     |
| Transient | A new instance for every resolution |

---

## 📁 Directory Structure

```
src/
├── container/
│   ├── Container.ts
│   ├── Resolver.ts
│   ├── Scope.ts
│   ├── ProviderRegistry.ts
│   └── strategies/
├── decorators/
│   ├── Inject.ts
│   └── Injectable.ts
├── modules/
│   └── Loader.ts
├── metadata/
│   └── MetadataKeys.ts
├── types/
│   └── index.ts
tests/
├── fixtures/
├── units/
```

---

## 🧩 Usage

### Basic Class Binding

```ts
class Logger {
  log(message: string) {
    console.log(message);
  }
}

const container = new Container();
container.bind(Logger).to(Logger);

const logger = container.resolve(Logger);
logger.log("Hello from IoC!");
```

### Factory Provider

```ts
container.bindFactory("uuid", () => crypto.randomUUID());
const uuid = container.resolve("uuid");
```

### Value Provider

```ts
container.bindValue("pi", 3.1415);
const pi = container.resolve("pi"); // 3.1415
```

---

## 🧪 Testing

We use [Japa](https://japa.dev/) with [`tsx`](https://github.com/esbuild-kit/tsx) to run modern TypeScript tests.

### Running tests

```bash
npm run test
```

> All tests are located in `tests/units/**.spec.ts` and cover 100% of the public API and decorators.

---

## 🧬 Decorators

### `@Injectable`

Marks a class as available for dependency injection.

```ts
@Injectable()
class ServiceA {}
```

### `@Inject(token)`

Injects a dependency by token into a constructor parameter.

```ts
class Controller {
  constructor(@Inject("ServiceA") private service: ServiceA) {}
}
```

---

## 📦 Module Loader

Automatically loads all files matching a pattern and registers those decorated with `@Injectable`.

```ts
await loadModules("app/services/**/*.ts", {
  failOnEmpty: true,
  failFast: true,
  verbose: true,
});
```

---

## 🔧 Creating a Scoped Container

```ts
const appContainer = new Container();
const requestScope = appContainer.createScope();
```

Each scope inherits registered providers but resolves its own instances (if transient).

---

## 📄 License

MIT

---

## 👨‍💻 Maintainer

Developed by [R. Souza](mailto:rsouza@example.com) for the **MacroApps** platform.
