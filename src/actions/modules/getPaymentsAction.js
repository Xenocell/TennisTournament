class GetPaymentsAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:getpayments'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        const payments = await ctx.services.player.getPayments(ctx.req.session.player_id)
        var results = []
        if(payments != null){
            payments.forEach(element => results.push(element.year));
            return ctx.res.json({"message": results});
        }
            
        else
            return ctx.res.json({"message": []});
    }
}
module.exports = { GetPaymentsAction }