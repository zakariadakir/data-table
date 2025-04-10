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
      },
    },
  },
  plugins: [],
};
