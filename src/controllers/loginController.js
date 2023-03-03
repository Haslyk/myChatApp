const db = require('../config/db')
const jwt = require('jsonwebtoken')


const login = async (req,res) => {
    try {
        const info = req.body
        console.log(info)
        const checkQuery = `select * from users where username = '${info.username}' && password ='${info.password}'`
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

        const info = req.body
        const checkQuery = `select * from users where mail = '${info.mail}'`
        db.query(checkQuery, (error, result) => {
            if(result[0])
            {
                res.redirect('/')
            }
            else
            {
                const insertQuery = `INSERT INTO users(fullName,username, password, mail) values('${info.fullName}','${info.username}', '${info.password}', '${info.mail}')`;
                db.query(insertQuery)
                
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