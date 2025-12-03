const { body, validationResult } = require('express-validator');
//const parser = require('ua-parser-js');

const { Account } = require('../../models/account');
const roles = require('../../guard/roles');

class AuthUserAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:auth'
    }
    validationRules(){
        return [
            body('login').not().isEmpty().withMessage('Не заполнен логин!'),
            body('password').not().isEmpty().withMessage('Не заполнен пароль!'),
        
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
            ctx.req.body.password
        )
        
        const data = await ctx.services.account.loadAccount(account);
        if(data != null){
            if(await account.verify(data.password)){

                ctx.req.session.account_id = data.account_id;
                ctx.req.session.type = Boolean(data.type);

                let count = 1;
                let role = '';
                for (const [key, value] of Object.entries(roles)) {
                    if (count == data.role_id){
                        role = value;
                        break;
                    }
                    count++;
                }

                if (role == roles.player){
                    const data_player = await ctx.services.player.getPlayerByAccountID(ctx.req.session.account_id);
                    if(data_player == null){
                        ctx.req.session.player_id = -1;
                        ctx.req.session.representative_id = -1;
                        ctx.req.session.role = roles.player_ghost
                    }else{
                        ctx.req.session.player_id = data_player.player.player_id
                        ctx.req.session.representative_id = data_player.player.representative_id
                        ctx.req.session.role = roles.player_ghost
                    }

                }else{
                    ctx.req.session.role = role
                }
                

                return ctx.res.json({"message": "Вы успешно авторизировались!"})

            }else{
                return ctx.res.status(400).json({ errors: 
                    [{
                        msg: "Неверный логин или пароль!"
                    }]
                });
            }
        }else{
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Неверный логин или пароль!"
                }]
            });
        }
    }
}
module.exports = { AuthUserAction }