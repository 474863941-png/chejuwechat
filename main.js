import Vue from 'vue'
import App from './App'
import setData from "./common/js/setData.js"
import Utils from "./common/js/util.js"
import Store from './store'
import AppFunction from "./common/js/app.js"
import wxApi from "./common/js/wxApi.js"
// import ican_H5Api from './common/js/ican-H5Api'
import FarBottom from './components/template/farbottom.vue'
import Phone from '@/components/template/PhoneMask.vue'
import GetVXphone from "@/components/template/getVXphone.vue"

Vue.config.productionTip = false


Vue.prototype.setData = setData
Vue.prototype.$util = Utils
Vue.prototype.$store = Store
Vue.prototype.imgfixUrl = AppFunction.imgfix
Vue.prototype.language = AppFunction.languageStatus
Vue.component('far-bottom', FarBottom)
Vue.component('Pho-ne', Phone)
Vue.component('GetVX-phone', GetVXphone)

App.mpType = 'app'
Vue.mixin({
	data() {
		return {
			languageStatus:AppFunction.languageStatus,
			imgfixUrls: AppFunction.imgfix,
			imageRoot: AppFunction.img_root,
			shareDataInfo: {},
			onShowPageTitle: false,
			sharwate:{}
		}
	},
	computed: {

	},
	mounted() {

	},
	onLoad(e) {
		// #ifndef H5
		this.pageHeaderColor()
		this.pageTitle()
		// #endif
		// #ifdef H5
		wxApi.wxRegister();
		
		this.pageTitle()
		// this.sharwate = uni.getStorageSync('shareWaterfallflow');
		// #endif
		uni.$on('shareflow',()=>{
			setTimeout(()=>{
				this.requestShareInfo()
			},500)
		})
	},
	onReady() {
		// #ifdef H5
		
		// #endif
	},
	methods: {
		pageHeaderColor() {
			// #ifndef H5
			uni.setNavigationBarColor({
				frontColor: this.Textbuff.textc,
				backgroundColor: this.Textbuff.bgc
			})
			// #endif
		},
		pageTitle() {
			
			let page = 'pages/mainPages/index/index';
			// let diyPage = 'pages/mainPages/index/diypage';
			let pageinfo;
				// #ifdef H5
			pageinfo = location.href.split("#/")[1];
			let pagetitle = uni.getStorageSync('TextSubstitution');
			document.title = pagetitle.sysname || '⁣​';
				// #endif
				// #ifndef H5
			let curPage = getCurrentPages();
			pageinfo = curPage[curPage.length - 1].route;
				// #endif
			// let isPage = pageinfo.indexOf(page) != -1 || pageinfo.indexOf(diyPage) != -1 || pageinfo.indexOf('pages') == -1;
				let isPage = pageinfo.indexOf(page) != -1  || pageinfo.indexOf('pages') == -1;
			let indexname = uni.getStorageSync('platformInfor');
			if (!isPage) {
				if (!!Store.state.appInfo && !!Store.state.appInfo.name) {
					let appInfo_title = Store.state.appInfo.name;
					if(pageinfo.indexOf('pages/subPages2/redClothes/redClothes') != -1){
						appInfo_title = '选择转赠对象';
					}
					// #ifdef H5
					// let pagetitle = uni.getStorageSync('TextSubstitution').sysname;
					console.log(Store.state.appInfo.name,'非主页名称')
					document.title = appInfo_title || '⁣​';
					// #endif
					// #ifndef H5
					uni.setNavigationBarTitle({
						title: appInfo_title
					});
					
					// #endif
					this.onShowPageTitle = true;
				}
			}else{
				//#ifdef H5
				let name = uni.getStorageSync('indexName');
				let appInfo_title = name;
				setTimeout(()=>{
					if(appInfo_title){
						console.log('在main。js当中率先执行',appInfo_title);
						document.title = appInfo_title;
					}
				},200)
				//#endif
				
				// if(name && (pageinfo.indexOf('pages/mainPages/index/index') != -1 || pageinfo.indexOf('pages') == -1 )){
				// 	let appInfo_title = name;
				// 	
				// 	uni.setNavigationBarTitle({
				// 		title: appInfo_title
				// 	});
				// 	console.log('在main。js当中率先执行',appInfo_title)
				// }
				
			}
		},
		saveForm(temp_type) {
			// #ifdef MP-WEIXIN
			AppFunction.saveFormId(temp_type)
			// #endif
		},
		mprequestShareInfo(dataInfo = "") {
			// 
			let _this = this,
				hideSharelist = [
					"pages/subPages/businesscard/mycard/mycard",
					"pages/subPages/businesscard/carddetail/renewcarddetail"
				],
				head_id = uni.getStorageSync('head_id'),
				pages = getCurrentPages(),
				currentPageObj = pages[pages.length - 1],
				currentPage = currentPageObj.route,
				currentPageOptions = currentPageObj.options,
				isOptions = Object.keys(currentPageOptions).length === 0,
				currentUrl = isOptions ? currentPage : currentPage + '?' + AppFunction.urlEncode(currentPageOptions),
				cardListPage = 'pages/subPages/businesscard/carddetail/renewcarddetail';

			if (hideSharelist.includes(currentPage)) {
				uni.hideShareMenu()
			}
			if (currentPage.indexOf(cardListPage) !== -1) {
				currentUrl = !!dataInfo ? `pages/subPages/businesscard/carddetail/carddetail?cardid=${dataInfo}` : currentUrl;
			}
			let requestData = {
				pageinfo: currentUrl
			};
			if (head_id && !!head_id) {
				Object.assign(requestData, {
					head_id
				})
			};
			AppFunction._post_form('&do=Shareinfo', requestData, res => {
				_this.setData({
					shareDataInfo: res.data
				});
				uni.setStorageSync('shareDataInfo', _this.shareDataInfo);
				//#ifdef APP-PLUS
				// let datainfo = {
				// 	title: shareData.title || "", // 分享标题
				// 	desc: shareData.desc || "", // 分享描述
				// 	link: shareLinkurl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				// 	imgUrl: shareData.img || "" // 分享图标
				// }
				uni.setStorageSync('AppShareData',_this.shareDataInfo);
				//#endif
				if (_this.shareDataInfo.mpurl.split('?')[0] == 'pages/subPages2/drawGame/drawGame') {
					uni.setStorageSync('drawGameShareData', _this.shareDataInfo);
				}
				if (_this.shareDataInfo.mpurl.split('?')[0] == 'pages/subPages2/drawGame/gameIntegral') {
					// let endurl = _this.shareDataInfo.mpurl.split('?')[1];
					_this.shareDataInfo = uni.getStorageSync('drawGameShareData');
				}
				// _this.onShareAppMessage();
				// _this.onShareTimeline();
				// _this.setSharePages(res.data);
				// uni.setStorageSync('ss','123')
				// _this.setSharePages(res.data);
				if (!!res.data.cleanheadid) {
					uni.removeStorageSync('head_id');
				}
			}, false, () => {})
		},
		requestShareInfo(dataInfo = "") {
			let _this = this,
				pageinfo = location.href.split("#/")[1],
				head_id = uni.getStorageSync('head_id'),
				cardListPage = 'pages/subPages/businesscard/carddetail/renewcarddetail';
				_this.sharwate = uni.getStorageSync('shareWaterfallflow');
			if (pageinfo.indexOf(cardListPage) !== -1) {
				pageinfo = !!dataInfo ? `pages/subPages/businesscard/carddetail/carddetail?cardid=${dataInfo}` : pageinfo;
			}
			let requestData = {
				pageinfo
			};
			if (head_id && !!head_id) {
				Object.assign(requestData, {
					head_id
				})
			};
			AppFunction._post_form('&do=Shareinfo', requestData, res => {
				_this.setData({
					shareDataInfo: res.data
				})
				if (_this.shareDataInfo.mpurl.split('?')[0] == 'pages/subPages2/drawGame/drawGame') {
					uni.setStorageSync('drawGameShareData', _this.shareDataInfo);
				}
				if (_this.shareDataInfo.mpurl.split('?')[0] == 'pages/subPages2/drawGame/gameIntegral') {
					// let endurl = _this.shareDataInfo.mpurl.split('?')[1];
					_this.shareDataInfo = uni.getStorageSync('drawGameShareData');
				}
				if (_this.shareDataInfo.mpurl.split('?')[0] == 'pages/subPages/friendshelp/friendshelp') {
					_this.shareDataInfo = uni.getStorageSync('frienshae');
				}
				if (!!_this.sharwate && _this.sharwate.is_shaer == true) {
					_this.shareDataInfo = uni.getStorageSync('shareWaterfallflow');
				}
				if (_this.shareDataInfo.mpurl.split('?')[0] == 'pages/mainPages/index/index' && !!_this.sharwate && _this.sharwate.is_shaer == true) {
					_this.shareDataInfo = uni.getStorageSync('shareWaterfallflow');
				}
				// uni.setStorageSync('ss','123')
				_this.setSharePages(_this.shareDataInfo);
				// _this.onShareAppMessage();
				// _this.onShareTimeline();
				if (!!res.data.cleanheadid) {
					// 
					uni.removeStorageSync('head_id');
				}
			}, false, () => {})
		},
		setSharePages(shareData) {
			let sharePages = [
					"#/pages/subPages/orderList/orderList",
					"#/pages/subPages/consumptionRecords/consumptionRecords",
					"#/pages/subPages/myPost/myPost",
					// "#/pages/subPages/dealer/apply/apply",
					"#/pages/subPages/bargin/barginlist/barginlist",
					"#/pages/subPages/receivingAddress/receivingAddress",
					"#/pages/mainPages/userCenter/userCenter",
					"#/pages/mainPages/submitOrder/submitOrder",
					"#/pages/subPages/attestationCenter/index",
					"#/pages/mainPages/userset/userset",
					"#/pages/subPages/businesscard/mycard/mycard",
					"#/pages/subPages/businesscard/carddetail/renewcarddetail",
					"#/pages/subPages/city/city",
					"#/pages/subPages/dealer/setshop/setshop",
					"#/pages/subPages/postRelease/postRelease",
					"#/pages/mainPages/Settled/Settled",
					"#/pages/subPages/receivingAddress/addReceivingAddress/addReceivingAddress",
					"#/pages/subPages/createCommodity/index",
					"/#pages/subPages2/management/addGoods/addGoods",
					"/#pages/subPages/merchant/merchantHome/merchantHome",
					"/#pages/subPages2/redClothes/redClothes",
					"/#pages/subPages/coupon/coupon",
					"/#pages/subPages/redpacket/myredpacket",
				],
				// 列表单个信息分享过滤
				listSharefilt = [
					"#/pages/subPages/businesscard/carddetail/renewcarddetail"
				],
				shareUrl = location.hash,
				fullUrl = location.protocol + '//' + location.host + location.pathname + '#/pages/mainPages/index/index?i=' +
				AppFunction.siteInfo.uniacid,
				currentPages = shareUrl.split("?")[0],
				islistPage = listSharefilt.includes(currentPages),
				isCardItem = shareData.mpurl.indexOf('businesscard/carddetail/carddetail') !== -1,
				getUserinfo = uni.getStorageSync('userinfo'),
				agencyData = uni.getStorageSync('agencyData'),
				Dparameterid = uni.getStorageSync('Dparameterid'),
				// storeSid = uni.getStorageSync()
				// 列表单个信息分享链接
				listShare = location.protocol + '//' + location.host + location.pathname + '#/' + shareData.mpurl + (shareData.mpurl
					.indexOf('i=' + AppFunction.siteInfo.uniacid) === -1 ? (shareData.mpurl.indexOf('?') === -1 ? '?i=' +
						AppFunction.siteInfo.uniacid : '&i=' + AppFunction.siteInfo.uniacid) : ""),
				ifSid = location.href.indexOf('sid') === -1 ? false : true,
				loclink = location.href.split('&head_id')[0],
				locationParameter = location.href.split('&head_id')[1],
				// 判断用哪种分享链接
				linkurl = isCardItem && islistPage ? listShare : (sharePages.includes(currentPages) ? fullUrl : loclink),
				// 分享link后面是否有head_id完整链接
				shareLinkurls = linkurl.indexOf('head_id') === -1 ? (linkurl.indexOf('?') === -1 ? linkurl + '?head_id=' +
					getUserinfo.mid : linkurl + '&head_id=' + getUserinfo.mid) : linkurl,
				// 分享link后面是否有aid完整链接
				shareLinkurl = shareLinkurls.indexOf('aid') === -1 ? (shareLinkurls.indexOf('?') === -1 ? shareLinkurls + '?aid=' +
					agencyData.aid : shareLinkurls + '&aid=' + agencyData.aid) : shareLinkurls;

			let parameter;
			if (!!locationParameter && locationParameter.indexOf('&') !== -1) {
				parameter = locationParameter.split('&')[1];
			}

			if (parameter) {
				shareLinkurl = shareLinkurl + parameter;
			}
			// shareLinkurl = encodeURIComponent(shareLinkurl);
			// let urltitle = shareLinkurl.split('?')[0];
			// let urlend = shareLinkurl.split('?')[1];
			// shareLinkurl = urltitle + encodeURIComponent(urlend);
			if (shareLinkurl.split('?')[0].split('/#/')[1] == 'pages/subPages2/phoneBook/logistics/logistics') {
				shareLinkurl = shareLinkurl.indexOf('share') === -1 ? shareLinkurl + '&share=1' : shareLinkurl;
			}
			if (shareLinkurl.split('?')[0].split('/#/')[1] == 'pages/subPages2/drawGame/drawGame' || shareLinkurl.split('?')[0]
				.split('/#/')[1] == 'pages/subPages2/drawGame/gameIntegral') {
				let titleUrl = shareLinkurl.split('?')[0].split('/#/')[0];
				let canshu = shareLinkurl.split('?')[1];
				shareLinkurl = titleUrl + '/#/' + 'pages/subPages2/drawGame/drawGame?' + canshu;
				shareLinkurl = shareLinkurl.indexOf('id') === -1 ? shareLinkurl + '&id=' + Dparameterid : shareLinkurl;
			}
			if (shareLinkurl.indexOf("/h5/?#/pages/") === -1) {
				let reg = new RegExp("\/h5/.*?\#/");
				shareLinkurl = shareLinkurl.replace(reg, "/h5/#/");
			}
			if(shareLinkurl.split('?')[0].split('/#/')[1] == 'pages/subPages/friendshelp/friendshelp'){
				let titlefiren = shareLinkurl.split('?')[0].split('/#/')[0];
				let firenchu = shareLinkurl.split('?')[1];
				let orid = shareData.orid
				shareLinkurl = titlefiren + '/#/' + shareData.urlsd
				// `pages/subPages/friendshelp/friendshelp?${firenchu}&i=${AppFunction.siteInfo.uniacid}&recordid=${orid}`
			}
			if(shareLinkurl.split('?')[0].split('/#/')[1] == 'pages/mainPages/index/diypage' && !!this.sharwate && this.sharwate.is_shaer == true){
				let titlefiren = shareLinkurl.split('?')[0].split('/#/')[0];
				let orid = shareData.orid
				shareLinkurl = titlefiren + '/#/' + 'pages/subPages/postDetails/postDetails?id=' + shareData.orid + '&i=' + AppFunction.siteInfo.uniacid + '&aid=' + agencyData.aid
				shareData.mpurl = shareLinkurl
			}
			if (!!this.sharwate && this.sharwate.is_shaer == true) {
				let titlefiren = shareLinkurl.split('?')[0].split('/#/')[0];
				let orid = shareData.orid
				shareLinkurl = titlefiren + '/#/' + 'pages/subPages/postDetails/postDetails?id=' + shareData.orid + '&i=' + AppFunction.siteInfo.uniacid + '&aid=' + agencyData.aid
				shareData.mpurl = shareLinkurl
			}
			uni.setStorageSync('shareLinkurl',shareLinkurl);
			// wxApi.wxRegister(() => {
				if(shareLinkurl.indexOf('pages/subPages/redpacket/myredpacket') != -1){
					uni.$emit('myredpacketShare');
				}
				if(shareLinkurl.indexOf('pages/subPages/coupon/coupon') != -1){
					uni.$emit('couponShare');
				}
				//#ifdef H5
				// uni.showModal({
				// 	content:shareLinkurl
				// })
				console.log(shareData,shareLinkurl)
				jWeixin.ready(() => {
					wxApi.wxShare({
						title: shareData.title || "", // 分享标题
						desc: shareData.desc || "", // 分享描述
						link: shareLinkurl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: shareData.img || "", // 分享图标
						success: function(res) {
							console.log("分享成功了")
							let cardUrl = 'pages/subPages/businesscard/carddetail/carddetail';
							if (linkurl.indexOf(cardUrl) !== -1) {
								let cardshare = Store.state.isCardshare;
								Store.commit("ISCARDSHARE", (cardshare + 1))
							};
							// if (shareLinkurl.split('?')[0].split('/#/')[1] == 'pages/subPages2/phoneBook/logistics/logistics') {
							// 	uni.$emit('shareLogistics');
							// }
							if (shareLinkurl.split('?')[0].split('/#/')[1] == 'pages/subPages/postDetails/postDetails') {
								let id = uni.getStorageSync('DetailsId'),
									data = {
										id: id || shareData.orid
									};
								AppFunction._post_form('&p=pocket&do=shareNum', data, res => {
									uni.showToast({
										icon: 'none',
										title: '分享成功',
										duration: 2000,
										success:(res)=>{
											console.log()
										}
									});
									console.log(2222222222)
									uni.$emit('shareNum')
								});
							}
						},
						trigger: function(res) {
							if (shareLinkurl.split('?')[0].split('/#/')[1] == 'pages/subPages2/phoneBook/logistics/logistics') {
								uni.$emit('shareLogistics');
							}
                          console.log("触发了分享")
						uni.removeStorageSync("shareWaterfallflow")
						},
						cancel:function(fali){
							uni.removeStorageSync("shareWaterfallflow")
							console.log("用户取消了")
						}
					})
				})
				//#endif
			
			// });
		}
	},
	onShareTimeline(e) {
		let sharePages = [
				"pages/subPages/orderList/orderList",
				"pages/subPages/consumptionRecords/consumptionRecords",
				"pages/subPages/myPost/myPost",
				"pages/subPages/dealer/apply/apply",
				"pages/subPages/bargin/barginlist/barginlist",
				"pages/subPages/receivingAddress/receivingAddress",
				"pages/mainPages/userCenter/userCenter",
				"pages/subPages/submitOrder/submitOrder",
				"pages/subPages/attestationCenter/index",
				"pages/mainPages/userset/userset",
				"pages/subPages/city/city",
				"pages/subPages/dealer/setshop/setshop",
				"pages/subPages/postRelease/postRelease",
				"pages/mainPages/Settled/Settled",
				"pages/subPages/receivingAddress/addReceivingAddress/addReceivingAddress",
				"pages/subPages/createCommodity/index",
				"pages/subPages2/management/addGoods/addGoods",
				"pages/subPages/merchant/merchantHome/merchantHome",
				"pages/subPages2/redClothes/redClothes",
				"pages/subPages/coupon/coupon",
				"pages/subPages/redpacket/myredpacket"
			],
			getUserinfo = uni.getStorageSync('userinfo'),
			agencyData = uni.getStorageSync('agencyData'),
			Dparameterid = uni.getStorageSync('Dparameterid'),
			pages = getCurrentPages(),
			currentPageObj = pages[pages.length - 1],
			currentPage = currentPageObj.route,
			ShareData = Store.state.mpshareInfo,
			shareDataInfo = this.shareDataInfo,
			mpwxUrl = shareDataInfo.mpurl,
			ismpwxUrl = mpwxUrl.indexOf('?') !== -1,
			cardUrl = 'pages/subPages/businesscard/carddetail/carddetail',
			shareObj = {
				title: sharePages.includes(currentPage) ? ShareData.title : shareDataInfo.title,
				desc: sharePages.includes(currentPage) ? ShareData.desc : shareDataInfo.desc,
				imageUrl: sharePages.includes(currentPage) ? ShareData.img : shareDataInfo.img,
				path: sharePages.includes(currentPage) ? ("pages/mainPages/index/index?head_id=" + getUserinfo.mid + '&aid=' +
					agencyData.aid) : (ismpwxUrl ?
					mpwxUrl + "&head_id=" + getUserinfo.mid + '&aid=' + agencyData.aid : mpwxUrl + "?head_id=" + getUserinfo.mid +
					'&aid=' + agencyData.aid)
			};
		if (mpwxUrl.split('?')[0] == 'pages/subPages2/phoneBook/logistics/logistics') {
			shareObj.path = shareObj.path + '&share=1';
			uni.$emit('shareLogistics');
		}
		if ((mpwxUrl.split('?')[0] == 'pages/subPages2/drawGame/drawGame') || (mpwxUrl.split('?')[0] ==
				'pages/subPages2/drawGame/gameIntegral')) {

			shareObj.path = ((shareObj.path.indexOf('&id') !== -1) && (shareObj.path.indexOf('?id') !== -1)) ? shareObj.path +
				'&id=' + Dparameterid : shareObj.path;
		}
		if (currentPage.indexOf(cardUrl) !== -1) {
			let cardshare = Store.state.isCardshare;
			Store.commit("ISCARDSHARE", (cardshare + 1))
		}
		

		// let query={
		//       head_id:getUserinfo.mid,
		// 	  aid:agencyData.aid
		//     };
		let query = shareObj.path.split('?')[1];
		let redlink = uni.getStorageSync('redItem');
		uni.removeStorageSync('redItem');
		
		if(redlink){
			shareObj.title = redlink.title;
			shareObj.imageUrl = redlink.shareimg;
			query = query + '&isred=' +  redlink.recordid
		}
		shareObj.query = query;
		uni.setStorageSync('shareObj', shareObj);
		return {
			title: shareObj.title,
			imageUrl: shareObj.imageUrl,
			query: query
		}
	},
	onShareAppMessage(e) {
		let _this=this;
		let sharePages = [
				"pages/subPages/orderList/orderList",
				"pages/subPages/consumptionRecords/consumptionRecords",
				"pages/subPages/myPost/myPost",
				"pages/subPages/dealer/apply/apply",
				"pages/subPages/bargin/barginlist/barginlist",
				"pages/subPages/receivingAddress/receivingAddress",
				"pages/mainPages/userCenter/userCenter",
				"pages/subPages/submitOrder/submitOrder",
				"pages/subPages/attestationCenter/index",
				"pages/mainPages/userset/userset",
				"pages/subPages/city/city",
				"pages/subPages/dealer/setshop/setshop",
				"pages/subPages/postRelease/postRelease",
				"pages/mainPages/Settled/Settled",
				"pages/subPages/receivingAddress/addReceivingAddress/addReceivingAddress",
				"pages/subPages/createCommodity/index",
				"pages/subPages2/management/addGoods/addGoods",
				"pages/subPages2/redClothes/redClothes",
				"pages/subPages/coupon/coupon",
				"pages/subPages/redpacket/myredpacket"
			],
			sharwate = uni.getStorageSync('shareWaterfallflow'),
			getUserinfo = uni.getStorageSync('userinfo'),
			agencyData = uni.getStorageSync('agencyData'),
			Dparameterid = uni.getStorageSync('Dparameterid'),
			pages = getCurrentPages(),
			currentPageObj = pages[pages.length - 1],
			currentPage = currentPageObj.route,
			ShareData = Store.state.mpshareInfo,
			shareDataInfo = this.shareDataInfo,
			mpwxUrl = shareDataInfo.mpurl,
			ismpwxUrl = mpwxUrl.indexOf('?') !== -1,
			cardUrl = 'pages/subPages/businesscard/carddetail/carddetail',
			shareObj = {
				title: sharePages.includes(currentPage) ? ShareData.title : shareDataInfo.title,
				desc: sharePages.includes(currentPage) ? ShareData.desc : shareDataInfo.desc,
				imageUrl: sharePages.includes(currentPage) ? ShareData.wxapp_img : shareDataInfo.wxapp_img,
				path: sharePages.includes(currentPage) ? ("pages/mainPages/index/index?head_id=" + getUserinfo.mid + '&aid=' +
					agencyData.aid) : (ismpwxUrl ?
					mpwxUrl + "&head_id=" + getUserinfo.mid + '&aid=' + agencyData.aid : mpwxUrl + "?head_id=" + getUserinfo.mid +
					'&aid=' + agencyData.aid)
			};
		if (mpwxUrl.split('?')[0] == 'pages/subPages2/phoneBook/logistics/logistics') {
			shareObj.path = shareObj.path + '&share=1';
			uni.$emit('shareLogistics');
		}
		if ((mpwxUrl.split('?')[0] == 'pages/subPages2/drawGame/drawGame') || (mpwxUrl.split('?')[0] ==
				'pages/subPages2/drawGame/gameIntegral')) {

			shareObj.path = ((shareObj.path.indexOf('&id') !== -1) && (shareObj.path.indexOf('?id') !== -1)) ? shareObj.path +
				'&id=' + Dparameterid : shareObj.path;
		}
		if (currentPage.indexOf(cardUrl) !== -1) {
			let cardshare = Store.state.isCardshare;
			Store.commit("ISCARDSHARE", (cardshare + 1))
		}
		if (!!sharwate && sharwate.is_shaer == true) {
			let shareDataInfos = uni.getStorageSync('shareWaterfallflow');
			shareObj.title = shareDataInfos.title;
			shareObj.desc = shareDataInfos.desc;
			shareObj.imageUrl = shareDataInfos.img;
			shareObj.path = 'pages/subPages/postDetails/postDetails?id=' + shareDataInfos.orid + '&i=' + AppFunction.siteInfo.uniacid + '&aid=' + agencyData.aid
		}
		uni.setStorageSync('shareObj', shareObj);
		let redlink = uni.getStorageSync('redItem');
		uni.removeStorageSync('redItem');
		if(redlink){
			shareObj.title = redlink.title;
			shareObj.imageUrl = redlink.shareimg;
			shareObj.desc = redlink.desc;
			shareObj.path = shareObj.path.indexOf('?') == -1?shareObj.path + '?isred=' +  redlink.recordid:shareObj.path + '&isred=' +  redlink.recordid;
		}
		uni.removeStorageSync("shareWaterfallflow")
		return shareObj
	},
	onShow(options) {
		// uni.$emit('shareNum');
		uni.$emit('getFarBtn');
		//#ifdef H5 
		let pages = location.href.split('?')[0].split('#/')[1];
		let pagetitle = uni.getStorageSync('TextSubstitution');
		document.title = pagetitle.sysname || '⁣​';
		if (pages == 'pages/mainPages/login/login' || pages == 'pages/subPages2/cleanCustom/bindingPhone') {
			return
		} else {
			AppFunction.getInt();
		}
		setTimeout(() => {
			this.requestShareInfo()
		}, 200)
		//#endif
		//#ifdef MP-WEIXIN || APP-PLUS
		setTimeout(()=>{
			let pages = getCurrentPages(),
				currentPageObj = pages[pages.length - 1],
				currentPage = currentPageObj.route;
				if(currentPage == 'pages/subPages2/cleanCustom/bindingPhone'){
					return
				}else{
					AppFunction.getInt();
				}
		},500)
		setTimeout(() => {
			this.mprequestShareInfo();
		}, 500)
		wx.showShareMenu({
			withShareTicket: false,
			menus: ['shareAppMessage', 'shareTimeline']
		})
		//#endif
		
		this.onShowPageTitle && this.pageTitle()
		

	},
	computed: {
		Textbuff() {
			return uni.getStorageSync('TextSubstitution');
		},
		resouCliType() {
			return AppFunction.getClientType()
		}
	}
})

const app = new Vue({
	...App
})
app.$mount()
