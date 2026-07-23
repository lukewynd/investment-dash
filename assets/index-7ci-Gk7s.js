(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))l(s);new MutationObserver(s=>{for(const e of s)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&l(n)}).observe(document,{childList:!0,subtree:!0});function r(s){const e={};return s.integrity&&(e.integrity=s.integrity),s.referrerPolicy&&(e.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?e.credentials="include":s.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function l(s){if(s.ep)return;s.ep=!0;const e=r(s);fetch(s.href,e)}})();const lt="https://yf-proxy.lukewynd.workers.dev";function it(t){return`${lt}${t}`}function yt(t){const a=encodeURIComponent(t);return`${lt}/v8/finance/chart/${a}?range=1y&interval=1d`}const Z=new Map,ft=5*60*1e3;async function gt(t){var r,l,s,e,n;const a=Z.get(t);if(a&&Date.now()-a.ts<ft)return a.data;try{const i=await fetch(yt(t),{headers:{Accept:"application/json"}});if(!i.ok)return null;const o=await i.json(),c=(l=(r=o==null?void 0:o.chart)==null?void 0:r.result)==null?void 0:l[0];if(!c)return null;const p=c.meta,u=((n=(e=(s=c.indicators)==null?void 0:s.quote)==null?void 0:e[0])==null?void 0:n.close)??[],v=u.find($=>$!=null),S=[...u].reverse().find($=>$!=null),C=v!=null&&S!=null&&v!==0?(S-v)/v*100:null,f=p.regularMarketPrice??null,b=p.chartPreviousClose??null,k=f!=null&&b!=null&&b!==0?(f-b)/b*100:null,E=f!=null&&b!=null?f-b:null,w=u.length,L=u[w-1],F=u[w-2]??null;let M=k;if(f!=null&&L!=null){const D=Math.abs(f-L)/(L||1)<1e-4?F:L;M=D!=null&&D!==0?(f-D)/D*100:k}const T=$=>{const D=u[w-$];return D!=null&&f!=null&&D!==0?(f-D)/D*100:null},H=new Date().getFullYear(),A=c.timestamp??[];let x=null;for(let $=0;$<A.length;$++)if(new Date(A[$]*1e3).getFullYear()===H&&u[$]!=null){x=u[$];break}const U=x!=null&&x!==0&&f!=null?(f-x)/x*100:C,Y={symbol:t,regularMarketPrice:f,regularMarketChangePercent:M,regularMarketChange:E,chartPreviousClose:b,quoteType:p.instrumentType??"",ytdPct:U,pct1d:M,pct1w:T(6),pct1m:T(22),pct3m:T(64),pctYtd:U};return Z.set(t,{ts:Date.now(),data:Y}),Y}catch{return null}}async function St(t){const r=new Map;for(let l=0;l<t.length;l+=8){const s=t.slice(l,l+8),e=await Promise.allSettled(s.map(n=>gt(n)));s.forEach((n,i)=>{const o=e[i].status==="fulfilled"?e[i].value:null;o&&r.set(n,o)})}return r}const ot=[{symbol:"^GSPC",name:"S&P 500",type:"index"},{symbol:"^VIX",name:"VIX",type:"vix"},{symbol:"^TNX",name:"US 10Y",type:"yield"},{symbol:"DX-Y.NYB",name:"DXY",type:"index"},{symbol:"GC=F",name:"Gold",type:"commodity"},{symbol:"BTC-USD",name:"Bitcoin",type:"crypto"}],rt=[{symbol:"^GSPC",name:"S&P 500",region:"Americas"},{symbol:"^IXIC",name:"NASDAQ Comp.",region:"Americas"},{symbol:"^DJI",name:"Dow Jones",region:"Americas"},{symbol:"^RUT",name:"Russell 2000",region:"Americas"},{symbol:"^BVSP",name:"Bovespa",region:"Americas"},{symbol:"^MXX",name:"IPC Mexico",region:"Americas"},{symbol:"^FTSE",name:"FTSE 100",region:"Europe"},{symbol:"^GDAXI",name:"DAX",region:"Europe"},{symbol:"^FCHI",name:"CAC 40",region:"Europe"},{symbol:"^STOXX50E",name:"Euro Stoxx 50",region:"Europe"},{symbol:"^SSMI",name:"SMI",region:"Europe"},{symbol:"^AEX",name:"AEX",region:"Europe"},{symbol:"^N225",name:"Nikkei 225",region:"Asia-Pacific"},{symbol:"^HSI",name:"Hang Seng",region:"Asia-Pacific"},{symbol:"000001.SS",name:"Shanghai Comp.",region:"Asia-Pacific"},{symbol:"^AXJO",name:"ASX 200",region:"Asia-Pacific"},{symbol:"^KS11",name:"KOSPI",region:"Asia-Pacific"},{symbol:"^STI",name:"Straits Times",region:"Asia-Pacific"}],ct=[{symbol:"^IRX",name:"3-Month"},{symbol:"^FVX",name:"5-Year"},{symbol:"^TNX",name:"10-Year"},{symbol:"^TYX",name:"30-Year"}],dt=[{symbol:"EURUSD=X",name:"EUR/USD",decimals:4},{symbol:"GBPUSD=X",name:"GBP/USD",decimals:4},{symbol:"USDJPY=X",name:"USD/JPY",decimals:2},{symbol:"AUDUSD=X",name:"AUD/USD",decimals:4},{symbol:"USDCAD=X",name:"USD/CAD",decimals:4},{symbol:"USDCHF=X",name:"USD/CHF",decimals:4},{symbol:"USDCNY=X",name:"USD/CNY",decimals:4},{symbol:"USDINR=X",name:"USD/INR",decimals:2}],mt=[{symbol:"GC=F",name:"Gold",unit:"/oz",group:"Metals"},{symbol:"SI=F",name:"Silver",unit:"/oz",group:"Metals"},{symbol:"HG=F",name:"Copper",unit:"/lb",group:"Metals"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl",group:"Energy"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl",group:"Energy"},{symbol:"NG=F",name:"Nat. Gas",unit:"/MMBtu",group:"Energy"},{symbol:"ZW=F",name:"Wheat",unit:"/bu",group:"Agri"},{symbol:"ZC=F",name:"Corn",unit:"/bu",group:"Agri"}],ut=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],pt=[{symbol:"BTC-USD",name:"Bitcoin",abbr:"BTC"},{symbol:"ETH-USD",name:"Ethereum",abbr:"ETH"},{symbol:"SOL-USD",name:"Solana",abbr:"SOL"},{symbol:"XRP-USD",name:"XRP",abbr:"XRP"}],kt=[...new Set([...ot.map(t=>t.symbol),...rt.map(t=>t.symbol),...ct.map(t=>t.symbol),...dt.map(t=>t.symbol),...mt.map(t=>t.symbol),...ut.map(t=>t.symbol),...pt.map(t=>t.symbol)])];function V(t,a=2){return t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:a,maximumFractionDigits:a})}function R(t){if(t==null)return{text:"—",cls:""};const a=t>=0?"+":"",r=t>=0?"up":"dn",l=Math.abs(t)>=3?" strong":"";return{text:`${a}${t.toFixed(2)}%`,cls:r+l}}function $t(t){if(t==null)return{text:"—",cls:""};const a=Math.round(t*100),r=a>=0?"+":"",l=a>=0?"up":"dn";return{text:`${r}${a}bps`,cls:l}}function g(t){const a=R(t);return`<td class="num pct-cell ${a.cls}">${a.text}</td>`}function B(t,a=7){return Array.from({length:t},()=>`<tr>${Array.from({length:a},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function wt(t){return ot.map(({symbol:a,name:r,type:l})=>{const s=t.get(a),e=s==null?void 0:s.regularMarketPrice,n=R((s==null?void 0:s.pct1d)??null),i=R((s==null?void 0:s.pctYtd)??null);let o="—";return e!=null&&(l==="yield"?o=e.toFixed(2)+"%":l==="crypto"?o="$"+e.toLocaleString("en-US",{maximumFractionDigits:0}):l==="commodity"?o="$"+V(e):o=V(e)),`
      <div class="mkt-stat-card">
        <div class="mkt-stat-name">${r}</div>
        <div class="mkt-stat-price">${o}</div>
        <div class="mkt-stat-chg ${n.cls}">${n.text}</div>
        <div class="mkt-stat-ytd ${i.cls}">${i.text} YTD</div>
      </div>`}).join("")}function Lt(t){const a=["Americas","Europe","Asia-Pacific"];let r="";return a.forEach(l=>{const s=rt.filter(e=>e.region===l);r+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,r+=s.map(({symbol:e,name:n})=>{const i=t.get(e),o=i==null?void 0:i.regularMarketPrice,c=o!=null?o.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";return`<tr>
        <td class="mkt-name">${n}</td>
        <td class="num mono">${c}</td>
        ${g(i==null?void 0:i.pct1d)}
        ${g(i==null?void 0:i.pct1w)}
        ${g(i==null?void 0:i.pct1m)}
        ${g(i==null?void 0:i.pct3m)}
        ${g(i==null?void 0:i.pctYtd)}
      </tr>`}).join("")}),`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Global Equities</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Index</th>
          <th class="num">Level</th>
          <th class="num">1D</th>
          <th class="num">1W</th>
          <th class="num">1M</th>
          <th class="num">3M</th>
          <th class="num">YTD</th>
        </tr></thead>
        <tbody>${r}</tbody>
      </table>
    </div>`}function Dt(t){const a=ct.map(({symbol:s,name:e})=>{const n=t.get(s),i=(n==null?void 0:n.regularMarketPrice)??null,o=(n==null?void 0:n.regularMarketChange)??null;return{name:e,yld:i,chg:o}}),r=Math.max(.01,...a.map(s=>s.yld??0));return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">US Treasuries</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Tenor</th>
          <th class="num">Yield</th>
          <th></th>
          <th class="num">1D Chg</th>
        </tr></thead>
        <tbody>${a.map(({name:s,yld:e,chg:n})=>{const i=$t(n),o=e!=null?e.toFixed(2)+"%":"—",c=e!=null?e/r*100:0;return`<tr>
      <td class="mkt-name">${s}</td>
      <td class="num mono">${o}</td>
      <td class="yc-bar-cell"><span class="yc-bar" style="width:${c.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${i.cls}">${i.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Mt(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Rates</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Pair</th>
          <th class="num">Rate</th>
          <th class="num">1D</th>
          <th class="num">1W</th>
          <th class="num">1M</th>
          <th class="num">YTD</th>
        </tr></thead>
        <tbody>${dt.map(({symbol:r,name:l,decimals:s})=>{const e=t.get(r),n=e==null?void 0:e.regularMarketPrice,i=n!=null?n.toFixed(s):"—";return`<tr>
      <td class="mkt-name">${l}</td>
      <td class="num mono">${i}</td>
      ${g(e==null?void 0:e.pct1d)}
      ${g(e==null?void 0:e.pct1w)}
      ${g(e==null?void 0:e.pct1m)}
      ${g(e==null?void 0:e.pctYtd)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Tt(t){const a=["Metals","Energy","Agri"];let r="";return a.forEach(l=>{const s=mt.filter(e=>e.group===l);r+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,r+=s.map(({symbol:e,name:n,unit:i})=>{const o=t.get(e),c=o==null?void 0:o.regularMarketPrice,p=c!=null?"$"+V(c):"—";return`<tr>
        <td class="mkt-name">${n}<span class="mkt-unit">${i}</span></td>
        <td class="num mono">${p}</td>
        ${g(o==null?void 0:o.pct1d)}
        ${g(o==null?void 0:o.pct1w)}
        ${g(o==null?void 0:o.pct1m)}
        ${g(o==null?void 0:o.pctYtd)}
      </tr>`}).join("")}),`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Commodities</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th>
          <th class="num">Price</th>
          <th class="num">1D</th>
          <th class="num">1W</th>
          <th class="num">1M</th>
          <th class="num">YTD</th>
        </tr></thead>
        <tbody>${r}</tbody>
      </table>
    </div>`}function Ct(t){const a=ut.map(({symbol:s,name:e})=>{const n=t.get(s);return{name:e,pct1d:(n==null?void 0:n.pct1d)??null,pct1m:(n==null?void 0:n.pct1m)??null,pctYtd:(n==null?void 0:n.pctYtd)??null}});a.sort((s,e)=>(e.pct1d??-999)-(s.pct1d??-999));const r=Math.max(.01,...a.map(s=>Math.abs(s.pct1d??0)));return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">US Equity Sectors</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Sector</th>
          <th class="sec-bar-cell"></th>
          <th class="num">1D</th>
          <th class="num">1M</th>
          <th class="num">YTD</th>
        </tr></thead>
        <tbody>${a.map(({name:s,pct1d:e,pct1m:n,pctYtd:i})=>{const o=R(e),c=R(n),p=R(i),u=e!=null?Math.abs(e)/r*100:0;return`<tr>
      <td class="mkt-name sec-name">${s}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${o.cls}" style="width:${u.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${o.cls}">${o.text}</td>
      <td class="num pct-cell ${c.cls}">${c.text}</td>
      <td class="num pct-cell ${p.cls}">${p.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Et(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Crypto</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th>
          <th class="num">Price (USD)</th>
          <th class="num">1D</th>
          <th class="num">1W</th>
          <th class="num">1M</th>
          <th class="num">YTD</th>
        </tr></thead>
        <tbody>${pt.map(({symbol:r,name:l,abbr:s})=>{const e=t.get(r),n=e==null?void 0:e.regularMarketPrice,i=n!=null?"$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:n>=100?2:4}):"—";return`<tr>
      <td class="mkt-name">${l} <span class="mkt-abbr">${s}</span></td>
      <td class="num mono">${i}</td>
      ${g(e==null?void 0:e.pct1d)}
      ${g(e==null?void 0:e.pct1w)}
      ${g(e==null?void 0:e.pct1m)}
      ${g(e==null?void 0:e.pctYtd)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}async function At(t){t.innerHTML=`
    <div class="mkt-topbar">
      <div class="mkt-topbar-left">
        <h2 class="mkt-title">Market Overview</h2>
        <span class="mkt-timestamp" id="mkt-timestamp">Loading…</span>
      </div>
      <button class="ghost-btn mkt-refresh-btn" id="mkt-refresh">↺ Refresh</button>
    </div>

    <!-- Quick Stats Strip -->
    <div class="mkt-stat-strip" id="mkt-stats">
      ${Array.from({length:6},()=>`
        <div class="mkt-stat-card">
          <div class="mkt-stat-name"><span class="skel" style="width:60px"></span></div>
          <div class="mkt-stat-price"><span class="skel" style="width:90px;height:20px"></span></div>
          <div class="mkt-stat-chg"><span class="skel" style="width:55px"></span></div>
          <div class="mkt-stat-ytd"><span class="skel" style="width:70px"></span></div>
        </div>`).join("")}
    </div>

    <!-- Global Equities -->
    <section class="mkt-section" id="mkt-equities">
      <div class="mkt-panel">
        <div class="mkt-panel-label">Global Equities</div>
        <table class="mkt-table"><tbody>${B(18)}</tbody></table>
      </div>
    </section>

    <!-- Bonds + FX -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Treasuries</div>
          <table class="mkt-table"><tbody>${B(4,4)}</tbody></table>
        </div>
      </div>
      <div id="mkt-fx">
        <div class="mkt-panel">
          <div class="mkt-panel-label">FX Rates</div>
          <table class="mkt-table"><tbody>${B(8,6)}</tbody></table>
        </div>
      </div>
    </section>

    <!-- Commodities + Sectors -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-commodities">
        <div class="mkt-panel">
          <div class="mkt-panel-label">Commodities</div>
          <table class="mkt-table"><tbody>${B(8,6)}</tbody></table>
        </div>
      </div>
      <div id="mkt-sectors">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Equity Sectors</div>
          <table class="mkt-table"><tbody>${B(11,5)}</tbody></table>
        </div>
      </div>
    </section>

    <!-- Crypto -->
    <section class="mkt-section" id="mkt-crypto">
      <div class="mkt-panel">
        <div class="mkt-panel-label">Crypto</div>
        <table class="mkt-table"><tbody>${B(4,6)}</tbody></table>
      </div>
    </section>
  `;const a=t.querySelector("#mkt-refresh");async function r(){const s=t.querySelector("#mkt-timestamp");s.textContent="Loading…";const e=await St(kt);if(!t.isConnected)return;t.querySelector("#mkt-stats").innerHTML=wt(e),t.querySelector("#mkt-equities").innerHTML=Lt(e),t.querySelector("#mkt-bonds").innerHTML=Dt(e),t.querySelector("#mkt-fx").innerHTML=Mt(e),t.querySelector("#mkt-commodities").innerHTML=Tt(e),t.querySelector("#mkt-sectors").innerHTML=Ct(e),t.querySelector("#mkt-crypto").innerHTML=Et(e);const n=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});s.textContent=`Updated ${n}`}a.addEventListener("click",r),await r();const l=setInterval(r,30*60*1e3);return()=>clearInterval(l)}const xt="modulepreload",Pt=function(t){return"/investment-dash/"+t},q={},Ft=function(a,r,l){let s=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),i=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));s=Promise.allSettled(r.map(o=>{if(o=Pt(o),o in q)return;q[o]=!0;const c=o.endsWith(".css"),p=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${p}`))return;const u=document.createElement("link");if(u.rel=c?"stylesheet":xt,c||(u.as="script"),u.crossOrigin="",u.href=o,i&&u.setAttribute("nonce",i),document.head.appendChild(u),c)return new Promise((v,S)=>{u.addEventListener("load",v),u.addEventListener("error",()=>S(new Error(`Unable to preload CSS for ${o}`)))})}))}function e(n){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=n,window.dispatchEvent(i),!i.defaultPrevented)throw n}return s.then(n=>{for(const i of n||[])i.status==="rejected"&&e(i.reason);return a().catch(e)})},G=[{label:"US (NYSE / NASDAQ)",suffix:"",example:"AAPL"},{label:"Australia (ASX)",suffix:".AX",example:"CBA.AX"},{label:"UK (LSE)",suffix:".L",example:"HSBA.L"},{label:"Canada (TSX)",suffix:".TO",example:"RY.TO"},{label:"Germany (XETRA)",suffix:".DE",example:"SAP.DE"},{label:"Japan (TSE)",suffix:".T",example:"7203.T"},{label:"Hong Kong (HKEX)",suffix:".HK",example:"0700.HK"}],_=[{label:"1W",range:"5d",interval:"1d"},{label:"1M",range:"1mo",interval:"1d"},{label:"3M",range:"3mo",interval:"1d"},{label:"6M",range:"6mo",interval:"1d"},{label:"1Y",range:"1y",interval:"1d"},{label:"2Y",range:"2y",interval:"1wk"},{label:"5Y",range:"5y",interval:"1wk"},{label:"MAX",range:"max",interval:"1mo"}],Ut={ma20:{period:20,color:"#fbbf24",label:"MA 20"},ma50:{period:50,color:"#60a5fa",label:"MA 50"},ma200:{period:200,color:"#f87171",label:"MA 200"}};function bt(t,a){const r=[];for(let l=a-1;l<t.length;l++){const s=t.slice(l-a+1,l+1).reduce((e,n)=>e+n.close,0);r.push({time:t[l].time,value:+(s/a).toFixed(4)})}return r}function Xt(t,a=20,r=2){const l=bt(t,a),s=[],e=[];for(let n=0;n<l.length;n++){const i=n+a-1,o=t.slice(i-a+1,i+1).map(u=>u.close),c=l[n].value,p=Math.sqrt(o.reduce((u,v)=>u+(v-c)**2,0)/a);s.push({time:l[n].time,value:+(c+r*p).toFixed(4)}),e.push({time:l[n].time,value:+(c-r*p).toFixed(4)})}return{upper:s,mid:l,lower:e}}const tt=new Map,et=new Map,ht=5*60*1e3;function Ht(t){const a=new Date(t*1e3);return`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}-${String(a.getDate()).padStart(2,"0")}`}async function st(t,a,r){var C,f;const l=`${t}:${a}:${r}`,s=tt.get(l);if(s&&Date.now()-s.ts<ht)return s.data;const e=`/v8/finance/chart/${encodeURIComponent(t)}?range=${a}&interval=${r}&includePrePost=false`,n=await fetch(it(e),{headers:{Accept:"application/json"}});if(!n.ok)throw new Error(`HTTP ${n.status}`);const i=await n.json(),o=(f=(C=i==null?void 0:i.chart)==null?void 0:C.result)==null?void 0:f[0];if(!o)throw new Error("Symbol not found");const c=o.timestamp??[],p=o.indicators.quote[0],u=[],v=[];for(let b=0;b<c.length;b++){if(p.open[b]==null||p.close[b]==null)continue;const k=Ht(c[b]);u.push({time:k,open:+p.open[b].toFixed(4),high:+p.high[b].toFixed(4),low:+p.low[b].toFixed(4),close:+p.close[b].toFixed(4)}),v.push({time:k,value:p.volume[b]??0,color:p.close[b]>=p.open[b]?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"})}const S={candles:u,volumes:v,meta:o.meta};return tt.set(l,{ts:Date.now(),data:S}),S}async function Yt(t){var i,o;const a=et.get(t);if(a&&Date.now()-a.ts<ht)return a.data;const l=`/v10/finance/quoteSummary/${encodeURIComponent(t)}?modules=price,summaryDetail,defaultKeyStatistics,financialData,assetProfile`,s=await fetch(it(l),{headers:{Accept:"application/json"}});if(!s.ok)return null;const e=await s.json(),n=((o=(i=e==null?void 0:e.quoteSummary)==null?void 0:i.result)==null?void 0:o[0])??null;return n&&et.set(t,{ts:Date.now(),data:n}),n}const P=(t,a={})=>t==null?"—":t.toLocaleString("en-US",a),O=t=>t==null?"—":`${t>=0?"+":""}${(t*100).toFixed(2)}%`,K=t=>t==null?"—":t>=1e12?`$${(t/1e12).toFixed(2)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString()}`;function Bt(t,a){var p,u,v,S,C,f,b,k,E,w,L,F,M,T,H;if(!a){t.innerHTML='<div class="sa-no-data">Fundamental data unavailable.</div>';return}const r=a.price??{},l=a.summaryDetail??{},s=a.defaultKeyStatistics??{},e=a.financialData??{},n=a.assetProfile??{},o=[["Market Cap",K((p=r.marketCap)==null?void 0:p.raw)],["P/E (TTM)",P((u=l.trailingPE)==null?void 0:u.raw,{maximumFractionDigits:1})],["Fwd P/E",P((v=l.forwardPE)==null?void 0:v.raw,{maximumFractionDigits:1})],["EPS (TTM)",((S=s.trailingEps)==null?void 0:S.raw)!=null?`$${s.trailingEps.raw.toFixed(2)}`:"—"],["52W High",P((C=l.fiftyTwoWeekHigh)==null?void 0:C.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["52W Low",P((f=l.fiftyTwoWeekLow)==null?void 0:f.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["Div Yield",O((b=l.dividendYield)==null?void 0:b.raw)],["Beta",P((k=l.beta)==null?void 0:k.raw,{maximumFractionDigits:2})],["Revenue TTM",K((E=e.totalRevenue)==null?void 0:E.raw)],["Gross Margin",O((w=e.grossMargins)==null?void 0:w.raw)],["Op Margin",O((L=e.operatingMargins)==null?void 0:L.raw)],["ROE",O((F=e.returnOnEquity)==null?void 0:F.raw)],["P/B Ratio",P((M=s.priceToBook)==null?void 0:M.raw,{maximumFractionDigits:2})],["Avg Volume",P((T=l.averageVolume)==null?void 0:T.raw)],["Employees",P(n.fullTimeEmployees)],["Free Cash Flow",K((H=e.freeCashflow)==null?void 0:H.raw)]].map(([A,x])=>`
    <div class="sa-fund-card">
      <div class="sa-fund-label">${A}</div>
      <div class="sa-fund-val">${x}</div>
    </div>`).join(""),c=[n.sector,n.industry].filter(Boolean).map(A=>`<span class="sa-badge">${A}</span>`).join("");t.innerHTML=`
    <div class="sa-section-label">Key Metrics</div>
    <div class="sa-fund-grid">${o}</div>
    ${n.longBusinessSummary?`
      <div class="sa-about">
        <div class="sa-section-label">About ${c}</div>
        <p class="sa-about-text">${n.longBusinessSummary}</p>
      </div>`:""}
  `}function Rt(t,a,r){var p,u,v;const l=(r==null?void 0:r.price)??{},s=l.longName||l.shortName||(a==null?void 0:a.symbol)||"",e=((p=l.regularMarketPrice)==null?void 0:p.raw)??(a==null?void 0:a.regularMarketPrice)??0,n=(((u=l.regularMarketChangePercent)==null?void 0:u.raw)??0)*100,i=((v=l.regularMarketChange)==null?void 0:v.raw)??0,o=l.exchangeName||(a==null?void 0:a.exchangeName)||"",c=n>=0;t.innerHTML=`
    <div class="sa-hdr-left">
      <div class="sa-hdr-name">${s} <span class="sa-hdr-sym">${(a==null?void 0:a.symbol)??""}</span></div>
      <div class="sa-hdr-exch">${o}</div>
    </div>
    <div class="sa-hdr-right">
      <div class="sa-hdr-price">${e.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div class="sa-hdr-chg ${c?"up":"dn"}">${c?"+":""}${i.toFixed(2)} (${c?"+":""}${n.toFixed(2)}%)</div>
    </div>
  `}let W=null;async function at(){return W||(W=await Ft(()=>import("./lightweight-charts.production-C-4kb1nc.js"),[])),W}async function It(t){const a=G.map((d,m)=>`<option value="${m}">${d.label}</option>`).join(""),r=_.map((d,m)=>`<button class="sa-range-btn${m===4?" active":""}" data-ri="${m}">${d.label}</button>`).join("");t.innerHTML=`
    <div class="sa-layout">
      <div class="sa-search-bar">
        <select class="sa-market-sel" id="sa-mkt">${a}</select>
        <input class="sa-ticker-inp" id="sa-ticker" type="text" placeholder="Ticker (e.g. AAPL)" spellcheck="false" autocomplete="off" />
        <button class="ghost-btn sa-go-btn" id="sa-go">Search</button>
      </div>

      <div class="sa-placeholder" id="sa-ph">
        <div class="sa-ph-icon">📈</div>
        <div class="sa-ph-title">Enter a ticker to get started</div>
        <div class="sa-ph-hint">e.g. AAPL · CBA.AX · HSBA.L · 7203.T</div>
      </div>

      <div class="sa-main" id="sa-main" style="display:none">
        <div class="sa-hdr" id="sa-hdr"></div>

        <div class="sa-controls">
          <div class="sa-ranges">${r}</div>
          <div class="sa-opts">
            <div class="sa-type-group">
              <button class="sa-opt active" data-type="candle">Candle</button>
              <button class="sa-opt" data-type="line">Line</button>
            </div>
            <div class="sa-ind-group">
              <button class="sa-opt" data-ind="ma20">MA 20</button>
              <button class="sa-opt" data-ind="ma50">MA 50</button>
              <button class="sa-opt" data-ind="ma200">MA 200</button>
              <button class="sa-opt" data-ind="bb">BB</button>
              <button class="sa-opt active" data-ind="vol">Vol</button>
              <button class="sa-opt" id="sa-annot-btn">+ Line</button>
            </div>
          </div>
        </div>

        <div class="sa-chart-wrap" id="sa-chart-wrap">
          <div id="sa-chart"></div>
          <div class="sa-tt" id="sa-tt"></div>
          <div class="sa-overlay" id="sa-overlay" style="display:none">
            <div class="sa-spinner"></div>
          </div>
        </div>

        <div class="sa-annot-list" id="sa-annot-list"></div>
        <div class="sa-funds" id="sa-funds"></div>
      </div>
    </div>
  `;let l=null,s={},e=[],n=!1,i=new Set(["vol"]),o="candle",c=[],p=[],u=4,v=null,S=null;const C=t.querySelector("#sa-ph"),f=t.querySelector("#sa-main"),b=t.querySelector("#sa-hdr"),k=t.querySelector("#sa-chart"),E=t.querySelector("#sa-overlay"),w=t.querySelector("#sa-tt"),L=t.querySelector("#sa-annot-list"),F=t.querySelector("#sa-funds"),M=t.querySelector("#sa-mkt"),T=t.querySelector("#sa-ticker"),H=t.querySelector("#sa-go"),A=t.querySelector("#sa-annot-btn");async function x(){if(l)return;const{createChart:d,CrosshairMode:m}=await at();l=d(k,{width:k.clientWidth||900,height:480,layout:{background:{color:"#0b0d14"},textColor:"#8892a4",fontSize:11,fontFamily:"'DM Mono', monospace"},grid:{vertLines:{color:"#1a1d26"},horzLines:{color:"#1a1d26"}},crosshair:{mode:m.Normal},rightPriceScale:{borderColor:"#2a2d3e"},timeScale:{borderColor:"#2a2d3e",timeVisible:!0,secondsVisible:!1}}),S=new ResizeObserver(()=>{l&&k.clientWidth&&l.resize(k.clientWidth,480)}),S.observe(k),l.subscribeCrosshairMove(y=>{var Q;if(!y.time||!y.point||!s.main){w.style.display="none";return}const h=y.seriesData.get(s.main);if(!h){w.style.display="none";return}const j="open"in h?`O <b>${h.open}</b>  H <b>${h.high}</b>  L <b>${h.low}</b>  C <b>${h.close}</b>`:`<b>${(Q=h.value)==null?void 0:Q.toFixed(4)}</b>`,z=y.seriesData.get(s.vol),vt=z?`  Vol <b>${P(z.value)}</b>`:"";w.innerHTML=`<span class="sa-tt-date">${y.time}</span>  ${j}${vt}`,w.style.display="block"}),l.subscribeClick(y=>{if(!n||!y.point||!s.main)return;const h=s.main.coordinateToPrice(y.point.y);if(h==null)return;const{LineStyle:X}=W,j=s.main.createPriceLine({price:h,color:"#7c6af7",lineWidth:1,lineStyle:X.Dashed,axisLabelVisible:!0,title:h.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})});e.push({pl:j,price:h}),Y()})}async function U(){const{LineStyle:d}=await at();Object.values(s).forEach(m=>{try{l.removeSeries(m)}catch{}}),s={},e=[],Y(),i.has("vol")&&(s.vol=l.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"vol"}),l.priceScale("vol").applyOptions({scaleMargins:{top:.82,bottom:0}}),s.vol.setData(p)),l.priceScale("right").applyOptions({scaleMargins:{top:.06,bottom:i.has("vol")?.22:.04}}),o==="candle"?(s.main=l.addCandlestickSeries({upColor:"#34d399",downColor:"#f87171",borderVisible:!1,wickUpColor:"#34d399",wickDownColor:"#f87171"}),s.main.setData(c)):(s.main=l.addLineSeries({color:"#7c6af7",lineWidth:2}),s.main.setData(c.map(m=>({time:m.time,value:m.close}))));for(const[m,y]of Object.entries(Ut))!i.has(m)||c.length<y.period||(s[m]=l.addLineSeries({color:y.color,lineWidth:1,title:y.label}),s[m].setData(bt(c,y.period)));if(i.has("bb")&&c.length>=20){const{upper:m,mid:y,lower:h}=Xt(c);s.bbU=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:d.Dashed}),s.bbM=l.addLineSeries({color:"rgba(124,106,247,0.4)",lineWidth:1}),s.bbL=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:d.Dashed}),s.bbU.setData(m),s.bbM.setData(y),s.bbL.setData(h)}l.timeScale().fitContent()}function Y(){if(!e.length){L.innerHTML="";return}L.innerHTML=`
      <div class="sa-annot-wrap">
        <span class="sa-section-label">Price Levels</span>
        <div class="sa-annot-pills">
          ${e.map((d,m)=>`
            <span class="sa-annot-pill">
              ${d.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              <button class="sa-annot-x" data-i="${m}">×</button>
            </span>`).join("")}
        </div>
      </div>`,L.querySelectorAll(".sa-annot-x").forEach(d=>{d.addEventListener("click",()=>{const m=+d.dataset.i;try{s.main.removePriceLine(e[m].pl)}catch{}e.splice(m,1),Y()})})}async function $(d){v=d;const{range:m,interval:y}=_[u];E.style.display="flex",C.style.display="none",f.style.display="block",b.innerHTML=`<div class="sa-hdr-loading">Loading ${d}…</div>`,F.innerHTML="";try{await x();const[h,X]=await Promise.all([st(d,m,y),Yt(d)]);c=h.candles,p=h.volumes,Rt(b,h.meta,X),await U(),Bt(F,X)}catch{b.innerHTML=`<div class="sa-error">Symbol <b>${d}</b> not found or no data available.</div>`,F.innerHTML=""}finally{E.style.display="none"}}async function D(d){if(!v)return;u=d,t.querySelectorAll(".sa-range-btn").forEach((h,X)=>h.classList.toggle("active",X===d));const{range:m,interval:y}=_[d];E.style.display="flex";try{const h=await st(v,m,y);c=h.candles,p=h.volumes,await U()}finally{E.style.display="none"}}t.querySelectorAll(".sa-range-btn").forEach((d,m)=>d.addEventListener("click",()=>D(m))),M.addEventListener("change",()=>{T.placeholder=`Ticker (e.g. ${G[+M.value].example})`});async function J(){const d=T.value.trim().toUpperCase(),m=G[+M.value];if(!d)return;const y=m.suffix&&!d.endsWith(m.suffix)?`${d}${m.suffix}`:d;await $(y)}return H.addEventListener("click",J),T.addEventListener("keydown",d=>{d.key==="Enter"&&J()}),t.querySelectorAll("[data-type]").forEach(d=>d.addEventListener("click",async()=>{o=d.dataset.type,t.querySelectorAll("[data-type]").forEach(m=>m.classList.remove("active")),d.classList.add("active"),c.length&&await U()})),t.querySelectorAll("[data-ind]").forEach(d=>d.addEventListener("click",async()=>{const m=d.dataset.ind;i.has(m)?i.delete(m):i.add(m),d.classList.toggle("active",i.has(m)),c.length&&await U()})),A.addEventListener("click",()=>{n=!n,A.classList.toggle("active",n),t.querySelector("#sa-chart-wrap").classList.toggle("sa-annotating",n)}),()=>{S==null||S.disconnect(),l&&(l.remove(),l=null),s={},e=[]}}function Ot(t){t.innerHTML=`
    <div class="placeholder-view">
      <div class="placeholder-icon">💼</div>
      <div class="placeholder-title">Portfolio Analysis</div>
      <p class="placeholder-body">
        Track your holdings, view allocation breakdowns, monitor performance
        vs benchmarks, and analyse risk. Coming soon.
      </p>
    </div>
  `}const Nt=["market","stock","portfolio"],Wt={market:"Markets",stock:"Stock Analysis",portfolio:"Portfolio"};let N="market",I=null;function jt(t){t.innerHTML=`
    <div class="topbar">
      <div class="topbar-left">
        <div class="logo">invest<span>.</span>dash</div>
      </div>
      <div class="topbar-center">
        <div class="tabs" id="main-tabs">
          ${Nt.map(s=>`
            <button class="tab ${s===N?"active":""}" data-tab="${s}">
              ${Wt[s]}
            </button>`).join("")}
        </div>
      </div>
      <div class="topbar-right"></div>
    </div>

    <div class="main-content" id="tab-content"></div>
  `;const a=t.querySelector("#main-tabs"),r=t.querySelector("#tab-content");function l(s){s!==N&&(N=s,a.querySelectorAll(".tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===s)}),nt(r,s))}a.addEventListener("click",s=>{const e=s.target.closest(".tab");e&&l(e.dataset.tab)}),nt(r,N)}function nt(t,a){I&&(I(),I=null),t.innerHTML="",a==="market"?At(t).then(r=>{I=r??null}):a==="stock"?It(t).then(r=>{I=r??null}):a==="portfolio"&&Ot(t)}jt(document.getElementById("app"));
