const crypto = require("crypto")

class User {
    constructor(id, id_role, fio, phone, gender, date_birth, city, email, password, date_reg) {
        this.id = id
        this.id_role = id_role
        this.fio = fio
        this.phone = phone
        this.gender = gender
        this.date_birth = date_birth
        this.city = city
        this.email = email
        this.password = password
        this.date_reg = date_reg
    }
    //setters
    set_id(id){
        this.id = id;
    }
    set_id_role(id_role){
        this.id_role = id_role;
    }
    set_fio(fio){
        this.fio = fio;
    }
    set_phone(phone){
        this.phone = phone;
    }
    set_gender(gender){
        this.gender = gender;
    }
    set_date_birth(date_birth){
        this.date_birth = date_birth;
    }
    set_city(city){
        this.city = city;
    }
    set_email(email){
        this.email = email;
    }
    set_password(password){
        this.password = password;
    }
    set_date_reg(date_reg){
        this.date_reg = date_reg;
    }
    //getters
    get_id(){
        return this.id;
    }
    get_id_role(){
        return this.id_role;
    }
    get_fio(){
        return this.fio;
    }
    get_phone(){
        return this.phone;
    }
    get_gender(){
        return this.gender;
    }
    get_date_birth(){
        return this.date_birth;
    }
    get_city(){
        return this.city;
    }
    get_email(){
        return this.email;
    }
    get_password(){
        return this.password;
    }
    get_date_reg(){
        return this.date_reg;
    }
    clear(){
        this.password = ''
    }
    async hashPass(){
        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(8).toString("hex");
            crypto.scrypt(this.password, salt, 16, (err, derivedKey) => {
                if (err) reject(false);
                this.password = salt + derivedKey.toString('hex');
                resolve(true)
            });
        })
    }
    async verify(hash) {
        return new Promise((resolve, reject) => {
            const [salt, key] = [hash.slice(0, 16), hash.slice(16)]
            crypto.scrypt(this.password, salt, 16, (err, derivedKey) => {
                if (err) reject(err);
                resolve(key == derivedKey.toString('hex'))
            });
        })
    }
}

module.exports = { User }