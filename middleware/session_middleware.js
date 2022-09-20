const session = require('express-session')


module.exports = (app) => {
    // install session middleware
    app.use(session({
        secret: 'my_key',
        resave: false,
        saveUninitialized: false,
    }))
}