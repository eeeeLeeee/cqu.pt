!function(t){function e(s){if(n[s])return n[s].exports;var a=n[s]={exports:{},id:s,loaded:!1};return t[s].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}var n={};return e.m=t,e.c=n,e.p="static/",e(0)}([function(t,e,n){t.exports=n(15)},function(t,e,n){!function(n){function s(t,e){e=e||{},this._id=s._generateUUID(),this._promise=e.promise||Promise,this._frameId=e.frameId||"CrossStorageClient-"+this._id,this._origin=s._getOrigin(t),this._requests={},this._connected=!1,this._closed=!1,this._count=0,this._timeout=e.timeout||5e3,this._listener=null,this._installListener();var n;e.frameId&&(n=document.getElementById(e.frameId)),n&&this._poll(),n=n||this._createFrame(t),this._hub=n.contentWindow}s.frameStyle={display:"none",position:"absolute",top:"-999px",left:"-999px"},s._getOrigin=function(t){var e,n,s;return e=document.createElement("a"),e.href=t,e.host||(e=window.location),n=e.protocol&&":"!==e.protocol?e.protocol:window.location.protocol,s=n+"//"+e.host,s=s.replace(/:80$|:443$/,"")},s._generateUUID=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=16*Math.random()|0,n="x"==t?e:3&e|8;return n.toString(16)})},s.prototype.onConnect=function(){var t=this;return this._connected?this._promise.resolve():this._closed?this._promise.reject(new Error("CrossStorageClient has closed")):(this._requests.connect||(this._requests.connect=[]),new this._promise(function(e,n){var s=setTimeout(function(){n(new Error("CrossStorageClient could not connect"))},t._timeout);t._requests.connect.push(function(t){return clearTimeout(s),t?n(t):void e()})}))},s.prototype.set=function(t,e){return this._request("set",{key:t,value:e})},s.prototype.get=function(t){var e=Array.prototype.slice.call(arguments);return this._request("get",{keys:e})},s.prototype.del=function(){var t=Array.prototype.slice.call(arguments);return this._request("del",{keys:t})},s.prototype.clear=function(){return this._request("clear")},s.prototype.getKeys=function(){return this._request("getKeys")},s.prototype.close=function(){var t=document.getElementById(this._frameId);t&&t.parentNode.removeChild(t),window.removeEventListener?window.removeEventListener("message",this._listener,!1):window.detachEvent("onmessage",this._listener),this._connected=!1,this._closed=!0},s.prototype._installListener=function(){var t=this;this._listener=function(e){var n,s,a,i;if(!t._closed&&e.data&&"string"==typeof e.data&&(s="null"===e.origin?"file://":e.origin,s===t._origin))if("cross-storage:unavailable"!==e.data){if(e.data.indexOf("cross-storage:")!==-1&&!t._connected){if(t._connected=!0,!t._requests.connect)return;for(n=0;n<t._requests.connect.length;n++)t._requests.connect[n](a);delete t._requests.connect}if("cross-storage:ready"!==e.data){try{i=JSON.parse(e.data)}catch(c){return}i.id&&t._requests[i.id]&&t._requests[i.id](i.error,i.result)}}else{if(t._closed||t.close(),!t._requests.connect)return;for(a=new Error("Closing client. Could not access localStorage in hub."),n=0;n<t._requests.connect.length;n++)t._requests.connect[n](a)}},window.addEventListener?window.addEventListener("message",this._listener,!1):window.attachEvent("onmessage",this._listener)},s.prototype._poll=function(){var t,e,n;t=this,n="file://"===t._origin?"*":t._origin,e=setInterval(function(){return t._connected?clearInterval(e):void(t._hub&&t._hub.postMessage("cross-storage:poll",n))},1e3)},s.prototype._createFrame=function(t){var e,n;e=window.document.createElement("iframe"),e.id=this._frameId;for(n in s.frameStyle)s.frameStyle.hasOwnProperty(n)&&(e.style[n]=s.frameStyle[n]);return window.document.body.appendChild(e),e.src=t,e},s.prototype._request=function(t,e){var n,s;return this._closed?this._promise.reject(new Error("CrossStorageClient has closed")):(s=this,s._count++,n={id:this._id+":"+s._count,method:"cross-storage:"+t,params:e},new this._promise(function(t,e){var a,i,c;a=setTimeout(function(){s._requests[n.id]&&(delete s._requests[n.id],e(new Error("Timeout: could not perform "+n.method)))},s._timeout),s._requests[n.id]=function(i,c){return clearTimeout(a),delete s._requests[n.id],i?e(new Error(i)):void t(c)},Array.prototype.toJSON&&(i=Array.prototype.toJSON,Array.prototype.toJSON=null),c="file://"===s._origin?"*":s._origin,s._hub.postMessage(JSON.stringify(n),c),i&&(Array.prototype.toJSON=i)}))},"undefined"!=typeof t&&t.exports?t.exports=s:e.CrossStorageClient=s}(this)},function(t,e,n){!function(n){var s={};s.init=function(t){var e=!0;try{window.localStorage||(e=!1)}catch(n){e=!1}if(!e)try{return window.parent.postMessage("cross-storage:unavailable","*")}catch(n){return}s._permissions=t||[],s._installListener(),window.parent.postMessage("cross-storage:ready","*")},s._installListener=function(){var t=s._listener;window.addEventListener?window.addEventListener("message",t,!1):window.attachEvent("onmessage",t)},s._listener=function(t){var e,n,a,i,c,r,o;if(e="null"===t.origin?"file://":t.origin,"cross-storage:poll"===t.data)return window.parent.postMessage("cross-storage:ready",t.origin);if("cross-storage:ready"!==t.data){try{a=JSON.parse(t.data)}catch(u){return}if(a&&"string"==typeof a.method&&(i=a.method.split("cross-storage:")[1])){if(s._permitted(e,i))try{r=s["_"+i](a.params)}catch(u){c=u.message}else c="Invalid permissions for "+i;o=JSON.stringify({id:a.id,error:c,result:r}),n="file://"===e?"*":e,window.parent.postMessage(o,n)}}},s._permitted=function(t,e){var n,a,i,c;if(n=["get","set","del","clear","getKeys"],!s._inArray(e,n))return!1;for(a=0;a<s._permissions.length;a++)if(i=s._permissions[a],i.origin instanceof RegExp&&i.allow instanceof Array&&(c=i.origin.test(t),c&&s._inArray(e,i.allow)))return!0;return!1},s._set=function(t){window.localStorage.setItem(t.key,t.value)},s._get=function(t){var e,n,s,a;for(e=window.localStorage,n=[],s=0;s<t.keys.length;s++){try{a=e.getItem(t.keys[s])}catch(i){a=null}n.push(a)}return n.length>1?n:n[0]},s._del=function(t){for(var e=0;e<t.keys.length;e++)window.localStorage.removeItem(t.keys[e])},s._clear=function(){window.localStorage.clear()},s._getKeys=function(t){var e,n,s;for(s=[],n=window.localStorage.length,e=0;e<n;e++)s.push(window.localStorage.key(e));return s},s._inArray=function(t,e){for(var n=0;n<e.length;n++)if(t===e[n])return!0;return!1},s._now=function(){return"function"==typeof Date.now?Date.now():(new Date).getTime()},"undefined"!=typeof t&&t.exports?t.exports=s:e.CrossStorageHub=s}(this)},function(t,e,n){t.exports={CrossStorageClient:n(1),CrossStorageHub:n(2)}},function(t,e,n){t.exports='<!--[if IE]><p class="kill-ie">微软都放弃了IE，为啥你却还不放弃？</p><![endif]--> <div id=_cqupt-side-box> <div class=_cqupt-side-bar> <div class=_cqupt-side-bar-item id=_cqupt-title> <a href=javascript:void(0);><i>×</i> 内网外入</a> <span class=_cqupt-side-bar-tip>隐藏</span> </div> <div class=_cqupt-side-bar-top> <a href=//cqupt.congm.in class=_cqupt-side-bar-item> <span class=_cqupt-iconfont>&#xe601;</span> <span class=_cqupt-side-bar-tip>主页</span> </a> <div class=_cqupt-side-bar-item data-toggle=sideTab data-target=#_cqupt-user-info> <span class=_cqupt-iconfont>&#xe602;</span> <span class=_cqupt-side-bar-tip>导航</span> </div> <a href=https://we.cqu.pt target=_blank class=_cqupt-side-bar-item> <img class=_cqupt-side-bar-img src=//cqupt.congm.in/src/img/wecqupt.png> <span class=_cqupt-side-bar-tip>We重邮</span> </a> </div> <div class=_cqupt-side-bar-bottom> <div class=_cqupt-side-bar-item data-toggle=sideTab data-target=#_cqupt-duosuo> <span class=_cqupt-iconfont>&#xe600;</span> <span class=_cqupt-side-bar-tip>评论</span> </div> <div class=_cqupt-side-bar-item data-toggle=sideTab data-target=#_cqupt-donate> <span class=_cqupt-iconfont>&#xe603;</span> <span class=_cqupt-side-bar-tip>捐助</span> </div> <div class=_cqupt-side-bar-item data-toggle=sideTab data-target=#_cqupt-info> <span class=_cqupt-iconfont>&#xe604;</span> <span class=_cqupt-side-bar-tip>关于</span> </div> <a href="http://jq.qq.com/?_wv=1027&k=2EgWhWy" target=_blank class=_cqupt-side-bar-item> <span class=_cqupt-iconfont>&#xe605;</span> <span class=_cqupt-side-bar-tip>内网外入交流群：312784909</span> </a> </div> </div> <header class=_cqupt-header> <div id=_cqupt-header-close data-toggle=sideTab data-target=close><img src='+n(6)+'></div> </header> <div class=_cqupt-content> <div class="_cqupt-content-item _cqupt-hidden" id=_cqupt-user-info> <div class=_cqupt-content-hd>导航</div> <div class=_cqupt-content-bd> <div class=_cqupt-nav-info> <small class=_cqupt-small>【<span class=_cqupt-nav-user-name></span>】同学，你好！这是你的专属链接：</small> <div class=_cqupt-nav-list> <a class="_cqupt-nav-item _cqupt-nav-user-info-btn" href=javascript:void(0); target=_blank>你的信息</a> <a class="_cqupt-nav-item _cqupt-nav-user-pic-btn" href=javascript:void(0); target=_blank>你的照片</a> <a class="_cqupt-nav-item _cqupt-nav-user-kb-btn" href=javascript:void(0); target=_blank>你的课表</a> </div> <div class=_cqupt-nav-info-cont> <div class="_cqupt-nav-user-info _cqupt-hidden"> <table> <tbody> <tr><td><span class=_cqupt-nav-user-xm></span> (<span class=_cqupt-nav-user-xb></span>)</td><td><span class=_cqupt-nav-user-xh></span></td></tr> <tr><td><span class=_cqupt-nav-user-yxm></span></td><td><span class=_cqupt-nav-user-nj></span></td></tr> <tr><td><span class=_cqupt-nav-user-zym></span></td><td><span class=_cqupt-nav-user-bj></span></td></tr> </tbody> </table> </div> <div class="_cqupt-nav-user-pic _cqupt-hidden"> </div> </div> </div> <small class=_cqupt-small>热门排行</small> <div class=_cqupt-nav-list> <a class=_cqupt-nav-item-o href=https://jwzx.cqupt.congm.in target=_blank>教务在线</a> <a class=_cqupt-nav-item-o href=http://xk1.cqupt.edu.cn.cqupt.congm.in target=_blank>选课地址1</a> <a class=_cqupt-nav-item-o href=http://xk2.cqupt.edu.cn.cqupt.congm.in/ target=_blank>选课地址2</a> <a class=_cqupt-nav-item-o href=http://222.177.140.105.cqupt.congm.in target=_blank>网上党校</a> <a class=_cqupt-nav-item-o href=http://202.202.43.222/bysj/ target=_blank>毕业设计</a> <a class=_cqupt-nav-item-o href=http://xk4.cqupt.edu.cn.cqupt.congm.in target=_blank>选课地址4</a> <a class=_cqupt-nav-item-o href=http://xk2.cqupt.edu.cn.cqupt.congm.in/xpj2016/ target=_blank>学评教</a> <a class=_cqupt-nav-item-o href=http://oa.cqupt.edu.cn.cqupt.congm.in target=_blank>校务信息网</a> <a class=_cqupt-nav-item-o href=http://oj.cqupt.edu.cn.cqupt.congm.in target=_blank>ACM/OJ</a> <a class=_cqupt-nav-item-o href=http://job.cqupt.edu.cn target=_blank>就业信息网</a> <a class=_cqupt-nav-item-o href=http://bbs.cqupt.edu.cn target=_blank>幽幽黄桷兰</a> <a class=_cqupt-nav-item-o href=http://gs.cqupt.edu.cn target=_blank>研究生学院</a> <a class=_cqupt-nav-item-o href=http://172.20.200.60.cqupt.congm.in target=_blank>教学资源库</a> <a class=_cqupt-nav-item-o href=http://cyhq.cqupt.edu.cn.cqupt.congm.in target=_blank>后勤服务</a> <a class=_cqupt-nav-item-o href=http://hongyan.cqupt.edu.cn target=_blank>红岩网校</a> <a class=_cqupt-nav-item-o href=http://www.cqupt.edu.cn target=_blank>重邮主页</a> <a class=_cqupt-nav-item-o href=http://tsg.cqupt.edu.cn target=_blank>图书馆</a> <a class=_cqupt-nav-item-o href=http://zs.cqupt.edu.cn.cqupt.congm.in target=_blank>招生信息网</a> </div> <div class=_cqupt-nav-more> <small class=_cqupt-small>截至2016年12月24日，内网外入总访问量已突破两百万，该列表为各站访问量排行。</small> </div> </div> </div> <div class="_cqupt-content-item _cqupt-hidden" id=_cqupt-duosuo> <div class=_cqupt-content-hd>评论</div> <div class=_cqupt-content-bd> <div class="ds-share flat" data-thread-key=1 data-title="内网外入 - CQUPT" data-content=一站解决外网访问教务在线等内网所有网页！ data-url=https://cqupt.congm.in> <div class=ds-share-inline> <ul class=ds-share-icons-16> <li data-toggle=ds-share-icons-more><a class=ds-more href=javascript:void(0);>分享:</a></li> <li><a class=ds-weibo href=javascript:void(0); data-service=weibo>微博</a></li> <li><a class=ds-wechat href=javascript:void(0); data-service=wechat>微信</a></li> <li><a class=ds-qq href=javascript:void(0); data-service=qq>QQ</a></li> <li><a class=ds-qzone href=javascript:void(0); data-service=qzone>空间</a></li> </ul> <div class=ds-share-icons-more></div> </div> </div> <span class=_cqupt-loading>正在加载中...</span> </div> </div> <div class="_cqupt-content-item _cqupt-hidden" id=_cqupt-donate> <div class=_cqupt-content-hd>捐助</div> <div class=_cqupt-content-bd> <h3><span class="_cqupt-label _cqupt-label-o">内网外入</span> (cqupt.congm.in) 是一个免费的系统，但是内网外入服务器搭建于我的旧电脑之上，每月需要宽带网络和运营维护的成本。</h3> <p>如果您觉得内网外入极大方便您的日常使用，您可以自愿选择通过捐赠来促进内网外入的健康维护和发展，内网外入也需要大家的支持。此外，内网外入已引入和谐健康的Google广告，您的每一次点击也是内网外入的点滴支持，如果您的浏览器有广告屏蔽插件，请向插件白名单中插入内网外入域名cqupt.congm.in、*.cqupt.congm.in、*.host.congm.in，再次感谢您的支持，Tnx。</p> <p>此外，内网外入已引入和谐健康的Google广告，您的每一次点击也是内网外入的点滴支持，如果您的浏览器有广告屏蔽插件，请向插件白名单中插入内网外入域名cqupt.congm.in、*.cqupt.congm.in、*.host.congm.in，再次感谢您的支持，Tnx。</p> <p class=_cqupt-small>支付宝帐号：i@congm.in / 这是昵称 (闵聪)</p> <img src=//cqupt.congm.in/src/img/alipay.png class=_cqupt-donate-img> <h2>捐助人列表 <small class=_cqupt-small>(每日更新)</small></h2> <table class=_cqupt-donate-list> <thead> <tr> <th>账户</th><th>用户名</th><th>时间</th><th>金额</th> </tr> </thead> </table> </div> </div> <div class="_cqupt-content-item _cqupt-hidden" id=_cqupt-info> <div class=_cqupt-content-hd>关于</div> <div class=_cqupt-content-bd> <h2>内网外入 (cqupt.congm.in) </h2> <h3><span class="_cqupt-label _cqupt-label-sm">重庆邮电大学</span> <span class="_cqupt-label _cqupt-label-sm">个人出品</span> <span class="_cqupt-label _cqupt-label-sm">非官方出品</span></h3> <p>内网外入诞生于2015年9月，该系统利用nginx服务器反向代理的原理，方便了重邮同学通过外网直接访问内网。该系统在保证内网安全的前提下，可以随时随地进入内网查询自己的个人课表、考试安排、期末成绩，进行选课等，极大方便同学们的日常使用。网页上线16个月来，总访问量(PV)超过200万多次，PV单日峰值达5万多次，独立访客(UV)日均约1200人，UV日峰值超1万人。</p> <div class=_cqupt-info-list> <p>官网：<a href=//cqupt.congm.in target=_blank>cqupt.congm.in</a></p> <p>Github：<a href=https://github.com/mcc108/cqupt.congm.in target=_blank>github.com/mcc108/cqupt.congm.in</a></p> <p>交流群：<a href="http://jq.qq.com/?_wv=1027&k=2EgWhWy" target=_blank>312784909</a></p> <p>博文：<a href=//i.congm.in/cqupt-inner target=_blank>i.congm.in/cqupt-inner</a></p> <p>统计：<a href="http://new.cnzz.com/v1/login.php?siteid=1257517721" target=_blank>CNZZ统计</a></p> <p>作者：<a href=//congm.in target=_blank>@ Cong Min</a></p> </div> </div> </div> </div> </div> <div id=_cqupt-adbox> <ins class=adsbygoogle style=display:block data-ad-client=ca-pub-9908918414837596 data-ad-slot=4401312664 data-ad-format=auto></ins> <ins class=adsbygoogle style=display:block data-ad-client=ca-pub-9908918414837596 data-ad-slot=3840432663 data-ad-format=auto></ins> </div>'},function(t,e){t.exports=[{user_id:"187***9149",user_name:"文",time:"2016-12-25",money:6.66},{user_id:"138***3218",user_name:"代琪",time:"2016-12-22",money:6.66},{user_id:"hml***@126.com",user_name:"茂梁",time:"2016-12-02",money:10},{user_id:"177***2728",user_name:"huhaosb",time:"2016-11-29",money:.1},{user_id:"136***9209",user_name:"Guan",time:"2016-11-20",money:10},{user_id:"152***9011",user_name:"穗乃果家的馒头",time:"2016-11-14",money:9.12},{user_id:"158***5091",user_name:"姜一凡",time:"2016-11-08",money:1.2},{user_id:"183***1479",user_name:"Aven",time:"2016-10-31",money:2},{user_id:"163***@qq.com",user_name:"宝童",time:"2016-10-25",money:6.66},{user_id:"173***1325",user_name:"Tritagonist",time:"2016-10-20",money:6},{user_id:"qxy***@163.com",user_name:"小勇",time:"2016-10-13",money:6},{user_id:"kin***@qq.com",user_name:"kindvin",time:"2016-09-13",money:5},{user_id:"188***1285",user_name:"LoveYourLove",time:"2016-09-13",money:5},{user_id:"188***4404",user_name:"秋健",time:"2016-09-13",money:8},{user_id:"183***1479",user_name:"Aven",time:"2016-09-12",money:1},{user_id:"734***@qq.com",user_name:"JohnZhu1997",time:"2016-09-11",money:5},{user_id:"188***1305",user_name:"权奥",time:"2016-09-11",money:5},{user_id:"156***4460",user_name:"Hypernova",time:"2016-09-09",money:5},{user_id:"109***@qq.com",user_name:"铮",time:"2016-09-08",money:10},{user_id:"181***6814",user_name:"文慧~",time:"2016-09-07",money:1}]},function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAflBMVEVHcEw4ODg1NTUvLy8xMTEzMzMwMDAzMzM2NjYyMjIzMzMxMTEzMzMyMjIzMzMyMjIyMjIzMzMzMzMyMjI1NTUyMjIzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMyMjIzMzMzMzMyMjIzMzMzMzMzMzM6zPdjAAAAKXRSTlMAEhMbJNIV2xzjGRoUztrZz9HQ2BjT1zsjvdy3zUWupJTHMrCWnpypuWzxzngAAAE+SURBVFjD7dVbU8IwEIbh0CqtKKJgOQkqHoD8/z9ISGMG6Gaz3+qVY+52Ou8zbTptjPkja93sarSZfwxncVhZW4HC1Y21izi9WlQ49vYtjk9TUPD9sGe0QqcHBaJ3wkQskL0xA6mQ6MWC7x961CWRwPQige2dMMoImT4rtH3B3SIr+H5c8Jt0mxZEPSMI+6Qg7p1wTwhATwq+fyykn2tHAPuO0PZ3yC+rPBUU/Zmg6p1QBcH313AfBXUfhKW+D8IPemPq5bFv+uoz0z8/fOpd9nrB902lFtr316+1QujdTuqE2CuFk14lnPUK4aKHhU4PCkQPCWQPCIleLCR7ocD0IoHtBUKmzwrZPiMIelYQ9Ywg7JOCuE8IQE8KUE8Ic6z/Fso4v4B9EL7iuEH7VniO02zxCZ9/5Xb/bv7Xr6wDN1lBlbRjKkIAAAAASUVORK5CYII="},,function(t,e,n){function s(){if(_cqupt_inner_user.xh){_cqupt_inner_user.xb=_cqupt_inner_user.xb.trim(),_cqupt_inner_user.bj=_cqupt_inner_user.bj.trim()+"班",_cqupt_inner_user.nj=_cqupt_inner_user.nj.trim()+"级",_cqupt_inner_user.zym=_cqupt_inner_user.zym.trim()+"专业",document.querySelector("._cqupt-nav-info").classList.add("_cqupt-show"),document.querySelector("._cqupt-nav-user-name").innerHTML=_cqupt_inner_user.xm;var t=["xm","xb","xh","yxm","zym","nj","bj"];t.forEach(function(t){document.querySelector("._cqupt-nav-user-"+t).innerHTML=_cqupt_inner_user[t].trim()}),document.querySelector("._cqupt-nav-user-kb-btn").setAttribute("href","https://jwzx.cqupt.congm.in/jwzxtmp/showKebiao.php?type=student&id="+_cqupt_inner_user.xh);var e=document.createElement("img");e.src="https://jwzx.cqupt.congm.in/showstuPic.php?xh="+_cqupt_inner_user.xh,e.onload=function(){e.complete&&document.querySelector("._cqupt-nav-user-pic").appendChild(e)};var n=document.createElement("img");n.src="https://congm.in/proxy/172.22.80.212.cqupt.congm.in/PHOTO0906CET/"+_cqupt_inner_user.xh+".JPG",n.onload=function(){n.complete&&document.querySelector("._cqupt-nav-user-pic").appendChild(n)}}}!function(){var t=document.createElement("script");t.async="true",t.src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",self==top&&document.body.appendChild(t),(adsbygoogle=window.adsbygoogle||[]).push({}),(adsbygoogle=window.adsbygoogle||[]).push({}),(adsbygoogle=window.adsbygoogle||[]).push({google_ad_client:"ca-pub-9908918414837596",enable_page_level_ads:!0})}(),function(){var t=function(t){t=t||{};for(var e=1;e<arguments.length;e++)if(arguments[e])for(var n in arguments[e])arguments[e].hasOwnProperty(n)&&(t[n]=arguments[e][n]);return t},e=n(3).CrossStorageClient,a=new e("https://cqupt.congm.in/common/storage-iframe.html");a.onConnect().then(function(){return a.get("cqupt_inner")}).then(function(e){function n(t){var e=document.querySelector(t.form);e&&e.querySelector(t.btn).addEventListener("click",function(){var n=e.querySelector(t.input).value;n.trim()&&(i.xh_list||(i.xh_list={}),i.xh_list[n]?i.xh_list[n]+=1:i.xh_list[n]=1,a.set("cqupt_inner",JSON.stringify(i)))})}var i={};e||a.set("cqupt_inner",JSON.stringify({}));try{i=JSON.parse(e)}catch(c){a.set("cqupt_inner",JSON.stringify({})),i={}}var r=0,o=3;if(i.xh_list){var u=i.xh_list;for(var d in u)u.hasOwnProperty(d)&&u[d]>=o&&(r=parseInt(d),o=u[d])}if(r)if(i.xh&&i.xh==r)window._cqupt_inner_user=i,s();else{var p=new XMLHttpRequest;p.open("GET","https://blues.congm.in/stu.php?searchKey="+parseInt(r),!0),p.onload=function(){if(p.status>=200&&p.status<400){var e=JSON.parse(p.responseText);1===e.total&&(window._cqupt_inner_user=t({},i,e.rows[0]),a.set("cqupt_inner",JSON.stringify(_cqupt_inner_user)),s())}else window._cqupt_inner_user={}},p.onerror=function(){window._cqupt_inner_user={}},p.send()}"jwzx.cqupt.congm.in"==location.hostname&&n({form:'form[action="login.php"]',btn:'input[src="syspic/go.gif"]',input:'input[name="id"]'}),location.hostname.indexOf("xk")!=-1&&n({form:"form#loginForm",btn:"button#submitButton",input:'input[name="id"]'})})}(),function(){var t=document.querySelector("#_cqupt-title"),e=document.querySelector("[data-target='#_cqupt-duosuo']"),s=document.querySelector("#_cqupt-duosuo"),a=document.querySelector("#_cqupt-side-box"),i=document.querySelectorAll("[data-toggle='sideTab']"),c=i.length,r=document.querySelectorAll("._cqupt-content-item"),o=r.length;a.addEventListener("click",function(t){if(t.target){var e="sideTab"==t.target.getAttribute("data-toggle")?t.target:t.target.parentNode;if("sideTab"==e.getAttribute("data-toggle")){for(var n=0;n<c;n++)i[n].classList.remove("_cqupt-active");for(var s=0;s<o;s++)r[s].classList.add("_cqupt-hidden");var u=e.getAttribute("data-target");"close"!=u?(e.classList.add("_cqupt-active"),a.classList.add("_cqupt-active"),document.querySelector(u).classList.remove("_cqupt-hidden")):a.classList.remove("_cqupt-active")}}}),t.onclick=function(){document.body.classList.remove("_cqupt-body"),a.classList.remove("_cqupt-active"),a.classList.add("_cqupt-close")},e.addEventListener("click",function(){var t=document.createElement("div");t.setAttribute("data-thread-key","1"),t.setAttribute("data-title","内网外入"),t.setAttribute("data-url","https://cqupt.congm.in"),DUOSHUO.EmbedThread(t);var e=s.querySelector("._cqupt-content-bd");e.replaceChild(t,e.lastElementChild)}),document.querySelector("._cqupt-nav-user-info-btn").addEventListener("click",function(){document.querySelector("._cqupt-nav-user-info").classList.remove("_cqupt-hidden"),document.querySelector("._cqupt-nav-user-pic").classList.add("_cqupt-hidden")}),document.querySelector("._cqupt-nav-user-pic-btn").addEventListener("click",function(){document.querySelector("._cqupt-nav-user-info").classList.add("_cqupt-hidden"),document.querySelector("._cqupt-nav-user-pic").classList.remove("_cqupt-hidden")}),function(t){for(var e="<tbody>",n=0;n<t.length;n++)e+="<tr>",e+="<td>"+t[n].user_id+"</td>",e+="<td>"+t[n].user_name+"</td>",e+="<td>"+t[n].time+"</td>",e+="<td>"+t[n].money+"</td>",e+="</tr>";e+="</tbody>",document.querySelector("._cqupt-donate-list").insertAdjacentHTML("afterbegin",e)}(n(5))}()},,,,function(t,e){},,,function(t,e,n){n(12),!function(){var t=document.createElement("script");t.src="//hm.baidu.com/hm.js?d57aa305b1d347caa2d89b63bdcd298c",self==top&&document.body.appendChild(t)}(),function(){var t=document.createElement("script");t.src="//congm.in/tongji/cqupt.congm.in.js",t.charset="utf-8",self==top&&document.body.appendChild(t)}(),function(){for(var t=document.getElementsByTagName("a"),e=0;e<t.length;e++){var n=t[e].href.split("/");if(n.length>2&&t[e].href.indexOf("//")!=-1&&n[2].indexOf("cqupt.congm.in")==-1&&n[2].indexOf("host.congm.in")==-1){if(n[2].indexOf(":")==-1)n[2]+=".cqupt.congm.in";else{var s=n[2].split(":");n[2]=s[0]+".cqupt.congm.in"}t[e].href=n.join("/")}}}(),function(){for(var t=document.getElementsByTagName("img"),e=0;e<t.length;e++){var n=t[e].src.split("/");if(n.length>2&&t[e].src.indexOf("//")!=-1&&n[2].indexOf("cqupt.congm.in")==-1&&n[2].indexOf("host.congm.in")==-1){if(n[2].indexOf(":")==-1)n[2]+=".cqupt.congm.in";else{var s=n[2].split(":");n[2]=s[0]+".cqupt.congm.in"}t[e].src=n.join("/")}}}(),function(){var t=document.createElement("link");t.rel="stylesheet",t.href="//cqupt.congm.in/common/main.css?"+(new Date).getTime(),self==top&&document.head.appendChild(t),t.onload=function(){var t=n(4);self==top&&(document.body.insertAdjacentHTML("beforeend",t),document.body.classList.add("_cqupt-body"),n(8))}}(),window.duoshuoQuery={short_name:"cqupt-inner"},function(){var t=document.createElement("script");t.src="//cqupt.congm.in/static/duosuo_embed.min.js",t.charset="utf-8",self==top&&document.body.appendChild(t)}()}]);