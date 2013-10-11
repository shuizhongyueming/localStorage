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
qike.localStorage.currDomain = location.protocol+'//'+location.hostname+(location.port&&':'+location.port);
qike.localStorage.getItem = function(key,domain,callback){
    var m = this,res;     
    if(m.isSupportLocalStorage){
        // 域名没设定或者与当前的相同
        if(!domain || domain===m.currDomain){
            res = localStorage.getItem(key);
            typeof callback === 'function' && callback();
            return res;
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
