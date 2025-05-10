import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginReactNative from "eslint-plugin-react-native";
import parser from "@babel/eslint-parser"; // ✅ On importe l'objet, pas une string
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      parser, // ✅ c’est un objet JS maintenant
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: pluginReact,
      "react-native": pluginReactNative,
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReactNative.configs.all.rules,
      "react-native/no-raw-text": "error",
    },
    settings: {
      react: {
        version: "detect", // ✅ Corrige le warning React version
      },
    },
  },
]);
