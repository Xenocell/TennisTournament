class PlayersAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:players'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        return ctx.res.render("players", { role: ctx.req.session.role })
    }
}
module.exports = { PlayersAction }