const perm = require('./permissions')

module.exports = async (accessTag, user_role) => {
    try {
        if(perm[user_role].indexOf(accessTag) != -1)
            return true
     }
     catch (e) {
        return false
     }
    return false
}