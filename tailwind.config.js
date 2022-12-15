/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow:{
        'proba': 'rgba(255,255,255,0.8)_0_0_1000px_1000px',
      },
      backgroundColor: (theme) => ({
        ...theme("colors"),
        
        "edit-button":"#FEC776",
        "delete-button":"#ff4d4d",
        "create-button":"#C2E799",
        "default-background": "#00cdff",
        "discard-button":"#FEC776",
      }),
      borderColor:(theme) => ({
        ...theme("colors"),
        "primary-border": "#00cdff",
        "invoices-border": "#C2E799",
        "customers-border": "#FEC776",
        "sellers-border": "#bfbfbf",
        "discard-border":"#FEC776",
      }),
    },
  },
  plugins: [],
}
