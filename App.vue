<script>
	import App from '@/common/js/app.js';
	// #ifdef H5
	import wxApi from '@/common/js/wxApi.js';
	// #endif
	export default {
		onLaunch: function(options) {
			console.log('App Launch');
			//设置项目地址信息
			App.setSiteInfo();
			// 设置地址
			let getAid = uni.getStorageSync('agencyData');
			// let aid = (options.query.aid == '0')?getAid.aid:(options.query.aid || getAid.aid);
			let aid = options.query.aid || getAid.aid;
			
			App.setAppRoot(aid);
			// 获取小程序信息
			App.updateAppInfo();
			// 获取跳转链接列表
			App.navgatetoLink();
			//获取用户设置
			App.userSettings();
			// 跳转选择地区
			// 获取图片地址
			App.getImgUrl();
			//获取用户通讯信息
			App.getSetInfo();
			// App.saveCity();
			//获取自定义文字替换信息
			App.getInt();
			// #ifndef H5
			//微信公共分享
			// 更新提示
			App.up();
			//#ifdef MP-WEIXIN
			uni.setInnerAudioOption({
			obeyMuteSwitch: false  
			})
			//#endif
			App.wxShareInfo();
			// #endif
			// App.wxApiCallback(options.path);
			
			// App.GetifAid()
			let location = uni.getStorageSync('curLoction');
			let agencyData = uni.getStorageInfoSync('agencyData');
			if (!!agencyData) {
				App.getAreaId(location);
			};	
			if(uni.getSystemInfoSync().platform == 'ios'){
				
			}

		},
		onShow: function(options) {
			// 	// 获取地区列表
			// #ifdef H5
			
			// #endif
			
			// #ifndef H5
			// 小程序启动场景
			
			if (options.query && JSON.stringify(options.query) !== "{}") {
				console.log("e.query", options.query);
				App.scanCode = true;
				App.onStartupScene(options.query);
			}
			// #endif
	
		},
		onHide: function() {
			console.log('App Hide');
		}
		// onLaunch:function(){
	};
</script>

<style>
	/*每个页面公共css */
	@import './common/css/common.css';
	@import "./common/css/new_iconfont.css";
	@import './common/css/iconfont.css';
	@import './pages/subPages2/grace/animate.css';
	/* @import './pages/subPages2/grace/graceIcons.css'; */
	/* @import './pages/subPages2/grace/graceUI.css';
@import './pages/subPages/grace2/graceWeex.css'; */
</style>
