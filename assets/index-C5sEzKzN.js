(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))l(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const e of a.addedNodes)e.tagName==="LINK"&&e.rel==="modulepreload"&&l(e)}).observe(document,{childList:!0,subtree:!0});function r(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function l(s){if(s.ep)return;s.ep=!0;const a=r(s);fetch(s.href,a)}})();const Rt="https://yf-proxy.lukewynd.workers.dev";function st(t){return`${Rt}${t}`}function te(t){const n=encodeURIComponent(t);return`${Rt}/v8/finance/chart/${n}?range=1y&interval=1d`}const Dt=new Map,ee=5*60*1e3;async function ae(t){var r,l,s,a,e,o;const n=Dt.get(t);if(n&&Date.now()-n.ts<ee)return n.data;try{const d=await fetch(te(t),{headers:{Accept:"application/json"}});if(!d.ok)return null;const u=await d.json(),i=(l=(r=u==null?void 0:u.chart)==null?void 0:r.result)==null?void 0:l[0];if(!i)return null;const m=i.meta,b=((e=(a=(s=i.indicators)==null?void 0:s.quote)==null?void 0:a[0])==null?void 0:e.close)??[],y=T=>{for(let L=T;L>=0;L--)if(b[L]!=null)return{index:L,value:b[L]};return null},p=y(b.length-1),S=p?y(p.index-1):null,f=m.regularMarketPrice??null??(p==null?void 0:p.value)??null,w=(S==null?void 0:S.value)??null,C=f!=null&&w!=null?f-w:null,P=C!=null&&w!==0?C/w*100:null,I=b.length,F=(p==null?void 0:p.index)??-1,M=f,H=T=>{let L=F-T;for(;L>=0&&b[L]==null;)L--;const K=L>=0?b[L]:null;return K!=null&&M!=null&&K!==0?(M-K)/K*100:null},B=T=>{let L=F-T;for(;L>=0&&b[L]==null;)L--;return L>=0?b[L]:null},N=T=>{const L=B(T);return L!=null&&M!=null?M-L:null},E=new Date().getFullYear(),j=i.timestamp??[];let O=null;for(let T=0;T<j.length;T++)if(new Date(j[T]*1e3).getFullYear()===E&&b[T]!=null){O=b[T];break}const z=O!=null&&O!==0&&M!=null?(M-O)/O*100:null,Y={symbol:t,regularMarketPrice:f,regularMarketChangePercent:P,regularMarketChange:C,previousClose:w,dataTimestamp:((o=i.timestamp)==null?void 0:o[F])??null,source:"Yahoo Finance chart",quoteType:m.instrumentType??"",ytdPct:z,pct1d:P,pct1w:H(5),pct1m:H(21),pct3m:H(63),pctYtd:z,change1d:C,change1w:N(5),change1m:N(21),change3m:N(63),changeYtd:O!=null&&M!=null?M-O:null};return Dt.set(t,{ts:Date.now(),data:Y}),Y}catch{return null}}async function se(t){const r=new Map;for(let l=0;l<t.length;l+=8){const s=t.slice(l,l+8),a=await Promise.allSettled(s.map(e=>ae(e)));s.forEach((e,o)=>{const d=a[o].status==="fulfilled"?a[o].value:null;d&&r.set(e,d)})}return r}const Bt=[{symbol:"^GSPC",name:"S&P 500",type:"index"},{symbol:"^VIX",name:"VIX",type:"vix"},{symbol:"^TNX",name:"US 10Y",type:"yield"},{symbol:"DX-Y.NYB",name:"DXY",type:"index"},{symbol:"GC=F",name:"Gold",type:"commodity"},{symbol:"BTC-USD",name:"Bitcoin",type:"crypto"}],Ot=[{symbol:"^GSPC",name:"S&P 500",region:"Americas"},{symbol:"^IXIC",name:"NASDAQ Comp.",region:"Americas"},{symbol:"^DJI",name:"Dow Jones",region:"Americas"},{symbol:"^RUT",name:"Russell 2000",region:"Americas"},{symbol:"^BVSP",name:"Bovespa",region:"Americas"},{symbol:"^MXX",name:"IPC Mexico",region:"Americas"},{symbol:"^FTSE",name:"FTSE 100",region:"Europe"},{symbol:"^GDAXI",name:"DAX",region:"Europe"},{symbol:"^FCHI",name:"CAC 40",region:"Europe"},{symbol:"^STOXX50E",name:"Euro Stoxx 50",region:"Europe"},{symbol:"^SSMI",name:"SMI",region:"Europe"},{symbol:"^AEX",name:"AEX",region:"Europe"},{symbol:"^N225",name:"Nikkei 225",region:"Asia-Pacific"},{symbol:"^HSI",name:"Hang Seng",region:"Asia-Pacific"},{symbol:"000001.SS",name:"Shanghai Comp.",region:"Asia-Pacific"},{symbol:"^AXJO",name:"ASX 200",region:"Asia-Pacific"},{symbol:"^KS11",name:"KOSPI",region:"Asia-Pacific"},{symbol:"^STI",name:"Straits Times",region:"Asia-Pacific"}],Xt=[{symbol:"^IRX",name:"3-Month"},{symbol:"^FVX",name:"5-Year"},{symbol:"^TNX",name:"10-Year"},{symbol:"^TYX",name:"30-Year"}],Nt=[{symbol:"BWX",name:"Global ex-US Treasuries",region:"Global"},{symbol:"IGOV",name:"International Treasuries",region:"Developed"},{symbol:"EMB",name:"Emerging Market Sovereign",region:"Emerging"},{symbol:"EWJ",name:"Japan rates proxy",region:"Japan"}],kt=[{code:"USD",name:"US Dollar",symbol:null,invert:!1},{code:"EUR",name:"Euro",symbol:"EURUSD=X",invert:!1},{code:"GBP",name:"Sterling",symbol:"GBPUSD=X",invert:!1},{code:"JPY",name:"Yen",symbol:"USDJPY=X",invert:!0},{code:"AUD",name:"Aus Dollar",symbol:"AUDUSD=X",invert:!1},{code:"CAD",name:"Can Dollar",symbol:"USDCAD=X",invert:!0},{code:"CHF",name:"Swiss Franc",symbol:"USDCHF=X",invert:!0}],ne=kt.filter(t=>t.symbol).map(t=>t.symbol),Yt=[{symbol:"GC=F",name:"Gold",unit:"/oz",group:"Metals"},{symbol:"SI=F",name:"Silver",unit:"/oz",group:"Metals"},{symbol:"HG=F",name:"Copper",unit:"/lb",group:"Metals"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl",group:"Energy"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl",group:"Energy"},{symbol:"NG=F",name:"Nat. Gas",unit:"/MMBtu",group:"Energy"},{symbol:"ZW=F",name:"Wheat",unit:"/bu",group:"Agri"},{symbol:"ZC=F",name:"Corn",unit:"/bu",group:"Agri"}],jt=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],Wt=[{symbol:"BTC-USD",name:"Bitcoin",abbr:"BTC"},{symbol:"ETH-USD",name:"Ethereum",abbr:"ETH"},{symbol:"SOL-USD",name:"Solana",abbr:"SOL"},{symbol:"XRP-USD",name:"XRP",abbr:"XRP"}],bt=[...new Set([...Bt.map(t=>t.symbol),...Ot.map(t=>t.symbol),...Xt.map(t=>t.symbol),...Nt.map(t=>t.symbol),...ne,...Yt.map(t=>t.symbol),...jt.map(t=>t.symbol),...Wt.map(t=>t.symbol)])];function ut(t,n=2){return t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:n,maximumFractionDigits:n})}function W(t){if(t==null)return{text:"—",cls:""};const n=t>=0?"+":"",r=t>=0?"up":"dn",l=Math.abs(t)>=3?" strong":"";return{text:`${n}${t.toFixed(2)}%`,cls:r+l}}function le(t){if(t==null)return{text:"—",cls:""};const n=Math.round(t*100),r=n>=0?"+":"",l=n>=0?"up":"dn";return{text:`${r}${n}bps`,cls:l}}function X(t){const n=W(t);return`<td class="num pct-cell ${n.cls}">${n.text}</td>`}function et(t,n=7){return Array.from({length:t},()=>`<tr>${Array.from({length:n},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function oe(t){return Bt.map(({symbol:n,name:r,type:l})=>{const s=t.get(n),a=s==null?void 0:s.regularMarketPrice,e=W((s==null?void 0:s.pct1d)??null),o=W((s==null?void 0:s.pctYtd)??null);let d="—";return a!=null&&(l==="yield"?d=a.toFixed(2)+"%":l==="crypto"?d="$"+a.toLocaleString("en-US",{maximumFractionDigits:0}):l==="commodity"?d="$"+ut(a):d=ut(a)),`
      <div class="mkt-stat-card">
        <div class="mkt-stat-name">${r}</div>
        <div class="mkt-stat-price">${d}</div>
        <div class="mkt-stat-chg ${e.cls}">${e.text}</div>
        <div class="mkt-stat-ytd ${o.cls}">${o.text} YTD</div>
      </div>`}).join("")}function re(t){const n=["Americas","Europe","Asia-Pacific"];let r="";return n.forEach(l=>{const s=Ot.filter(a=>a.region===l);r+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,r+=s.map(({symbol:a,name:e})=>{const o=t.get(a),d=o==null?void 0:o.regularMarketPrice,u=d!=null?d.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";return`<tr>
        <td class="mkt-name">${e}</td>
        <td class="num mono">${u}</td>
        ${X(o==null?void 0:o.pct1d)}
        ${X(o==null?void 0:o.pct1w)}
        ${X(o==null?void 0:o.pct1m)}
        ${X(o==null?void 0:o.pct3m)}
        ${X(o==null?void 0:o.pctYtd)}
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
    </div>`}function ie(t){const n=Xt.map(({symbol:s,name:a})=>{const e=t.get(s),o=(e==null?void 0:e.regularMarketPrice)??null;return{name:a,yld:o,change1d:(e==null?void 0:e.change1d)??null,change1w:(e==null?void 0:e.change1w)??null,change1m:(e==null?void 0:e.change1m)??null,change3m:(e==null?void 0:e.change3m)??null,changeYtd:(e==null?void 0:e.changeYtd)??null}}),r=Math.max(.01,...n.map(s=>s.yld??0));return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">US Treasuries · cash curve</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Tenor</th>
          <th class="num">Yield</th>
          <th></th>
          <th class="num">1D</th>
          <th class="num">1W</th>
          <th class="num">1M</th>
          <th class="num">3M</th>
          <th class="num">YTD</th>
        </tr></thead>
        <tbody>${n.map(({name:s,yld:a,change1d:e,change1w:o,change1m:d,change3m:u,changeYtd:i})=>{const m=[e,o,d,u,i].map(le),b=a!=null?a.toFixed(2)+"%":"—",y=a!=null?a/r*100:0;return`<tr>
      <td class="mkt-name">${s}</td>
      <td class="num mono">${b}</td>
      <td class="yc-bar-cell"><span class="yc-bar" style="width:${y.toFixed(1)}%"></span></td>
      ${m.map(p=>`<td class="num pct-cell ${p.cls}">${p.text}</td>`).join("")}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function ce(t){return`<div class="mkt-panel">
    <div class="mkt-panel-label">Global Bond Markets · price proxies</div>
    <table class="mkt-table">
      <thead><tr><th>Instrument</th><th class="num">Level</th><th class="num">1D</th><th class="num">1M</th><th class="num">YTD</th></tr></thead>
      <tbody>${Nt.map(({symbol:r,name:l,region:s})=>{const a=t.get(r),e=a==null?void 0:a.regularMarketPrice,o=W(a==null?void 0:a.pct1d),d=W(a==null?void 0:a.pct1m),u=W(a==null?void 0:a.pctYtd);return`<tr>
      <td><span class="mkt-name">${l}</span><span class="mkt-unit">${s}</span></td>
      <td class="num mono">${e!=null?ut(e):"—"}</td>
      <td class="num pct-cell ${o.cls}">${o.text}</td>
      <td class="num pct-cell ${d.cls}">${d.text}</td>
      <td class="num pct-cell ${u.cls}">${u.text}</td>
    </tr>`}).join("")}</tbody>
    </table>
  </div>`}function de(t){const n={USD:1};kt.forEach(({code:e,symbol:o,invert:d})=>{var i;if(!o)return;const u=(i=t.get(o))==null?void 0:i.regularMarketPrice;u!=null&&(n[e]=d?1/u:u)});const r=e=>e==null?"—":e>=100?e.toFixed(2):e>=10?e.toFixed(3):e.toFixed(4),l=kt.map(e=>e.code),s=l.map(e=>`<th class="num fx-col-hdr">${e}</th>`).join(""),a=l.map(e=>{const o=l.map(d=>{if(e===d)return'<td class="fx-diag">—</td>';const u=n[e],i=n[d],m=u!=null&&i!=null&&i!==0?u/i:null;return`<td class="num fx-cell">${r(m)}</td>`}).join("");return`<tr><th class="fx-row-hdr">${e}</th>${o}</tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Cross Rates <span class="mkt-panel-sub">1 row = X column</span></div>
      <div class="fx-matrix-wrap">
        <table class="fx-matrix">
          <thead><tr><th></th>${s}</tr></thead>
          <tbody>${a}</tbody>
        </table>
      </div>
    </div>`}function ue(t){const n=["Metals","Energy","Agri"];let r="";return n.forEach(l=>{const s=Yt.filter(a=>a.group===l);r+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,r+=s.map(({symbol:a,name:e,unit:o})=>{const d=t.get(a),u=d==null?void 0:d.regularMarketPrice,i=u!=null?"$"+ut(u):"—";return`<tr>
        <td class="mkt-name">${e}<span class="mkt-unit">${o}</span></td>
        <td class="num mono">${i}</td>
        ${X(d==null?void 0:d.pct1d)}
        ${X(d==null?void 0:d.pct1w)}
        ${X(d==null?void 0:d.pct1m)}
        ${X(d==null?void 0:d.pctYtd)}
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
    </div>`}function me(t){const n=jt.map(({symbol:s,name:a})=>{const e=t.get(s);return{name:a,pct1d:(e==null?void 0:e.pct1d)??null,pct1m:(e==null?void 0:e.pct1m)??null,pctYtd:(e==null?void 0:e.pctYtd)??null}});n.sort((s,a)=>(a.pct1d??-999)-(s.pct1d??-999));const r=Math.max(.01,...n.map(s=>Math.abs(s.pct1d??0)));return`
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
        <tbody>${n.map(({name:s,pct1d:a,pct1m:e,pctYtd:o})=>{const d=W(a),u=W(e),i=W(o),m=a!=null?Math.abs(a)/r*100:0;return`<tr>
      <td class="mkt-name sec-name">${s}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${d.cls}" style="width:${m.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${d.cls}">${d.text}</td>
      <td class="num pct-cell ${u.cls}">${u.text}</td>
      <td class="num pct-cell ${i.cls}">${i.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function pe(t){return`
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
        <tbody>${Wt.map(({symbol:r,name:l,abbr:s})=>{const a=t.get(r),e=a==null?void 0:a.regularMarketPrice,o=e!=null?"$"+e.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:e>=100?2:4}):"—";return`<tr>
      <td class="mkt-name">${l} <span class="mkt-abbr">${s}</span></td>
      <td class="num mono">${o}</td>
      ${X(a==null?void 0:a.pct1d)}
      ${X(a==null?void 0:a.pct1w)}
      ${X(a==null?void 0:a.pct1m)}
      ${X(a==null?void 0:a.pctYtd)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}async function he(t){t.innerHTML=`
    <div class="mkt-topbar">
      <div class="mkt-topbar-left">
        <div><div class="eyebrow">01 / MACRO MONITOR</div><h1 class="mkt-title">Global cross-asset pulse</h1></div>
        <span class="mkt-timestamp" id="mkt-timestamp">Connecting…</span>
      </div>
      <div class="mkt-actions"><span class="data-note">Indicative · delayed</span><button class="ghost-btn mkt-refresh-btn" id="mkt-refresh">Refresh data</button></div>
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
        <table class="mkt-table"><tbody>${et(18)}</tbody></table>
      </div>
    </section>

    <!-- Bonds + FX -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Treasuries</div>
          <table class="mkt-table"><tbody>${et(4,8)}</tbody></table>
        </div>
      </div>
      <div id="mkt-fx">
        <div class="mkt-panel">
          <div class="mkt-panel-label">FX Cross Rates</div>
          <div class="fx-matrix-wrap"><span class="skel" style="display:block;height:160px;margin:14px"></span></div>
        </div>
      </div>
    </section>

    <section class="mkt-section" id="mkt-global-bonds">
      <div class="mkt-panel">
        <div class="mkt-panel-label">Global Bond Markets · price proxies</div>
        <table class="mkt-table"><tbody>${et(4,5)}</tbody></table>
      </div>
    </section>

    <!-- Commodities + Sectors -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-commodities">
        <div class="mkt-panel">
          <div class="mkt-panel-label">Commodities</div>
          <table class="mkt-table"><tbody>${et(8,6)}</tbody></table>
        </div>
      </div>
      <div id="mkt-sectors">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Equity Sectors</div>
          <table class="mkt-table"><tbody>${et(11,5)}</tbody></table>
        </div>
      </div>
    </section>

    <!-- Crypto -->
    <section class="mkt-section" id="mkt-crypto">
      <div class="mkt-panel">
        <div class="mkt-panel-label">Crypto</div>
        <table class="mkt-table"><tbody>${et(4,6)}</tbody></table>
      </div>
    </section>
  `;const n=t.querySelector("#mkt-refresh");async function r(){const s=t.querySelector("#mkt-timestamp");s.textContent="Loading…";const a=await se(bt);if(!t.isConnected)return;t.querySelector("#mkt-stats").innerHTML=oe(a),t.querySelector("#mkt-equities").innerHTML=re(a),t.querySelector("#mkt-bonds").innerHTML=ie(a),t.querySelector("#mkt-fx").innerHTML=de(a),t.querySelector("#mkt-global-bonds").innerHTML=ce(a),t.querySelector("#mkt-commodities").innerHTML=ue(a),t.querySelector("#mkt-sectors").innerHTML=me(a),t.querySelector("#mkt-crypto").innerHTML=pe(a);const e=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"}),o=bt.length-a.size;s.textContent=`Updated ${e} · ${a.size}/${bt.length} instruments${o?` · ${o} unavailable`:""}`}n.addEventListener("click",r),await r();const l=setInterval(r,30*60*1e3);return()=>clearInterval(l)}const be="modulepreload",ve=function(t){return"/investment-dash/"+t},Tt={},_t=function(n,r,l){let s=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const e=document.querySelector("meta[property=csp-nonce]"),o=(e==null?void 0:e.nonce)||(e==null?void 0:e.getAttribute("nonce"));s=Promise.allSettled(r.map(d=>{if(d=ve(d),d in Tt)return;Tt[d]=!0;const u=d.endsWith(".css"),i=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${i}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":be,u||(m.as="script"),m.crossOrigin="",m.href=d,o&&m.setAttribute("nonce",o),document.head.appendChild(m),u)return new Promise((b,y)=>{m.addEventListener("load",b),m.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${d}`)))})}))}function a(e){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=e,window.dispatchEvent(o),!o.defaultPrevented)throw e}return s.then(e=>{for(const o of e||[])o.status==="rejected"&&a(o.reason);return n().catch(a)})},vt=[{label:"US (NYSE / NASDAQ)",suffix:"",example:"AAPL"},{label:"Australia (ASX)",suffix:".AX",example:"CBA.AX"},{label:"UK (LSE)",suffix:".L",example:"HSBA.L"},{label:"Canada (TSX)",suffix:".TO",example:"RY.TO"},{label:"Germany (XETRA)",suffix:".DE",example:"SAP.DE"},{label:"Japan (TSE)",suffix:".T",example:"7203.T"},{label:"Hong Kong (HKEX)",suffix:".HK",example:"0700.HK"}],ft=[{label:"1W",range:"5d",interval:"1d"},{label:"1M",range:"1mo",interval:"1d"},{label:"3M",range:"3mo",interval:"1d"},{label:"6M",range:"6mo",interval:"1d"},{label:"1Y",range:"1y",interval:"1d"},{label:"2Y",range:"2y",interval:"1wk"},{label:"5Y",range:"5y",interval:"1wk"},{label:"MAX",range:"max",interval:"1mo"}],fe={ma20:{period:20,color:"#fbbf24",label:"MA 20D"},ma50:{period:50,color:"#60a5fa",label:"MA 50D"},ma200:{period:200,color:"#f87171",label:"MA 200D"}};function qt(t,n){const r=[];for(let l=n-1;l<t.length;l++){const s=t.slice(l-n+1,l+1).reduce((a,e)=>a+e.close,0);r.push({time:t[l].time,value:+(s/n).toFixed(4)})}return r}function ye(t,n,r){const l=qt(t,n);let s=0,a=null;return r.map(e=>{for(;s<l.length&&l[s].time<=e.time;)a=l[s].value,s+=1;return a==null?null:{time:e.time,value:a}}).filter(Boolean)}function ge(t,n=20,r=2){const l=qt(t,n),s=[],a=[];for(let e=0;e<l.length;e++){const o=e+n-1,d=t.slice(o-n+1,o+1).map(m=>m.close),u=l[e].value,i=Math.sqrt(d.reduce((m,b)=>m+(b-u)**2,0)/n);s.push({time:l[e].time,value:+(u+r*i).toFixed(4)}),a.push({time:l[e].time,value:+(u-r*i).toFixed(4)})}return{upper:s,mid:l,lower:a}}const mt=new Map,At=new Map,xt=5*60*1e3;function $t(t){const n=new Date(t*1e3);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`}async function Ct(t,n,r){var S,k;const l=`${t}:${n}:${r}`,s=mt.get(l);if(s&&Date.now()-s.ts<xt)return s.data;const a=`/v8/finance/chart/${encodeURIComponent(t)}?range=${n}&interval=${r}&includePrePost=false`,e=await fetch(st(a),{headers:{Accept:"application/json"}});if(!e.ok)throw new Error(`HTTP ${e.status}`);const o=await e.json(),d=(k=(S=o==null?void 0:o.chart)==null?void 0:S.result)==null?void 0:k[0];if(!d)throw new Error("Symbol not found");const u=d.timestamp??[],i=d.indicators.quote[0],m=new Map;for(let f=0;f<u.length;f++){if(i.open[f]==null||i.close[f]==null)continue;const w=$t(u[f]);m.set(w,{time:w,open:+i.open[f].toFixed(4),high:+i.high[f].toFixed(4),low:+i.low[f].toFixed(4),close:+i.close[f].toFixed(4),volume:i.volume[f]??0})}const b=[...m.values()].sort((f,w)=>f.time.localeCompare(w.time)),y=b.map(f=>({time:f.time,value:f.volume,color:f.close>=f.open?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"}));b.forEach(f=>delete f.volume);const p={candles:b,volumes:y,meta:d.meta};return mt.set(l,{ts:Date.now(),data:p}),p}async function Se(t){var i,m,b,y,p,S;const n=`${t}:indicator-history`,r=mt.get(n);if(r&&Date.now()-r.ts<xt)return r.data;const l=`/v8/finance/chart/${encodeURIComponent(t)}?range=10y&interval=1d&includePrePost=false`,s=await fetch(st(l),{headers:{Accept:"application/json"}});if(!s.ok)throw new Error(`HTTP ${s.status}`);const a=(b=(m=(i=await s.json())==null?void 0:i.chart)==null?void 0:m.result)==null?void 0:b[0];if(!a)throw new Error("Indicator history unavailable");const e=a.timestamp??[],o=((S=(p=(y=a.indicators)==null?void 0:y.quote)==null?void 0:p[0])==null?void 0:S.close)??[],d=new Map;e.forEach((k,f)=>{o[f]!=null&&d.set($t(k),{time:$t(k),close:+o[f].toFixed(4)})});const u=[...d.values()].sort((k,f)=>k.time.localeCompare(f.time));return mt.set(n,{ts:Date.now(),data:u}),u}async function ke(t){var e,o;const n=At.get(t);if(n&&Date.now()-n.ts<xt)return n.data;const r=["annualTotalRevenue","annualGrossProfit","annualOperatingIncome","annualNetIncome","annualDilutedEPS"],l=Math.floor(Date.now()/1e3),s=l-370*24*60*60,a=`/ws/fundamentals-timeseries/v1/finance/timeseries/${encodeURIComponent(t)}?type=${r.join(",")}&period1=${s}&period2=${l}`;try{const d=await fetch(st(a),{headers:{Accept:"application/json"}});if(!d.ok)return null;const u=((o=(e=await d.json())==null?void 0:e.timeseries)==null?void 0:o.result)??[],i=S=>{var k,f,w,C;return((C=(w=(f=(k=u.find(P=>{var I,F,M,H;return((M=(F=(I=P.meta)==null?void 0:I.symbol)==null?void 0:F.includes)==null?void 0:M.call(F,t))&&((H=P[S])==null?void 0:H.length)}))==null?void 0:k[S])==null?void 0:f.at(-1))==null?void 0:w.reportedValue)==null?void 0:C.raw)??null},m=i("annualTotalRevenue"),b=i("annualGrossProfit"),y=i("annualOperatingIncome"),p={financialData:{totalRevenue:{raw:m},grossMargins:{raw:m&&b?b/m:null},operatingMargins:{raw:m&&y?y/m:null}},defaultKeyStatistics:{trailingEps:{raw:i("annualDilutedEPS")}}};return At.set(t,{ts:Date.now(),data:p}),p}catch{return null}}const _=(t,n={})=>t==null?"—":t.toLocaleString("en-US",n),ot=t=>t==null?"—":`${t>=0?"+":""}${(t*100).toFixed(2)}%`,yt=t=>t==null?"—":t>=1e12?`$${(t/1e12).toFixed(2)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString()}`;function gt(t,n){var i,m,b,y,p,S,k,f,w,C,P,I,F,M,H;if(!n){t.innerHTML='<div class="sa-no-data">Fundamental data unavailable.</div>';return}const r=n.price??{},l=n.summaryDetail??{},s=n.defaultKeyStatistics??{},a=n.financialData??{},e=n.assetProfile??{},d=[["Market Cap",yt((i=r.marketCap)==null?void 0:i.raw)],["P/E (TTM)",_((m=l.trailingPE)==null?void 0:m.raw,{maximumFractionDigits:1})],["Fwd P/E",_((b=l.forwardPE)==null?void 0:b.raw,{maximumFractionDigits:1})],["EPS (TTM)",((y=s.trailingEps)==null?void 0:y.raw)!=null?`$${s.trailingEps.raw.toFixed(2)}`:"—"],["52W High",_((p=l.fiftyTwoWeekHigh)==null?void 0:p.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["52W Low",_((S=l.fiftyTwoWeekLow)==null?void 0:S.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["Div Yield",ot((k=l.dividendYield)==null?void 0:k.raw)],["Beta",_((f=l.beta)==null?void 0:f.raw,{maximumFractionDigits:2})],["Revenue TTM",yt((w=a.totalRevenue)==null?void 0:w.raw)],["Gross Margin",ot((C=a.grossMargins)==null?void 0:C.raw)],["Op Margin",ot((P=a.operatingMargins)==null?void 0:P.raw)],["ROE",ot((I=a.returnOnEquity)==null?void 0:I.raw)],["P/B Ratio",_((F=s.priceToBook)==null?void 0:F.raw,{maximumFractionDigits:2})],["Avg Volume",_((M=l.averageVolume)==null?void 0:M.raw)],["Employees",_(e.fullTimeEmployees)],["Free Cash Flow",yt((H=a.freeCashflow)==null?void 0:H.raw)]].map(([B,N])=>`
    <div class="sa-fund-card">
      <div class="sa-fund-label">${B}</div>
      <div class="sa-fund-val">${N}</div>
    </div>`).join(""),u=[e.sector,e.industry].filter(Boolean).map(B=>`<span class="sa-badge">${B}</span>`).join("");t.innerHTML=`
    <div class="sa-section-label">Key Metrics</div>
    <div class="sa-fund-grid">${d}</div>
    ${e.longBusinessSummary?`
      <div class="sa-about">
        <div class="sa-section-label">About ${u}</div>
        <p class="sa-about-text">${e.longBusinessSummary}</p>
      </div>`:""}
  `}function rt(t,n,r){var i,m,b;const l=(r==null?void 0:r.price)??{},s=l.longName||l.shortName||(n==null?void 0:n.symbol)||"",a=((i=l.regularMarketPrice)==null?void 0:i.raw)??(n==null?void 0:n.regularMarketPrice)??0,e=(((m=l.regularMarketChangePercent)==null?void 0:m.raw)??0)*100,o=((b=l.regularMarketChange)==null?void 0:b.raw)??0,d=l.exchangeName||(n==null?void 0:n.exchangeName)||"",u=e>=0;t.innerHTML=`
    <div class="sa-hdr-left">
      <div class="sa-hdr-name">${s} <span class="sa-hdr-sym">${(n==null?void 0:n.symbol)??""}</span></div>
      <div class="sa-hdr-exch">${d}</div>
    </div>
    <div class="sa-hdr-right">
      <div class="sa-hdr-price">${a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div class="sa-hdr-chg ${u?"up":"dn"}">${u?"+":""}${o.toFixed(2)} (${u?"+":""}${e.toFixed(2)}%)</div>
    </div>
  `}let dt=null;async function Pt(){return dt||(dt=await _t(()=>import("./lightweight-charts.production-C-4kb1nc.js"),[])),dt}async function $e(t){const n=vt.map((c,h)=>`<option value="${h}">${c.label}</option>`).join(""),r=ft.map((c,h)=>`<button class="sa-range-btn${h===4?" active":""}" data-ri="${h}">${c.label}</button>`).join("");t.innerHTML=`
    <div class="sa-layout">
      <div class="sa-search-bar">
        <select class="sa-market-sel" id="sa-mkt">${n}</select>
        <input class="sa-ticker-inp" id="sa-ticker" type="text" placeholder="Ticker (e.g. AAPL)" spellcheck="false" autocomplete="off" />
        <button class="ghost-btn sa-go-btn" id="sa-go">Add to chart</button>
      </div>

      <div class="sa-placeholder" id="sa-ph">
        <div class="sa-ph-icon">📈</div>
        <div class="sa-ph-title">Enter a ticker to get started</div>
        <div class="sa-ph-hint">e.g. AAPL · CBA.AX · HSBA.L · 7203.T</div>
      </div>

      <div class="sa-main" id="sa-main" style="display:none">
        <div class="sa-hdr" id="sa-hdr"></div>
        <div class="sa-instruments" id="sa-instruments" aria-label="Chart instruments"></div>

        <div class="sa-controls">
          <div class="sa-ranges">${r}</div>
          <div class="sa-opts">
            <div class="sa-type-group">
              <button class="sa-opt" data-type="candle">Candle</button>
              <button class="sa-opt active" data-type="line">Line</button>
            </div>
            <div class="sa-ind-group">
              <button class="sa-opt" data-ind="ma20">MA 20D</button>
              <button class="sa-opt" data-ind="ma50">MA 50D</button>
              <button class="sa-opt" data-ind="ma200">MA 200D</button>
              <button class="sa-opt" data-ind="bb">BB</button>
              <button class="sa-opt active" data-ind="vol">Vol</button>
            </div>
          </div>
        </div>

        <div class="sa-level-tools" role="group" aria-label="Price level tools">
          <span class="sa-tool-label">PRICE LEVELS</span>
          <input class="sa-level-input" id="sa-level-input" type="number" inputmode="decimal" step="any" placeholder="Enter price" aria-label="Price level" />
          <button class="sa-opt" id="sa-level-add">Add level</button>
          <button class="sa-opt" id="sa-annot-btn" type="button" aria-pressed="false" title="Click the chart repeatedly to add horizontal levels">Place on chart</button>
          <button class="sa-opt" id="sa-measure-btn" type="button" aria-pressed="false" title="Click two chart points to measure the move">Measure move</button>
          <span class="sa-tool-hint">Or click the chart to place multiple levels</span>
        </div>

        <div class="sa-chart-wrap" id="sa-chart-wrap">
          <div id="sa-chart"></div>
          <div class="sa-tt" id="sa-tt"></div>
          <div class="sa-overlay" id="sa-overlay" style="display:none">
            <div class="sa-spinner"></div>
          </div>
        </div>

        <div class="sa-annot-list" id="sa-annot-list"></div>
        <div class="sa-measure-list" id="sa-measure-list"></div>
        <div class="sa-funds" id="sa-funds"></div>
      </div>
    </div>
  `;let l=null,s={},a=new Map,e=null,o=[],d=1,u=!1,i=!1,m=null,b=[],y=1,p=new Set(["vol"]),S="line",k=4,f=null,w=null;const C=t.querySelector("#sa-ph"),P=t.querySelector("#sa-main"),I=t.querySelector("#sa-hdr"),F=t.querySelector("#sa-instruments"),M=t.querySelector("#sa-chart"),H=t.querySelector("#sa-overlay"),B=t.querySelector("#sa-tt"),N=t.querySelector("#sa-annot-list"),E=t.querySelector("#sa-funds"),j=t.querySelector("#sa-mkt"),O=t.querySelector("#sa-ticker"),z=t.querySelector("#sa-go"),Y=t.querySelector("#sa-annot-btn"),T=t.querySelector("#sa-measure-btn"),L=t.querySelector("#sa-level-input"),K=t.querySelector("#sa-level-add"),pt=t.querySelector("#sa-measure-list");function nt(){const c=document.documentElement.dataset.theme;return c==="more-visible"?{background:"#fffdf7",text:"#101820",grid:"#c3d0d9",border:"#293c4a",level:"#005a9c",fontSize:15,lineWidth:3,colors:["#005a9c","#9b3d00","#006b3c","#7b2f83","#8a4b00","#005b70","#a51d37","#34495e"],volumeUp:"rgba(0,107,60,0.45)",volumeDown:"rgba(180,35,24,0.45)"}:c==="light"?{background:"#f3f0e8",text:"#5e665e",grid:"#ded8cc",border:"#b7ad9d",level:"#9b641d",fontSize:11,lineWidth:2,colors:["#9b641d","#3575a8","#b34f43","#37845b","#805b96","#86751a","#34817d","#a34f73"],volumeUp:"rgba(55,132,91,0.36)",volumeDown:"rgba(179,79,67,0.36)"}:{background:"#111413",text:"#99a49b",grid:"#303a33",border:"#47564b",level:"#e3a857",fontSize:11,lineWidth:2,colors:["#e3a857","#63a7d8","#d77d72","#72b58a","#bc91cf","#d9ca68","#55b9b3","#e28dab"],volumeUp:"rgba(101,193,140,0.4)",volumeDown:"rgba(223,124,112,0.4)"}}async function zt(){if(l)return;const{createChart:c,CrosshairMode:h}=await Pt(),$=nt();l=c(M,{width:M.clientWidth||900,height:480,layout:{background:{color:$.background},textColor:$.text,fontSize:$.fontSize,fontFamily:"'DM Mono', monospace"},grid:{vertLines:{color:$.grid},horzLines:{color:$.grid}},crosshair:{mode:h.Normal},leftPriceScale:{visible:!0,borderColor:$.border},rightPriceScale:{borderColor:$.border},timeScale:{borderColor:$.border,timeVisible:!0,secondsVisible:!1}}),w=()=>{if(!l)return;const v=nt();l.applyOptions({layout:{background:{color:v.background},textColor:v.text,fontSize:v.fontSize},grid:{vertLines:{color:v.grid},horzLines:{color:v.grid}},leftPriceScale:{borderColor:v.border},rightPriceScale:{borderColor:v.border},timeScale:{borderColor:v.border}}),[...a.values()].forEach((g,x)=>{var R,Z;g.color=v.colors[x%v.colors.length];const D=s[g.symbol]??{};(R=D.main)==null||R.applyOptions({color:g.color,lineWidth:v.lineWidth}),(Z=D.vol)==null||Z.setData(g.priceData.volumes.map(tt=>({...tt,color:tt.color.includes("52,211,153")||tt.color.includes("101,193,140")?v.volumeUp:v.volumeDown})))}),o.forEach(g=>{var x;if(g.line){try{(x=s[g.symbol])==null||x.main.removePriceLine(g.line)}catch{}g.line=V(g.price,g.symbol)}})},document.addEventListener("macro-theme-change",w),f=new ResizeObserver(()=>{l&&M.clientWidth&&l.resize(M.clientWidth,480)}),f.observe(M),l.subscribeCrosshairMove(v=>{if(!v.time||!v.point){B.style.display="none";return}const g=[...a.values()].map(x=>{var tt;const D=(tt=s[x.symbol])==null?void 0:tt.main,R=D&&v.seriesData.get(D);if(!R)return"";const Z="close"in R?R.close:R.value;return`<span class="sa-tt-instrument"><i style="background:${x.color}"></i>${x.symbol} <b>${Number(Z).toLocaleString("en-US",{maximumFractionDigits:4})}</b></span>`}).filter(Boolean).join("");if(!g){B.style.display="none";return}B.innerHTML=`<span class="sa-tt-date">${v.time}</span>${g}`,B.style.display="block"}),l.subscribeClick(v=>{var D;const g=e&&((D=s[e])==null?void 0:D.main);if(!v.point||!v.time||!g)return;const x=g.coordinateToPrice(v.point.y);if(x!=null){if(i){m?(Kt(m,{symbol:e,time:v.time,price:x}),m=null,J()):(m={symbol:e,time:v.time,price:x},J());return}u&&wt(x,e)}})}async function q(){const{LineStyle:c}=await Pt();Object.values(s).flatMap(v=>Object.values(v)).forEach(v=>{try{l.removeSeries(v)}catch{}}),s={},o.forEach(v=>{v.line=null}),Q();const h=nt();l.priceScale("left").applyOptions({visible:!0,borderColor:h.border,scaleMargins:{top:.06,bottom:p.has("vol")?.22:.04}}),l.priceScale("right").applyOptions({visible:!0,borderColor:h.border,scaleMargins:{top:.06,bottom:p.has("vol")?.22:.04}});for(const[v,g]of[...a.values()].entries()){g.color=h.colors[v%h.colors.length];const x=g.axis;s[g.symbol]={},S==="candle"?(s[g.symbol].main=l.addCandlestickSeries({priceScaleId:x,upColor:"#65c18c",downColor:"#df7c70",borderVisible:!1,wickUpColor:"#65c18c",wickDownColor:"#df7c70"}),s[g.symbol].main.setData(g.priceData.candles)):(s[g.symbol].main=l.addLineSeries({color:g.color,lineWidth:h.lineWidth,priceScaleId:x,title:g.symbol}),s[g.symbol].main.setData(g.priceData.candles.map(D=>({time:D.time,value:D.close}))));for(const[D,R]of Object.entries(fe))!p.has(D)||g.indicatorCandles.length<R.period||(s[g.symbol][D]=l.addLineSeries({color:R.color,lineWidth:1,title:`${g.symbol} ${R.label}`,priceScaleId:x}),s[g.symbol][D].setData(ye(g.indicatorCandles,R.period,g.priceData.candles)));if(p.has("bb")&&g.priceData.candles.length>=20){const{upper:D,mid:R,lower:Z}=ge(g.priceData.candles);s[g.symbol].bbU=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:c.Dashed,priceScaleId:x}),s[g.symbol].bbM=l.addLineSeries({color:"rgba(124,106,247,0.4)",lineWidth:1,priceScaleId:x}),s[g.symbol].bbL=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:c.Dashed,priceScaleId:x}),s[g.symbol].bbU.setData(D),s[g.symbol].bbM.setData(R),s[g.symbol].bbL.setData(Z)}}const $=a.values().next().value;p.has("vol")&&$&&(s[$.symbol].vol=l.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"vol"}),l.priceScale("vol").applyOptions({scaleMargins:{top:.82,bottom:0}}),s[$.symbol].vol.setData($.priceData.volumes.map(v=>({...v,color:v.color.includes("52,211,153")||v.color.includes("101,193,140")?h.volumeUp:h.volumeDown})))),o.forEach(v=>{var x;const g=(x=s[v.symbol])==null?void 0:x.main;v.line=g?V(v.price,v.symbol):null}),b.forEach(v=>{var x;const g=(x=s[v.symbol])==null?void 0:x.main;v.startLine=g?V(v.startPrice,v.symbol):null,v.endLine=g?V(v.endPrice,v.symbol):null}),l.timeScale().fitContent()}function V(c,h){const{LineStyle:$}=dt,v=nt().level;return s[h].main.createPriceLine({price:c,color:v,lineWidth:1,lineStyle:$.Dashed,axisLabelVisible:!0,title:`${h} ${c.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`})}function wt(c,h=e){var $;!Number.isFinite(c)||!(($=s[h])!=null&&$.main)||(o.push({id:d++,price:c,symbol:h,line:V(c,h)}),Q())}function ht(c){return typeof c=="string"?c:c&&typeof c=="object"?`${c.year}-${String(c.month).padStart(2,"0")}-${String(c.day).padStart(2,"0")}`:"point"}function Kt(c,h){c.symbol!==h.symbol||c.price===0||(b.push({id:y++,symbol:c.symbol,startTime:ht(c.time),endTime:ht(h.time),startPrice:c.price,endPrice:h.price,startLine:V(c.price,c.symbol),endLine:V(h.price,h.symbol)}),J())}function J(){const c=m?`<div class="sa-measure-pending">${m.symbol} · ${ht(m.time)} · ${m.price.toLocaleString("en-US",{maximumFractionDigits:4})} <span>Click a second point</span></div>`:"";if(!b.length){pt.innerHTML=c;return}pt.innerHTML=`${c}${b.map(h=>{const $=h.endPrice-h.startPrice,v=$/h.startPrice*100,g=$>=0?"up":"dn";return`<div class="sa-measure-row">
        <span class="sa-measure-symbol">${h.symbol}</span>
        <span>${h.startTime} → ${h.endTime}</span>
        <strong class="${g}">${$>=0?"+":""}${$.toLocaleString("en-US",{maximumFractionDigits:4})} (${v>=0?"+":""}${v.toFixed(2)}%)</strong>
        <button class="sa-annot-x" data-measure-id="${h.id}" aria-label="Remove measurement">×</button>
      </div>`}).join("")}`,pt.querySelectorAll("[data-measure-id]").forEach(h=>{h.addEventListener("click",()=>{var g,x;const $=b.findIndex(D=>D.id===Number(h.dataset.measureId));if($<0)return;const v=b[$];try{(g=s[v.symbol])==null||g.main.removePriceLine(v.startLine)}catch{}try{(x=s[v.symbol])==null||x.main.removePriceLine(v.endLine)}catch{}b.splice($,1),J()})})}function Q(){var c;if(!o.length){N.innerHTML="";return}N.innerHTML=`
      <div class="sa-annot-wrap">
        <span class="sa-section-label">Price Levels</span>
        <div class="sa-annot-pills">
          ${o.map(h=>`
            <span class="sa-annot-pill">
              ${h.symbol} · ${h.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              <button class="sa-annot-x" data-id="${h.id}" aria-label="Remove price level ${h.price}" title="Remove level">×</button>
            </span>`).join("")}
          ${o.length>1?'<button class="sa-clear-levels" type="button">Clear all</button>':""}
        </div>
      </div>`,N.querySelectorAll(".sa-annot-x").forEach(h=>{h.addEventListener("click",()=>{var g;const $=Number(h.dataset.id),v=o.findIndex(x=>x.id===$);if(!(v<0)){try{o[v].line&&((g=s[o[v].symbol])==null||g.main.removePriceLine(o[v].line))}catch{}o.splice(v,1),Q()}})}),(c=N.querySelector(".sa-clear-levels"))==null||c.addEventListener("click",()=>{o.forEach(h=>{var $;try{h.line&&(($=s[h.symbol])==null||$.main.removePriceLine(h.line))}catch{}}),o=[],Q()})}function lt(){F.innerHTML=[...a.values()].map(c=>`
      <div class="sa-instrument-row${c.symbol===e?" active":""}" data-symbol="${c.symbol}">
        <span class="sa-instrument-swatch" style="--instrument-color:${c.color}"></span>
        <button class="sa-instrument-focus" type="button" data-focus="${c.symbol}" title="Focus ${c.symbol}">${c.symbol}</button>
        <span class="sa-instrument-name">${c.name}</span>
        <label class="sa-axis-label" for="axis-${encodeURIComponent(c.symbol)}">Axis</label>
        <select class="sa-axis-select" id="axis-${encodeURIComponent(c.symbol)}" data-axis="${c.symbol}" aria-label="Price axis for ${c.symbol}">
          <option value="left"${c.axis==="left"?" selected":""}>Left</option>
          <option value="right"${c.axis==="right"?" selected":""}>Right</option>
        </select>
        <button class="sa-instrument-remove" type="button" data-remove="${c.symbol}" aria-label="Remove ${c.symbol}" title="Remove ${c.symbol}">×</button>
      </div>`).join(""),F.querySelectorAll("[data-focus]").forEach(c=>{c.addEventListener("click",()=>Lt(c.dataset.focus))}),F.querySelectorAll("[data-axis]").forEach(c=>{c.addEventListener("change",async()=>{const h=a.get(c.dataset.axis);h&&(h.axis=c.value,await q())})}),F.querySelectorAll("[data-remove]").forEach(c=>{c.addEventListener("click",()=>Jt(c.dataset.remove))})}function Lt(c){const h=a.get(c);h&&(e=c,lt(),rt(I,h.priceData.meta,h.funds),gt(E,h.funds))}async function Jt(c){if(!a.has(c))return;if(a.delete(c),o=o.filter($=>$.symbol!==c),b=b.filter($=>$.symbol!==c),(m==null?void 0:m.symbol)===c&&(m=null),e===c&&(e=[...a.keys()].at(-1)??null),!a.size){P.style.display="none",C.style.display="flex",I.innerHTML="",E.innerHTML="",Q(),lt(),await q();return}const h=a.get(e);rt(I,h.priceData.meta,h.funds),gt(E,h.funds),lt(),Q(),await q()}async function Qt(c){if(a.has(c)){Lt(c);return}const{range:h,interval:$}=ft[k];H.style.display="flex",C.style.display="none",P.style.display="block",I.innerHTML=`<div class="sa-hdr-loading">Loading ${c}…</div>`,E.innerHTML="";try{await zt();const[v,g,x]=await Promise.all([Ct(c,h,$),Se(c),ke(c)]),D={symbol:c,name:v.meta.longName||v.meta.shortName||c,priceData:v,indicatorCandles:g,funds:x,axis:a.size===0?"right":a.size%2?"left":"right",color:"#e3a857"};a.set(c,D),e=c,rt(I,v.meta,x),lt(),await q(),gt(E,x)}catch{I.innerHTML=`<div class="sa-error">Symbol <b>${c}</b> not found or no data available.</div>`,E.innerHTML=""}finally{H.style.display="none"}}async function Zt(c){if(!a.size)return;k=c,t.querySelectorAll(".sa-range-btn").forEach((v,g)=>v.classList.toggle("active",g===c));const{range:h,interval:$}=ft[c];H.style.display="flex";try{(await Promise.all([...a.values()].map(async x=>({symbol:x.symbol,data:await Ct(x.symbol,h,$)})))).forEach(({symbol:x,data:D})=>{a.get(x).priceData=D});const g=a.get(e);rt(I,g.priceData.meta,g.funds),await q()}finally{H.style.display="none"}}t.querySelectorAll(".sa-range-btn").forEach((c,h)=>c.addEventListener("click",()=>Zt(h))),j.addEventListener("change",()=>{O.placeholder=`Ticker (e.g. ${vt[+j.value].example})`});async function Et(){const c=O.value.trim().toUpperCase(),h=vt[+j.value];if(!c)return;const $=h.suffix&&!c.endsWith(h.suffix)?`${c}${h.suffix}`:c;await Qt($)}z.addEventListener("click",Et),O.addEventListener("keydown",c=>{c.key==="Enter"&&Et()}),t.querySelectorAll("[data-type]").forEach(c=>c.addEventListener("click",async()=>{S=c.dataset.type,t.querySelectorAll("[data-type]").forEach(h=>h.classList.remove("active")),c.classList.add("active"),a.size&&await q()})),t.querySelectorAll("[data-ind]").forEach(c=>c.addEventListener("click",async()=>{const h=c.dataset.ind;p.has(h)?p.delete(h):p.add(h),c.classList.toggle("active",p.has(h)),a.size&&await q()})),Y.addEventListener("click",()=>{i&&(i=!1,m=null,T.classList.remove("active"),T.setAttribute("aria-pressed","false"),T.textContent="Measure move",J()),u=!u,Y.classList.toggle("active",u),Y.setAttribute("aria-pressed",String(u)),Y.textContent=u?"Click to place":"Place on chart",t.querySelector("#sa-chart-wrap").classList.toggle("sa-annotating",u)}),T.addEventListener("click",()=>{u&&(u=!1,Y.classList.remove("active"),Y.setAttribute("aria-pressed","false"),Y.textContent="Place on chart"),i=!i,m=null,T.classList.toggle("active",i),T.setAttribute("aria-pressed",String(i)),T.textContent=i?"Click first point":"Measure move",t.querySelector("#sa-chart-wrap").classList.toggle("sa-measuring",i),J()});function Mt(){const c=Number(L.value);if(!L.value.trim()||!Number.isFinite(c)){L.focus();return}wt(c),L.value="",L.focus()}return K.addEventListener("click",Mt),L.addEventListener("keydown",c=>{c.key==="Enter"&&Mt()}),()=>{f==null||f.disconnect(),w&&document.removeEventListener("macro-theme-change",w),l&&(l.remove(),l=null),s={},o=[],b=[],m=null}}const Vt="portv1",Ft={symbol:"^GSPC"},xe=[{label:"US",suffix:""},{label:"ASX",suffix:".AX"},{label:"LSE",suffix:".L"},{label:"TSX",suffix:".TO"},{label:"XETRA",suffix:".DE"},{label:"TSE",suffix:".T"},{label:"HKEX",suffix:".HK"}];let A=[],it=63,G=null;function St(){try{localStorage.setItem(Vt,JSON.stringify(A))}catch{}}function we(){try{return JSON.parse(localStorage.getItem(Vt)??"[]")}catch{return[]}}const It=new Map,Le=10*60*1e3;async function Ee(t,n){var l,s,a,e,o;const r=It.get(t);if(r&&Date.now()-r.ts<Le)return r.data;try{const d=`/v8/finance/chart/${encodeURIComponent(t)}?range=1y&interval=1d`,u=await fetch(st(d),{headers:{Accept:"application/json"},signal:n});if(!u.ok)return null;const i=await u.json(),m=(s=(l=i==null?void 0:i.chart)==null?void 0:l.result)==null?void 0:s[0];if(!m)return null;const b=m.timestamp??[],y=((o=(e=(a=m.indicators)==null?void 0:a.quote)==null?void 0:e[0])==null?void 0:o.close)??[],p=m.meta,S=[];for(let f=1;f<b.length;f++)y[f]!=null&&y[f-1]!=null&&y[f-1]!==0&&S.push({date:b[f],ret:(y[f]-y[f-1])/y[f-1]});const k={symbol:t,name:p.longName||p.shortName||t,price:p.regularMarketPrice,retData:S};return It.set(t,{ts:Date.now(),data:k}),k}catch{return null}}async function Me(t){var n,r,l,s;try{const a=`/v8/finance/chart/${encodeURIComponent(t)}?range=1d&interval=1d`,e=await fetch(st(a),{headers:{Accept:"application/json"}});if(!e.ok)return null;const o=(s=(l=(r=(n=await e.json())==null?void 0:n.chart)==null?void 0:r.result)==null?void 0:l[0])==null?void 0:s.meta;return o?{name:o.longName||o.shortName||t,price:o.regularMarketPrice}:null}catch{return null}}function De(t){const n=new Date((t+43200)*1e3);return`${n.getUTCFullYear()}-${String(n.getUTCMonth()+1).padStart(2,"0")}-${String(n.getUTCDate()).padStart(2,"0")}`}function Te(t){const n=t.map(a=>a.map(e=>({key:De(e.date),ret:e.ret}))),r=new Set;n.forEach(a=>a.forEach(e=>r.add(e.key)));const l=[...r].sort(),s=n.map(a=>{const e=new Map(a.map(o=>[o.key,o.ret]));return l.map(o=>e.get(o)??0)});return{dates:l,aligned:s}}function Ae(t,n){var d;const r=t.length,l=((d=t[0])==null?void 0:d.length)??0;if(l<10||r<1)return null;const s=Math.exp(-Math.LN2/n),a=Array.from({length:r},()=>new Array(r).fill(0));let e=0,o=1;for(let u=l-1;u>=0;u--){for(let i=0;i<r;i++)for(let m=0;m<r;m++)a[i][m]+=o*t[i][u]*t[m][u];e+=o,o*=s}for(let u=0;u<r;u++)for(let i=0;i<r;i++)a[u][i]=a[u][i]/e*252;return a}function Ce(t){const n=t.length;return Array.from({length:n},(r,l)=>Array.from({length:n},(s,a)=>{const e=Math.sqrt(t[l][l]*t[a][a]);return e>0?t[l][a]/e:l===a?1:0}))}function Pe(t,n){t.length;const r=t.map((i,m)=>t.reduce((b,y,p)=>b+n[m][p]*y,0)),l=t.reduce((i,m,b)=>i+m*r[b],0),s=Math.sqrt(Math.max(0,l)),a=t.map((i,m)=>s>0?i*r[m]/s:0),e=a.map(i=>s>0?i/s:0),o=n.map((i,m)=>Math.sqrt(Math.max(0,n[m][m]))),d=t.reduce((i,m,b)=>i+m*o[b],0),u=s>0?d/s:1;return{portVol:s,RC:a,pctRC:e,indivVols:o,divRatio:u}}function Fe(t,n){const r=t.length;if(r<5)return null;let l=1,s=1,a=0;const e=[],o=[];for(const k of t){l*=1+k,e.push(l),l>s&&(s=l);const f=l/s-1;o.push(f),-f>a&&(a=-f)}const d=Math.pow(Math.max(l,1e-9),252/r)-1,u=t.reduce((k,f)=>k+f,0)/r,i=Math.sqrt(t.reduce((k,f)=>k+(f-u)**2,0)/(r-1)*252),m=i>0?(d-.04)/i:null,b=a>0?d/a:null;let y=null;if((n==null?void 0:n.length)===r){const k=n.reduce((C,P)=>C+P,0)/r;let f=0,w=0;t.forEach((C,P)=>{f+=(C-u)*(n[P]-k),w+=(n[P]-k)**2}),y=w>0?f/w:null}let p=1;const S=(n==null?void 0:n.map(k=>(p*=1+k,p)))??[];return{annRet:d,vol:i,sharpe:m,beta:y,maxDD:a,calmar:b,navSeries:e,ddSeries:o,bmkNav:S}}const U={pct:(t,n=2)=>t==null||isNaN(t)?"—":`${t>=0?"+":""}${(t*100).toFixed(n)}%`,num:(t,n=2)=>t==null||isNaN(t)?"—":t.toFixed(n),price:t=>t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),cls:t=>t==null||isNaN(t)?"":t>=0?"up":"dn"};function Ie(t){if(t==null||isNaN(t))return"transparent";const n=Math.max(-1,Math.min(1,t)),r=(Math.abs(n)*.65+.08).toFixed(2);return n>=0?`rgba(248,113,113,${r})`:`rgba(52,211,153,${r})`}function Ue(t){return`<div class="port-metrics-strip">
    ${[["Ann. Return",U.pct(t.annRet),U.cls(t.annRet)],["Ann. Vol",U.pct(t.vol),""],["Sharpe",U.num(t.sharpe),U.cls(t.sharpe)],["Beta (SPX)",U.num(t.beta),""],["Max Drawdown",U.pct(-t.maxDD),"dn"],["Calmar",U.num(t.calmar),U.cls(t.calmar)]].map(([r,l,s])=>`
      <div class="port-metric-card">
        <div class="port-metric-label">${r}</div>
        <div class="port-metric-val ${s}">${l}</div>
      </div>`).join("")}
  </div>`}function He(t,n,r){const{portVol:l,pctRC:s,indivVols:a,divRatio:e}=Pe(n,r),o=Math.max(1e-9,...s.map(Math.abs)),d=t.map((u,i)=>`
    <div class="port-risk-row">
      <div class="port-risk-lbl">${u}</div>
      <div class="port-risk-bar-wrap">
        <div class="port-risk-bar" style="width:${(Math.abs(s[i])/o*100).toFixed(1)}%"></div>
      </div>
      <div class="port-risk-pct">${(s[i]*100).toFixed(1)}%</div>
      <div class="port-risk-vol">${(a[i]*100).toFixed(1)}% vol</div>
    </div>`).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Risk Contribution</div>
      <div class="port-risk-meta">
        Portfolio Vol <strong>${(l*100).toFixed(2)}%</strong>
        &nbsp;·&nbsp; Div. Ratio <strong>${e.toFixed(2)}×</strong>
      </div>
      <div class="port-risk-rows">${d}</div>
    </div>`}function Re(t,n,r){const l=n.reduce((a,e,o)=>a+e*n.reduce((d,u,i)=>d+u*r[o][i],0),0);return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Volatility & Contribution Beta</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Ann. Vol</th><th class="num">β → Port</th>
        </tr></thead>
        <tbody>${t.map((a,e)=>{const o=Math.sqrt(Math.max(0,r[e][e])),d=n.reduce((i,m,b)=>i+m*r[e][b],0),u=l>0?d/l:null;return`<tr>
      <td class="mkt-name">${a}</td>
      <td class="num">${(n[e]*100).toFixed(1)}%</td>
      <td class="num">${(o*100).toFixed(1)}%</td>
      <td class="num">${U.num(u)}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Be(t,n,r){const l=Ce(n),s=t.map(e=>`<th class="corr-col-hdr">${e}</th>`).join(""),a=t.map((e,o)=>`<tr><th class="corr-row-hdr">${e}</th>${t.map((d,u)=>{const i=l[o][u],m=o===u;return`<td class="corr-cell${m?" corr-diag":""}"
        style="background:${m?"var(--bg-base)":Ie(i)}">${m?"—":i.toFixed(2)}</td>`}).join("")}</tr>`).join("");return`
    <div class="mkt-panel">
      <div class="port-corr-hdr">
        <span class="mkt-panel-label" style="border:none;padding:10px 14px 8px">EWMA Correlation Matrix</span>
        <div class="port-hl-ctrl">
          <span class="port-hl-label">Half-life</span>
          <input type="range" id="port-hl-slider" class="port-hl-slider" min="5" max="252" value="${r}" step="1">
          <span id="port-hl-val" class="port-hl-val">${r}d</span>
        </div>
      </div>
      <div class="corr-legend">
        <span class="corr-leg corr-leg-neg">■ Diversifying (negative)</span>
        <span class="corr-leg corr-leg-pos">■ Correlated (positive)</span>
      </div>
      <div class="corr-scroll">
        <table class="corr-table">
          <thead><tr><th></th>${s}</tr></thead>
          <tbody>${a}</tbody>
        </table>
      </div>
    </div>`}function Oe(t,n,r,l,s){const a=l.length,e={"1d":1,"1w":5,"1m":21,"3m":63};let o;if(s==="ytd"){const y=String(new Date().getFullYear());o=l.findIndex(p=>p.startsWith(y)),o<0&&(o=0)}else o=Math.max(0,a-(e[s]??1));const d=r.map(y=>y.slice(o).reduce((p,S)=>p*(1+S),1)-1),u=d.reduce((y,p,S)=>y+n[S]*p,0),i=Math.max(1e-9,...d.map(y=>Math.abs(y))),m=["1d","1w","1m","3m","ytd"].map(y=>`<button class="port-period-btn${y===s?" active":""}" data-period="${y}">${y.toUpperCase()}</button>`).join(""),b=t.map((y,p)=>{const S=d[p],k=n[p]*S,f=(Math.abs(S)/i*100).toFixed(1);return`<tr>
      <td class="mkt-name">${y}</td>
      <td class="num">${(n[p]*100).toFixed(1)}%</td>
      <td class="num ${U.cls(S)}">${U.pct(S)}</td>
      <td class="num ${U.cls(k)}">${U.pct(k)}</td>
      <td class="port-attr-bar-cell">
        <span class="port-attr-bar ${S>=0?"up":"dn"}" style="width:${f}%"></span>
      </td>
    </tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="port-attr-hdr">
        <span class="mkt-panel-label" style="border:none;padding:10px 14px 8px">Return Attribution</span>
        <div class="port-attr-periods" id="port-attr-periods">${m}</div>
      </div>
      <div class="port-attr-summary">
        Portfolio return: <strong class="${U.cls(u)}">${U.pct(u)}</strong>
      </div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Return</th><th class="num">Contribution</th><th></th>
        </tr></thead>
        <tbody>${b}</tbody>
      </table>
    </div>`}async function Xe(t,n,r,l){var b;const s=t.querySelector("#port-chart-wrap");if(!s)return;G&&(G(),G=null);const{createChart:a}=await _t(async()=>{const{createChart:y}=await import("./lightweight-charts.production-C-4kb1nc.js");return{createChart:y}},[]);s.innerHTML="";const e=document.createElement("div");e.style.height="280px",s.appendChild(e);const o=a(e,{layout:{background:{color:"transparent"},textColor:"#6b7280"},grid:{vertLines:{color:"#22253a"},horzLines:{color:"#22253a"}},rightPriceScale:{borderColor:"#22253a"},timeScale:{borderColor:"#22253a"}}),d=o.addLineSeries({color:"#7c6af7",lineWidth:2,title:"Portfolio"}),u=o.addLineSeries({color:"#4b5563",lineWidth:1,lineStyle:2,title:"S&P 500"});function i(y){if(y==="cumret")d.setData(n.map((p,S)=>({time:p,value:+((r[S]-1)*100).toFixed(3)}))),u.setData(n.map((p,S)=>({time:p,value:+((l[S]-1)*100).toFixed(3)})));else{let p=1;d.setData(n.map((S,k)=>(r[k]>p&&(p=r[k]),{time:S,value:+((r[k]/p-1)*100).toFixed(3)}))),u.setData([])}o.timeScale().fitContent()}i("cumret"),(b=t.querySelector("#port-chart-toggle"))==null||b.querySelectorAll("[data-mode]").forEach(y=>{y.addEventListener("click",()=>{t.querySelectorAll("#port-chart-toggle [data-mode]").forEach(p=>p.classList.toggle("active",p===y)),i(y.dataset.mode)})});const m=new ResizeObserver(()=>o.resize(e.offsetWidth,280));m.observe(e),G=()=>{m.disconnect(),o.remove()}}function Ne(t,n,r,l,s,a){t.innerHTML=`
    <div id="port-metrics-strip"></div>

    <div class="mkt-panel port-chart-panel">
      <div class="port-chart-hdr">
        <span class="mkt-panel-label" style="border:none;padding:10px 14px 4px">Portfolio Returns</span>
        <div id="port-chart-toggle" class="port-chart-toggle">
          <button class="port-period-btn active" data-mode="cumret">Cumulative</button>
          <button class="port-period-btn" data-mode="dd">Drawdown</button>
        </div>
      </div>
      <div id="port-chart-wrap"></div>
    </div>

    <div class="mkt-section mkt-two-col">
      <div id="port-risk-panel"></div>
      <div id="port-vol-panel"></div>
    </div>

    <div id="port-corr-panel" class="mkt-section"></div>

    <div id="port-attr-panel" class="mkt-section"></div>
  `,t.querySelector("#port-metrics-strip").innerHTML=Ue(a);function e(u){const i=Ae(n,u);i&&(t.querySelector("#port-risk-panel").innerHTML=He(l,s,i),t.querySelector("#port-vol-panel").innerHTML=Re(l,s,i),t.querySelector("#port-corr-panel").innerHTML=Be(l,i,u),o())}function o(){const u=t.querySelector("#port-hl-slider"),i=t.querySelector("#port-hl-val");u&&u.addEventListener("input",()=>{it=+u.value,i&&(i.textContent=`${it}d`),e(it)})}function d(u="1d"){var i;t.querySelector("#port-attr-panel").innerHTML=Oe(l,s,n,r,u),(i=t.querySelector("#port-attr-periods"))==null||i.querySelectorAll(".port-period-btn").forEach(m=>{m.addEventListener("click",()=>d(m.dataset.period))})}e(it),d("1d"),Xe(t,r,a.navSeries,a.bmkNav)}function Ye(t){A=we(),Array.isArray(A)||(A=[]),t.innerHTML=`
    <div class="port-layout">
      <div class="mkt-panel port-holdings-panel">
        <div class="mkt-panel-label">Portfolio Holdings</div>

        <div class="port-add-form">
          <select id="port-market" class="sa-market-sel">
            ${xe.map(b=>`<option value="${b.suffix}">${b.label}</option>`).join("")}
          </select>
          <input id="port-ticker" type="text" class="sa-ticker-inp" placeholder="Ticker" maxlength="12">
          <div class="port-add-weight-wrap">
            <input id="port-weight-inp" type="number" class="port-add-weight" placeholder="Wt" min="0" max="100" step="0.5">
            <span class="port-weight-pct">%</span>
          </div>
          <button id="port-add-btn" class="ghost-btn">+ Add</button>
          <span id="port-add-err" class="port-add-err"></span>
        </div>

        <table class="mkt-table port-holdings-table">
          <thead><tr>
            <th>Ticker</th><th>Name</th><th>Weight</th><th class="num">Price</th><th></th>
          </tr></thead>
          <tbody id="port-holdings-body"></tbody>
        </table>

        <div class="port-holdings-footer">
          <span id="port-total" class="port-total">Total: 0%</span>
          <button id="port-analyze-btn" class="port-analyze-btn">Analyze Portfolio</button>
        </div>
      </div>

      <div id="port-analytics"></div>
    </div>
  `;let n=A.reduce((b,y)=>Math.max(b,y.id??0),0)+1,r=null;const l=t.querySelector("#port-analytics"),s=t.querySelector("#port-add-btn"),a=t.querySelector("#port-analyze-btn"),e=t.querySelector("#port-add-err"),o=t.querySelector("#port-ticker"),d=t.querySelector("#port-market"),u=t.querySelector("#port-weight-inp"),i=t.querySelector("#port-holdings-body");function m(){const b=A.reduce((p,S)=>p+S.weight,0);i.innerHTML=A.length===0?'<tr><td colspan="5" class="port-empty">No holdings yet — add a ticker above.</td></tr>':A.map(p=>`
        <tr>
          <td class="mkt-name mono">${p.displaySymbol}</td>
          <td class="port-name-cell">${p.name}</td>
          <td>
            <div class="port-wt-cell">
              <input type="number" class="port-wt-inp" data-id="${p.id}"
                value="${p.weight}" min="0" max="100" step="0.5">
              <span class="port-weight-pct">%</span>
            </div>
          </td>
          <td class="num">${U.price(p.price)}</td>
          <td><button class="port-remove" data-id="${p.id}" title="Remove">×</button></td>
        </tr>`).join("");const y=t.querySelector("#port-total");y&&(y.textContent=`Total: ${b.toFixed(1)}%`,y.className=`port-total ${b>100.01?"dn":Math.abs(b-100)<.01?"up":""}`),i.querySelectorAll(".port-wt-inp").forEach(p=>{p.addEventListener("change",S=>{const k=A.find(f=>f.id===+S.target.dataset.id);k&&(k.weight=parseFloat(S.target.value)||0,St(),m())})}),i.querySelectorAll(".port-remove").forEach(p=>{p.addEventListener("click",S=>{A=A.filter(k=>k.id!==+S.target.dataset.id),St(),m()})})}return s.addEventListener("click",async()=>{const b=d.value,y=o.value.trim().toUpperCase();if(!y){e.textContent="Enter a ticker";return}const p=y+b;if(A.some(f=>f.symbol===p)){e.textContent="Already added";return}const S=parseFloat(u.value)||0;s.disabled=!0,e.textContent="Looking up…";const k=await Me(p);if(s.disabled=!1,!k){e.textContent=`"${p}" not found`;return}A.push({id:n++,symbol:p,displaySymbol:y,name:k.name,price:k.price,weight:S}),St(),o.value="",u.value="",e.textContent="",m()}),o.addEventListener("keydown",b=>{b.key==="Enter"&&s.click()}),a.addEventListener("click",async()=>{if(A.length<2){l.innerHTML='<div class="port-msg port-err">Add at least 2 holdings to analyze.</div>';return}r==null||r.abort(),r=new AbortController,l.innerHTML=`<div class="port-msg port-loading"><div class="sa-spinner"></div><span>Fetching 1Y data for ${A.length} holdings…</span></div>`,a.disabled=!0;const b=[...new Set([Ft.symbol,...A.map(E=>E.symbol)])],y=await Promise.all(b.map(E=>Ee(E,r.signal)));a.disabled=!1;const p=new Map(b.map((E,j)=>[E,y[j]])),S=A.filter(E=>!p.get(E.symbol));if(S.length){l.innerHTML=`<div class="port-msg port-err">Could not load data for: ${S.map(E=>E.displaySymbol).join(", ")}</div>`;return}const k=p.get(Ft.symbol),f=A.map(E=>p.get(E.symbol).retData),w=k?[...f,k.retData]:f,{dates:C,aligned:P}=Te(w),I=P.slice(0,A.length),F=k?P[P.length-1]:null,M=A.map(E=>E.weight/100),H=C.map((E,j)=>M.reduce((O,z,Y)=>O+z*(I[Y][j]??0),0)),B=Fe(H,F);if(!B){l.innerHTML='<div class="port-msg port-err">Insufficient data for analysis (need ≥5 aligned trading days).</div>';return}const N=A.map(E=>E.displaySymbol);Ne(l,I,C,N,M,B)}),m(),()=>{r==null||r.abort(),G&&(G(),G=null)}}const je=["market","stock","portfolio"],We={market:"Macro monitor",stock:"Single name",portfolio:"Portfolio lab"},_e={market:"01",stock:"02",portfolio:"03"};let ct="market",at=null;const Gt="macro-monitor-theme";function qe(){try{const t=localStorage.getItem(Gt);return["dark","light","more-visible"].includes(t)?t:"dark"}catch{return"dark"}}function Ut(t){document.documentElement.dataset.theme=t,document.dispatchEvent(new CustomEvent("macro-theme-change",{detail:{theme:t}}))}function Ve(t){const n=qe();Ut(n),t.innerHTML=`
    <div class="app-frame">
      <header class="topbar">
        <div class="brand-lockup"><div class="logo">MACRO MONITOR</div><div class="brand-sub">GLOBAL MULTI-ASSET RESEARCH</div></div>
        <div class="topbar-center"><nav class="tabs" id="main-tabs">
          ${je.map(e=>`<button class="tab ${e===ct?"active":""}" data-tab="${e}"><span class="tab-num">${_e[e]}</span>${We[e]}</button>`).join("")}
        </nav></div>
        <div class="topbar-right"><span class="market-status"><i></i> DATA LINKED</span><span class="topbar-date">${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span><label class="theme-select-label" for="theme-select">Theme</label><select class="theme-select" id="theme-select" aria-label="Colour theme"><option value="dark"${n==="dark"?" selected":""}>Dark</option><option value="light"${n==="light"?" selected":""}>Light</option><option value="more-visible"${n==="more-visible"?" selected":""}>More Visible</option></select></div>
      </header>
      <main class="main-content" id="tab-content"></main>
      <footer class="app-footer"><span>NSM / TERMINAL</span><span>MARKET DATA: YAHOO FINANCE · DELAYED / INDICATIVE</span><span>LOCAL SESSION</span></footer>
    </div>
  `;const r=t.querySelector("#main-tabs"),l=t.querySelector("#tab-content"),s=t.querySelector("#theme-select");s.addEventListener("change",()=>{const e=s.value;Ut(e);try{localStorage.setItem(Gt,e)}catch{}});function a(e){e!==ct&&(ct=e,r.querySelectorAll(".tab").forEach(o=>{o.classList.toggle("active",o.dataset.tab===e)}),Ht(l,e))}r.addEventListener("click",e=>{const o=e.target.closest(".tab");o&&a(o.dataset.tab)}),Ht(l,ct)}function Ht(t,n){at&&(at(),at=null),t.innerHTML="",n==="market"?he(t).then(r=>{at=r??null}):n==="stock"?$e(t).then(r=>{at=r??null}):n==="portfolio"&&(at=Ye(t)??null)}Ve(document.getElementById("app"));
