import "reflect-metadata";
import { MetadataKeys } from "../metadata";

export function Inject(token: any): ParameterDecorator {
  return (target, _propertyKey, index) => {
    const existing =
      Reflect.getMetadata(MetadataKeys.InjectParams, target) || [];
    existing[index] = token;
    Reflect.defineMetadata(MetadataKeys.InjectParams, existing, target);
  };
}
