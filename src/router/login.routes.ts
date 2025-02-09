import { Router} from 'express'; 
import { checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from "../utils/tokenManager";
import { adminLogin } from '../controller/login.controller';

const router : Router = Router();


router.post ('/adminLogin',
    basicAuthUser,
    checkRequestBodyParams('email'),
    checkRequestBodyParams('password'),
    adminLogin);

export default router;