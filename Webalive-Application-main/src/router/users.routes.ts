import { Router } from 'express';
import { saveUsers,updateUsers,getAllUsers,getSingleUsers,deletedUsers,getUserReferralCode,
         saveBank, savePost,unsavePost,userRewards,getSavedPost,advertiserFollow,advertiserUnfollow,  
         getFollowersDetails,getFollowingDetails,blockUser,unBlockUser,getBlockedUsers,countUser,getCompletedTask,
         userGetNotify,updatePaytmAndUPI,getFollowingCount,getAllFollowers,upgradePlan,taskManagement,
        getReferredUser,getTrendingReferUser,dailyCheckIn} from '../controller/users.controller';
        
import { checkParam, checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();
// 
router.post('/', // create user
    basicAuthUser,
    checkRequestBodyParams('email'),
    saveUsers);

router.put('/', // update user
    basicAuthUser,
    checkRequestBodyParams('_id'),
    checkSession,
    updateUsers);

router.get('/', // get all users
    basicAuthUser,
    checkSession,
    getAllUsers);

router.get('/getSingleUsers',//get single user
    basicAuthUser,
    checkSession,
    checkQuery('_id'),    
    getSingleUsers);

router.delete('/', //delete user
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deletedUsers);

router.get('/getReferralCode',//get single user
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getUserReferralCode);

router.post('/addBankDetails',//to add the Bank Details
    basicAuthUser,
    checkSession,
   checkRequestBodyParams('_id'),
    saveBank);

router.put('/savePost',//to save the post
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('postId'),
    savePost);

router.put('/unSavePost',//to unsave the post
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('postId'),
    unsavePost);

router.get('/getSavedPost',  //to get all saved post
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSavedPost);
    
router.put('/advertiserFollow',   //follow advertiser 
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('userId'),
    advertiserFollow);

router.put('/advertiserUnFollow', //unfollow advertiser
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('userId'),
    advertiserUnfollow);


router.get('/userrewards',  //get user rewards
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    userRewards);

router.get('/getFollowersDetails',  //get user followers details
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getFollowersDetails);

router.get('/getFollowingDetails', //get followingDetails
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getFollowingDetails);

router.put('/blockUser', //block user
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('blockerId'),
    blockUser);

router.put('/unBlockUser', //unblock user
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('blockerId'),
    unBlockUser);

router.get('/getBlockedUsers', //get blocked users
    basicAuthUser,
    //checkSession,
    checkQuery('_id'),
    getBlockedUsers);

router.get('/countUser', //get count users
    basicAuthUser,
    checkSession,
    countUser);

router.get('/showUserNotify', //to get the user notifications
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    userGetNotify);

router.put('/updatePaytmAndUPI', //update paytm and UPI
    basicAuthUser,
    checkSession,
    updatePaytmAndUPI);

router.get('/followingCount', //to get the users following count
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getFollowingCount);

router.get('/getAllFollowers', //get all followers
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getAllFollowers);

router.put('/upgradePlan', //upgrade plan
    basicAuthUser,
    checkSession,
    checkRequestBodyParams("_id"),
    checkRequestBodyParams("plan"),
    upgradePlan);

 router.put('/updateTask',
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('userId'),
    taskManagement);   

router.get('/completedTask',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getCompletedTask
    );

router.get('/referredUser',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getReferredUser
    );

router.get('/getTrendingReferer',
    basicAuthUser,
    checkSession,
    getTrendingReferUser
    );

    router.get('/dailyCheckIn',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    dailyCheckIn)
export default router;