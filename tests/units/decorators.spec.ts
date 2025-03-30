import { test } from "@japa/runner";
import "reflect-metadata";

import { Inject } from "../../src/decorators/Inject";
import { Injectable } from "../../src/decorators/Injectable";
import { MetadataKeys } from "../../src/metadata";

test.group("Inject decorator", () => {
  test("should define metadata for a single injected parameter", ({
    assert,
  }) => {
    class DecoratedClass {
      constructor(@Inject("TokenA") _dep: any) {}
    }

    const metadata = Reflect.getMetadata(
      MetadataKeys.InjectParams,
      DecoratedClass
    );
    assert.deepEqual(metadata, ["TokenA"]);
  });

  test("should define metadata in correct order for multiple injected parameters", ({
    assert,
  }) => {
    class MultiDependencyClass {
      constructor(
        @Inject("A") _a: any,
        @Inject("B") _b: any,
        @Inject("C") _c: any
      ) {}
    }

    const metadata = Reflect.getMetadata(
      MetadataKeys.InjectParams,
      MultiDependencyClass
    );
    assert.deepEqual(metadata, ["A", "B", "C"]);
  });

  test("should preserve parameter position for partial injection", ({
    assert,
  }) => {
    class PartialInjectionClass {
      constructor(_a: any, @Inject("B") _b: any) {}
    }

    const metadata = Reflect.getMetadata(
      MetadataKeys.InjectParams,
      PartialInjectionClass
    );
    assert.deepEqual(metadata, [undefined, "B"]);
  });
});

test.group("Injectable decorator", () => {
  test("should mark a class as injectable", ({ assert }) => {
    @Injectable()
    class InjectableClass {}

    const result = Reflect.getMetadata(
      MetadataKeys.Injectable,
      InjectableClass
    );
    assert.isTrue(result);
  });

  test("should not mark class as injectable if not decorated", ({ assert }) => {
    class UndecoratedClass {}

    const result = Reflect.getMetadata(
      MetadataKeys.Injectable,
      UndecoratedClass
    );
    assert.isUndefined(result);
  });
});
