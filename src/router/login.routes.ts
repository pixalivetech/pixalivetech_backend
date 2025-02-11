import {Router} from 'express';
import {  panelLogin } from '../controller/login.controller';
import {  checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';

const router:Router=Router();


router.post('/loginPanel', // login admin panel
    basicAuthUser,
    checkSession,
    checkRequestBodyParams("email"),
    checkRequestBodyParams("password"),
    panelLogin
);

export default router;