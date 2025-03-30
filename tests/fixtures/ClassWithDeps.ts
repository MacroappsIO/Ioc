import { Injectable, Inject } from "../../src/decorators";

@Injectable()
export class Dependency {
  name = "dep";
}

@Injectable()
export class ClassWithDeps {
  constructor(@Inject("Dependency") public dep: Dependency) {}

  onInit() {
    this.initialized = true;
  }

  initialized = false;
}
