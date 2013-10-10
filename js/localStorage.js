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
qike.localStorage.currDomain=location.protocol+'//'+location.hostname+(location.port&&':'+location.port);
qike.localStorage.getItem = function(key,domain,callback){
    var m = this,res;     
    if(m.isSupportLocalStorage){
        // √¥µ”√ª’”√”µ«“÷µ ∫£÷Ωª»
        if(!domain || domain===m.currDomain){
            res = localStorage.getItem(key);
            typeof callback === 'function' && callback();
            return res;
	}
    }												    };
qike.localStorage.setItem = function(key,value,domain,callback){
    var m = this,res;
    if(m.isSupportLocalStorage){
    	// 
        if(!domain || domain===m.currDomain){
	    res  = localStorage.setItem(key);
	    typeof callback === 'function' && callback();
	    return res;
	}
    }
};
qike.localStorage.removeItem = function(key,domain,callback){
    var m = this,res;     
    if(m.isSupportLocalStorage){
        // √¥µ”√ª’”√”µ«“÷µ ∫£÷Ωª»
        if(!domain || domain===m.currDomain){
            res = localStorage.removeItem(key);
            typeof callback === 'function' && callback();
            return res;
	}
    }												    };
qike.localStorage.key=function(index,domain,callback){};
qike.localStorage.clear=function(domain,callback){};
