const express = require('express');
const router = express.Router();
const roles = require('../guard/roles');

const Root = router.get('/', (req, res, next) => {
    if (req.session.role == roles.anonymous){
        return res.redirect("/signup");
    }
    if (req.session.role == roles.referee){
        return res.redirect("/referee")
    }
    return res.redirect("/form/1");
});

module.exports = { Root }