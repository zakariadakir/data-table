/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./scripts/*.js"],
  theme: {
    extend: {
      fontFamily: { inter: ["Inter", "sans-serif"] },
      boxShadow: {
        custom: "0px 0px 0px 1px #5E5ADB, 0px 1px 1px 0px #0000001A",
        custom2: "0px 0px 0px 1px #4945C4, 0px 1px 1px 0px #0000001A",
        custom3:
          "0px 0px 0px 4px #5E5ADB66, 0px 0px 0px 1px #5E5ADB, 0px 1px 1px 0px #0000001A",
        custom4: "0px 0px 0px 1px #464F601A, 0px 1px 1px 0px #0000001A",
        custom5: "0px 0px 0px 1px #464F6052, 0px 1px 1px 0px #0000001A",
        custom6:
          "0px 0px 0px 4px #5E5ADB66, 0px 0px 0px 1px #464F6052, 0px 1px 1px 0px #0000001A",
        custom7: "0px 0px 0px 1px #D1293D, 0px 1px 1px 0px #0000001A",
        custom8: "0px 0px 0px 1px #BA1B2E, 0px 1px 1px 0px #0000001A",
        custom9:
          "0px 0px 0px 4px #5E5ADB66, 0px 0px 0px 1px #D1293D, 0px 1px 1px 0px #0000001A",
        custom10: "0px 0px 0px 1px #868FA01A, 0px 1px 2px 0px #0000000F",
        custom11: "0px 0px 0px 1px #868FA066, 0px 1px 2px 0px #0000000F",
        custom12:
          "0px 0px 0px 4px #5E5ADB66, 0px 0px 0px 1px #868FA052, 0px 1px 2px 0px #0000000F",
        custom13: "0px 0px 0px 1px #464F601A, 0px 1px 1px 0px #0000001A",
        custom14: "0px 0px 0px 1px #868fa028, 0px 1px 2px 0px #0000000f",
        custom15: "0px 0px 0px 1px #868fa066, 0px 1px 2px 0px #0000000f",
        custom16:
          "0px 0px 0px 4px #5e5adb66, 0px 0px 0px 1px #868fa032, 0px 1px 2px 0px #0000000f",
        custom17:
          "0px 10px 30px 0px #00000033, 0px 30px 70px 0px #1a224026, 0px 0px 0px 1px #888faa1a",
      },
    },
  },
  plugins: [],
};
