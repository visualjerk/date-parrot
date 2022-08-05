import{d as oe,r as z,c as T,o as R,a as A,b as x,F as k,e as P,u as I,w as re,v as ce,t as N,f as ie,n as L,g as pe,h as Y}from"./app.0eb458e4.js";var ue="/date-parrot/parrot.png";function E(n){if(n===null||n===!0||n===!1)return NaN;var s=Number(n);return isNaN(s)?s:s<0?Math.ceil(s):Math.floor(s)}function h(n,s){if(s.length<n)throw new TypeError(n+" argument"+(n>1?"s":"")+" required, but only "+s.length+" present")}function v(n){h(1,arguments);var s=Object.prototype.toString.call(n);return n instanceof Date||typeof n=="object"&&s==="[object Date]"?new Date(n.getTime()):typeof n=="number"||s==="[object Number]"?new Date(n):((typeof n=="string"||s==="[object String]")&&typeof console!="undefined"&&(console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"),console.warn(new Error().stack)),new Date(NaN))}function W(n,s){h(2,arguments);var e=v(n),t=E(s);return isNaN(t)?new Date(NaN):(t&&e.setDate(e.getDate()+t),e)}function de(n,s){h(2,arguments);var e=v(n),t=E(s);if(isNaN(t))return new Date(NaN);if(!t)return e;var a=e.getDate(),o=new Date(e.getTime());o.setMonth(e.getMonth()+t+1,0);var r=o.getDate();return a>=r?o:(e.setFullYear(o.getFullYear(),o.getMonth(),a),e)}var ye={};function fe(){return ye}function De(n,s){h(2,arguments);var e=E(s),t=e*7;return W(n,t)}function j(n,s){h(2,arguments);var e=E(s);return de(n,e*12)}function F(n,s){for(var e=n<0?"-":"",t=Math.abs(n).toString();t.length<s;)t="0"+t;return e+t}function U(n,s){var e,t;h(1,arguments);var a=v(n);if(isNaN(a.getTime()))throw new RangeError("Invalid time value");var o=String((e=s==null?void 0:s.format)!==null&&e!==void 0?e:"extended"),r=String((t=s==null?void 0:s.representation)!==null&&t!==void 0?t:"complete");if(o!=="extended"&&o!=="basic")throw new RangeError("format must be 'extended' or 'basic'");if(r!=="date"&&r!=="time"&&r!=="complete")throw new RangeError("representation must be 'date', 'time', or 'complete'");var i="",l="",d=o==="extended"?"-":"",c=o==="extended"?":":"";if(r!=="time"){var p=F(a.getDate(),2),u=F(a.getMonth()+1,2),y=F(a.getFullYear(),4);i="".concat(y).concat(d).concat(u).concat(d).concat(p)}if(r!=="date"){var f=a.getTimezoneOffset();if(f!==0){var D=Math.abs(f),m=F(Math.floor(D/60),2),_=F(D%60,2),g=f<0?"+":"-";l="".concat(g).concat(m,":").concat(_)}else l="Z";var w=F(a.getHours(),2),O=F(a.getMinutes(),2),C=F(a.getSeconds(),2),ae=i===""?"":"T",le=[w,O,C].join(c);i="".concat(i).concat(ae).concat(le).concat(l)}return i}function ge(n){h(1,arguments);var s=v(n),e=s.getFullYear(),t=s.getMonth(),a=new Date(0);return a.setFullYear(e,t+1,0),a.setHours(0,0,0,0),a.getDate()}function H(n,s){h(2,arguments);var e=v(n),t=v(s);return e.getTime()<t.getTime()}function G(n){return h(1,arguments),v(n).getTime()<Date.now()}function V(n,s){h(2,arguments);var e=v(n),t=E(s),a=e.getFullYear(),o=e.getDate(),r=new Date(0);r.setFullYear(a,t,15),r.setHours(0,0,0,0);var i=ge(r);return e.setMonth(t,Math.min(o,i)),e}function X(n,s){h(2,arguments);var e=v(n),t=E(s);return e.setDate(t),e}function he(n,s,e){var t,a,o,r,i,l,d,c;h(2,arguments);var p=fe(),u=E((t=(a=(o=(r=e==null?void 0:e.weekStartsOn)!==null&&r!==void 0?r:e==null||(i=e.locale)===null||i===void 0||(l=i.options)===null||l===void 0?void 0:l.weekStartsOn)!==null&&o!==void 0?o:p.weekStartsOn)!==null&&a!==void 0?a:(d=p.locale)===null||d===void 0||(c=d.options)===null||c===void 0?void 0:c.weekStartsOn)!==null&&t!==void 0?t:0);if(!(u>=0&&u<=6))throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");var y=v(n),f=E(s),D=y.getDay(),m=f%7,_=(m+7)%7,g=7-u,w=f<0||f>6?f-(D+g)%7:(_+g)%7-(D+g)%7;return W(y,w)}function B(n,s){h(2,arguments);var e=v(n),t=E(s);return e.setHours(t),e}function K(n,s){h(2,arguments);var e=v(n),t=E(s);return e.setMinutes(t),e}function q(n,s){h(2,arguments);var e=v(n),t=E(s);return e.setSeconds(t),e}const me=[["sunday",0],["monday",1],["tuesday",2],["wednesday",3],["thursday",4],["friday",5],["saturday",6]],ve=[["january",1],["february",2],["march",3],["april",4],["may",5],["june",6],["july",7],["august",8],["september",9],["october",10],["november",11],["december",12]],_e=[["everyday","1D"],["daily","1D"],["weekly","1W"],["monthly","1M"],["yearly","1Y"]],Ee=["every","each"],Fe=["next","coming","upcoming"],Se=[["today",0],["tomorrow",1],["yesterday",-1]],xe="th|st|nd|rd",we="on|at",Re=[["first",1],["second",2],["other",2],["third",3],["fourth",4],["fifth",5],["sixth",6],["seventh",7],["eigth",8],["nineth",9],["tenth",10],["one",1],["two",2],["three",3],["four",4],["five",5],["six",6],["seven",7],["eight",8],["nine",9],["ten",10],["eleven",11],["twelve",12],["thirteen",13],["fourteen",14],["fifteen",15],["sixteen",16],["seventeen",17],["eighteen",18],["nineteen",19],["twenty",20],["twentyone",21],["twentytwo",22],["twentythree",23],["twentyfour",24],["twentyfive",25],["twentysix",26],["twentyseven",27],["twentyeight",28],["twentynine",29],["thirty",30]],Ae=[["seconds?","s"],["minutes?","m"],["hours?","h"],["days?","D"],["weeks?","W"],["months?","M"],["years?","Y"]],Ce={DAY_OF_WEEK_WORDS:me,MONTH_WORDS:ve,SCHEDULE_SINGLE_WORDS:_e,SCHEDULE_TRIGGER_WORDS:Ee,DATE_NEXT_TRIGGER_WORDS:Fe,SINGLE_DAY_WORDS:Se,INTEGER_SUFFIX:xe,TIME_TRIGGER:we,INTEGER_WORDS:Re,UNIT_WORDS:Ae},Oe=[["sonntag",0],["montag",1],["dienstag",2],["mittwoch",3],["donnerstag",4],["freitag",5],["samstag",6]],Te=[["januar",1],["februar",2],["m\xE4rz",3],["april",4],["mai",5],["juni",6],["juli",7],["august",8],["september",9],["oktober",10],["november",11],["dezember",12]],Ie=[["t\xE4glich","1D"],["w\xF6chentlich","1W"],["monatlich","1M"],["j\xE4hrlich","1Y"]],be=["jede[rn]?","alle"],$e=["n\xE4chste[rn]?","kommende[rn]?"],We=[["heute",0],["morgen",1],["\xFCbermorgen",2],["gestern",-1]],Ne="ter?",Me="um",Ge=[["erste[rn]?",1],["zweite[rn]?",2],["dritte[rn]?",3],["vierte[rn]?",4],["f\xFCnfte[rn]?",5],["sexte[rn]?",6],["siebte[rn]?",7],["achte[rn]?",8],["neunte[rn]?",9],["zehnte[rn]?",10],["eins",1],["zwei",2],["drei",3],["vier",4],["f\xFCnf",5],["sechs",6],["sieben",7],["acht",8],["neun",9],["zehn",10],["elf",11],["zw\xF6lf",12],["dreizehn",13],["vierzehn",14],["f\xFCnfzehn",15],["sechzehn",16],["siebzehn",17],["achtzehn",18],["neunzehn",19],["zwanzig",20],["einundzwanzig",21],["zweiundzwanzig",22],["dreinundzwanzig",23],["vierundzwanzig",24],["f\xFCnfundzwanzig",25],["sechsundzwanzig",26],["siebenundzwanzig",27],["achtundzwanzig",28],["neunundzwanzig",29],["dreissig",30],["drei\xDFig",30]],ze=[["sekunden?","s"],["minuten?","m"],["stunden?","h"],["tag[e|en]?","D"],["wochen?","W"],["monat[e|en]?","M"],["jahr[e|en]?","Y"]],ke={DAY_OF_WEEK_WORDS:Oe,MONTH_WORDS:Te,SCHEDULE_SINGLE_WORDS:Ie,SCHEDULE_TRIGGER_WORDS:be,DATE_NEXT_TRIGGER_WORDS:$e,SINGLE_DAY_WORDS:We,INTEGER_SUFFIX:Ne,TIME_TRIGGER:Me,INTEGER_WORDS:Ge,UNIT_WORDS:ze},J={en:Ce,de:ke},Pe=n=>function(s,e,t){return s.some(a=>{const o=typeof a=="string"?a:a[0],r=typeof a=="string"?a:a[1],i=e.match(n(o));if(i&&i[0]){let l=i.index||0,d=i[0];return i[0][0].match(/\s/)&&(l++,d=d.slice(1)),t(l,d,r),!0}return!1})},Z="(?:^|\\s)",Q="(?=$|[\\s.,;:!?])",Le="(?:[01]\\d|2[0123])(:(?:[012345]\\d))?(:(?:[012345]\\d))?",ee=Pe(n=>new RegExp(`${Z}${n}${Q}`,"i"));function ne(n,s){let e=he(n,s,{weekStartsOn:1});return(H(e,n)||G(e))&&(e=De(e,1)),e}function Ye(n,s){let e=V(n,s);return(H(e,n)||G(e))&&(e=j(e,1)),e}function b(n,s){return n.filter(([e])=>s.match(new RegExp(`${e}`,"i"))).sort((e,t)=>t[0].length-e[0].length)[0][1]}function $(n){return n.map(([s])=>s).join("|")}function M(n,s){var a;const e=new RegExp(`^${s}(\\d+)?$`);return(a=Object.entries(n).filter(([o,r])=>o.match(e)&&r!=null).sort(([o],[r])=>{const i=parseInt(o.replace(s,"")),l=parseInt(r.replace(s,""));return isNaN(i)?1:isNaN(l)?-1:i-l})[0])==null?void 0:a[1]}function se(n,s,e){const{DAY_OF_WEEK_WORDS:t,MONTH_WORDS:a,INTEGER_WORDS:o,UNIT_WORDS:r}=e,i=`${Z}${s}${Q}`,d=new RegExp(i,"gi").exec(n);if(!d)return null;const c={index:d.index,text:d[0]};c.text[0].match(/\s/)&&(c.index++,c.text=c.text.slice(1));const{unit:p,weekday:u,month:y,nextword:f}=d.groups;c.next=f!=null;const D=M(d.groups,"time"),m=M(d.groups,"integer"),_=M(d.groups,"integerword");if(m?c.integer=parseInt(m):_&&(c.integer=b(o,_)),D){const g=D.split(":");c.hours=parseInt(g[0]),c.minutes=g[1]?parseInt(g[1]):0,c.seconds=g[2]?parseInt(g[2]):0}return p&&(c.unit=b(r,p)),u&&(c.weekday=b(t,u)),y&&(c.month=b(a,y)),c}const S=(n,s)=>e=>s.replace("<$1>",`<${n}${e||""}>`);function te(n){const{SCHEDULE_TRIGGER_WORDS:s,DATE_NEXT_TRIGGER_WORDS:e,DAY_OF_WEEK_WORDS:t,MONTH_WORDS:a,INTEGER_SUFFIX:o,INTEGER_WORDS:r,UNIT_WORDS:i,TIME_TRIGGER:l}=n;return{scheduleTrigger:S("schedulword",`(?:${s.join("|")})`),nextWord:S("nextword",`(?<$1>${e.join("|")})`),integer:S("integer",`(?<$1>\\d+)(?:${o}|\\.)?`),integerWord:S("integerword",`(?<$1>${$(r)})`),unit:S("unit",`(?<$1>${$(i)})`),weekday:S("weekday",`(?<$1>${$(t)})`),month:S("month",`(?<$1>${$(a)})`),time:S("time",`(?:(${l}) )?(?<$1>${Le})`)}}function je(n,s){const{SCHEDULE_SINGLE_WORDS:e}=s;let t,a=0,o="",r,i,l=new Date;function d(){return t?{schedule:{repeatFrequency:t,startDate:U(l),byDay:r,byMonth:i},match:{index:a,length:o.length,text:o}}:null}if(ee(e,n,(f,D,m)=>{a=f,o=D,t=`P${m}`}))return d();const p=te(s),u=`(${p.time(2)} )?${p.scheduleTrigger()} (${p.integer()} |${p.integerWord()} )?(${p.unit()}|${p.weekday()}|${p.month()})( ${p.time(1)})?`,y=se(n,u,s);if(y){a=y.index,o=y.text;const{hours:f,minutes:D,seconds:m,integer:_,unit:g,weekday:w,month:O}=y;f!=null&&D!=null&&m!=null&&(l=B(l,f),l=K(l,D),l=q(l,m));const C=_||1;return g?t=`P${C}${g}`:w?(t=`P${C}W`,r=w,l=ne(l,r)):O&&(t="P1Y",i=O,l=X(V(l,i-1),C),G(l)&&(l=j(l,1))),d()}return null}function Ue(n,s={locales:["en"]}){if(!n)return null;const e=s.locales.map(t=>J[t]);for(const t of e){const a=je(n,t);if(a)return a}return null}function He(n,s){const{SINGLE_DAY_WORDS:e}=s;let t=new Date,a,o="";function r(){return a==null?null:{date:U(t),match:{index:a,length:o.length,text:o}}}if(ee(e,n,(p,u,y)=>{a=p,o=u,t=W(t,y)}))return r();const l=te(s),d=`(${l.time(2)} )?(${l.nextWord()} |${l.integer(2)} |${l.integerWord(2)} )?(${l.weekday()}|${l.month()})( ${l.integer(1)}| ${l.integerWord(1)})?( ${l.time(1)})?`,c=se(n,d,s);if(c){a=c.index,o=c.text;const{integer:p,month:u,weekday:y,next:f,hours:D,minutes:m,seconds:_}=c,g=p||1;return D!=null&&m!=null&&_!=null&&(t=B(t,D),t=K(t,m),t=q(t,_)),y&&(f&&(t=W(t,1)),t=ne(t,y)),u&&(t=X(t,g),t=Ye(t,u-1)),r()}return null}function Ve(n,s={locales:["en"]}){if(!n)return null;const e=s.locales.map(t=>J[t]);for(const t of e){const a=He(n,t);if(a)return a}return null}const Xe={class:"md:-mx-8 lg:-mx-12 p-6 lg:px-12 lg:py-8 shadow-lg rounded-lg bg-gradient-to-br from-green-50 to-indigo-100 border-4 border-white dark:border-purple-800 dark:from-purple-900 dark:to-indigo-800 dark:shadow-purple-900 text-slate-800"},Be={class:"flex justify-end gap-2 mb-4"},Ke=["onClick"],qe={class:"relative mb-6"},Je={class:"border border-transparent pointer-events-none p-4 text-xl font-extrabold whitespace-pre-wrap text-slate-700 relative"},Ze=ie(" \xA0 "),Qe={class:"language-ts"},en=oe({__name:"ParrotPlayground",setup(n){const s=["en","de"],e=z(["en"]);function t(c){return e.value.includes(c)}function a(c){const p=e.value.indexOf(c);p===-1?e.value.push(c):e.value.splice(p,1)}const o=T(()=>({locales:e.value})),r=z("I eat pizza every second friday"),i=T(()=>Ue(r.value,o.value)),l=T(()=>Ve(r.value,o.value)),d=T(()=>{const c=r.value,p=i.value,u=l.value,y=p&&p.match||u&&u.match;if(!y)return[{value:c}];const f=[{isSchedule:!!p,isDate:!!u,value:y.text}];y.index>0&&f.unshift({value:c.slice(0,y.index)});const D=y.index+y.text.length;return c.length>D&&f.push({value:c.slice(D)}),f});return(c,p)=>(R(),A("div",Xe,[x("div",Be,[(R(!0),A(k,null,P(I(s),u=>(R(),A("button",{key:u,onClick:y=>a(u),class:L(["px-2 rounded-full text-white font-bold",t(u)?"bg-pink-600":"bg-purple-400"])},N(u),11,Ke))),128))]),x("div",qe,[re(x("textarea",{"onUpdate:modelValue":p[0]||(p[0]=u=>r.value=u),class:"border border-solid border-white shadow-md bg-slate-50 rounded-lg w-full p-4 text-xl focus:outline focus:outline-4 focus:outline-pink-400 focus:bg-white font-extrabold text-transparent caret-slate-800 absolute inset-0 resize-none",rows:"1",autocorrect:"off",autocapitalize:"off",spellcheck:"false",autocomplete:"off"},null,512),[[ce,r.value]]),x("div",Je,[(R(!0),A(k,null,P(I(d),u=>(R(),A("span",{class:L((u.isSchedule||u.isDate)&&"text-pink-500")},N(u.value),3))),256)),Ze])]),x("div",Qe,[x("pre",null,[x("code",null,N(I(i)||I(l)||"null"),1)])])]))}}),nn=Y('<img src="'+ue+`" alt="Parrot" class="h-40 mb-4"><h1 id="dateparrot" tabindex="-1">DateParrot <a class="header-anchor" href="#dateparrot" aria-hidden="true">#</a></h1><p>DateParrot parses natural language into a <a href="https://schema.org/Schedule" target="_blank" rel="noopener noreferrer">unified schedule object</a> or ISO date.</p><div class="language-sh"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">npm install date-parrot</span></span>
<span class="line"></span></code></pre></div><p><strong>This package is in a very early stage and not yet production ready.</strong></p><h2 id="playground" tabindex="-1">Playground <a class="header-anchor" href="#playground" aria-hidden="true">#</a></h2>`,6),sn=Y(`<h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-hidden="true">#</a></h2><div class="language-ts"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">parseDate</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">date-parrot</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">parseDate</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">lets go out tomorrow</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   date: [TOMORROW_AS_ISO_STRING],</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   match: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     index: 12,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     length: 8,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     text: &#39;tomorrow&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// }</span></span>
<span class="line"></span></code></pre></div><div class="language-ts"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">parseSchedule</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">date-parrot</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">parseSchedule</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">every second day</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   schedule: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     repeatFrequency: &#39;P2D&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     startDate: &#39;[NOW_AS_ISO_STRING]&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   match: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     index: 0,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     length: 16,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     text: &#39;every second day&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// }</span></span>
<span class="line"></span></code></pre></div><div class="language-ts"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">parseSchedule</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">date-parrot</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">parseSchedule</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">eat donuts on every 3rd friday</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   schedule: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     repeatFrequency: &#39;P1W&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     startDate: &#39;[NEXT_FRIDAY_AS_ISO_STRING]&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   match: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     index: 11,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     length: 16,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     text: &#39;every 3rd friday&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// }</span></span>
<span class="line"></span></code></pre></div><h2 id="localization" tabindex="-1">Localization <a class="header-anchor" href="#localization" aria-hidden="true">#</a></h2><p>By default DateParrot only parses english but you can add support for other languages by adding a <code>locales</code> property to the config of the parser functions.</p><p>It takes an array of locale identifiers (e.g. <code>[&#39;en&#39;, &#39;de&#39;]</code>).</p><div class="language-ts"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">parseDate</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">date-parrot</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">parseDate</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">lass uns morgen ausgehen</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">locales</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">de</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">] </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   date: [TOMORROW_AS_ISO_STRING],</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   match: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     index: 9,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     length: 6,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     text: &#39;morgen&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// }</span></span>
<span class="line"></span></code></pre></div><p>Parrot icon is provided by the awesome <a href="https://www.animaljamarchives.com/" target="_blank" rel="noopener noreferrer">AnimalJamSrchives</a>.</p>`,9),ln=JSON.parse('{"title":"DateParrot","description":"","frontmatter":{},"headers":[{"level":2,"title":"Playground","slug":"playground"},{"level":2,"title":"Usage","slug":"usage"},{"level":2,"title":"Localization","slug":"localization"}],"relativePath":"index.md"}'),tn={name:"index.md"},on=Object.assign(tn,{setup(n){return(s,e)=>(R(),A("div",null,[nn,pe(en,{class:"my-8"}),sn]))}});export{ln as __pageData,on as default};