class TournamentsAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:tournaments'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        return ctx.res.render("tournaments")
    }
}
module.exports = { TournamentsAction }