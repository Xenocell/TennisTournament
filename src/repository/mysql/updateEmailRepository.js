require('../../utils/string')
const { v4: uuidv4 } = require('uuid');

class UpdateEmailRepository {
    constructor(db) {
        this.db = db;
    }
    async new(id_user, email) {
        const uid = uuidv4();
        const str_query = "INSERT INTO email_update (request_id, user_id, email, expires) VALUES ('{0}', {1}, '{2}', {3})".format(
            uid, 
            id_user, 
            email, 
            Math.round(new Date().getTime()/1000) + 300
        )
        return [uid, await this.db.query_async(str_query)];
    }
    async get(request_id){
        const str_query = "SELECT user_id, email, expires FROM email_update WHERE request_id='{0}'".format(
            request_id
        )
        return await this.db.query_async(str_query);
    }
    async set(id_user, email){
        const str_query = "UPDATE users SET email = '{0}' WHERE id_user = {1}".format(
            email,
            id_user
        )
        return await this.db.query_async(str_query);
    }
    async check(email){
        const str_query = "SELECT COUNT(*) > 0 AS result FROM users WHERE email='{0}'".format(
            email
        )
        return await this.db.query_async(str_query);
    }
}

module.exports = { UpdateEmailRepository }