import {Router} from 'express';
import { createDummyUser, getAllDummyUsers, dummyUsersCount} from '../controller/dummyUser.controller';
import { checkParam, checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';

const router:Router=Router();

router.post('/',    //to create dummy user
    basicAuthUser,
    checkSession,
    createDummyUser,
);

router.get('/',     //to get all dummy users
    basicAuthUser,
    checkSession,
    getAllDummyUsers
);

router.get('/dummyuserscount',      //to get dummy users count
    basicAuthUser,
    checkSession,
    dummyUsersCount
);

export default router;