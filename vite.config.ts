import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [vue(), svgLoader()],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @import "@/styles/typo.scss";
          @import "@/styles/mixins.scss";
        `
        }
      }
    }
  };
});
