require('../../utils/string')

class ClassificationAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:classification'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        const result_get_transition = await ctx.services.transition.getTransition()
        //console.log(result_get_transition)
        //DETAILS START
        if(ctx.req.query.details != '' && Number.isInteger( Number(ctx.req.query.details) )){
            //console.log(ctx.req.query.details)
            const getCurrDdate = () => {
                const curr_date = new Date()
                return curr_date.getDate()+'.'+(curr_date.getMonth()+1) + '.'+curr_date.getFullYear()
            }
            const result_credit_tournaments = await ctx.services.tournament.getCreditTournamentsForPlayer( lniToId(ctx.req.query.details), result_get_transition.start_week, result_get_transition.end_week)
            const result_get_classification = await ctx.services.player.getClassificationByPlayer(lniToId(ctx.req.query.details))
            

            let tournamnets = {
                credit: [],
                uncredit: []
            }
            if (result_credit_tournaments != null){
                for(let i=0; i < result_credit_tournaments.length; i++){
                    const d_s = result_credit_tournaments[i].start_date.split('.')
                    result_credit_tournaments[i].formated_start_date = new Date(''+ d_s[2] +'-'+ d_s[1] +'-'+ d_s[0] +'')
                }
            }

            if (result_credit_tournaments != null)
                for(let i=0; i < result_credit_tournaments.length; i++){
                    if (i < 2){
                        tournamnets.credit.push(result_credit_tournaments[i])
                    }else{
                        tournamnets.uncredit.push(result_credit_tournaments[i])
                    }
                }
            else
                tournamnets = null
            if (tournamnets != null && Number(tournamnets.credit.length) != 0){
                tournamnets.credit.sort(function(a, b){
                    return a.formated_start_date - b.formated_start_date ;
                });
            }
           

            return ctx.res.render("classification_details", {
                current_date: getCurrDdate(),
                data: tournamnets,
                player: result_get_classification[0]
            })
        }//DETAILS END

        const g = ctx.req.query.gender != null ? "&gender="+ctx.req.query.gender : ""
        //MAIN START
        if(ctx.req.query.page == '' || !Number.isInteger( Number(ctx.req.query.page) ) || Number(ctx.req.query.page) == 0)
            return ctx.res.redirect('/rating?page=1' + g)
       
        const count_players = await ctx.services.player.getCountPlayers(ctx.req.query.gender)
        const last_page = Math.ceil((count_players/25))

        if(Number(ctx.req.query.page) > last_page && last_page != 0)
            return ctx.res.redirect('/rating?page=' + last_page + g)

        const players = await ctx.services.player.getClassification(ctx.req.query.page, result_get_transition.start_week, result_get_transition.end_week, ctx.req.query.gender)
        /*players.forEach(async (p) =>{
            
            const payments = await ctx.services.player.getPayments(lniToId(p.rni))
            //console.log(payments)
            p.payments = payments
            //console.log(p)
        })*/
        for(let i = 0; i < players.length; i++){
            const payments = await ctx.services.player.getPayments(lniToId(players[i].rni))
            players[i].payments = []
            if(payments != null)
                payments.forEach(p =>{
                    players[i].payments.push(p.year)
                })
        }
        //const payments = await ctx.services.player.getClassification(ctx.req.query.page)
        //console.log('p' ,players)
        const getRangePages = (curr_page) =>{
            let x = 1;
            let buff = []
            if(curr_page <= 3){
                for(let y = 1; y <= 5; y++)
                    buff.push(y)
                return buff;
            } 
            for(let y = Number(Number(curr_page)-2); y <= Number(Number(curr_page)+2); y++){
                buff.push(y);
            }
            //console.log(buff);
            return buff;
            /*while (true){
                let buff = []
                if(curr_page <= 3){
                    for(let y = 1; y <= 5; y++)
                        buff.push(y)
                    return buff;
                } 
                for(let y = curr_page-2; y < curr_page+2; y++){
                    buff.push(y);
                }
                x++;
                console.log(buff);
                console.log(buff.indexOf(curr_page))
                if(buff.indexOf(curr_page) == -1)
                    return buff;

                if(buff.indexOf(curr_page) == 2)
                    return buff;
            }*/
        }
        //console.log('!')
        //console.log(getRangePages(7));
        return ctx.res.render("classification", 
            { 
                data:players, 
                first_page: 1, 
                last_page:  last_page, 
                current_page: ctx.req.query.page, 
                pages: getRangePages(ctx.req.query.page),
                gender: ctx.req.query.gender
            })
    }
}
module.exports = { ClassificationAction }