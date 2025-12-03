const { body, validationResult } = require('express-validator');
const roles = require('../../guard/roles');
const fs = require("fs")

class CreatePlayerAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:createPlayer'
    }
    validationRules(){
        return [
            body('fio').not().isEmpty().withMessage('Не заполнено ФИО игрока!'),
            body('phone').not().isEmpty().withMessage('Не заполнен контактный телефон игрока!'),
            body('email').not().isEmpty().withMessage('Не заполнена электронная почта игрока!'),
            body('gender').not().isEmpty().withMessage('Не выбран пол игрока!'),
            body('date_birth').not().isEmpty().withMessage('Не выбрана дата рождения игрока!'),
            body('citizenship').not().isEmpty().withMessage('Не заполнено гражданство игрока!'),
            body('city').not().isEmpty().withMessage('Не заполнено гражданство игрока!'),
            body('serial_pass').not().isEmpty().withMessage('Не заполнена серия паспорта игрока!'),
            body('number_pass').not().isEmpty().withMessage('Не заполнен номер паспорта игрока!'),
            body('date_give_pass').not().isEmpty().withMessage('Не выбрана дата выдачи паспорта игрока!'),
            body('name_org_give_pass').not().isEmpty().withMessage('Не заполнена организация выдавшая паспорт игрока!'),

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
        const data_player = {
            passport: {
                series: ctx.req.body.serial_pass,
                number: ctx.req.body.number_pass,
                date_issue: ctx.req.body.date_give_pass,
                organization: ctx.req.body.name_org_give_pass
            },
            player: {
                account_id: ctx.req.session.account_id,
                first_name: ctx.req.body.fio.split(' ')[1],
                last_name: ctx.req.body.fio.split(' ')[0],
                patronymic: ( ctx.req.body.fio.split(' ')[2] == undefined ? ' ' : ctx.req.body.fio.split(' ')[2]),
                gender: ctx.req.body.gender,
                date_birth: ctx.req.body.date_birth,
                citizenship: ctx.req.body.citizenship,
                city: ctx.req.body.city,
                phone_number: ctx.req.body.phone,
                email: ctx.req.body.email,
                representative_id: -1
            },
        };
        const result_first_check = await ctx.services.player.first_check(data_player);
        if (result_first_check == true)
        return ctx.res.status(400).json({ errors: 
            [{
                msg: "Игрок с таким именем, фамилией и отчеством уже создан, свяжитесь по телефону 8 (926) 430-69-68 для решения данной проблемы!"
            }]
        });
        const result_create_player = await ctx.services.player.createPlayer(data_player);
        if (result_create_player != null){
            ctx.req.session.player_id = result_create_player;
            ctx.req.session.representative_id = -1;
            return ctx.res.json(
                {
                    "message": "Вы успешно сохранили анкету."
                }
            );
        }else{
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка при сохранение анкеты!"
                }]
            });
        }
    }
}
module.exports = { CreatePlayerAction }