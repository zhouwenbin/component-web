/**
 * [paths description] 如果文件名“jquery-1.7.2.js”改为“jquery.js”就不必配置paths参数了。
 * @type {Object}
 * require.config用来配置一些参数，它将影响到requirejs库的一些行为。
 *require.config的参数是一个JS对象，常用的配置有baseUrl，paths等。
 *这里配置了paths参数，使用模块名“jquery”，其实际文件路径jquery-1.7.2.js（后缀.js可以省略）。
 */
require.config({
	//baseUrl: "./js", //所有模块的base URL,注意，以.js结尾的文件加载时不会使用该baseUrl
	paths:{
		jquery:"../../vender/jquery-1.7.1.min" ,
		company:"../../modules/company/index"
	}
	//, waitSeconds: 10   //waitSeconds是指定最多花多长等待时间来加载一个JavaScript文件，用户不指定的情况下默认为7秒
});
/**
 * [description]
 * @return {[type]} [description]
 */
require(['jquery', 'company'],function($, company){ //require函数的第一个参数是数组，数组中存放的是模块名（字符串类型），数组中的模块与回调函数的参数一一对应 
	/**
	 * 模块化的设计使得JavaScript代码在需要访问”全局变量”的时候，
	 * 都可以通过依赖关系，把这些”全局变量”作为参数传递到模块的实现体里，
	 * 在实现中就避免了访问或者声明全局的变量或者函数，有效的避免大量而且复杂的命名空间管理。
	 */
});


