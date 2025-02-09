import { Router } from "express";
const router:Router = Router();
import {  getAdmin} from "../controller/admin.controller";
import { basicAuthUser } from "../middleware/checkAuth";
import { checkSession } from "../utils/tokenManager";




router.get('/', //get all user
    basicAuthUser,
    checkSession,
    getAdmin);



export default router;