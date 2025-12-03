class SecurityAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:security'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        return ctx.res.render("security");
    }
}
module.exports = { SecurityAction }