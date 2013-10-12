localStorage
============

make a cross domain able localStorage for most of the browser with localStorage and userData


## 推荐的使用方式
localStorage比较适合用来存储那些在页面加载完成之后才需要填充的数据，而不是一些开关

比如在页面加载的瞬间，判断某个值，然后选择是否跳转页面。

如果是原生的localStorage，是能够在head里面实现这一功能的。可是对于IE6,7，需要使用userData来实现本地存储，那么就必须是有一个明确的放置userData的在body里面的标签。可能响应的速度上面就比较慢，会在页面部分渲染的时候再跳转。

而这个整个userData和localStorage的方案，在使用的时候，要让二者都有效，就使得代码是没法在head里面去读取本地存储的数据