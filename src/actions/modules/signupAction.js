class SignupUserAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'auth:signup'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        return ctx.res.render("signup");
    }
}
module.exports = { SignupUserAction }