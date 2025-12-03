const { body, validationResult } = require('express-validator');
const { Account } = require('../../models/account');
const roles = require('../../guard/roles');

class CreateAccountAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:createAccount'
    }
    validationRules(){
        return [
            body('login').not().isEmpty().withMessage('Не заполнен логин!'),
            body('password').not().isEmpty().withMessage('Не заполнен пароль!'),
            body('u_state').not().isEmpty().withMessage('...!'),

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
        const account = new Account(
            ctx.req.body.login,
            ctx.req.body.password,
            Boolean(ctx.req.body.u_state)
        )
        let result = await account.hashPass();
        if (!result)
            return ctx.res.status(400).json({ errors: [{
                    msg: "Возникла ошибка при хешировании пароля!"
                }]
            }); 
        result = await ctx.services.account.checkLogin(account);
        if(Number(result[0].result) == 1){
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Данный логин уже занят!"
                }]
            }); 
        }
        //account.set_role( (Boolean(ctx.req.body.u_state)) ?  2 : 5)

        result = await ctx.services.account.createAccount(account);
        if(result.length != 0){
            ctx.req.session.account_id = result.insertId;
            ctx.req.session.role = roles.player_ghost;
            ctx.req.session.type = (Boolean(ctx.req.body.u_state))
            ctx.req.session.player_id = -1
            ctx.req.session.representative_id = -1

            return ctx.res.json({"message": "Вы успешно зарегистрировались!"});
        }
        else
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка при создании пользователя!"
                }]
            });	
    }
}
module.exports = { CreateAccountAction }