import { Injectable } from "../../src/decorators";

@Injectable()
export class ScopedService {
  getTenant() {
    return "scoped:tenant-42";
  }
}
