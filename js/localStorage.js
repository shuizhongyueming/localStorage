window.qike = window.qike || {};
window.qike.localStorage = {};
window.qike.localStorage.isSupportLocalStorage=(function(){
    var m = this;
    try{
        return 'localStorage' in window && window['localStorage'] !== null;
    }catch(e){
        return false;
    }
})();
qike.localStorage.loadIframe=function(domain,callback){
    var m = this,d=document,iframe;
    m[domain]={};
    // 存储在加载过程中，收集到的操作请求，加载完成之后，遍历运行
    m[domain].actionArr=[];
    // isLoading  1 ==> 正在加载  2 ==> 加载完毕 undefined ==> 未加载
    m[domain].isLoading=1;
    iframe=d.createElement('iframe');
    iframe.width='0';
    iframe.height='0';
    iframe.frameborder='0';
    iframe.src=domain+'GitHub/localStorage/localStorage.html';
    m[domain].dom = iframe;
    d.getElementsByTagName('body')[0].appendChild(iframe);
    m[domain].dom.onload=function(e){

    };
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
            typeof callback === 'function' && callback();
            return res;
        }else{

            // 域名与当前的不相同
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
