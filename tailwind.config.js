/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./scripts/*.js"],
  theme: {
    extend: {
      colors: {
        gray: {
          0: "rgb(247, 249, 252)",
          1: "rgb(233, 237, 245)",
        },
        indigo: {
          0: "rgb(237, 237, 252)",
        },
        green: {
          0: "rgb(225, 252, 239)",
        },
        red: {
          0: "rgb(255, 237, 239)",
        },
        orange: {
          0: "rgb(252, 242, 230)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        "primary-btn-default":
          "0px 0px 0px 1px rgb(94, 90, 219),0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "primary-btn-hover":
          "0px 0px 0px 1px rgb(73, 69, 196),0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "primary-btn-active":
          "0px 0px 0px 4px rgba(94, 90, 219, 0.4),0px 0px 0px 1px rgb(94, 90, 219),0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "primary-btn-disabled":
          "0px 0px 0px 1px rgb(158, 155, 245),0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "secondary-btn-default":
          "0px 0px 0px 1px rgba(70, 79, 96, 0.16),0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "secondary-btn-hover":
          "0px 0px 0px 1px rgba(70, 79, 96, 0.32),0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "secondary-btn-active":
          "0px 0px 0px 4px rgba(94, 90, 219, 0.4),0px 0px 0px 1px rgba(70, 79, 96, 0.32),0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "secondary-btn-disabled": "0px 0px 0px 1px rgba(70, 79, 96, 0.2)",
        "danger-btn-default":
          "0px 0px 0px 1px rgb(209, 41, 61),0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "danger-btn-hover":
          "0px 0px 0px 1px rgb(186, 27, 46),0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "danger-btn-active":
          "0px 0px 0px 4px rgba(94, 90, 219, 0.4),0px 0px 0px 1px rgb(209, 41, 61),0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "primary-input-default":
          "0px 0px 0px 1px rgba(134, 143, 160, 0.16),0px 1px 2px 0px rgba(0, 0, 0, 0.06)",
        "primary-input-hover":
          "0px 0px 0px 1px rgba(134, 143, 160, 0.4),0px 1px 2px 0px rgba(0, 0, 0, 0.06)",
        "primary-input-focus":
          "0px 0px 0px 4px rgba(94, 90, 219, 0.4),0px 0px 0px 1px rgba(134, 143, 160, 0.32),0px 1px 2px 0px rgba(0, 0, 0, 0.06)",
        "project-deletion-form":
          "0px 10px 30px 0px rgba(0, 0, 0, 0.2),0px 30px 70px -10px rgba(17, 24, 38, 0.25),0px 0px 0px 1px rgba(152, 161, 178, 0.1)",
        "project-form":
          "0px 10px 30px 0px rgba(0, 0, 0, 0.2),0px 30px 70px 0px rgba(26, 34, 64, 0.15),0px 0px 0px 1px rgba(136, 143, 170, 0.1);",
        "project-actions-menu":
          "0px 5px 15px 0px rgba(0, 0, 0, 0.08),0px 15px 35px -5px rgba(17, 24, 38, 0.15),0px 0px 0px 1px rgba(152, 161, 179, 0.1)",
        "toast-notification":
          "0px 5px 15px 0px rgba(0, 0, 0, 0.25),0px 15px 35px -5px rgba(17, 24, 38, 0.5),0px 0px 0px 0.5px rgba(255, 255, 255, 0.4)",
        "project-checkbox-default":
          "0px 0px 0px 1px rgba(70, 79, 96, 0.16), 0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "project-checkbox-hover":
          "0px 0px 0px 1px rgba(70, 79, 96, 0.32), 0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "project-checkbox-active":
          "0px 0px 0px 4px rgba(94, 90, 219, 0.4), 0px 0px 0px 1px rgba(70, 79, 96, 0.32), 0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "status-update-form": "0 4px 20px rgba(0, 0, 0, 0.1)",
        "resource-checkbox-default":
          "0px 0px 0px 1px rgba(70, 79, 96, 0.1), 0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "resource-checkbox-checked":
          "0px 0px 0px 1px rgb(94, 90, 219), 0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "resource-checkbox-checked-hover":
          "0px 0px 0px 1px rgb(73, 69, 196), 0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "resource-checkbox-checked-active":
          "0px 0px 0px 4px rgba(94, 90, 219, 0.4), 0px 0px 0px 1px rgb(94, 90, 219), 0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "resource-checkbox-hover":
          "0px 0px 0px 1px rgba(70, 79, 96, 0.16), 0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
        "resource-checkbox-active":
          "0px 0px 0px 1px rgba(70, 79, 96, 0.32), 0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
