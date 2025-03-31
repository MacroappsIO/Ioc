import { test } from "@japa/runner";
import { ClassResolver } from "../../src/container/strategies/ClassResolver";
import { FactoryResolver } from "../../src/container/strategies/FactoryResolver";
import { ValueResolver } from "../../src/container/strategies/ValueResolver";
import type {
  ClassProvider,
  FactoryProvider,
  ResolverContext,
  Token,
  ValueProvider,
} from "../../src/types";
import { strategyTable } from "../../src/container/strategies";
import { ClassWithDeps, Dependency } from "../fixtures/ClassWithDeps";

const mockContext: ResolverContext = {
  resolve<T>(token: Token<T>): T {
    if (token === "Dependency") return new Dependency() as T;
    if (token === (Number as any)) return 42 as T;

    throw new Error(`Token not resolved: ${String(token)}`);
  },
};

test.group("ClassResolver", () => {
  test("resolve with paramTypes and injectTokens", ({ assert }) => {
    const provider: ClassProvider = {
      type: "class" as const,
      token: ClassWithDeps,
      useClass: ClassWithDeps,
      scope: "singleton",
    };

    Reflect.defineMetadata("design:paramtypes", [Dependency], ClassWithDeps);
    Reflect.defineMetadata("ioc:inject_params", ["Dependency"], ClassWithDeps);

    const instance = ClassResolver(provider, mockContext);

    assert.instanceOf(instance, ClassWithDeps);
    assert.equal(instance.dep.name, "dep");
    assert.isTrue(instance.initialized);
    assert.equal(provider.instance, instance);
  });

  test("returns existing singleton instance", ({ assert }) => {
    const instance = new ClassWithDeps(new Dependency());
    const provider: ClassProvider = {
      type: "class" as const,
      token: ClassWithDeps,
      useClass: ClassWithDeps,
      scope: "singleton",
      instance,
    };

    const resolved = ClassResolver(provider, mockContext);

    assert.strictEqual(resolved, instance);
  });
});

test.group("FactoryResolver", () => {
  test("resolves from factory and stores singleton", ({ assert }) => {
    const factory = () => "built";
    const provider: FactoryProvider = {
      type: "factory" as const,
      token: "Factory",
      useFactory: factory,
      deps: [],
      scope: "singleton",
    };

    const result = FactoryResolver(provider, mockContext);

    assert.equal(result, "built");
    assert.strictEqual(provider.instance, result);
  });

  test("resolves with deps", ({ assert }) => {
    const factory = (x: number) => `val:${x}`;
    const provider: FactoryProvider = {
      type: "factory" as const,
      token: "WithDep",
      useFactory: factory,
      deps: [Number],
      scope: "transient",
    };

    const result = FactoryResolver(provider, mockContext);

    assert.equal(result, "val:42");
    assert.isUndefined(provider.instance);
  });

  test("returns cached singleton", ({ assert }) => {
    const provider: FactoryProvider = {
      type: "factory" as const,
      token: "Cached",
      useFactory: () => "should-not-run",
      deps: [],
      scope: "singleton",
      instance: "cached-value",
    };

    const result = FactoryResolver(provider, mockContext);

    assert.equal(result, "cached-value");
  });
});

test.group("ValueResolver", () => {
  test("returns the useValue", ({ assert }) => {
    const provider: ValueProvider = {
      type: "value" as const,
      token: "pi",
      useValue: 3.14,
    };

    const result = ValueResolver(provider, mockContext);
    assert.equal(result, 3.14);
  });
});

test.group("StrategyTable", () => {
  test("resolves strategy by type", ({ assert }) => {
    assert.strictEqual(strategyTable.get("class"), ClassResolver);
    assert.strictEqual(strategyTable.get("factory"), FactoryResolver);
    assert.strictEqual(strategyTable.get("value"), ValueResolver);
  });

  test("fails if unknown type is passed", ({ assert }) => {
    const unknownResolver = strategyTable.get("other");
    assert.isUndefined(unknownResolver);
  });
});
