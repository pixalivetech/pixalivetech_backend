import {Router} from 'express';
import {  userLogin, verifyOtp } from '../controller/login.controller';
import {  checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';

const router:Router=Router();


router.post('/loginuser', // login user 
    basicAuthUser,
    checkRequestBodyParams("email"),
    checkRequestBodyParams("password"),
    userLogin
);

router.post('/verifyotp', // verify otp 
    basicAuthUser,
    checkSession,
    checkRequestBodyParams("email"),
    verifyOtp
);

export default router;