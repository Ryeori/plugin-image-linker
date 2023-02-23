import { Config, Plugin } from "payload/config";

export const imageLinker =
  (): Plugin =>
  (incomingConfig: Config): Config => {
    return {
      ...incomingConfig,
      admin: {
        webpack: (config: any) => ({
          ...config,
          resolve: {
            ...config.resolve,
            fallback: {
              ...config.resolve.fallback,
              fs: false,
            },
          },
        }),
      },
    };
  };
