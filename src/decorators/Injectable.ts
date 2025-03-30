import "reflect-metadata";
import { MetadataKeys } from "../metadata";

export function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MetadataKeys.Injectable, true, target);
  };
}
