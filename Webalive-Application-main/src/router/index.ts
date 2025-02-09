import { Router } from 'express';
const router: Router = Router();

import Users from './users.routes';
import Login from './login.routes';
import Advertiser  from './advertiser.routes';
import InstallAds from '../router/installAds.routes';
import ImageAds from "./imageAds.routes";
import Url from './url.routes';
import Privacy from './privacyPolicy.router'
import ShareAds from './shareAds.routes';
import VideoAds from '../router/videoAds.routes'
import Terms from './terms.routes';
import SupportPost from './support.routes';
import Dummy from './dummyUser.router';
import SaveFaq from './faq.routes';
import Notification from './notification.routes';
import Category from './category.routes';
import MasterPanel from './masterPanel.routes';
import  advertiserTask  from "./advertiserTask.router";

router.use('/users', Users)
router.use('/advertiser', Advertiser)
router.use('/login', Login)
router.use('/imageAds',ImageAds)
router.use('/installAds',InstallAds )
router.use('/shareAds',ShareAds)
router.use('/url', Url)
router.use('/videoAds', VideoAds)
router.use('/terms',Terms)
router.use('/privacy',Privacy)
router.use('/support',SupportPost)
router.use('/dummyuser',Dummy)
router.use('/faq',SaveFaq)
router.use('/notification',Notification)
router.use('/category',Category)
router.use('/masterPanel',MasterPanel)
router.use('/advertiserTask',advertiserTask)

export default router