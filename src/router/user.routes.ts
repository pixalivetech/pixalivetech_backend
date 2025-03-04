import {Router} from 'express';
import {  createUser, deleteUser, listSingleUser, updateUser } from '../controller/task.controller';
import {  checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';

const router:Router=Router();


router.post('/', // create user 
    basicAuthUser,
    checkRequestBodyParams("email"),
    checkRequestBodyParams("password"),
    createUser
);

router.get('/singleuser', // get single user
    basicAuthUser,
    checkSession,
    checkRequestBodyParams("_id"),
    listSingleUser
);

router.put('/updateuser', //update user
    basicAuthUser,
    checkSession,
    checkRequestBodyParams("_id"),
    updateUser
)

router.delete('/deleteuser', // delete user
    basicAuthUser,
    checkSession,
    checkRequestBodyParams("_id"),
    deleteUser
);

export default router;