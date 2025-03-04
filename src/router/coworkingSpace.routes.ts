import {Router} from "express";
const router:Router = Router();
import { saveWorkingSpace,getWorkingSpace ,getSingleWorkingSpace,updateWorkingSpace,deleteWorkingSpace} from "../controller/coworkingSpace.controller";
import {basicAuthUser} from "../middleware/checkAuth";
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";
import { checkSession } from "../utils/tokenManager";


router.post('/', 
    basicAuthUser,
    saveWorkingSpace
)

router.get('/',   
    basicAuthUser,
    getWorkingSpace
);

router.get('/getSingleSpace',   
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleWorkingSpace
);

router.put('/',  
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateWorkingSpace
);

router.delete ('/', 
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteWorkingSpace
);

export default router;