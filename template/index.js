// 实现简单的JS模板引擎

// 比如实现以下模板功能
// <%for (var i = 0; i < users.length; i++) {%>
//   <li>
//     <a href="<%= users[i].url%>">
//       <%= usrs[i].name%>
//     </a>
//   </li>
// <% } %>

//思路转换成以下程序
var users = [{"name": "Kevin", "url": "http://localhost"}];

// var p = []
// for (var i = 0; i < users.length; i++) {
//   p.push('<li><a href="')
//   p.push(users[i].url)
//   p.push('">')
//   p.push(users[i].name)
//   p.push('</a></li>')
// }

// console.log(p.join(''))

// 模板其实就是一段字符串，然后根据一段字符串生成一段代码
// 分析得
//需要将<%xxx%>转换为 xxx，其实就是去掉包裹的符号，还要将 <%=xxx%>转化成 p.push(xxx)，这些都可以用正则实现，但是还需要写 p.push('<li><a href="'); 、p.push('">')

// 1.将 %> 替换成 p.push('
// 2.将 <% 替换成 ');
// 3.将 <%=xxx%> 替换成 ');p.push(xxx);p.push('

// 例子，前面将会解析成下
// // ');for ( var i = 0; i < users.length; i++ ) { p.push('
// <li>
// <a href="');p.push(users[i].url);p.push('">
//     ');p.push(users[i].name);p.push('
// </a>
// </li>
// '); } p.push('

// 补全
// 添加的首部代码
// var p = []; p.push('

// ');for ( var i = 0; i < users.length; i++ ) { p.push('
//     <li>
//         <a href="');p.push(users[i].url);p.push('">
//             ');p.push(users[i].name);p.push('
//         </a>
//     </li>
// '); } p.push('

// // 添加的尾部代码
// ');


var results = document.getElementById('container')

// eval版
// function tmpl (str, data) {
//   var str = document.getElementById(str).innerHTML

//   var string = "var p = []; p.push('" +
//   str
//   .replace(/[\r\t\n]/g, "") //要将换行符替换成空格
//   .replace(/<%=(.*?)%>/g, "');p.push($1);p.push('")
//   .replace(/<%/g, "');")
//   .replace(/%>/g,"p.push('")
//   + "');"

//   eval(string)

//   return p.join('')
// }

// results.innerHTML = tmpl("user_tmpl", users)

// Funciton 版
// new Function ([arg1[, arg2[, ...argN]],] functionBody)
//arg1, arg2, ... argN
// 被函数使用的参数的名称必须是合法命名的。参数名称是一个有效的JavaScript标识符的字符串，或者一个用逗号分隔的有效字符串的列表;例如“×”，“theValue”，或“A，B”。
// functionBody 一个含有包括函数定义的JavaScript语句的字符串。

// var adder = new Function("a", "b", "return a + b")

// console.log(adder(2, 6)); // 8

// 不传入data照样可以执行
function tmpl (str, data) {
  var str = document.getElementById(str).innerHTML

  var fn = new Function("obj",
  "var p = []; p.push('" +
  str
    .replace(/[\r\t\n]/g, "") //要将换行符替换成空格
    .replace(/<%=(.*?)%>/g, "');p.push($1);p.push('")
    .replace(/<%/g, "');")
    .replace(/%>/g,"p.push('")
    + "');return p.join('')")

  return fn(data)
}

results.innerHTML = tmpl("user_tmpl", users)