import {Router} from 'express';
import { creeateContactUs, getAllContactUs, getSingle } from '../controller/contactUs.controller';
import {  checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';

const router:Router=Router();


router.post('/', // create contact us 
    basicAuthUser,
    checkRequestBodyParams("name"),
    checkRequestBodyParams("email"),
    creeateContactUs
);

router.get('/getallcontact', // get all contact us 
    basicAuthUser,
    checkSession,
    getAllContactUs
);


router.get('/getsinglecontact', // get single contact us 
    basicAuthUser,
    checkSession,
    checkRequestBodyParams("_id"),
    getSingle
);


export default router;