import {Router} from "express";
const router:Router = Router();
import { saveOurClients,getOurClients ,getSingleOurClients,updateOurClients,deleteOurClients} from "../controller/ourClients.controller";
import {basicAuthUser} from "../middleware/checkAuth";
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";
import { checkSession } from "../utils/tokenManager";


router.post('/', //save contact  // without checking session
    basicAuthUser,
    saveOurClients
)

router.get('/', //get all contact   
    basicAuthUser,
    getOurClients
);

router.get('/getSingleClient',  //get single user   
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleOurClients
);

router.put('/',  //update user   
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateOurClients
);

router.delete ('/',  //delete users',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteOurClients
);

export default router;