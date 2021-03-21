import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default (command) => {
    return defineConfig({
        base: command === 'build' ? '/svg-gradients/' : '',
        plugins: [vue()],
    });
}
