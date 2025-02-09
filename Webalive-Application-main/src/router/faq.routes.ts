import {Router} from "express";
const router:Router = Router();
import { saveFaq,getAllFaq } from "../controller/faq.controller";
import { basicAuthUser } from "../middleware/checkAuth";
import { checkSession } from "../utils/tokenManager";


router.post('/', //save faq
basicAuthUser,
checkSession,
saveFaq
);

router.get('/', //get faq
basicAuthUser,
checkSession,
getAllFaq
);


export default router;
