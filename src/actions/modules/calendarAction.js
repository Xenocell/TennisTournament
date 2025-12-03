require('../../utils/string')

const get_week = (d, m, y) => {
  var iter = 1;
  for (var day = new Date(Number(y), 0, 1); day <= new Date(Number(y)+1, 11, 31); day.setDate(day.getDate() + 1)) {
   if(day.getTime() === new Date(y, m-1, d).getTime()){
    return iter;
   }
   if(day.getDay() == 0){
    iter++;
   }
  }
  return -1;
}

class CalendarAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:calendar'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        //console.log(ctx.req.query)
        //?date=2021.11-2021.12
        //getCalendarTournament
        const formatted_data = {
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
            "7": [],
            "8": [],
            "9": [],
            "10": [],
            "11": [],
            "12": []
        }
        if (Object.keys(ctx.req.query).length === 0){
            const curr_date = new Date()
            const filter = {
                date: {
                    start: curr_date.getFullYear() + "-" + "01" + "-" + "01",
                    end: curr_date.getFullYear() + "-" + "12" + "-" + "01"
                }
            }
            const data = await ctx.services.tournament.getCalendarTournament(filter);
            if (data != null){
                data.forEach(t =>{
                    const c_m = ((t.start_date).split('.'))[1]
                    t.weekly = getWeeklyForDate2(t.start_date)
                    formatted_data[(c_m[0] == '0' ? c_m[1] : c_m)].push(t)
                })
            }
        }else{
            const r_d = /^\s*(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*-(1[012]|0?[1-9])\.((?:19|20)\d{2})$/
            if(r_d.test(ctx.req.query.date)){
                const date_split = (ctx.req.query.date).split('-')
                const d_s = date_split[0]
                const d_e = date_split[1]
                const d_s_s = d_s.split('.')
                const d_e_s = d_e.split('.')
                const filter = {
                    date: {
                        start: d_s_s[1] + "-" + d_s_s[0] + "-" + "01",
                        end: d_e_s[1] + "-" + d_e_s[0] + "-" + "01"
                    }
                }
                const data = await ctx.services.tournament.getCalendarTournament(filter);
                if (data != null){
                    data.forEach(t =>{
                        const c_m = ((t.start_date).split('.'))[1]
                        t.weekly = getWeeklyForDate2(t.start_date)
                        formatted_data[(c_m[0] == '0' ? c_m[1] : c_m)].push(t)
                    })
                }
                //console.log(formatted_data)
                //return ctx.res.end()
            }else{
                return ctx.res.redirect("/calendar");
            }
            //?date=2021.11-2021.12

        }
        /*const data = await ctx.services.tournament.getTournaments(null);
        if(data.length == 0)
            return ctx.res.render("error")
   
        data.forEach(element => {
            element.weekly = getWeeklyForDate(element.start_date)
        });*/
        //return ctx.res.end()
        return ctx.res.render("calendar", {data: formatted_data, role: ctx.req.session.role})
    }
}
module.exports = { CalendarAction }