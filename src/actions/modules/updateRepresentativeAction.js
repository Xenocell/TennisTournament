const { body, validationResult } = require('express-validator');

class UpdateRepresentativeAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:updateRepresentative'
    }
    validationRules(){
        return [
            body('id').not().isEmpty().withMessage('empty id!'),
            body('action').not().isEmpty().withMessage('empty action!'),
            body('value').not().isEmpty().withMessage('empty value!'),
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
        const representative_id = (ctx.req.body.id == -1) ? ctx.req.session.representative_id : ctx.req.body.id
        const value = ctx.req.body.value

        switch (ctx.req.body.action) {
            case 'all':{
                const data = {
                    passport: {
                        series: value.serial_pass,
                        number: value.number_pass,
                        date_issue: value.date_give_pass,
                        organization: value.name_org_give_pass
                    },
                    representative: {
                        first_name:value.fio.split(' ')[1],
                        last_name: value.fio.split(' ')[0],
                        patronymic: value.fio.split(' ')[2],
                        gender: value.gender,
                        date_birth: value.date_birth,
                        phone_number: value.phone,
                        email: value.email,
                        status: value.status
                    }
                };
                const result = await ctx.services.representative.updateRepresentative(representative_id, data);
                if(!result)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Произошла ошибка, попробуйте еще раз!"
                        }]
                    });
                
                return ctx.res.json({"message": "Вы успешно отправили анкету."})    
                break;
            }

            case 'update_status':{
                if(Number(value) == 2){
                    if(ctx.req.body.message.length == 0)
                        return ctx.res.status(400).json({ errors: 
                            [{
                                msg: "Нету причины отказа!"
                            }]
                        });
                    const res = await ctx.services.representative.rejectionRepresentative(representative_id, ctx.req.body.message);
                    if(res.length == 0)
                        return ctx.res.status(400).json({ errors: 
                            [{
                                msg: "Произошла ошибка, попробуйте еще раз!"
                            }]
                        });
                }

                const res = await ctx.services.representative.updateValueRepresentative(representative_id, 'status', value);
                if (!res){
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Произошла ошибка, попробуйте еще раз!"
                        }]
                    });
                }else{
                    return ctx.res.json({"message": "Вы успешно подтвердили/отказали анкету."})
                }
                break;
            }
            default:
              break;
          }
    }
}
module.exports = { UpdateRepresentativeAction }