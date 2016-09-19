!function(t){function e(i){if(n[i])return n[i].exports;var s=n[i]={exports:{},id:i,loaded:!1};return t[i].call(s.exports,s,s.exports,e),s.loaded=!0,s.exports}var n={};return e.m=t,e.c=n,e.p="static/",e(0)}([function(t,e,n){t.exports=n(15)},function(t,e,n){!function(n){function i(t,e){e=e||{},this._id=i._generateUUID(),this._promise=e.promise||Promise,this._frameId=e.frameId||"CrossStorageClient-"+this._id,this._origin=i._getOrigin(t),this._requests={},this._connected=!1,this._closed=!1,this._count=0,this._timeout=e.timeout||5e3,this._listener=null,this._installListener();var n;e.frameId&&(n=document.getElementById(e.frameId)),n&&this._poll(),n=n||this._createFrame(t),this._hub=n.contentWindow}i.frameStyle={display:"none",position:"absolute",top:"-999px",left:"-999px"},i._getOrigin=function(t){var e,n,i;return e=document.createElement("a"),e.href=t,e.host||(e=window.location),n=e.protocol&&":"!==e.protocol?e.protocol:window.location.protocol,i=n+"//"+e.host,i=i.replace(/:80$|:443$/,"")},i._generateUUID=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=16*Math.random()|0,n="x"==t?e:3&e|8;return n.toString(16)})},i.prototype.onConnect=function(){var t=this;return this._connected?this._promise.resolve():this._closed?this._promise.reject(new Error("CrossStorageClient has closed")):(this._requests.connect||(this._requests.connect=[]),new this._promise(function(e,n){var i=setTimeout(function(){n(new Error("CrossStorageClient could not connect"))},t._timeout);t._requests.connect.push(function(t){return clearTimeout(i),t?n(t):void e()})}))},i.prototype.set=function(t,e){return this._request("set",{key:t,value:e})},i.prototype.get=function(t){var e=Array.prototype.slice.call(arguments);return this._request("get",{keys:e})},i.prototype.del=function(){var t=Array.prototype.slice.call(arguments);return this._request("del",{keys:t})},i.prototype.clear=function(){return this._request("clear")},i.prototype.getKeys=function(){return this._request("getKeys")},i.prototype.close=function(){var t=document.getElementById(this._frameId);t&&t.parentNode.removeChild(t),window.removeEventListener?window.removeEventListener("message",this._listener,!1):window.detachEvent("onmessage",this._listener),this._connected=!1,this._closed=!0},i.prototype._installListener=function(){var t=this;this._listener=function(e){var n,i,s,r;if(!t._closed&&e.data&&"string"==typeof e.data&&(i="null"===e.origin?"file://":e.origin,i===t._origin))if("cross-storage:unavailable"!==e.data){if(e.data.indexOf("cross-storage:")!==-1&&!t._connected){if(t._connected=!0,!t._requests.connect)return;for(n=0;n<t._requests.connect.length;n++)t._requests.connect[n](s);delete t._requests.connect}if("cross-storage:ready"!==e.data){try{r=JSON.parse(e.data)}catch(o){return}r.id&&t._requests[r.id]&&t._requests[r.id](r.error,r.result)}}else{if(t._closed||t.close(),!t._requests.connect)return;for(s=new Error("Closing client. Could not access localStorage in hub."),n=0;n<t._requests.connect.length;n++)t._requests.connect[n](s)}},window.addEventListener?window.addEventListener("message",this._listener,!1):window.attachEvent("onmessage",this._listener)},i.prototype._poll=function(){var t,e,n;t=this,n="file://"===t._origin?"*":t._origin,e=setInterval(function(){return t._connected?clearInterval(e):void(t._hub&&t._hub.postMessage("cross-storage:poll",n))},1e3)},i.prototype._createFrame=function(t){var e,n;e=window.document.createElement("iframe"),e.id=this._frameId;for(n in i.frameStyle)i.frameStyle.hasOwnProperty(n)&&(e.style[n]=i.frameStyle[n]);return window.document.body.appendChild(e),e.src=t,e},i.prototype._request=function(t,e){var n,i;return this._closed?this._promise.reject(new Error("CrossStorageClient has closed")):(i=this,i._count++,n={id:this._id+":"+i._count,method:"cross-storage:"+t,params:e},new this._promise(function(t,e){var s,r,o;s=setTimeout(function(){i._requests[n.id]&&(delete i._requests[n.id],e(new Error("Timeout: could not perform "+n.method)))},i._timeout),i._requests[n.id]=function(r,o){return clearTimeout(s),delete i._requests[n.id],r?e(new Error(r)):void t(o)},Array.prototype.toJSON&&(r=Array.prototype.toJSON,Array.prototype.toJSON=null),o="file://"===i._origin?"*":i._origin,i._hub.postMessage(JSON.stringify(n),o),r&&(Array.prototype.toJSON=r)}))},"undefined"!=typeof t&&t.exports?t.exports=i:e.CrossStorageClient=i}(this)},function(t,e,n){!function(n){var i={};i.init=function(t){var e=!0;try{window.localStorage||(e=!1)}catch(n){e=!1}if(!e)try{return window.parent.postMessage("cross-storage:unavailable","*")}catch(n){return}i._permissions=t||[],i._installListener(),window.parent.postMessage("cross-storage:ready","*")},i._installListener=function(){var t=i._listener;window.addEventListener?window.addEventListener("message",t,!1):window.attachEvent("onmessage",t)},i._listener=function(t){var e,n,s,r,o,a,c;if(e="null"===t.origin?"file://":t.origin,"cross-storage:poll"===t.data)return window.parent.postMessage("cross-storage:ready",t.origin);if("cross-storage:ready"!==t.data){try{s=JSON.parse(t.data)}catch(d){return}if(s&&"string"==typeof s.method&&(r=s.method.split("cross-storage:")[1])){if(i._permitted(e,r))try{a=i["_"+r](s.params)}catch(d){o=d.message}else o="Invalid permissions for "+r;c=JSON.stringify({id:s.id,error:o,result:a}),n="file://"===e?"*":e,window.parent.postMessage(c,n)}}},i._permitted=function(t,e){var n,s,r,o;if(n=["get","set","del","clear","getKeys"],!i._inArray(e,n))return!1;for(s=0;s<i._permissions.length;s++)if(r=i._permissions[s],r.origin instanceof RegExp&&r.allow instanceof Array&&(o=r.origin.test(t),o&&i._inArray(e,r.allow)))return!0;return!1},i._set=function(t){window.localStorage.setItem(t.key,t.value)},i._get=function(t){var e,n,i,s;for(e=window.localStorage,n=[],i=0;i<t.keys.length;i++){try{s=e.getItem(t.keys[i])}catch(r){s=null}n.push(s)}return n.length>1?n:n[0]},i._del=function(t){for(var e=0;e<t.keys.length;e++)window.localStorage.removeItem(t.keys[e])},i._clear=function(){window.localStorage.clear()},i._getKeys=function(t){var e,n,i;for(i=[],n=window.localStorage.length,e=0;e<n;e++)i.push(window.localStorage.key(e));return i},i._inArray=function(t,e){for(var n=0;n<e.length;n++)if(t===e[n])return!0;return!1},i._now=function(){return"function"==typeof Date.now?Date.now():(new Date).getTime()},"undefined"!=typeof t&&t.exports?t.exports=i:e.CrossStorageHub=i}(this)},function(t,e,n){t.exports={CrossStorageClient:n(1),CrossStorageHub:n(2)}},function(t,e,n){t.exports='<!--[if IE]><p class="kill-ie">微软都放弃了IE，为啥你却还不放弃？</p><![endif]--> <div id=_cqupt-side-box> <div class=_cqupt-side-bar> <div class=_cqupt-side-bar-item id=_cqupt-title> <a href=javascript:void(0);><i>×</i> 内网外入</a> <span class=_cqupt-side-bar-tip>隐藏</span> </div> <div class=_cqupt-side-bar-top> <div class=_cqupt-side-bar-item> <a href=//cqupt.congm.in> <span class=_cqupt-iconfont>&#xe601;</span> <span class=_cqupt-side-bar-tip>主页</span> </a> </div> <div class=_cqupt-side-bar-item data-toggle=sideTab data-target=#_cqupt-user-info> <span class=_cqupt-iconfont>&#xe602;</span> <span class=_cqupt-side-bar-tip id=_cqupt-user-name>个人中心</span> </div> </div> <div class=_cqupt-side-bar-bottom> <div class=_cqupt-side-bar-item data-toggle=sideTab data-target=#_cqupt-duosuo> <span class=_cqupt-iconfont>&#xe600;</span> <span class=_cqupt-side-bar-tip>评论</span> </div> <div class=_cqupt-side-bar-item data-toggle=sideTab data-target=#_cqupt-donate> <span class=_cqupt-iconfont>&#xe603;</span> <span class=_cqupt-side-bar-tip>捐助</span> </div> <div class=_cqupt-side-bar-item data-toggle=sideTab data-target=#_cqupt-info> <span class=_cqupt-iconfont>&#xe604;</span> <span class=_cqupt-side-bar-tip>关于</span> </div> <div class=_cqupt-side-bar-item> <a href="http://jq.qq.com/?_wv=1027&k=2EgWhWy" target=_blank> <span class=_cqupt-iconfont>&#xe605;</span> <span class=_cqupt-side-bar-tip>内网外入交流群：312784909</span> </a> </div> </div> </div> <header class=_cqupt-header> <div id=_cqupt-header-close data-toggle=sideTab data-target=close><img src='+n(6)+'></div> </header> <div class=_cqupt-content> <div class="_cqupt-content-item _cqupt-hidden" id=_cqupt-user-info> <div class=_cqupt-content-hd>个人中心</div> <div class=_cqupt-content-bd> <p>【开发中，敬请期待】</p> <small id=_cqupt-user-id></small> </div> </div> <div class="_cqupt-content-item _cqupt-hidden" id=_cqupt-duosuo> <div class=_cqupt-content-hd>评论</div> <div class=_cqupt-content-bd> <div class="ds-share flat" data-thread-key=1 data-title="内网外入 - CQUPT" data-content=一站解决外网访问教务在线等内网所有网页！ data-url=https://cqupt.congm.in> <div class=ds-share-inline> <ul class=ds-share-icons-16> <li data-toggle=ds-share-icons-more><a class=ds-more href=javascript:void(0);>分享:</a></li> <li><a class=ds-weibo href=javascript:void(0); data-service=weibo>微博</a></li> <li><a class=ds-wechat href=javascript:void(0); data-service=wechat>微信</a></li> <li><a class=ds-qq href=javascript:void(0); data-service=qq>QQ</a></li> <li><a class=ds-qzone href=javascript:void(0); data-service=qzone>空间</a></li> </ul> <div class=ds-share-icons-more></div> </div> </div> <span class=_cqupt-loading>正在加载中...</span> </div> </div> <div class="_cqupt-content-item _cqupt-hidden" id=_cqupt-donate> <div class=_cqupt-content-hd>捐助</div> <div class=_cqupt-content-bd> <h3><span class="_cqupt-label _cqupt-label-o">内网外入</span> (cqupt.congm.in) 是一个免费的系统，但是内网外入服务器搭建于我的旧电脑之上，每月需要宽带网络和运营维护的成本。</h3> <p>如果您觉得内网外入极大方便您的日常使用，您可以自愿选择通过捐赠来促进内网外入的健康维护和发展，内网外入也需要大家的点滴支持。</p> <p class=_cqupt-small>支付宝帐号：i@congm.in / 这是昵称 (闵聪)</p> <img src=//cqupt.congm.in/src/img/alipay.png class=_cqupt-donate-img> <h2>捐助人列表 <small class=_cqupt-small>(每日更新)</small></h2> <table class=_cqupt-donate-list> <thead> <tr> <th>账户</th><th>用户名</th><th>时间</th><th>金额</th> </tr> </thead> </table> </div> </div> <div class="_cqupt-content-item _cqupt-hidden" id=_cqupt-info> <div class=_cqupt-content-hd>关于</div> <div class=_cqupt-content-bd> <h2>内网外入 (cqupt.congm.in) </h2> <h3><span class="_cqupt-label _cqupt-label-sm">个人项目</span> <span class="_cqupt-label _cqupt-label-sm">非官方项目</span></h3> <p>内网外入诞生于2015年9月，该系统利用nginx服务器反向代理的原理，解决了同学通过外网无法访问内网的问题。该系统在保证内网安全的前提下，可以随时随地进入内网查询自己的个人课表、考试安排、期末成绩，进行选课等，极大方便同学们的日常使用。网页上线一年PV总访问量超过100万多次，PV单日峰值达5万多次，UV独立访客日均约1200人，UV日峰值超1万人。</p> <div class=_cqupt-info-list> <p>官网：<a href=//cqupt.congm.in target=_blank>cqupt.congm.in</a></p> <p>Github：<a href=https://github.com/mcc108/cqupt.congm.in target=_blank>github.com/mcc108/cqupt.congm.in</a></p> <p>交流群：<a href="http://jq.qq.com/?_wv=1027&k=2EgWhWy" target=_blank>312784909</a></p> <p>博文：<a href=//i.congm.in/cqupt-inner target=_blank>i.congm.in/cqupt-inner</a></p> <p>统计：<a href="http://new.cnzz.com/v1/login.php?siteid=1257517721" target=_blank>CNZZ统计</a></p> <p>作者：<a href=//congm.in target=_blank>@ Cong Min</a></p> </div> </div> </div> </div> </div>'},function(t,e){t.exports=[{user_id:"kin***@qq.com",user_name:"kindvin",time:"2016-09-13",money:5},{user_id:"188***1285",user_name:"LoveYourLove",time:"2016-09-13",money:5},{user_id:"188***4404",user_name:"秋健",time:"2016-09-13",money:8},{user_id:"183***1479",user_name:"Aven",time:"2016-09-12",money:1},{user_id:"734***@qq.com",user_name:"JohnZhu1997",time:"2016-09-11",money:5},{user_id:"188***1305",user_name:"权奥",time:"2016-09-11",money:5},{user_id:"156***4460",user_name:"Hypernova",time:"2016-09-09",money:5},{user_id:"109***@qq.com",user_name:"铮",time:"2016-09-08",money:10},{user_id:"181***6814",user_name:"文慧~",time:"2016-09-07",money:1}]},function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAflBMVEVHcEw4ODg1NTUvLy8xMTEzMzMwMDAzMzM2NjYyMjIzMzMxMTEzMzMyMjIzMzMyMjIyMjIzMzMzMzMyMjI1NTUyMjIzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMyMjIzMzMzMzMyMjIzMzMzMzMzMzM6zPdjAAAAKXRSTlMAEhMbJNIV2xzjGRoUztrZz9HQ2BjT1zsjvdy3zUWupJTHMrCWnpypuWzxzngAAAE+SURBVFjD7dVbU8IwEIbh0CqtKKJgOQkqHoD8/z9ISGMG6Gaz3+qVY+52Ou8zbTptjPkja93sarSZfwxncVhZW4HC1Y21izi9WlQ49vYtjk9TUPD9sGe0QqcHBaJ3wkQskL0xA6mQ6MWC7x961CWRwPQige2dMMoImT4rtH3B3SIr+H5c8Jt0mxZEPSMI+6Qg7p1wTwhATwq+fyykn2tHAPuO0PZ3yC+rPBUU/Zmg6p1QBcH313AfBXUfhKW+D8IPemPq5bFv+uoz0z8/fOpd9nrB902lFtr316+1QujdTuqE2CuFk14lnPUK4aKHhU4PCkQPCWQPCIleLCR7ocD0IoHtBUKmzwrZPiMIelYQ9Ywg7JOCuE8IQE8KUE8Ic6z/Fso4v4B9EL7iuEH7VniO02zxCZ9/5Xb/bv7Xr6wDN1lBlbRjKkIAAAAASUVORK5CYII="},,function(t,e,n){function i(){_cqupt_inner_user.xh&&(document.querySelector("#_cqupt-user-id").innerHTML="同学！我猜你是 "+_cqupt_inner_user.xm+"。")}!function(){var t=n(3).CrossStorageClient,e=new t("https://cqupt.congm.in/common/storage-iframe.html");e.onConnect().then(function(){return e.get("cqupt_inner")}).then(function(t){function n(t){var n=document.querySelector(t.form);n&&n.querySelector(t.btn).addEventListener("click",function(){var i=n.querySelector(t.input).value;i.trim()&&(s.xh_list||(s.xh_list={}),s.xh_list[i]?s.xh_list[i]+=1:s.xh_list[i]=1,e.set("cqupt_inner",JSON.stringify(s)))})}var s={};t||e.set("cqupt_inner",JSON.stringify({}));try{s=JSON.parse(t)}catch(r){e.set("cqupt_inner",JSON.stringify({})),s={}}var o=0,a=3;if(s.xh_list){var c=s.xh_list;for(var d in c)c.hasOwnProperty(d)&&c[d]>=a&&(o=d,a=c[d])}if(parseInt(o)){var u=new XMLHttpRequest;u.open("GET","https://blues.congm.in/stu.php?searchKey="+parseInt(o),!0),u.onload=function(){if(u.status>=200&&u.status<400){var t=JSON.parse(u.responseText);1===t.total&&(window._cqupt_inner_user=t.rows[0],i())}},u.send()}"jwzx.cqupt.congm.in"==location.hostname&&n({form:'form[action="login.php"]',btn:'input[src="syspic/go.gif"]',input:'input[name="id"]'}),location.hostname.indexOf("xk")!=-1&&n({form:"form#loginForm",btn:"button#submitButton",input:'input[name="id"]'})})}(),function(){var t=document.querySelector("#_cqupt-title"),e=document.querySelector("[data-target='#_cqupt-duosuo']"),i=document.querySelector("#_cqupt-duosuo"),s=document.querySelector("#_cqupt-side-box"),r=document.querySelectorAll("[data-toggle='sideTab']"),o=r.length,a=document.querySelectorAll("._cqupt-content-item"),c=a.length;s.addEventListener("click",function(t){if(t.target){var e="sideTab"==t.target.getAttribute("data-toggle")?t.target:t.target.parentNode;if("sideTab"==e.getAttribute("data-toggle")){for(var n=0;n<o;n++)r[n].classList.remove("_cqupt-active");for(var i=0;i<c;i++)a[i].classList.add("_cqupt-hidden");var d=e.getAttribute("data-target");"close"!=d?(e.classList.add("_cqupt-active"),s.classList.add("_cqupt-active"),document.querySelector(d).classList.remove("_cqupt-hidden")):s.classList.remove("_cqupt-active")}}}),t.onclick=function(){document.body.classList.remove("_cqupt-body"),s.classList.remove("_cqupt-active"),s.classList.add("_cqupt-close")},e.addEventListener("click",function(){var t=document.createElement("div");t.setAttribute("data-thread-key","1"),t.setAttribute("data-title","内网外入"),t.setAttribute("data-url","https://cqupt.congm.in"),DUOSHUO.EmbedThread(t);var e=i.querySelector("._cqupt-content-bd");e.replaceChild(t,e.lastElementChild)}),function(t){for(var e="<tbody>",n=0;n<t.length;n++)e+="<tr>",e+="<td>"+t[n].user_id+"</td>",e+="<td>"+t[n].user_name+"</td>",e+="<td>"+t[n].time+"</td>",e+="<td>"+t[n].money+"</td>",e+="</tr>";e+="</tbody>",document.querySelector("._cqupt-donate-list").insertAdjacentHTML("afterbegin",e)}(n(5))}()},,,function(t,e){},,,,function(t,e,n){n(11),!function(){var t=document.createElement("script");t.src="//hm.baidu.com/hm.js?d57aa305b1d347caa2d89b63bdcd298c",self==top&&document.body.appendChild(t)}(),function(){var t=document.createElement("script");t.src="//congm.in/tongji/cqupt.congm.in.js",t.charset="utf-8",self==top&&document.body.appendChild(t)}(),function(){var t=document.createElement("link");t.rel="stylesheet",t.href="//cqupt.congm.in/common/main.css?"+(new Date).getTime(),self==top&&document.head.appendChild(t),t.onload=function(){var t=n(4);self==top&&(document.body.insertAdjacentHTML("afterbegin",t),document.body.classList.add("_cqupt-body"),n(8))}}(),window.duoshuoQuery={short_name:"cqupt-inner"},function(){var t=document.createElement("script");t.src="//cqupt.congm.in/static/duosuo_embed.min.js",t.charset="utf-8",self==top&&document.body.appendChild(t)}(),function(){for(var t=document.getElementsByTagName("a"),e=0;e<t.length;e++){var n=t[e].href.split("/");if(n.length>2&&t[e].href.indexOf("//")!=-1&&n[2].indexOf("cqupt.congm.in")==-1){if(n[2].indexOf(":")==-1)n[2]+=".cqupt.congm.in";else{var i=n[2].split(":");n[2]=i[0]+".cqupt.congm.in:"+i[1]}t[e].href=n.join("/")}}}(),function(){for(var t=document.getElementsByTagName("img"),e=0;e<t.length;e++){var n=t[e].src.split("/");if(n.length>2&&t[e].src.indexOf("//")!=-1&&n[2].indexOf("cqupt.congm.in")==-1){if(n[2].indexOf(":")==-1)n[2]+=".cqupt.congm.in";else{var i=n[2].split(":");n[2]=i[0]+".cqupt.congm.in:"+i[1]}t[e].src=n.join("/")}}}()}]);