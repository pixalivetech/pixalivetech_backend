import {Router} from "express";
const router:Router = Router();
import { saveServices,getServices ,getSingleServices,updateServices,deleteServices} from "../controller/services.controller";
import {basicAuthUser} from "../middleware/checkAuth";
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";
import { checkSession } from "../utils/tokenManager";


router.post('/', 
    basicAuthUser,
    saveServices
)

router.get('/',   
    basicAuthUser,
    getServices
);

router.get('/getSingleService',   
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    getSingleServices
);

router.put('/',  
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateServices
);

router.delete ('/', 
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteServices
);

export default router;