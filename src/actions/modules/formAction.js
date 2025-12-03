const roles = require('../../guard/roles');

class FormAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:form'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        const id = ctx.req.params.id;
        if (id != 1){
            return ctx.res.redirect("/form/1");
        }
        if (id == 1){

            ///*if (ctx.req.session.type == false){
            const render_page = (ctx.req.session.type == false) ? ("form_players_and_representives") : ("form_players")
            //console.log(render_page)
            if(ctx.req.session.player_id == -1){
                return ctx.res.render(render_page, {
                    data: null,
                    message: 'Заполните анкету'
                })
            }else{
                const data = await ctx.services.player.getPlayerByPlayerID(ctx.req.session.player_id);
                if (data != null){
                    if(ctx.req.session.representative_id != -1){
                        const data_representative = await ctx.services.representative.getRepresentativeByRepresentativeID(ctx.req.session.representative_id);
                        data.representative = data_representative
                    }

                    if(data.player.status == -1){
                        return ctx.res.render(render_page, {
                            data: data,
                            message: 'Нажмите "Продолжить, чтобы прикрепить фотографию паспорта и отправить анкету на подтверждение.',
                            role: ctx.req.session.role
                        })
                    } else if(data.player.status == 0){
                        if(ctx.req.session.role != roles.player_ghost)
                            ctx.req.session.role = roles.player_ghost
                        return ctx.res.render(render_page, {
                            data: data,
                            message: 'Ожидается оплата.',
                            role: ctx.req.session.role
                        })
                    } else if(data.player.status == 1){
                        if(ctx.req.session.role != roles.player)
                            ctx.req.session.role = roles.player
                        return ctx.res.render(render_page, {
                            data: data,
                            message: 'Оплачено.',
                            role: ctx.req.session.role
                        })
                    } else if(data.player.status == 2){
                        const result = await ctx.services.player.getMessagePlayerRejection(ctx.req.session.player_id);
                        return ctx.res.render(render_page, {
                            data: data,
                            message: (result.length != 0) ? 'Ваша анкета была отклонена по причине: ' + result[0].message : 'Произошла ошибка при загрузке сообщения!',
                            role: ctx.req.session.role
                        })
                    } else if(data.player.status == 3){
                        if(ctx.req.session.role != roles.player)
                            ctx.req.session.role = roles.player
                        const result = await ctx.services.player.getBanPlayer(ctx.req.session.player_id);
                        return ctx.res.render(render_page, {
                            data: data,
                            message: 'Вы дисквалифицированы до ' + result,
                            role: ctx.req.session.role
                        })
                    }
                }
            }
        }else{
            return ctx.res.render("form_representatives_2",{
                role: ctx.req.session.role
            })
        }
            
    }
}
module.exports = { FormAction }