const db = require('../config/db')

const userGetAll = async (req,res) => {
    try {
        if(req.user) {

            const user = req.user
            const getAllQuery = `SELECT * from users where id != ${user.id}`

            db.query(getAllQuery, (error, result) => {
                if(result){
                    res.render('homepage', {allUser : result, mainUser: user})
                }
                else {
                    console.log("Tüm kullanıcılar alınamadı")
                }
            })
        } else {
            console.log("Olmadı!")
            res.redirect('/')
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    userGetAll
}