ndow.qike = window.qike || {};
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
        // ô��û���ӵ��ֵʺ�ֽ��
        if(!domain || domain===m.currDomain){
            res = localStorage.getItem(key);
            typeof callback === 'function' && callback();
            return res;
	}
    }												    };
