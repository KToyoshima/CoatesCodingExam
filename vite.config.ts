import { defineConfig, ConfigEnv, UserConfigExport, loadEnv  } from 'vite';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default function ({command, mode}: ConfigEnv): UserConfigExport {
  const env = loadEnv(mode, process.cwd(), '')
  return defineConfig({
    plugins: [react()],
    build: {
      assetsDir: '.',
      // brotliSize: false,
    },
    define: {
      __APP_ENV__: env.APP_ENV,
      'process.env.REACT_APP_GOOGLE_API': 'AIzaSyDiKmRh2vEg2hiV1ZIVeyNlxPjVegpChvE'
    },
  });
}