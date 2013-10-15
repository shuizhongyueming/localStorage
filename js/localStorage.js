window.qike = window.qike || {};
window.qike.localStorage = {};
window.qike.isIE = /*@cc_on !@*/false;
window.qike.localStorage.isSupportLocalStorage=(function(){
    var m = this;
    try{
        return 'localStorage' in window && window['localStorage'] !== null;
    }catch(e){
        return false;
    }
})();
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
    iframe.src=domain+'GitHub/localStorage/localStorage.html';
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
                    break;
                case 2:
                    // 加载完毕，则直接操作
                    res=m[domain].iframeLocalStorage.getItem(key);
                    typeof callback === 'function' && callback(res);
                    return res;
                default:
                    m.loadIframe(domain,{action:'getItem',key:key,callback:callback});
            }
        }
    }
};
qike.localStorage.setItem = function(key,value,domain,callback){
    var m = this,res;
    if(m.isSupportLocalStorage){
        // 
        if(!domain || domain===m.currDomain){
            res  = localStorage.setItem(key,value);
            typeof callback === 'function' && callback();
            return res;
        }
    }
};
qike.localStorage.removeItem = function(key,domain,callback){
    var m = this,res;
    if(m.isSupportLocalStorage){
        // 域名没设定或者与当前的相同
        if(!domain || domain===m.currDomain){
            res = localStorage.removeItem(key);
            typeof callback === 'function' && callback();
            return res;
        }
    }
};
qike.localStorage.key=function(index,domain,callback){
    var m = this,res;
    if(m.isSupportLocalStorage){
        // 域名没设定或者与当前的相同
        if(!domain || domain===m.currDomain){
            res = localStorage.key(index);
            typeof callback === 'function' && callback();
            return res;
        }
    }
};
qike.localStorage.clear=function(domain,callback){
    var m = this,res;
    if(m.isSupportLocalStorage){
        // 域名没设定或者与当前的相同
        if(!domain || domain===m.currDomain){
            res = localStorage.clear();
            typeof callback === 'function' && callback();
            return res;
        }
    }
};
