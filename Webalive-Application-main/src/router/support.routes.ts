import {Router} from 'express';
import { supportpost,getAllTickets, getSingleTickets, getAdvertiserTickets } from '../controller/support.controller';
import { checkQuery,checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();

router.post('/', //post support for flutter team and react
    basicAuthUser,
    checkSession,
    supportpost
);

router.get('/', //get all tickets
    basicAuthUser,
    checkSession,
    getAllTickets
);

router.get('/getSingleTicket',  //get single ticket
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleTickets
)

router.get('/getAdvertiserTicket',  //get specific advertiser tickets
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getAdvertiserTickets
)

export default router;