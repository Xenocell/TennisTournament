class ViewCreateTournamentAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:viewCreateTournament'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        return ctx.res.render("create_tournaments");
    }
}
module.exports = { ViewCreateTournamentAction }