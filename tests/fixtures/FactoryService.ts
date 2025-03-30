export const createFactoryService = (prefix: string) => {
  return {
    name: `${prefix}-service`,
    id: Math.floor(Math.random() * 1000),
  };
};
