class RefereePlayersAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:refereePlayers'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        return ctx.res.render("referee_players");
    }
}
module.exports = { RefereePlayersAction }