/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './views/*.ejs'
    ],
    theme: {
        extend: {
            colors: {
                'main': '#171923',
                'secondary': '#252a37',
                'the_red': '#ff2d20',
                'icons': '#93939e',
                'text_color': '#e7e8f2',
            },
        },
    },
    plugins: [],
}