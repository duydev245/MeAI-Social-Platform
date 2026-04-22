const runtimeConfigKeys = ['VITE_API_URL', 'VITE_GOOGLE_CLIENT_ID', 'VITE_NODE_ENV'] as const;

type RuntimeConfigKey = (typeof runtimeConfigKeys)[number];

function renderRuntimeConfig(env: Env) {
  const runtimeConfig = runtimeConfigKeys.reduce(
    (config, key) => {
      config[key] = env[key];
      return config;
    },
    {} as Record<RuntimeConfigKey, string>
  );

  return `window.__MEAI_RUNTIME_CONFIG__ = Object.freeze(${JSON.stringify(runtimeConfig)});\n`;
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/runtime-config.js') {
      return new Response(renderRuntimeConfig(env), {
        headers: {
          'content-type': 'application/javascript; charset=utf-8',
          'cache-control': 'no-store'
        }
      });
    }

    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;

declare global {
  interface Env {
    ASSETS: Fetcher;
    VITE_API_URL: string;
    VITE_GOOGLE_CLIENT_ID: string;
    VITE_NODE_ENV: string;
  }
}
