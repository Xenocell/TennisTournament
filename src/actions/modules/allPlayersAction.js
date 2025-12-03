const fs = require('fs');
const { Account } = require('../../models/account');

class AllPlayersAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:allPlayers'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        if (ctx.req.method == "POST"){
            if(ctx.req.body.action == 'ban'){
                const result_ban = await ctx.services.player.banPlayer(ctx.req.body.player_id, ctx.req.body.date)
                if(result_ban == null)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Произошла ошибка, попробуйте позже!"
                        }]
                    });
                return ctx.res.json({"message": "Вы успешно дисквалифицировали игрока."});
            }else if(ctx.req.body.action == 'unban'){
                const result_ban = await ctx.services.player.unBanPlayer(ctx.req.body.player_id)
                if(result_ban == null)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Произошла ошибка, попробуйте позже!"
                        }]
                    });
                return ctx.res.json({"message": "Вы успешно зачислили игрока."});
            }else if(ctx.req.body.action == 'change-login'){
                const account = new Account(
                    ctx.req.body.login,
                    null
                )
                let result = await ctx.services.account.checkLogin(account);
                if(Number(result[0].result) == 1){
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Данный логин уже занят!"
                        }]
                    }); 
                }
                result = await ctx.services.account.changeLoginAccount(ctx.req.body.player_id, ctx.req.body.login);
                if(result == null)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка при изменении логина!"
                        }]
                    });
                
                //console.log(ctx.req.body)
                return ctx.res.json({"message": "Вы успешно изменили логин."});
            }else if(ctx.req.body.action == 'change-password'){
                const account = new Account(
                    null,
                    ctx.req.body.password
                )
                let result = await account.hashPass();
                if (!result)
                    return ctx.res.status(400).json({ errors: [{
                            msg: "Возникла ошибка при хешировании пароля!"
                        }]
                    }); 
                
                result = await ctx.services.account.changePasswordAccount(ctx.req.body.player_id, account.get_password());
                if(result == null)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка при изменении пароля!"
                        }]
                    });

                return ctx.res.json({"message": "Вы успешно изменили пароль."});
            }else if(ctx.req.body.action == 'delete'){
                
                await ctx.services.account.deleteAccountByPlayer(ctx.req.body.player_id);
                await ctx.services.tournament.deleteAllByPlayerID(ctx.req.body.player_id);
                await ctx.services.player.deleteAllByPlayerID(ctx.req.body.player_id);

                return ctx.res.json({"message": "Вы успешно удалили игрока."});
            }else{
                return ctx.req.end()
            }
        }


        const getImage = (type, id) =>{
            const folder = (type == 'Игрок' ? 'players' : 'representatives')

            const path = './src/public/images/uploads/'+ folder +'/passport-' + id
            const l = ['.png', '.jpg', '.gif', '.jpeg']

            for (let i = 0; i < l.length; i++) {
                if (fs.existsSync(path+l[i])) {
                    return '/images/uploads/'+ folder +'/passport-'+ id+l[i]
                }
            }
            
        }

        if (
            Object.keys(ctx.req.query).length === 0 || 
            !Number.isInteger(Number(ctx.req.query.id))
        ){
            const data = await ctx.services.player.getAllPlayers();
            if(data == null)
                return ctx.res.redirect("/rPlayers")

            return ctx.res.render("referee_all_players", { 
                data: data
            })
        }else{
            
            /*const data = await ctx.services.player.getPlayerByPlayerID(ctx.req.query.id);
            if (data == null){
                return ctx.res.redirect("/allPlayers");
            }
            if(data.player.representative_id != -1){
                const rep = await ctx.services.representative.getRepresentativeByRepresentativeID(data.player.representative_id);
                if (rep != null){
                    data.representative = rep;
                    data.representative.passport.src = getImage('Представитель', data.player.representative_id)
                }
            }
            data.passport.src = getImage('Игрок', ctx.req.query.id)
            ctx.res.render("view_player", {data: data})
            */
            if(ctx.req.query.action == 'view'){
                const data = await ctx.services.player.getPlayerByPlayerID(ctx.req.query.id);
                if (data == null){
                    return ctx.res.redirect("/allPlayers");
                }
                if(data.player.representative_id != -1){
                    const rep = await ctx.services.representative.getRepresentativeByRepresentativeID(data.player.representative_id);
                    if (rep != null){
                        data.representative = rep;
                        data.representative.passport.src = getImage('Представитель', data.player.representative_id)
                    }
                }
                data.passport.src = getImage('Игрок', ctx.req.query.id)
                return ctx.res.render("view_player", {data: data})
            }else if(ctx.req.query.action == 'edit'){
                const data = await ctx.services.player.getPlayerByPlayerID(ctx.req.query.id);
                if (data != null){
                    const data_representative = await ctx.services.representative.getRepresentativeByRepresentativeID(data.player.representative_id);
                    if (data_representative != null){
                        data.representative = data_representative
                    }
                }
                return ctx.res.render("referee_edit_player", {data: data})
            }
            else{
                return ctx.res.end()
            }
            
        }
    }
}
module.exports = { AllPlayersAction }