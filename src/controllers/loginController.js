const db = require('../config/db')
const jwt = require('jsonwebtoken')


const login = async (req,res) => {
    try {
        const item = req.body
        console.log(item)
        const checkQuery = `select * from users where username = '${item.username}' && password ='${item.password}'`
        db.query(checkQuery, (error, result) => {
            if(result[0])
            {
                const token = createToken(result[0].id)
                res.cookie('token', token, { maxAge: 3600000, httpOnly: true }) 
                res.redirect('/homepage')
            }
            else
            {
                res.redirect('/')
            }
        })
        
    } catch (error) {
        console.log("Başarısız")
    }
}

const register = async ( req,res) => {
    try {

        const item = req.body
        const checkQuery = `select * from users where mail = '${item.mail}'`
        db.query(checkQuery, (error, result) => {
            if(result[0])
            {
                res.redirect('/')
            }
            else
            {
                const insertUserQuery = `INSERT INTO users(fullName,username, password, mail) values('${item.fullName}','${item.username}', '${item.password}', '${item.mail}')`;
                db.query(insertUserQuery)              
                res.redirect('/')
            }
        })    
        
        
    } catch (error) {
        console.log("Hata mesajı : " + error)
    }
}


const createToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '1d',
    })
}

module.exports = {
    login,
    register
}