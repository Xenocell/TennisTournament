class PaymentsAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:payments'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        const data = await ctx.services.player.getPayments(ctx.req.session.player_id)

        return ctx.res.render("payments", {data: data, role: ctx.req.session.role})
    }
}
module.exports = { PaymentsAction }