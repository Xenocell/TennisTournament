class RefereeAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:referee'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        return ctx.res.redirect("/tournaments");
    }
}
module.exports = { RefereeAction }