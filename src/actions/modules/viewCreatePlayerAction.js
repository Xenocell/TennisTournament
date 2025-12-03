class ViewCreatePlayerAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:viewCreatePlayer'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        return ctx.res.render("create_player", {
            role: ctx.req.session.role
        })
    }
}
module.exports = { ViewCreatePlayerAction }