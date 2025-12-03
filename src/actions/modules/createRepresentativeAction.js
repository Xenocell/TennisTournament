const { body, validationResult } = require('express-validator');
const roles = require('../../guard/roles');
const fs = require("fs")

class CreateRepresentativeAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:createRepresentative'
    }
    validationRules(){
        return [
            body('fio').not().isEmpty().withMessage('Не заполнено ФИО!'),
            body('phone').not().isEmpty().withMessage('Не заполнен контактный телефон!'),
            body('email').not().isEmpty().withMessage('Не заполнена электронная почта!'),
            body('gender').not().isEmpty().withMessage('Не выбран пол!'),
            body('date_birth').not().isEmpty().withMessage('Не выбрана дата рождения!'),
            body('serial_pass').not().isEmpty().withMessage('Не заполнена серия паспорта!'),
            body('number_pass').not().isEmpty().withMessage('Не заполнен номер паспорта!'),
            body('date_give_pass').not().isEmpty().withMessage('Не выбрана дата выдачи паспорта!'),
            body('name_org_give_pass').not().isEmpty().withMessage('Не заполнена организация выдавшая паспорт!'),

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
        const data = {
            passport: {
                series: ctx.req.body.serial_pass,
                number: ctx.req.body.number_pass,
                date_issue: ctx.req.body.date_give_pass,
                organization: ctx.req.body.name_org_give_pass
            },
            representative: {
                account_id: ctx.req.session.account_id,
                first_name: ctx.req.body.fio.split(' ')[1],
                last_name: ctx.req.body.fio.split(' ')[0],
                patronymic: ctx.req.body.fio.split(' ')[2],
                gender: ctx.req.body.gender,
                date_birth: ctx.req.body.date_birth,
                phone_number: ctx.req.body.phone,
                email: ctx.req.body.email
            }
        };
        const result = await ctx.services.representative.createRepresentative(data);
        if (result != null){
            ctx.req.session.representative_id = result;
            return ctx.res.json({"message": "Вы успешно сохранили часть анкеты."});
        }else{
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка при сохранении части анкеты!"
                }]
            });
        }
    }
}
module.exports = { CreateRepresentativeAction }