import { Injectable } from "../../src/decorators";

export class NormalExport {
  id = 123;
}

@Injectable()
export class DecoratedService {
  name = "Multi";
}
