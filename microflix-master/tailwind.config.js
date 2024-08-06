/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        translate_down_to_up:{
          '0%': {transform: 'translateY(100vh)', opacity: '0'},
          "100%": {transform: 'translateY(00px)', opacity: '1'}
        },
        translate_up_to_down:{
          "0%": {transform: 'translateY(-30vh)', opacity: '0'},
          '100%': {transform: 'translateY(0vh)', opacity: '1'}
        },
        translate_right_to_left:{
          "0%": {transform: 'translateX(100vw)', opacity: '0'},
          '100%': {transform: 'translateX(0vw)', opacity: '1'}
        }
      },
      animation:{
        translate_down_to_up: "translate_down_to_up 1s ease-in-out",
        translate_up_to_down: "translate_up_to_down 1s ease-in-out",
        translate_right_to_left: "translate_right_to_left 1s ease-in-out"
      },
      screens:{
        "xxl": "1980px",
        "xl": "1560px",
        "llg": "1280px",
        "mmd": "900px",
        "smmd": "810px",
        "smd": "756px",
        "xs": "475px",
        "xxs": "375px"
      },
    },
  },
  plugins: [],
}