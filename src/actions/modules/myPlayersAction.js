class MyPlayersAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:myPlayers'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        const result = await ctx.services.player.getPlayersByAccountID(ctx.req.session.account_id);
        if(result.length == 0 )
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Игроков не найдено!"
                }]
            });
        //console.log(result)
        return ctx.res.render("my_players", { 
            role: ctx.req.session.role,
            data: result
        })
    }
}
module.exports = { MyPlayersAction }