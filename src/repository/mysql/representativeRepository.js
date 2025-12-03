require('../../utils/string')

class RepresentativeRepository {
    constructor(db) {
        this.db = db;
    }
    async create_passport_info(data) {
        const str_query = "INSERT INTO passport_info (series, number, date_issue, organization) VALUES ('{0}', '{1}', '{2}', '{3}')".format(
            data.series,
            data.number,
            data.date_issue,
            data.organization
        )
        return await this.db.query_async(str_query);
    }
    async update_passport_info(representative_id, passport_info_id, data) {
        const str_query = "UPDATE passport_info SET series='{0}', number='{1}', date_issue='{2}', organization='{3}' WHERE {4} LIMIT 1".format(
            data.series,
            data.number,
            data.date_issue,
            data.organization,
            (representative_id) ? 
                ('passport_id IN (SELECT passport_info_id FROM representatives WHERE representative_id = '+ representative_id +')') :
                ('passport_id='+passport_info_id)
        )
        return await this.db.query_async(str_query);
    }

    async update_representiative(representative_id, data) {
        const str_query_representative = "UPDATE representatives SET first_name='{0}', last_name='{1}', patronymic='{2}', type='{3}', gender={4}, date_birth='{5}', phone_number='{6}', email='{7}' WHERE representative_id={8}".format(
            data.first_name,
            data.last_name,
            data.patronymic,
            data.type,
            data.gender,
            data.date_birth,
            data.phone_number,
            data.email,
            representative_id
        )
        return await this.db.query_async(str_query_representative);
    }

    async create_representiative(data) {
        const str_query_representative = "INSERT INTO representatives (first_name, last_name, patronymic, type, gender, date_birth, phone_number, email, passport_info_id, create_at, update_at) VALUES ('{0}', '{1}', '{2}', '{3}', {4}, '{5}', '{6}', '{7}', '{8}', NOW(), NOW())".format(
            data.first_name,
            data.last_name,
            data.patronymic,
            data.type,
            data.gender,
            data.date_birth,
            data.phone_number,
            data.email,
            data.passport_info_id
        )
        return await this.db.query_async(str_query_representative);
    }

    async get_representiative(account_id, representative_id) {
        const str_query = "SELECT representative_id, first_name, last_name, patronymic, type, gender, DATE_FORMAT(date_birth,\'%e-%m-%Y\') AS date_birth, phone_number, email, passport_info_id FROM representatives WHERE {0} LIMIT 1".format(
            (account_id != null) ? ('account_id='+account_id) : ('representative_id='+representative_id)
        )
        return await this.db.query_async(str_query);
    }

    async get_passport_info(representative_id, passport_info_id) {
        const str_query = "SELECT series, number, DATE_FORMAT(date_issue,\'%e-%m-%Y\') AS date_issue, organization FROM passport_info WHERE {0} LIMIT 1".format(
            (representative_id) ? 
                ('passport_id IN (SELECT passport_info_id FROM representatives WHERE representative_id = '+ representative_id +')') :
                ('passport_id='+passport_info_id)
        )
        return await this.db.query_async(str_query);
    }

    async update_value_representative(representative_id, key, value) {
        const sqr_query = "UPDATE representatives SET {0}={1} WHERE representative_id={2} LIMIT 1".format(
            key,
            Number.isInteger(value) ? Number(value) : "'"+ value +"'",
            representative_id
        )
        return await this.db.query_async(sqr_query);
    }

    async delete_passport_info(representative_id, passport_info_id) {
        const str_query = "DELETE FROM passport_info WHERE {0} LIMIT 1".format(
            (representative_id) ? 
                ('passport_id IN (SELECT passport_info_id FROM representatives WHERE representative_id = '+ representative_id +')') :
                ('passport_id='+passport_info_id)
        )
        return await this.db.query_async(str_query);
    }

    async delete_representative(representative_id) {
        const str_query = "DELETE FROM representatives WHERE representative_id={0} LIMIT 1".format(
            representative_id
        )
        return await this.db.query_async(str_query);
    }

    async rejection_representative(representative_id, message) {
        const str_query = "INSERT INTO rejection_members (representative_id, message) VALUES ({0}, '{1}')".format(
            representative_id,
            message
        )
        return await this.db.query_async(str_query);
    }

    async get_rejection_representative_message(representative_id){
        const str_query = "SELECT message FROM rejection_members WHERE representative_id = {0} ORDER BY rejection_id DESC LIMIT 1".format(
            representative_id
        )
        return await this.db.query_async(str_query);
    }
}

module.exports = { RepresentativeRepository }