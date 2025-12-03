const express = require('express');
const router = express.Router();

const action = require('../actions/index');
const modules  = require('../actions/modules/index');

const Auth = (services) => {
    router.get('/signin', action(new modules.SigninUserAction()));
    router.get('/signup', action(new modules.SignupUserAction()));
    
    
    /*router.get('/signin', (req, res, next) => {
        return res.redirect("/counting");
    });
    router.get('/signup', (req, res, next) => {
        return res.redirect("/counting");
    });
    */
    router.get('/logout', action(new modules.LogoutUserAction(), services));

    router.get('/counting', (req, res, next) => {
        return res.redirect("/");
    })

    router.get('/tech_auth', action(new modules.SigninUserAction()))
    
    return router;
};

module.exports = { Auth }