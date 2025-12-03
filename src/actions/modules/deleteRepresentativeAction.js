class DeleteRepresentativeAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:deleteRepresentative'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        const result = await ctx.services.representative.deleteRepresentative(ctx.req.session.representative_id);
        if (result != null){
            ctx.req.session.representative_id = -1
            return ctx.res.json({"message": "Вы успешно удалили анкету!"})
        }else{
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка при удалении анкеты!"
                }]
            });
        }
    }
}
module.exports = { DeleteRepresentativeAction }