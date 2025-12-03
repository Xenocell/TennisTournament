require('../../utils/string')

class SessionRepository {
    constructor(db) {
        this.db = db;
    }
    async new(data) {
        const str_query = "INSERT INTO active_sessions (session_id, user_id, os, os_version, browser_name, browser_version, device, date) VALUES ('{0}', {1}, '{2}', '{3}', '{4}', '{5}', '{6}', '{7}',NOW())".format(
            data.session_id, 
            data.user_id, 
            data.os, 
            data.os_version,
            data.browser_name,
            data.browser_version,
            data.device
        )
        return await this.db.query_async(str_query);
    }
    async destroy(session_id){
        const str_query = "DELETE FROM active_sessions WHERE session_id = '{0}'".format(
            session_id
        )
        return await this.db.query_async(str_query);
    }
    async get(session_id){
        const str_query = "UPDATE users SET email = '{0}' WHERE id_user = {1}".format(
            session_id
        )
        return await this.db.query_async(str_query);
    }
    async getAll(user_id){
        const str_query = "SELECT `active_sessions`.`session_id`, `active_sessions`.`os`, `active_sessions`.`device`, DATE_FORMAT(`active_sessions`.`date`,\'%Y-%m-%dT%H:%i:%s\') AS date\
        FROM `sessions`, `active_sessions`\
        WHERE `active_sessions`.`session_id`=`sessions`.`session_id` AND `active_sessions`.`user_id` = {0} AND `sessions`.`expires` > UNIX_TIMESTAMP();".format(
            user_id
        )
        return await this.db.query_async(str_query);
    }
}

module.exports = { SessionRepository }