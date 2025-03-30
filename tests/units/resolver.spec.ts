import { test } from "@japa/runner";
import { Resolver } from "../../src/container/Resolver";
import { ProviderRegistry } from "../../src/container/ProviderRegistry";
import type {
  ClassProvider,
  FactoryProvider,
  ValueProvider,
  Token,
} from "../../src/types";

class MyService {
  name = "service";
}

test.group("Resolver", () => {
  test("resolve value provider", ({ assert }) => {
    const registry = new ProviderRegistry();
    registry.register({
      type: "value",
      token: "pi",
      useValue: 3.14,
    } satisfies ValueProvider);

    const resolver = new Resolver(registry);
    const value = resolver.resolve("pi");

    assert.equal(value, 3.14);
  });

  test("resolve factory provider", ({ assert }) => {
    const registry = new ProviderRegistry();
    registry.register({
      type: "factory",
      token: "factoryToken",
      useFactory: () => "from-factory",
      deps: [],
      scope: "singleton",
    } satisfies FactoryProvider);

    const resolver = new Resolver(registry);
    const result = resolver.resolve("factoryToken");

    assert.equal(result, "from-factory");
  });

  test("resolve class provider", ({ assert }) => {
    const registry = new ProviderRegistry();
    registry.register({
      type: "class",
      token: MyService,
      useClass: MyService,
      scope: "singleton",
    } satisfies ClassProvider);

    const resolver = new Resolver(registry);
    const instance = resolver.resolve(MyService);

    assert.instanceOf(instance, MyService);
    assert.equal(instance.name, "service");
  });

  test("throws if token is not registered", ({ assert }) => {
    const registry = new ProviderRegistry();
    const resolver = new Resolver(registry);

    assert.throws(() => {
      resolver.resolve("not-registered");
    }, /Token não registrado/);
  });

  test("throws if provider type is unknown", ({ assert }) => {
    const registry = new ProviderRegistry();

    registry.register({
      type: "invalid",
      token: "X",
      useValue: 1,
    } as unknown as ValueProvider);
    const resolver = new Resolver(registry);

    assert.throws(() => {
      resolver.resolve("X");
    }, /Tipo de provider não suportado/);
  });
});
