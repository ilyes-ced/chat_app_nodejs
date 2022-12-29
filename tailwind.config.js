/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './views/*.ejs',
        './views/components/*.ejs'
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#1d203e',
                'secondary': '#21293e',
                'tertiary': '#393d5e',
                'dark_pink': '#e15484',
                'ligth_pink': '#f06391',
            },
        },
    },
    plugins: [],
}