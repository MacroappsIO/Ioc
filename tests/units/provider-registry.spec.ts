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
  test("should register a provider", ({ assert }) => {
    const registry = new ProviderRegistry();
    registry.register(mockProvider);

    const stored = registry.get(MyService);
    assert.deepEqual(stored, mockProvider);
  });

  test("should return undefined when provider is not found", ({ assert }) => {
    const registry = new ProviderRegistry();
    const result = registry.get(Symbol("NotRegistered"));
    assert.isUndefined(result);
  });

  test("should return true when provider exists", ({ assert }) => {
    const registry = new ProviderRegistry();
    registry.register(mockProvider);

    assert.isTrue(registry.has(MyService));
  });

  test("should return false when provider does not exist", ({ assert }) => {
    const registry = new ProviderRegistry();
    assert.isFalse(registry.has(Symbol("Other")));
  });

  test("should return all registered providers", ({ assert }) => {
    const registry = new ProviderRegistry();
    registry.register(mockProvider);

    const all = registry.all();
    assert.lengthOf(all, 1);
    assert.deepEqual(all[0], mockProvider);
  });

  test("should clear all registered providers", ({ assert }) => {
    const registry = new ProviderRegistry();
    registry.register(mockProvider);
    registry.clear();

    assert.isFalse(registry.has(MyService));
    assert.deepEqual(registry.all(), []);
  });
});
