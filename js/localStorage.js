(function(require){
    lcStorage = window.lcStorage = {};

    // domain+baseHtmlUrl ==> 跨域文件的地址
    lcStorage.baseHtmlUrl='localStorage.html';

    // domain+baseFlashUrl ==> Flash的地址
    lcStorage.baseFlashUrl='localStorage.swf';

    lcStorage.isSupportLocalStorage=(function(){
        var m = this;
        try{
            return 'localStorage' in window && window['localStorage'] !== null;
        }catch(e){
            return false;
        }
    })();

    // 跨域获取LocalStorage数据时，加载对应域名下的文件
    lcStorage.loadIframe=function(domain,obj){
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
        iframe.frameBorder='0';
        iframe.src=domain+m.baseHtmlUrl;
        iframe.style.display='none';
        m[domain].dom = iframe;
        d.getElementsByTagName('body')[0].appendChild(iframe);

        // 支持localStorage的时候，是由iframe的onload事件来知晓是否加载完毕。
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
            var iframeLocalStorage=m[domain].iframeLocalStorage=iframe.contentWindow.localStorage;

            for(i;i<len;i++){
                curr = arr[i];
                if(curr.action === 'getItem'){
                    res=iframeLocalStorage[curr.action](curr.key);

                    // 在chrome和Firefox下，获取的key不存在返回null，其他返回undefined。统一为null
                    if(res==null){res=null}
                }else if(curr.action === 'removeItem'){
                    res=iframeLocalStorage[curr.action](curr.key);
                }
                else if(curr.action === 'setItem'){
                    res=iframeLocalStorage.key(curr.key,curr.value);
                }else if(curr.action === 'key'){
                    res=iframeLocalStorage.key(curr.key);
                }else if(curr.action === 'clear'){
                    res=iframeLocalStorage.clear();
                }
                typeof curr.callback === 'function' && curr.callback(res,curr);
            }
        }
    };


    // 获取指定域名下的FlashCookie的数据时，需要加载对应域名下的Flash
    lcStorage.loadFlash=function(domain,obj){
        var m = this,
            d=document,
            div,
            flash,
            swfName,
            flashvars;


        m[domain]={};

        m[domain].actionArr=[];
        m[domain].actionArr.push(obj);

        // isLoading  1 ==> 正在加载  2 ==> 加载完毕 undefined ==> 未加载
        m[domain].isLoading=1;


        div=d.createElement('div');
        d.body.appendChild(div);



        div.style.position = 'absolute';
        div.style.top = '-2000px';
        div.style.left = '-2000px';




        swfName = 'SwfStore_'+(new Date().valueOf());
        flashvars = 'domain='+domain+'&amp;'+'callback=lcStorage.flashCallback';
        swfUrl = domain+m.baseFlashUrl;


        div.innerHTML = '<object height="100" width="500" codebase="https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' +
                            swfName + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">' +
                            '        <param value="' + swfUrl + '" name="movie">' +
                            '        <param value="' + flashvars + '" name="FlashVars">' +
                            '        <param value="always" name="allowScriptAccess">' +
                            '        <embed height="375" align="middle" width="500" pluginspage="https://www.macromedia.com/go/getflashplayer" ' +
                            'flashvars="' + flashvars + '" type="application/x-shockwave-flash" allowscriptaccess="always" quality="high" loop="false" play="true" ' +
                            'name="' + swfName + '" bgcolor="#ffffff" src="' + swfUrl + '">' +
                            '</object>';


        m[domain].swf = document[swfName] || window[swfName];

    };

    lcStorage.flashCallback=function(domain){
        // alert('aa')
        var m = this,
            arr=m[domain].actionArr,
            len,
            i=0,
            win,
            curr,
            res,
            flashLocalStorage;


        // 用setTimeout，是为了能够让次回调延缓执行。
        // 在IE6(目前遇到的，IE7未测试)下，flash放到页面中之后
        // flashCallback的执行会先于m[domain].swf的定义
        // 这样的话，flashCallback里面的方法调用就会失效
        setTimeout(function(){
            len=arr.length;
            // 标识IFrame加载完成
            m[domain].isLoading=2;

            // 存储在IFrame里面的localStorage 但凡使用IFrame的，必然是支持localStorage的场景
            flashLocalStorage=m[domain].swf;

            // There is a bug in flash player where if no values have been saved and the page is
            // then refreshed, the flashcookie gets deleted - even if another tab *had* saved a
            // value to the flashcookie.
            // So to fix, we immediately save something
            flashLocalStorage.setItem('__flashBugFix','1');

            for(i;i<len;i++){
                curr = arr[i];
                if(curr.action === 'getItem'){
                    res=flashLocalStorage.getItem(curr.key);
                }else if(curr.action === 'setItem'){
                    res=flashLocalStorage.setItem(curr.key,curr.value);
                }else if(curr.action === 'removeItem'){
                    res=flashLocalStorage.removeItem(curr.key);
                }else if(curr.action === 'key'){
                    res=flashLocalStorage.key(curr.index);
                }else if(curr.action === 'clear'){
                    res=flashLocalStorage.clear();
                }
                typeof curr.callback === 'function' && curr.callback(res,curr);
            }
        },1);
    }

    lcStorage.currDomain = location.protocol+'//'+location.hostname+(location.port&&':'+location.port)+'/';

    /**
     * 实现级接口
     * @param  {[object]} obj {action: 'getItem',key:'key',value:'value',index:'index',callback:'cbk'}
     */
    lcStorage.commonAction = function(obj){
        var m = this,res,args,domain;

        switch(obj.action){
            case 'getItem': args=[obj.key];break;
            case 'setItem': args=[obj.key,obj.value];break;
            case 'removeItem': args=[obj.key];break;
            case 'key': args=[obj.index];break;
            case 'clear': args=[];break;
        }


        // 格式化domain
        domain = m.formatDomain(obj.domain);

        // 支持localStorage
        if(m.isSupportLocalStorage){

            if(domain===m.currDomain){

                // 域名与当前的相同
                res = window.localStorage[obj.action].apply(window.localStorage,args);
                typeof obj.callback === 'function' && obj.callback.call(window,res,obj);
                return res;
            }else{

                // 域名与当前的不相同
                if(m[domain] === undefined) m[domain]={};
                switch(m[domain].isLoading){
                    case 1:
                        // 正在加载，则把操作放到队列中
                        m[domain].actionArr.push(obj);
                        return;
                    case 2:
                        // 加载完毕，则直接操作
                        res=m[domain].iframeLocalStorage[obj.action].apply(m[domain].iframeLocalStorage,args);
                        typeof obj.callback === 'function' && obj.callback.call(window,res,obj);
                        return res;
                    default:
                        m.loadIframe(domain,obj);
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
                    m[domain].actionArr.push(obj);
                    return;
                case 2:
                    // 加载完毕，则直接操作
                    res=m[domain].swf[obj.action].apply(m[domain].swf,args);;
                    typeof obj.callback === 'function' && obj.callback.call(window,res,obj);
                    return res;
                default:
                    m.loadFlash(domain,obj);
                    return;
            }
        }
    };
    lcStorage.getItem = function(key,domain,callback){
        var m = this;
        m.commonAction({action:'getItem',key:key,domain:domain,callback:callback});
    };
    lcStorage.setItem = function(key,value,domain,callback){
        var m = this;
        m.commonAction({action:'setItem',key:key,value:value,domain:domain,callback:callback});
    };
    lcStorage.removeItem = function(key,domain,callback){
        var m = this;
        m.commonAction({action:'removeItem',key:key,domain:domain,callback:callback});
    };
    lcStorage.key=function(index,domain,callback){
        var m = this;
        m.commonAction({action:'key',index:index,domain:domain,callback:callback});
    };
    lcStorage.clear=function(domain,callback){
        var m = this;
        m.commonAction({action:'clear',domain:domain,callback:callback});
    };

    // 按照规则格式化传进来的域名
    lcStorage.formatDomain=function(domain){
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

        return domain.toLowerCase();
    }

    // CommonJS AMD 
    if ( typeof define === "function" && define.amd) {
        define([], function(){
            return lcStorage;
        });
    }
}());
