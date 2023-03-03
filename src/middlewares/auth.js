const db = require('../config/db')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const authenticateToken = async (req,res,next) => {

    try {
        const token = req.cookies.token

        if(!token){
            return res.redirect('/')
        }
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decodedToken.userId
        
        const query = `SELECT * FROM users WHERE id = '${userId}'`
        await db.query(query, (error, result) => {
            if(result[0]){
                req.user = result[0]
                next()
            }
            else {
                res.status(401).json({
                    "message error:" : error
                })
            }
        })

    } catch (error) {
        res.status(401).json({
            succeeded : false,
            error : "Not authorizate"
        })
    }

    

}

module.exports = {
    authenticateToken
}