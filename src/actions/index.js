const guard = require('../guard/index')

module.exports = (action, services) => {
    action.init()
    return [action.validationRules(), async (req, res, next) => {
    //return async (req, res, next) => {
        const result = await guard(action.accessTag(), req.session.role)
        if (!result){
            if (req.method == "POST"){
                return res.status(403).json({ errors: [{
                        msg: "Недостаточно прав!"
                    }]
                });
            }
            else if (req.method == "GET") {
                return res.render('403');
            }
        }
        const ctx = {
            req: req,
            res: res,
            services: services
        }
        action.run(ctx)
    }]
}