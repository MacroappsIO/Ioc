import { test } from "@japa/runner";
import "reflect-metadata";
import { Inject } from "../../src/decorators/Inject";
import { Injectable } from "../../src/decorators/Injectable";
import { MetadataKeys } from "../../src/metadata";

class ServiceA {}
class ServiceB {}

test.group("Inject decorator", () => {
  test("define metadata para parâmetro injetado", ({ assert }) => {
    class TestClass {
      constructor(@Inject("TokenA") _dep: any) {}
    }

    const meta = Reflect.getMetadata(MetadataKeys.InjectParams, TestClass);
    assert.deepEqual(meta, ["TokenA"]);
  });

  test("define múltiplos parâmetros injetados na ordem correta", ({
    assert,
  }) => {
    class MultiInject {
      constructor(
        @Inject("A") _a: any,
        @Inject("B") _b: any,
        @Inject("C") _c: any
      ) {}
    }

    const meta = Reflect.getMetadata(MetadataKeys.InjectParams, MultiInject);
    assert.deepEqual(meta, ["A", "B", "C"]);
  });

  test("mantém posições corretas mesmo se alguns não forem decorados", ({
    assert,
  }) => {
    class PartialInject {
      constructor(_a: any, @Inject("B") _b: any) {}
    }

    const meta = Reflect.getMetadata(MetadataKeys.InjectParams, PartialInject);
    assert.deepEqual(meta, [undefined, "B"]);
  });
});

test.group("Injectable decorator", () => {
  test("marca a classe como injetável", ({ assert }) => {
    @Injectable()
    class MyService {}

    const isInjectable = Reflect.getMetadata(
      MetadataKeys.Injectable,
      MyService
    );
    assert.isTrue(isInjectable);
  });

  test("não aplica metadata se não for decorado", ({ assert }) => {
    class PlainClass {}

    const isInjectable = Reflect.getMetadata(
      MetadataKeys.Injectable,
      PlainClass
    );
    assert.isUndefined(isInjectable);
  });
});
