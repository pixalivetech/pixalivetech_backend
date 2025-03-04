import {Router} from "express";
const router:Router = Router();
import { saveDevelopers,getDevelopers ,getSingleDevelopers,updateDevelopers,deleteDevelopers} from "../controller/hireDevelopers.controller";
import {basicAuthUser} from "../middleware/checkAuth";
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";
import { checkSession } from "../utils/tokenManager";


router.post('/', 
    basicAuthUser,
    saveDevelopers
)

router.get('/',   
    basicAuthUser,
    getDevelopers
);

router.get('/getSingleDeveloper',   
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    getSingleDevelopers
);

router.put('/',  
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateDevelopers
);

router.delete ('/', 
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteDevelopers
);

export default router;