const { body, validationResult } = require('express-validator');

class ConfirmEditMailAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:confirmEmail'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        const uid = ctx.req.params.id;
        const result = await ctx.services[0][2].getRequestToChangeEmail(uid)
        if(result.length != 0){
            if(Math.round(new Date().getTime()/1000) > Number(result[0].expires)){
                return ctx.res.render("confirm_email", { 
                    message: "Время на подтверждение электронной почты вышло!"
                });
            }else{
                const result2 = await ctx.services[0][2].setUserEmail(result[0].user_id, result[0].email)
                if (Number(result2.changedRows) != 0)      
                    return ctx.res.render("confirm_email", { 
                        message: "Вы успешно подтвердили смену электронной почты!"
                    });
                else
                    return ctx.res.render("confirm_email", { 
                        message: "Возникла ошибка при подтверждении электронной почты!"
                    });
            }
        }else{
            return ctx.res.render("confirm_email", { 
                message: "Произошла ошибка при загрузке запроса на подтверждение электронной почты, попробуйте позже."
            });
        }
        
    }
}
module.exports = { ConfirmEditMailAction }