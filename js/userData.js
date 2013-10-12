/**
 * @name userData 实现在IE6，7中的本地存储功能
 * @author wangxing
 * @last-modify:
 *  at 20131011 by wangxing: create file
 */


;(function(){
var localData = window.localData = {};
localData.hname = location.hostname?location.hostname:'localStatus';
try{
    localData.dataDom = document.createElement('input');//这里使用hidden的input元素
    localData.dataDom.type = 'hidden';
    localData.dataDom.style.display = "none";
    localData.dataDom.addBehavior('#default#userData');//这是userData的语法
    document.body.appendChild(localData.dataDom);
    var exDate = new Date();
    exDate.setDate(exDate.getDate()+30);
    localData.dataDom.expires = exDate.toUTCString();//设定过期时间
}catch(ex){
 localData.dataDom=null;
}

localData.setItem = function(key,value){
    var m = this,res;
    m.dataDom.load(m.hname);
    res = m.dataDom.setAttribute(key,value);
    m.dataDom.save(m.hname);
    return res;
};
localData.getItem = function(key){
    var m = this,res;
    m.dataDom.load(m.hname);
    res = m.dataDom.getAttribute(key);
    return res;
};
localData.removeItem = function(key){
    var m = this,res;
    m.dataDom.load(m.hname);
    res = m.dataDom.removeAttribute(key);
    m.dataDom.save(m.hname);
    return res;
};

})();


