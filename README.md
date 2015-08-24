localStorage
============

make a cross domain able localStorage for most of the browser with localStorage and Flashcookie


## 推荐的使用方式

localStorage比较适合用来存储那些在页面加载完成之后才需要填充的数据，而不是一些开关

比如在页面加载的瞬间，判断某个值，然后选择是否跳转页面。

如果是原生的localStorage，是能够在head里面实现这一功能的。可是对于IE6,7，需要使用Flashcookie来实现本地存储，那么就必须是把swf文件放在body标签里面，所以需要在document ready之后使用才是最安全的

而这个整个FlashCookie和localStorage的方案，在使用的时候，要让二者都有效，就使得代码是没法在head里面去读取本地存储的数据

## 接口说明

所有的接口都是仿造localStorage进行设计的，返回值也是类似

关于domain，如果是当前域下，可以不用写域名直接写null即可。在非当前域的时候，域名的完整书写格式是：协议+hostname+端口号(如果是默认的80，则可省略不写)。比如：http://www.7k7k.com/。如果协议是http://，端口是80，则域名可简写为hostname ，比如上面的地址就能写成www.7k7k.com。需要这样设定的原因是localStorage的来源限制策略就是如此

往本地存储的数据，要做好取出来会变成字符串的心理准备。所以最合适存储的数据格式是number和string

### getItem

方法功能：获取指定域名下的key对应的value值，如果不存在，返回null，存在，返回的都是字符串

调用方式：

    qike.localStorage.getItem(key,domain,callback);

参数说明：

+ key 是要获取的键值对的名字
+ doamin 是这个键值对所在的域名
+ callback 是取得key对应的value之后的回调函数，会传递value到callback中

### setItem

方法功能：给指定域名下的key设定一个value值。如果key已经存在，则覆盖原有的值；如果key不存在，则新建一个

调用方式：

    qike.localStorage.setItem(key,value,domain,callback);

参数说明：

+ key 是要赋值的键值对的名字
+ value 是给key设定的值
+ doamin 是这个键值对所在的域名
+ callback 是取得key对应的value之后的回调函数 callback接收的参数是setItem方法的返回值，一般是undefined

### removeItem

方法功能：根据key，移除给指定域名下对应的键值对。如果该域名下不存在这个key，则返回null，否则返回undefined

调用方式：

    qike.localStorage.removeItem(key,domain,callback);

参数说明：

+ key 是要移除的键值对的名字
+ doamin 是这个键值对所在的域名
+ callback 是取得key对应的value之后的回调函数 callback接收的参数是removeItem方法的返回值，一般是undefined

### key

方法功能：此方法主要用于遍历本地存储的数据，可以将本地存储的数据看成类数组的一个对象。传递一个索引进去之后，会返回对应的key，如果索引值超出范围，则返回null。这个功能在实现上有些问题，localStorage和FlashCookie对数据的排序有些不同，所以建议只进行遍历，而不是根据某个索引取特定的哪一个key

调用方式：

    qike.localStorage.key(index,domain,callback);

参数说明：

+ index 索引值
+ doamin 是索引的数据所在的域名
+ callback 是取得key对应的value之后的回调函数 callback接收的参数是key方法返回的key的名字

### clear

方法功能： 此方法是用来清空所有指定域名下的本地存储的数据

调用方式：

    qike.localStorage.clear(domain,callback);

参数说明：

+ doamin 是要清空的数据所在的域名
+ callback 是取得key对应的value之后的回调函数 callback接收的参数是clear方法的返回值，一般是undefined


## 关于实施方案的部署

首先，项目页面里面需要引入localStorage.js

然后是localStorage的跨域问题，需要在各个域名的服务器下，放置一个head里面有document.domain='(your domain)'的空localStorage.html文件。这个是跨域获取localStorage数据的时候，需要通过iframe的方式加载该页面到当前页面，然后访问iframe里面的contentWindow，取到对应域名下的localStorage数据。

接着是FlashCookie的部署。FlashCookie的数据是按照swf文件的地址进行划分的。为了能实现不同域名下有不同数据的效果。需要在不同域名的服务器下放置一份localStorage.swf。

html和swf的放置路径必须是各自保持一个相同的格式。然后在localStorage.js里面有两个参数：qike.localStorage.baseHtmlUrl和qike.localStorage.baseFlashUrl。这两个值分别是html和swf在各个服务器下的摒除domain之后的路径。

假设localStorage.html和localStorage.swf都是放在根目录下。那么qike.localStorage.baseHtmlUrl='localStorage.html',qike.localStorage.baseHtmlUrl='localStorage.swf'
