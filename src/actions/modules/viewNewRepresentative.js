class ViewNewRepresentativeAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:viewNewRepresentative'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        return ctx.res.render("view_representative")
    }
}
module.exports = { ViewNewRepresentativeAction }