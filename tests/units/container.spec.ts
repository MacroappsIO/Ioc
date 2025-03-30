import { test } from "@japa/runner";
import { Container } from "../../src/container/Container";
import { ClassProvider, FactoryProvider, ValueProvider } from "../../src/types";

class MyService {
  getMessage() {
    return "hello";
  }
}

test.group("Container - bind()", () => {
  test("bind().to() registra como singleton por padrão", ({ assert }) => {
    const container = new Container();
    container.bind(MyService).to(MyService);

    const registered = (container as any).registry.get(
      MyService
    ) as ClassProvider;

    assert.equal(registered.type, "class");
    assert.equal(registered.scope, "singleton");
    assert.strictEqual(registered.useClass, MyService);
  });

  test("bind().to().asTransient() atualiza escopo para transient", ({
    assert,
  }) => {
    const container = new Container();
    const config = container.bind(MyService).to(MyService);
    config.asTransient();

    const registered = (container as any).registry.get(
      MyService
    ) as ClassProvider;
    assert.equal(registered.scope, "transient");
  });

  test("bind().to().asSingleton() força escopo singleton", ({ assert }) => {
    const container = new Container();
    const config = container.bind(MyService).to(MyService);
    config.asSingleton();

    const registered = (container as any).registry.get(
      MyService
    ) as ClassProvider;
    assert.equal(registered.scope, "singleton");
  });
});

test.group("Container - bindFactory()", () => {
  test("registra factory como singleton por padrão", ({ assert }) => {
    const container = new Container();
    const factory = () => new MyService();

    container.bindFactory("MyFactory", factory, []);

    const registered = (container as any).registry.get(
      "MyFactory"
    ) as FactoryProvider;
    assert.equal(registered.type, "factory");
    assert.equal(registered.scope, "singleton");
    assert.strictEqual(registered.useFactory, factory);
    assert.deepEqual(registered.deps, []);
  });

  test("bindFactory().asTransient() atualiza escopo corretamente", ({
    assert,
  }) => {
    const container = new Container();
    const factory = () => new MyService();
    const config = container.bindFactory("TransientFactory", factory);
    config.asTransient();

    const registered = (container as any).registry.get(
      "TransientFactory"
    ) as FactoryProvider;
    assert.equal(registered.scope, "transient");
  });
});

test.group("Container - bindValue()", () => {
  test("registra um value provider corretamente", ({ assert }) => {
    const container = new Container();
    container.bindValue("MyValue", 123);

    const registered = (container as any).registry.get(
      "MyValue"
    ) as ValueProvider;
    assert.equal(registered.type, "value");
    assert.strictEqual(registered.useValue, 123);
  });
});

test.group("Container - createScope()", () => {
  test("retorna nova instância de container (isolada)", ({ assert }) => {
    const root = new Container();
    const scope = root.createScope();

    assert.instanceOf(scope, Container);
    assert.notStrictEqual(scope, root);
  });
});
