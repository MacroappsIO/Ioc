import { test } from "@japa/runner";
import { Container } from "../../src/container/Container";
import { ClassProvider, FactoryProvider, ValueProvider } from "../../src/types";
import { FakeService } from "../fixtures/FakeService";

test.group("Container / bind()", () => {
  test("should register class as singleton by default", ({ assert }) => {
    const container = new Container();
    container.bind(FakeService).to(FakeService);

    const registered = (container as any).registry.get(
      FakeService
    ) as ClassProvider;

    assert.equal(registered.type, "class");
    assert.equal(registered.scope, "singleton");
    assert.strictEqual(registered.useClass, FakeService);
  });

  test("should set scope to transient when using asTransient()", ({
    assert,
  }) => {
    const container = new Container();
    const config = container.bind(FakeService).to(FakeService);
    config.asTransient();

    const registered = (container as any).registry.get(
      FakeService
    ) as ClassProvider;
    assert.equal(registered.scope, "transient");
  });

  test("should keep scope as singleton when using asSingleton()", ({
    assert,
  }) => {
    const container = new Container();
    const config = container.bind(FakeService).to(FakeService);
    config.asSingleton();

    const registered = (container as any).registry.get(
      FakeService
    ) as ClassProvider;
    assert.equal(registered.scope, "singleton");
  });
});

test.group("Container / bindFactory()", () => {
  test("should register factory as singleton by default", ({ assert }) => {
    const container = new Container();
    const factory = () => new FakeService();

    container.bindFactory("MyFactory", factory, []);

    const registered = (container as any).registry.get(
      "MyFactory"
    ) as FactoryProvider;
    assert.equal(registered.type, "factory");
    assert.equal(registered.scope, "singleton");
    assert.strictEqual(registered.useFactory, factory);
    assert.deepEqual(registered.deps, []);
  });

  test("should set factory scope to transient using asTransient()", ({
    assert,
  }) => {
    const container = new Container();
    const factory = () => new FakeService();
    const config = container.bindFactory("TransientFactory", factory);
    config.asTransient();

    const registered = (container as any).registry.get(
      "TransientFactory"
    ) as FactoryProvider;
    assert.equal(registered.scope, "transient");
  });
});

test.group("Container / bindValue()", () => {
  test("should register value provider correctly", ({ assert }) => {
    const container = new Container();
    container.bindValue("MyValue", 123);

    const registered = (container as any).registry.get(
      "MyValue"
    ) as ValueProvider;
    assert.equal(registered.type, "value");
    assert.strictEqual(registered.useValue, 123);
  });
});

test.group("Container / createScope()", () => {
  test("should create a new isolated scope", ({ assert }) => {
    const root = new Container();
    const scope = root.createScope();

    assert.instanceOf(scope, Container);
    assert.notStrictEqual(scope, root);
  });
});
