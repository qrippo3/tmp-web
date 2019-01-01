function getCookie(name) {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}

function setCookie(c_name, value, expiredays) {

  var d = new Date();
  d.setTime(d.getTime() + (expiredays * 1000));
  var expires = "expires=" + d.toUTCString();
  console.info(c_name + "=" + value + "; " + expires);
  document.cookie = c_name + "=" + JSON.stringify(value) + "; " + expires;
  console.info(document.cookie);
}

function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}