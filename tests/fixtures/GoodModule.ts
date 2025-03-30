import { Injectable } from "../../src/decorators";

@Injectable()
export class GoodService {
  say() {
    return "hello from GoodService";
  }
}
