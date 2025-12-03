const roles = require('../../guard/roles')

class SigninUserAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'auth:signin'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        if(ctx.req.session.role != roles.anonymous)
            return ctx.res.redirect("/");
        return ctx.res.render("signin");
    }
}
module.exports = { SigninUserAction }