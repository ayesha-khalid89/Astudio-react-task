// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        neutra: ['"Neutra Text"', 'sans-serif'],
      },
      colors: {
        primary: "#fdc936",  
        secondary: "#c0e3e5", 
        light: "#ebebeb",    
        hoverRow: "rgb(243,239,239)", 
      },
      borderWidth: {
      },
      spacing: {
        "5px": "5px",
        "8px": "8px",   
        "10px": "10px",
        "16px": "16px",
      },
      transitionDuration: {
        300: "300ms",
      },
      scale: {
      },
    },
  },
  plugins: [],
};
