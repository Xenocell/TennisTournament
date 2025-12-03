const { body, validationResult } = require('express-validator');

class EditMailAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:editMail'
    }
    validationRules(){
        return [
            body('email').isEmail().normalizeEmail().withMessage('Электронная почта некорректна!'),
            body('new_email').isEmail().normalizeEmail().withMessage('Электронная почта некорректна!'),
            (req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() });
                }
                else next();
            }
        ];
    }
    async run(ctx){
        const result_ = await ctx.services[0][2].checkUserEmail(ctx.req.body.new_email);
        if(Number(result_[0].result) == 1){
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Данная электронная почта уже занята!"
                }]
            }); 
        }
        const [uid, result] = await ctx.services[0][2].newRequestToChangeEmail(ctx.req.session.user_id, ctx.req.body.new_email);
        if(result.length != 0){
            const res = await ctx.services[0][1].confirmUpdateEmailAlert(ctx.req.body.email, ctx.req.body.new_email, "http://localhost:8080/confirm_update_mail/" + uid);
            console.log(res.response)
            return ctx.res.json({"message": "Вам на почту отправлено подтверждение на смену электронной почты!"})
        }
        else
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка при создании запроса на смену электронной почты!"
                }]
            });	
    }
}
module.exports = { EditMailAction }