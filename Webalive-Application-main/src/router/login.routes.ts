import { Router } from 'express';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { advertiserLogin,userLogin,verifyLoginOtp,forgotPassword,resetPassword,sendMailOtp,verifyGmailOtp,masterLogin,verifyMasterLoginOtp,advertiserMobileLogin} from "../controller/login.controller";
import { checkSchema } from 'express-validator';
const router: Router = Router();

router.post('/advertiserLogin', //login advertiser
    basicAuthUser,
    checkRequestBodyParams('email'),
    checkRequestBodyParams('password'),
    advertiserLogin
);

router.post('/',   //for user
    basicAuthUser,
    checkRequestBodyParams('mobileNumber'),
    userLogin);

router.post('/verifyLoginOtp',  //for user
    basicAuthUser,
    checkRequestBodyParams('mobileNumber'),
    checkRequestBodyParams('otp'),
    verifyLoginOtp)

router.put('/forgotPassword',  //for advertiser
    basicAuthUser,
    checkRequestBodyParams('email'),
    checkRequestBodyParams('link'),
    forgotPassword
);

router.put('/updatePassword',  //for advertiser
    basicAuthUser,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('password'),
    resetPassword
);
router.post('/sendMailOtp',  //for advertiser
    basicAuthUser,
    checkRequestBodyParams('email'),
    sendMailOtp
);
router.post('/verifyGmailOtp',  //for advertiser
    basicAuthUser,
    checkRequestBodyParams('otp'), 
    checkRequestBodyParams('fcm_Token'),
    verifyGmailOtp
);

router.post('/masterLogin',  //for Master Login
    basicAuthUser,
    checkRequestBodyParams('email'),
    masterLogin)

router.post('/verifyMasterLoginOtp', //for Master Login Verify
    basicAuthUser,
    checkRequestBodyParams('email'),
    checkRequestBodyParams('otp'),
    verifyMasterLoginOtp)

router.post('/advertiserMobileLogin', //for advertiser login
    basicAuthUser,
    advertiserMobileLogin
    )

export default router;