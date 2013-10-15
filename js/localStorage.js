window.qike = window.qike || {};
window.qike.localStorage = {};
window.qike.localStorage.isIE = /*@cc_on !@*/false;
window.qike.localStorage.isSupportLocalStorage=(function(){
    var m = this;
    try{
        return 'localStorage' in window && window['localStorage'] !== null;
    }catch(e){
        return false;
    }
})();

// 跨域获取LocalStorage数据时，加载对应域名下的文件
qike.localStorage.loadIframe=function(domain,obj){
    var m = this,d=document,iframe;
    m[domain]={};
    // 存储在加载过程中，收集到的操作请求，加载完成之后，遍历运行
    // {
    //  action: getItem,
    //  key: 'test',
    //  value: null,
    //  index: null,
    //  callback: callback
    // }
    m[domain].actionArr=[];
    m[domain].actionArr.push(obj);
    // isLoading  1 ==> 正在加载  2 ==> 加载完毕 undefined ==> 未加载
    m[domain].isLoading=1;
    iframe=d.createElement('iframe');
    iframe.width='0';
    iframe.height='0';
    iframe.frameborder='0';
    iframe.src=domain+'localStorage.html';
    m[domain].dom = iframe;
    d.getElementsByTagName('body')[0].appendChild(iframe);
    
    if(window.addEventListener){
        iframe.addEventListener('load',function(e){
            callback();
        });
    }else{
        iframe.attachEvent('onload',function(){
            callback();
        });
    }

    // 在IFrame加载完成之后的遍历执行
    function callback(){
        var arr=m[domain].actionArr,
            len=arr.length,
            i=0,
            win,
            curr,res;

        // 标识IFrame加载完成
        m[domain].isLoading=2;

        // 存储在IFrame里面的localStorage 但凡使用IFrame的，必然是支持localStorage的场景
        iframeLocalStorage=m[domain].iframeLocalStorage=iframe.contentWindow.localStorage;

        for(i;i<len;i++){
            curr = arr[i];
            if(curr.action === 'getItem' || curr.action === 'removeItem'){
                res=iframeLocalStorage[curr.action](curr.key);
            }else if(curr.action === 'setItem'){
                res=iframeLocalStorage.key(curr.key,curr.value);
            }else if(curr.action === 'key'){
                res=iframeLocalStorage.key(curr.key);
            }else if(curr.action === 'clear'){
                res=iframeLocalStorage.clear();
            }
            typeof curr.callback === 'function' && curr.callback(res);
        }
    }
};

// 获取指定域名下的FlashCookie的数据时，需要加载对应域名下的Flash
qike.localStorage.loadFlash=function(domain,obj){
    var m = this,d=document,div,flash;
    m[domain]={};
    // 存储在加载过程中，收集到的操作请求，加载完成之后，遍历运行
    // {
    //  action: getItem,
    //  key: 'test',
    //  value: null,
    //  index: null,
    //  callback: callback
    // }
    m[domain].actionArr=[];
    m[domain].actionArr.push(obj);
    
    // isLoading  1 ==> 正在加载  2 ==> 加载完毕 undefined ==> 未加载
    m[domain].isLoading=1;
    
    div=d.createElement('div');
    div.style='display:none;';
    
    if(m.isIE){
        flash=
        '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">'+
            '<param name="movie" value="'+domain+'GitHub/localStorage/swf/saveLocalData20131015.swf" />'+
            '<param name="quality" value="high" />'+
            '<param name="bgcolor" value="#ffffff" />'+
            '<param name="allowScriptAccess" value="always" />'+
            '<param name="wmode" value="Transparent" />'+
        '</object>';
    }else{
        flash='<embed src="'+domain+'GitHub/localStorage/swf/saveLocalData20131015.swf" quality="high" bgcolor="#ffffff" width="740px" height="184px" align="middle" play="true" loop="false" wmode="Transparent" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer"></embed>';
    }

    div.innerHTML=flash;

    if(m.isIE){
        m[domain].dom = div.getElementsByTagName('object')[0];
    }else{
        m[domain].dom = div.getElementsByTagName('embed')[0];
    }

    d.getElementsByTagName('body')[0].appendChild(div);
    
    if(window.addEventListener){
        dom.addEventListener('load',function(e){
            callback();
        });
    }else{
        dom.attachEvent('onload',function(){
            callback();
        });
    }

    // 在IFrame加载完成之后的遍历执行
    function callback(){
        var arr=m[domain].actionArr,
            len=arr.length,
            i=0,
            win,
            curr,res;

        // 标识IFrame加载完成
        m[domain].isLoading=2;

        // 存储在IFrame里面的localStorage 但凡使用IFrame的，必然是支持localStorage的场景
        iframeLocalStorage=m[domain].iframeLocalStorage=iframe.contentWindow.localStorage;

        for(i;i<len;i++){
            curr = arr[i];
            if(curr.action === 'getItem' || curr.action === 'removeItem'){
                res=iframeLocalStorage[curr.action](curr.key);
            }else if(curr.action === 'key'){
                res=iframeLocalStorage.key(curr.key);
            }else if(curr.action === 'clear'){
                res=iframeLocalStorage.clear();
            }
            typeof curr.callback === 'function' && curr.callback(res);
        }
    }
};

qike.localStorage.currDomain = location.protocol+'//'+location.hostname+(location.port&&':'+location.port)+'/';

