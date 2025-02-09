import {Router}  from "express";
const router:Router = Router();
import { saveCategory, getAllCategory, updateCategory } from "../controller/category.controller";
import { basicAuthUser, } from "../middleware/checkAuth";
import { checkSession } from "../utils/tokenManager";
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";

router.post('/', // save category
    basicAuthUser,
    checkSession,
    saveCategory);

router.get('/', // get category
    basicAuthUser,
    checkSession,
    getAllCategory);

router.put('/', // update category
    basicAuthUser,
     checkSession,
    updateCategory
);

export default router 