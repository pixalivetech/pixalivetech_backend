import {Router}  from "express";
const router:Router = Router();
import { savePrivacy, getAllPrivacy, updatePrivacy } from "../controller/privacyPolicy.controller";
import { basicAuthUser, } from "../middleware/checkAuth";
import { checkSession } from "../utils/tokenManager";
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";

router.post('/', // save privacy policy
    basicAuthUser,
    checkSession,
    savePrivacy);

router.get('/',  // get privacy policy
    basicAuthUser,
    checkSession,
    getAllPrivacy);

router.put('/',  // update privacy
    basicAuthUser,
    checkSession,
    updatePrivacy
);

export default router 