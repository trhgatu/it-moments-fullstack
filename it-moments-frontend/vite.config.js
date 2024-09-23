import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      scopeBehaviour: 'local', // có thể để 'global' nếu bạn muốn toàn cục
      generateScopedName: '[name]__[local]__[hash:base64:5]', // định dạng mới
    },
  },
});
