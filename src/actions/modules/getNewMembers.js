class GetNewMembersAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:getNewMembers'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        const res_1 = await ctx.services.player.getNewPlayers();
        if(res_1.length == 0)
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Новых участников нет."
                }]
            });
        
        const data = 
            {
                'Игроки': [...res_1]
            }

        return ctx.res.json({"message": data});
       
    }
}
module.exports = { GetNewMembersAction }