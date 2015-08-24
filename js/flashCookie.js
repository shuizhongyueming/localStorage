/**
 * @name flashCookie 通过flashCookie来实现本地存储的功能
 * @author wangxing
 * @last-modify:
 *  at 20131012 by wangxing: create file
 */
;(function(a){
a.flashCookie={};

a.flashCookie.flashDom=document.getElementById('J-localStorage-flash');

a.flashCookie.getItem=function(key){
    var m = this,res;
    try{
        res = m.flashDom.getItem(key);
        return res;
    }catch(e){
        return e;
    }
};

a.flashCookie.setItem=function(key,value){
    var m = this,res;
    try{
        res = m.flashDom.setItem(key,value);
        return res;
    }catch(e){
        return e;
    }
};

a.flashCookie.removeItem=function(key){
    var m = this,res;
    try{
        res = m.flashDom.removeItem(key);
        return res;
    }catch(e){
        return e;
    }
};

a.flashCookie.clear=function(){
    var m = this,res;
    try{
        res = m.flashDom.clear();
        return res;
    }catch(e){
        return e;
    }
};

a.flashCookie.key=function(index){
    var m = this,res;
    try{
        res = m.flashDom.key(index);
        return res;
    }catch(e){
        return e;
    }
};

})(window);