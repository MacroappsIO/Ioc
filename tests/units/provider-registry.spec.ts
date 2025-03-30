import { test } from "@japa/runner";
import { ProviderRegistry } from "../../src/container/ProviderRegistry";
import type { ClassProvider, Token } from "../../src/types";

class MyService {
  name = "service";
}

const mockProvider: ClassProvider<MyService> = {
  type: "class",
  token: MyService,
  useClass: MyService,
  scope: "singleton",
};

test.group("ProviderRegistry", () => {
  test("register() adiciona provider corretamente", ({ assert }) => {
    const registry = new ProviderRegistry();
    registry.register(mockProvider);

    const stored = registry.get(MyService);
    assert.deepEqual(stored, mockProvider);
  });

  test("get() retorna undefined se não encontrado", ({ assert }) => {
    const registry = new ProviderRegistry();
    const result = registry.get(Symbol("NotRegistered"));
    assert.isUndefined(result);
  });

  test("has() retorna true para provider existente", ({ assert }) => {
    const registry = new ProviderRegistry();
    registry.register(mockProvider);

    assert.isTrue(registry.has(MyService));
  });

  test("has() retorna false para token não registrado", ({ assert }) => {
    const registry = new ProviderRegistry();
    assert.isFalse(registry.has(Symbol("Other")));
  });

  test("all() retorna lista com todos os providers", ({ assert }) => {
    const registry = new ProviderRegistry();
    registry.register(mockProvider);

    const all = registry.all();
    assert.lengthOf(all, 1);
    assert.deepEqual(all[0], mockProvider);
  });

  test("clear() remove todos os providers", ({ assert }) => {
    const registry = new ProviderRegistry();
    registry.register(mockProvider);
    registry.clear();

    assert.isFalse(registry.has(MyService));
    assert.deepEqual(registry.all(), []);
  });
});
