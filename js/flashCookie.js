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
        res = m.flashDom.read(key);
        return res;
    }catch(e){
        return e;
    }
};
a.flashCookie.setItem=function(key,value,name){
    var m = this,res;
    try{
        res = m.flashDom.write(key,value,name);
        return res;
    }catch(e){
        return e;
    }
};

})(window);