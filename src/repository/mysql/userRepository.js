require('../../utils/string')

class UserRepository {
    constructor(db) {
        this.db = db;
    }
    async add(user) {
        const str_query = "INSERT INTO users (id_role, fio, phone, gender, date_birth, email, city, password, date_reg) VALUES ({0}, '{1}', '{2}', {3}, '{4}', '{5}', '{6}', '{7}', '{8}')".format(
            user.get_id_role(), 
            user.get_fio(), 
            user.get_phone(), 
            user.get_gender(), 
            user.get_date_birth(), 
            user.get_email(),
            user.get_city(), 
            user.get_password(),
            user.get_date_reg()
        )
        return await this.db.query_async(str_query);
        //return await this.db.query(str_query, callback);
    }
    async check(user){
        const str_query = "SELECT COUNT(*) > 0 AS result FROM users WHERE email='{0}'".format(
            user.get_email()
        )
        return await this.db.query_async(str_query);
    }
    async load(id_user){
        const str_query = "SELECT fio, phone, gender, DATE_FORMAT(date_birth,\'%d-%m-%Y\') AS date_birth, email, city  FROM users WHERE id_user={0}".format(
            id_user
        )
        return await this.db.query_async(str_query);
    }
    async setName(id_user, name){
        const str_query = "UPDATE users SET fio = '{0}' WHERE id_user = {1}".format(
            name,
            id_user
        )
        return await this.db.query_async(str_query);
    }
    async setPhone(id_user, phone){
        const str_query = "UPDATE users SET phone = '{0}' WHERE id_user = {1}".format(
            phone,
            id_user
        )
        return await this.db.query_async(str_query);
    }
    async setCity(id_user, city){
        const str_query = "UPDATE users SET city = '{0}' WHERE id_user = {1}".format(
            city,
            id_user
        )
        return await this.db.query_async(str_query);
    }
    async getAuthInfo(email){
        const str_query = "SELECT id_user, id_role, password FROM users WHERE email='{0}'".format(
            email
        )
        return await this.db.query_async(str_query);
    }
    async getRole(id_user){
        const str_query = "SELECT id_role FROM users WHERE id_user={0}".format(
            id_user
        )
        return await this.db.query_async(str_query);
    }
    async checkPayments(id_user){
        const str_query = "SELECT SUM(sum) AS sum FROM payments WHERE year(date_payment) = YEAR(CURDATE()) AND id_user={0}".format(
            id_user
        )
        return await this.db.query_async(str_query);
    }
    async getPayments(id_user){
        const str_query = "SELECT sum, DATE_FORMAT(date_payment,\'%Y-%m-%dT%H:%i:%s\') AS date_payment FROM payments WHERE id_user={0}".format(
            id_user
        )
        return await this.db.query_async(str_query);
    }

}

module.exports = { UserRepository }