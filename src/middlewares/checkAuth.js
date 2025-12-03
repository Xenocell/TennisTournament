const roles = require('../guard/roles')
var url = require('url');


class CheckAuth{
    async init () {
        console.log(`${this.constructor.name} initialized...`)
    }
  
    handler (user_service) {
        return async (req, res, next) => {
            const role = req.session.role;
            if (!role){
                req.session.role = roles.anonymous;
            }
            
            //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            console.log(req.originalUrl)

            next()
        }
    }
}

module.exports = { CheckAuth }