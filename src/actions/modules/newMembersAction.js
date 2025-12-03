const fs = require("fs")

class NewMembersAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:newMembers'
    }
    validationRules(){
        return [];
    }

    async run(ctx){
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
            return ctx.res.render("new_members")
        }else{
            
            const data = await ctx.services.player.getPlayerByPlayerID(ctx.req.query.id);
            if (data == null){
                return ctx.res.redirect("/new_members");
            }
            if(data.player.representative_id != -1){
                const rep = await ctx.services.representative.getRepresentativeByRepresentativeID(data.player.representative_id);
                if (rep != null){
                    data.representative = rep;
                    data.representative.passport.src = getImage('Представитель', data.player.representative_id)
                }
                //console.log(rep)
            }
            data.passport.src = getImage('Игрок', ctx.req.query.id)
            
            console.log(data)
            ctx.res.render("view_player", {data: data})
            //ctx.res.render("view_player")
            
        }
    }
}
module.exports = { NewMembersAction }