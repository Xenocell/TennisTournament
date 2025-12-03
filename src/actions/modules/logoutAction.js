const roles = require('../../guard/roles');

class LogoutUserAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'auth:logout'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        ctx.req.session.account_id = -1;
        ctx.req.session.player_id = -1;
        ctx.req.session.representative_id = -1;
        ctx.req.session.type = -1;
        ctx.req.session.role = roles.anonymous;
        //await ctx.services[0][0].destroySesion(ctx.req.session.id);
        return ctx.res.redirect("/signin");
    }
}
module.exports = { LogoutUserAction }