import{k as m}from"./a-c624dad1.js";import"./index-2ec19aca.js";import"./layout-67591e10.js";import"./index-11f44c82.js";import"./index-f5f672d0.js";import"./index-3ad8ff50.js";import"./index-a0c0b49e.js";import"./index-c83af63d.js";function d(t){var r=t;return!!(r.ctrlKey||r.shiftKey||r.metaKey||r.button&&r.button==1)}function b(t,r){return!!(t.target==="_blank"&&r)}function F(t,r,e,i){var f=this,u=[];return t?(t instanceof Element?u=[t]:"toArray"in t?u=t.toArray():u=t,u.forEach(function(n){n.addEventListener("click",function(a){var c,o,s=r instanceof Function?r(n):r,v=e instanceof Function?e(n):e,h=n.getAttribute("href")||n.getAttributeNS("http://www.w3.org/1999/xlink","href")||n.getAttribute("xlink:href")||((c=n.getElementsByTagName("a")[0])===null||c===void 0?void 0:c.getAttribute("href")),l=m(f.track(s,v,i??{}),(o=f.settings.timeout)!==null&&o!==void 0?o:500);!b(n,h)&&!d(a)&&h&&(a.preventDefault?a.preventDefault():a.returnValue=!1,l.catch(console.error).then(function(){window.location.href=h}).catch(console.error))},!1)}),this):this}function _(t,r,e,i){var f=this;if(!t)return this;t instanceof HTMLFormElement&&(t=[t]);var u=t;return u.forEach(function(n){if(!(n instanceof Element))throw new TypeError("Must pass HTMLElement to trackForm/trackSubmit.");var a=function(o){var s;o.preventDefault?o.preventDefault():o.returnValue=!1;var v=r instanceof Function?r(n):r,h=e instanceof Function?e(n):e,l=m(f.track(v,h,i??{}),(s=f.settings.timeout)!==null&&s!==void 0?s:500);l.catch(console.error).then(function(){n.submit()}).catch(console.error)},c=window.jQuery||window.Zepto;c?c(n).submit(a):n.addEventListener("submit",a,!1)}),this}export{_ as form,F as link};
