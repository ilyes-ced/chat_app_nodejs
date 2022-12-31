/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './views/*.ejs',
        './views/components/*.ejs'
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#222a3f',
                'secondary': '#1d2437',
                'tertiary': '#393d5e',
                'dark_pink': '#dc386e',
                'ligth_pink': '#f06391',
            },
        },
    },
    plugins: [],
}