qike.localStorage.getItem = function(key,domain,callback){
    var m = this,res;
    
    // 格式化domain
    domain = m.formatDomain(domain);

    // 支持localStorage
    if(m.isSupportLocalStorage){
        if(domain===m.currDomain){
            
            // 域名与当前的相同
            res = localStorage.getItem(key);
            typeof callback === 'function' && callback(res);
            return res;
        }else{

            // 域名与当前的不相同
            if(m[domain] === undefined) m[domain]={};
            switch(m[domain].isLoading){
                case 1:
                    // 正在加载，则把操作放到队列中
                    m[domain].actionArr.push({action:'getItem',key:key,callback:callback});
                    return;
                case 2:
                    // 加载完毕，则直接操作
                    res=m[domain].iframeLocalStorage.getItem(key);
                    typeof callback === 'function' && callback(res);
                    return res;
                default:
                    m.loadIframe(domain,{action:'getItem',key:key,callback:callback});
                    return;
            }
        }
    }

    // 不支持localStorage，使用FlashCookie
    // 针对FlashCookie，不管任何域名都是需要加载对应域名下的swf文件
    if(!m.isSupportLocalStorage){
        
        if(m[domain] === undefined) m[domain]={};

        switch(m[domain].isLoading){
            case 1:
                // 正在加载，则把操作放到队列中
                m[domain].actionArr.push({action:'getItem',key:key,callback:callback});
                return;
            case 2:
                // 加载完毕，则直接操作
                res=m[domain].flashCookie.getItem(key);
                typeof callback === 'function' && callback(res);
                return res;
            default:
                m.loadFlash(domain,{action:'getItem',key:key,callback:callback});
                return;
        }
    }
};
qike.localStorage.setItem = function(key,value,domain,callback){
    var m = this,res;
    
    // 格式化domain
    domain = m.formatDomain(domain);

    // 支持localStorage
    if(m.isSupportLocalStorage){
        
        // 域名与当前的相同
        if(domain===m.currDomain){
            res  = localStorage.setItem(key,value);
            typeof callback === 'function' && callback();
            return res;
        }else{

            // 域名与当前的不相同
            if(m[domain] === undefined) m[domain]={};
            switch(m[domain].isLoading){
                case 1:
                    // 正在加载，则把操作放到队列中
                    m[domain].actionArr.push({action:'setItem',key:key,value:value,callback:callback});
                    return;
                case 2:
                    // 加载完毕，则直接操作
                    res=m[domain].iframeLocalStorage.setItem(key,value);
                    typeof callback === 'function' && callback(res);
                    return res;
                default:
                    m.loadIframe(domain,{action:'setItem',key:key,value:value,callback:callback});
                    return;
            }
        }
    }
};
qike.localStorage.removeItem = function(key,domain,callback){
    var m = this,res;

    // 格式化domain
    domain = m.formatDomain(domain);

    // 支持localStorage
    if(m.isSupportLocalStorage){
        // 域名没设定或者与当前的相同
        if(!domain || domain===m.currDomain){
            res = localStorage.removeItem(key);
            typeof callback === 'function' && callback();
            return res;
        }else{

            // 域名与当前的不相同
            if(m[domain] === undefined) m[domain]={};
            switch(m[domain].isLoading){
                case 1:
                    // 正在加载，则把操作放到队列中
                    m[domain].actionArr.push({action:'removeItem',key:key,callback:callback});
                    return;
                case 2:
                    // 加载完毕，则直接操作
                    res=m[domain].iframeLocalStorage.removeItem(key);
                    typeof callback === 'function' && callback(res);
                    return res;
                default:
                    m.loadIframe(domain,{action:'removeItem',key:key,callback:callback});
                    return;
            }
        }
    }
};
qike.localStorage.key=function(index,domain,callback){
    var m = this,res;

    // 格式化domain
    domain = m.formatDomain(domain);

    // 支持localStorage
    if(m.isSupportLocalStorage){
        // 域名没设定或者与当前的相同
        if(!domain || domain===m.currDomain){
            res = localStorage.key(index);
            typeof callback === 'function' && callback();
            return res;
        }else{

            // 域名与当前的不相同
            if(m[domain] === undefined) m[domain]={};
            switch(m[domain].isLoading){
                case 1:
                    // 正在加载，则把操作放到队列中
                    m[domain].actionArr.push({action:'key',index:index,callback:callback});
                    return;
                case 2:
                    // 加载完毕，则直接操作
                    res=m[domain].iframeLocalStorage.key(index);
                    typeof callback === 'function' && callback(res);
                    return res;
                default:
                    m.loadIframe(domain,{action:'key',index:index,callback:callback});
                    return;
            }
        }
    }
};
qike.localStorage.clear=function(domain,callback){
    var m = this,res;

    // 格式化domain
    domain = m.formatDomain(domain);

    // 支持localStorage
    if(m.isSupportLocalStorage){
        // 域名没设定或者与当前的相同
        if(!domain || domain===m.currDomain){
            res = localStorage.clear();
            typeof callback === 'function' && callback();
            return res;
        }else{

            // 域名与当前的不相同
            if(m[domain] === undefined) m[domain]={};

            switch(m[domain].isLoading){
                case 1:
                    // 正在加载，则把操作放到队列中
                    m[domain].actionArr.push({action:'clear',callback:callback});
                    return;
                case 2:
                    // 加载完毕，则直接操作
                    res=m[domain].iframeLocalStorage.clear();
                    typeof callback === 'function' && callback(res);
                    return res;
                default:
                    m.loadIframe(domain,{action:'clear',callback:callback});
                    return;
            }

        }
    }
};

// 按照规则格式化传进来的域名
qike.localStorage.formatDomain=function(domain){
    var m = this;
    
    // 如果domain没设定，使用默认的
    if(!domain){
        domain = m.currDomain;
    }

    // domain不包含http(s)的字符，则强制给加上http://
    if(!domain.match(/https?/)){
        domain = 'http://'+domain;
    }
    
    // 如果domain在最后没有加/，则强制加上
    if(!domain.match(/\/$/)){
        domain = domain+'/';
    }

    return domain;
}
