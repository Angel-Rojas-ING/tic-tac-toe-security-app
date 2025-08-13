const security = require('eslint-plugin-security');

module.exports = [
  {
    files: ["**/*.js"],
    plugins: {
      security: security
    },
    rules: {
      "security/detect-object-injection": "error",
      "security/detect-non-literal-regexp": "error", 
      "security/detect-non-literal-fs-filename": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-possible-timing-attacks": "error",
      "security/detect-pseudoRandomBytes": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-child-process": "error",
      "security/detect-disable-mustache-escape": "error",
      "security/detect-new-buffer": "error",
      "security/detect-no-csrf-before-method-override": "error",
      "security/detect-unsafe-regex": "error",
      "no-eval": "error",
      "no-implied-eval": "error", 
      "no-new-func": "error",
      "no-script-url": "error"
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        "console": "readonly",
        "process": "readonly",
        "Buffer": "readonly",
        "require": "readonly",
        "module": "readonly",
        "exports": "readonly",
        "__dirname": "readonly",
        "__filename": "readonly",
        "global": "readonly",
        "document": "readonly",
        "window": "readonly",
        "fetch": "readonly"
      }
    }
  }
];