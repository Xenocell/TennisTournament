require('../../utils/string')
const fs = require("fs")

class ViewInfoTournament{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:viewInfoTournament'
    }
    validationRules(){
        return [];
    }
    async run(ctx){

        if (
            Object.keys(ctx.req.query).length === 0 || 
            !Number.isInteger(Number(ctx.req.query.id)) //||
            //(ctx.req.query.type != 'Игрок' && ctx.req.query.type != 'Представитель')
        ){
            return ctx.res.render("error")
        }

        const data = await ctx.services.tournament.getTournament(ctx.req.query.id);

        if(!data || data.length == 0)
            return ctx.res.render("error")

        //console.log(data)
        if(ctx.req.query.active == 'administrations' ){
            return ctx.res.render("info_tournament_administrations", {data: data[0]})
        }
        else if(ctx.req.query.active == 'additional_information'){
            if (fs.existsSync('./src/public/pdf/additional_information/addinfo_tour_' + ctx.req.query.id + '.pdf')) {
                return ctx.res.redirect('https://docs.google.com/viewer?url=https://lk.mta-donskoy.ru/pdf/additional_information/addinfo_tour_44.pdf&embedded=true')
            }else{
                return ctx.res.send('Дополнительная информация еще не загружена.')
            }

        }
        else if(ctx.req.query.active == 'lists' ){
            //await ctx.services.tournament.updateTournamentEntries(ctx.req.query.id)
            //const data = await ctx.services.tournament.getTournament(ctx.req.query.id);
            //const end_date_reg = data[0].end_date_reg
            //const date_update = new Date(''+ end_date_reg.split('.')[2] +'-' + end_date_reg.split('.')[1] + '-'+ end_date_reg.split('.')[0] + 'T17:00:00')
            //console.log(new Date() )
            //console.log( end_date_reg )
            /*if (new Date() > date_update){
                //console.log('!')
                const g_s = async () =>{
                    const data_players = await ctx.services.tournament.getTournamentPlayers(ctx.req.query.id);
                    data_players.forEach(element => {
                        if(Number(element.status) != 1)
                            return true;
                    })
                    return false;
                }
                if(await g_s() == false){
                    await ctx.services.tournament.updateTournamentEntries(ctx.req.query.id)
                }
            }*/

            const data_players = await ctx.services.tournament.getTournamentPlayers(ctx.req.query.id);
            let main_players = []
            let waiting_players = []
            let replacement_players = []
            if (data_players != null)
                data_players.forEach(element => {
                    if(Number(element.status) == 1)
                        main_players.push(element)
                    else if(Number(element.status) == 2)
                        waiting_players.push(element)
                    else if(Number(element.status) == 3)
                        replacement_players.push(element)
                });
            //console.log(waiting_players)
           // console.log(data_players)
            return ctx.res.render("info_tournament_lists", {data: data[0], main_players: main_players, waiting_players: waiting_players, replacement_players: replacement_players})
        }
        else if(ctx.req.query.active == 'results'){
			const status_tournament = await ctx.services.tournament.getTournamentStatus(ctx.req.query.id)
            const data = await ctx.services.tournament.getSubTournaments(ctx.req.query.id)
			const draw_players = await ctx.services.tournament.getDrawTournament(ctx.req.query.id);
                //return ctx.res.render('referee_drawing_tournament', {data: data_players, type: status_tournament.type})
			if(Number(status_tournament.type) == 1){
                const data_players = await ctx.services.tournament.getTournamentPlayers(ctx.req.query.id);
                let replacement_players = [] 
                let substitute_players = []
                if (data_players != null)
                    data_players.forEach(element => {
                        if(Number(element.status) == 3)
                        replacement_players.push(element)
                        if(Number(element.status) == 3 || Number(element.status) == 4)
                        substitute_players.push(element)

                    });
				return ctx.res.render('info_tournament_results', {data: data, replacement_players: replacement_players, substitute_players: substitute_players, status_tournament: status_tournament, draw_players: draw_players})
            }else{
                console.log(data[0])
				return ctx.res.render('info_tournament_results', {data: data, status_tournament: status_tournament, draw_players: draw_players})
            }
        }else if(ctx.req.query.active == 'schedule'){
            const data = await ctx.services.tournament.getScheduleTournament(ctx.req.query.id)
            return ctx.res.render('info_tournament_schedure', {data: data})
        }
        return ctx.res.render("info_tournament", {data: data[0]})
    }
}
module.exports = { ViewInfoTournament }