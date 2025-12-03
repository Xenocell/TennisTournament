class PlayerTournamentsAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:playerTournaments'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        if (ctx.req.method == "POST"){
            if(ctx.req.body.action == "load"){
                const player = await ctx.services.player.getMinPlayer(ctx.req.session.player_id);
                const data = await ctx.services.tournament.getTournaments(ctx.req.session.player_id);
                if(data.length == 0)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, попробуйте позже!"
                        }]
                    });
                return ctx.res.json({"message": {tournaments: data, player: player}});     
            }else if(ctx.req.body.action == "reg"){
                const data = await ctx.services.tournament.registerPlayerInTournament(ctx.req.body.t_id, ctx.req.session.player_id);
                if(data.length == 0)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, попробуйте позже!"
                        }]
                    });
                return ctx.res.json({"message": "Вы успешно заявились на турнир."});     
            }else if(ctx.req.body.action == "unreg"){
                const data = await ctx.services.tournament.unregisterPlayerInTournament(ctx.req.body.t_id, ctx.req.session.player_id);
                if(data.length == 0)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, попробуйте позже!"
                        }]
                    });
                return ctx.res.json({"message": "Вы успешно снялись с турнира."});     
            }else if(ctx.req.body.action == "regspare"){

                const result_update_status = await ctx.services.tournament.updateStatusEntriesInTournament(ctx.req.body.t_id, ctx.req.session.player_id, 3)
                if(result_update_status == null)
                  return ctx.res.status(400).json({ errors: 
                    [{
                        msg: "Возникла ошибка, попробуйте позже!"
                    }]
                  });
                return ctx.res.json({"message": "Вы успешно стали запасным."});  

            }else{
                return ctx.res.end()
            }
            /*if (
                ((ctx.req.body.action != '+') && (ctx.req.body.action != '-') && (ctx.req.body.action != 'reg')) ||
                ((ctx.req.body.type != 'normal')) ||
                !Number.isInteger(Number(ctx.req.body.id))
            )
                return ctx.res.status(400).json({ errors: 
                    [{
                        msg: "Возникла ошибка, попробуйте позже!"
                    }]
                });
            if(ctx.req.body.action == '+'){
                const result_count_entries = await ctx.services.tournament.getСountEntriesInTournament(ctx.req.body.id, ctx.req.session.player_id);
                if(result_count_entries == null)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, попробуйте позже!"
                        }]
                    });
                if(result_count_entries >= 2)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Вы больше не можете заявляться на турнир!"
                        }]
                    });
                const result = await ctx.services.tournament.registerPlayerInTournament(ctx.req.body.id, ctx.req.session.player_id);
                if(result.length == 0)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, попробуйте позже!"
                        }]
                    });
                return ctx.res.json({"message": "Вы успешно заявились на турнир."});  
            }  
            else if(ctx.req.body.action == '-'){
                const result = await ctx.services.tournament.unregisterPlayerInTournament(ctx.req.body.id, ctx.req.session.player_id);
                if(result == null)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, попробуйте позже!"
                        }]
                    });
                return ctx.res.json(
                {
                    "message": "Вы успешно снялись с турнира.",
                    "data": null//result
                });  
            }
            else if(ctx.req.body.action == 'reg'){
                const result = await ctx.services.tournament.updateStatusEntriesInTournament(ctx.req.body.id, ctx.req.session.player_id, 3)
                if(result == null)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, попробуйте позже!"
                        }]
                    });
                return ctx.res.json(
                {
                    "message": "Вы успешно стали запасным.",
                    "data": null
                });
            }*/
        }

        return ctx.res.render("player_tournaments", { role: ctx.req.session.role })
    }
}
module.exports = { PlayerTournamentsAction }