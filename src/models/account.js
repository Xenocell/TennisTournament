const crypto = require("crypto")

class Account {
    constructor(login, password, type) {
        this.login = login
        this.password = password
        this.type = type
        this.role = null
    }
    //setters
    set_login(login){
        this.login = login;
    }
    set_password(password){
        this.password = password;
    }
    set_role(role){
        this.role = role;
    }
    //getters
    get_login(){
        return this.login;
    }
    get_password(){
        return this.password;
    }
    get_role(){
        return this.role;
    }
    get_type(){
        return this.type;
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

module.exports = { Account }