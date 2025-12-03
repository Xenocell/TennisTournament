class DeletePlayerAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:deletePlayer'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        if(ctx.req.session.representative_id != -1 ){
            const result = await ctx.services.representative.deleteRepresentative(ctx.req.session.representative_id);
            if (result != null){
                ctx.req.session.representative_id = -1
            }else{
                return ctx.res.status(400).json({ errors: 
                    [{
                        msg: "Возникла ошибка при удалении анкеты!"
                    }]
                });
            }
        }
        const result = await ctx.services.player.deletePlayer(ctx.req.session.player_id);
        if (result != null){
            ctx.req.session.player_id = -1
            return ctx.res.json({"message": "Вы успешно удалили анкету!"})
        }else{
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка при удалении анкеты!"
                }]
            });
        }
    }
}
module.exports = { DeletePlayerAction }