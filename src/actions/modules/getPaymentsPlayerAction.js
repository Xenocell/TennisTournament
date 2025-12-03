
require('../../utils/string')

class GetPaymentsPlayerAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:getPaymentsPlayer'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        if(Number.isInteger(Number(ctx.req.body.player_id))){
            const payments = await ctx.services.player.getPayments(lniToId(ctx.req.body.player_id))
            if(payments != null)
                return ctx.res.json({"message": payments});
            else
                return ctx.res.json({"message": []});
        }else{
            return ctx.res.end()
        }
    }
}
module.exports = { GetPaymentsPlayerAction }