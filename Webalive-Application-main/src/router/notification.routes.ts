import {Router} from 'express';
import { manualNotificationMultiple } from '../controller/notification.controller';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();

router.post('/sendnotification',//get single user
    basicAuthUser,
    //checkSession,
    manualNotificationMultiple);

export default router;