import {Router} from 'express';
import { createAdminPAnel } from '../controller/adminPanel.controller';
import {  checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';

const router:Router=Router();


router.post('/', // create admin panel
    basicAuthUser,
    checkRequestBodyParams("email"),
    checkRequestBodyParams("password"),
    createAdminPAnel
);

export default router;