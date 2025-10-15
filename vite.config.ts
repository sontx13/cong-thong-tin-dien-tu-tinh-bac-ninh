import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default () => {
  return defineConfig({
    root: "./src",
    base: "",
    plugins: [tsconfigPaths(), react()],
    server: {
      port: 3000, // hoặc 5173 nếu bạn muốn mặc định
      proxy: {
        "/api": {
          target: "https://vnptbacninh.com", // domain backend
          changeOrigin: true,
          secure: false, // bỏ kiểm tra chứng chỉ tự ký
        },
      },
    },
  });
};
