class GetDevicesAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:devices'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        const result = await ctx.services[0][3].getAllSessions(ctx.req.session.user_id);
        if(result.length != 0){
            return ctx.res.json({"message": result, "s": ctx.req.session.id});
        }else{
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка при загрузке ваших устройств!"
                }]
            });
        }
    }
}
module.exports = { GetDevicesAction }