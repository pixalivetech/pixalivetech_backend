import {Router} from "express";
const router:Router = Router();
import { saveTerms,getAllTerms, updateTerms } from "../controller/terms.controller";
import { basicAuthUser } from "../middleware/checkAuth";
import { checkSession } from "../utils/tokenManager";



router.post('/', //save terms for admin panel
basicAuthUser,
checkSession,
saveTerms );

router.get('/', //get terms for flutter 
basicAuthUser,
checkSession,
getAllTerms );

router.put('/', //update termsandcondition for admin panel
basicAuthUser,
checkSession,
updateTerms);

export default router;