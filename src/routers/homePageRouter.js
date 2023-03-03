const router = require('express').Router()
const loginController = require('../controllers/loginController')
const homepageController = require('../controllers/homepageController')
const authMW = require('../middlewares/auth')


router.get('/', (req,res) => {
    res.clearCookie('token')
    res.render('login')
})


router.post('/login', loginController.login)
router.post('/register', loginController.register)

router.get('/homepage', authMW.authenticateToken ,homepageController.userGetAll)

module.exports = router