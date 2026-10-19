(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))l(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const e of a.addedNodes)e.tagName==="LINK"&&e.rel==="modulepreload"&&l(e)}).observe(document,{childList:!0,subtree:!0});function r(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function l(s){if(s.ep)return;s.ep=!0;const a=r(s);fetch(s.href,a)}})();const Tt="https://yf-proxy.lukewynd.workers.dev";function tt(t){return`${Tt}${t}`}function _t(t){const n=encodeURIComponent(t);return`${Tt}/v8/finance/chart/${n}?range=1y&interval=1d`}const St=new Map,Vt=5*60*1e3;async function qt(t){var r,l,s,a,e,o;const n=St.get(t);if(n&&Date.now()-n.ts<Vt)return n.data;try{const c=await fetch(_t(t),{headers:{Accept:"application/json"}});if(!c.ok)return null;const d=await c.json(),i=(l=(r=d==null?void 0:d.chart)==null?void 0:r.result)==null?void 0:l[0];if(!i)return null;const m=i.meta,b=((e=(a=(s=i.indicators)==null?void 0:s.quote)==null?void 0:a[0])==null?void 0:e.close)??[],h=A=>{for(let E=A;E>=0;E--)if(b[E]!=null)return{index:E,value:b[E]};return null},p=h(b.length-1),k=p?h(p.index-1):null,S=m.regularMarketPrice??null??(p==null?void 0:p.value)??null,D=(k==null?void 0:k.value)??null,L=S!=null&&D!=null?S-D:null,T=L!=null&&D!==0?L/D*100:null,R=b.length,F=(p==null?void 0:p.index)??-1,x=S,U=A=>{let E=F-A;for(;E>=0&&b[E]==null;)E--;const V=E>=0?b[E]:null;return V!=null&&x!=null&&V!==0?(x-V)/V*100:null},X=A=>{let E=F-A;for(;E>=0&&b[E]==null;)E--;return E>=0?b[E]:null},Y=A=>{const E=X(A);return E!=null&&x!=null?x-E:null},M=new Date().getFullYear(),B=i.timestamp??[];let N=null;for(let A=0;A<B.length;A++)if(new Date(B[A]*1e3).getFullYear()===M&&b[A]!=null){N=b[A];break}const W=N!=null&&N!==0&&x!=null?(x-N)/N*100:null,G={symbol:t,regularMarketPrice:S,regularMarketChangePercent:T,regularMarketChange:L,previousClose:D,dataTimestamp:((o=i.timestamp)==null?void 0:o[F])??null,source:"Yahoo Finance chart",quoteType:m.instrumentType??"",ytdPct:W,pct1d:T,pct1w:U(5),pct1m:U(21),pct3m:U(63),pctYtd:W,change1d:L,change1w:Y(5),change1m:Y(21),change3m:Y(63),changeYtd:N!=null&&x!=null?x-N:null};return St.set(t,{ts:Date.now(),data:G}),G}catch{return null}}async function Gt(t){const r=new Map;for(let l=0;l<t.length;l+=8){const s=t.slice(l,l+8),a=await Promise.allSettled(s.map(e=>qt(e)));s.forEach((e,o)=>{const c=a[o].status==="fulfilled"?a[o].value:null;c&&r.set(e,c)})}return r}const At=[{symbol:"^GSPC",name:"S&P 500",type:"index"},{symbol:"^VIX",name:"VIX",type:"vix"},{symbol:"^TNX",name:"US 10Y",type:"yield"},{symbol:"DX-Y.NYB",name:"DXY",type:"index"},{symbol:"GC=F",name:"Gold",type:"commodity"},{symbol:"BTC-USD",name:"Bitcoin",type:"crypto"}],Ct=[{symbol:"^GSPC",name:"S&P 500",region:"Americas"},{symbol:"^IXIC",name:"NASDAQ Comp.",region:"Americas"},{symbol:"^DJI",name:"Dow Jones",region:"Americas"},{symbol:"^RUT",name:"Russell 2000",region:"Americas"},{symbol:"^BVSP",name:"Bovespa",region:"Americas"},{symbol:"^MXX",name:"IPC Mexico",region:"Americas"},{symbol:"^FTSE",name:"FTSE 100",region:"Europe"},{symbol:"^GDAXI",name:"DAX",region:"Europe"},{symbol:"^FCHI",name:"CAC 40",region:"Europe"},{symbol:"^STOXX50E",name:"Euro Stoxx 50",region:"Europe"},{symbol:"^SSMI",name:"SMI",region:"Europe"},{symbol:"^AEX",name:"AEX",region:"Europe"},{symbol:"^N225",name:"Nikkei 225",region:"Asia-Pacific"},{symbol:"^HSI",name:"Hang Seng",region:"Asia-Pacific"},{symbol:"000001.SS",name:"Shanghai Comp.",region:"Asia-Pacific"},{symbol:"^AXJO",name:"ASX 200",region:"Asia-Pacific"},{symbol:"^KS11",name:"KOSPI",region:"Asia-Pacific"},{symbol:"^STI",name:"Straits Times",region:"Asia-Pacific"}],Pt=[{symbol:"^IRX",name:"3-Month"},{symbol:"^FVX",name:"5-Year"},{symbol:"^TNX",name:"10-Year"},{symbol:"^TYX",name:"30-Year"}],Ft=[{symbol:"BWX",name:"Global ex-US Treasuries",region:"Global"},{symbol:"IGOV",name:"International Treasuries",region:"Developed"},{symbol:"EMB",name:"Emerging Market Sovereign",region:"Emerging"},{symbol:"EWJ",name:"Japan rates proxy",region:"Japan"}],bt=[{code:"USD",name:"US Dollar",symbol:null,invert:!1},{code:"EUR",name:"Euro",symbol:"EURUSD=X",invert:!1},{code:"GBP",name:"Sterling",symbol:"GBPUSD=X",invert:!1},{code:"JPY",name:"Yen",symbol:"USDJPY=X",invert:!0},{code:"AUD",name:"Aus Dollar",symbol:"AUDUSD=X",invert:!1},{code:"CAD",name:"Can Dollar",symbol:"USDCAD=X",invert:!0},{code:"CHF",name:"Swiss Franc",symbol:"USDCHF=X",invert:!0}],zt=bt.filter(t=>t.symbol).map(t=>t.symbol),It=[{symbol:"GC=F",name:"Gold",unit:"/oz",group:"Metals"},{symbol:"SI=F",name:"Silver",unit:"/oz",group:"Metals"},{symbol:"HG=F",name:"Copper",unit:"/lb",group:"Metals"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl",group:"Energy"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl",group:"Energy"},{symbol:"NG=F",name:"Nat. Gas",unit:"/MMBtu",group:"Energy"},{symbol:"ZW=F",name:"Wheat",unit:"/bu",group:"Agri"},{symbol:"ZC=F",name:"Corn",unit:"/bu",group:"Agri"}],Ut=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],Rt=[{symbol:"BTC-USD",name:"Bitcoin",abbr:"BTC"},{symbol:"ETH-USD",name:"Ethereum",abbr:"ETH"},{symbol:"SOL-USD",name:"Solana",abbr:"SOL"},{symbol:"XRP-USD",name:"XRP",abbr:"XRP"}],ct=[...new Set([...At.map(t=>t.symbol),...Ct.map(t=>t.symbol),...Pt.map(t=>t.symbol),...Ft.map(t=>t.symbol),...zt,...It.map(t=>t.symbol),...Ut.map(t=>t.symbol),...Rt.map(t=>t.symbol)])];function rt(t,n=2){return t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:n,maximumFractionDigits:n})}function j(t){if(t==null)return{text:"—",cls:""};const n=t>=0?"+":"",r=t>=0?"up":"dn",l=Math.abs(t)>=3?" strong":"";return{text:`${n}${t.toFixed(2)}%`,cls:r+l}}function Kt(t){if(t==null)return{text:"—",cls:""};const n=Math.round(t*100),r=n>=0?"+":"",l=n>=0?"up":"dn";return{text:`${r}${n}bps`,cls:l}}function O(t){const n=j(t);return`<td class="num pct-cell ${n.cls}">${n.text}</td>`}function Q(t,n=7){return Array.from({length:t},()=>`<tr>${Array.from({length:n},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function Jt(t){return At.map(({symbol:n,name:r,type:l})=>{const s=t.get(n),a=s==null?void 0:s.regularMarketPrice,e=j((s==null?void 0:s.pct1d)??null),o=j((s==null?void 0:s.pctYtd)??null);let c="—";return a!=null&&(l==="yield"?c=a.toFixed(2)+"%":l==="crypto"?c="$"+a.toLocaleString("en-US",{maximumFractionDigits:0}):l==="commodity"?c="$"+rt(a):c=rt(a)),`
      <div class="mkt-stat-card">
        <div class="mkt-stat-name">${r}</div>
        <div class="mkt-stat-price">${c}</div>
        <div class="mkt-stat-chg ${e.cls}">${e.text}</div>
        <div class="mkt-stat-ytd ${o.cls}">${o.text} YTD</div>
      </div>`}).join("")}function Qt(t){const n=["Americas","Europe","Asia-Pacific"];let r="";return n.forEach(l=>{const s=Ct.filter(a=>a.region===l);r+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,r+=s.map(({symbol:a,name:e})=>{const o=t.get(a),c=o==null?void 0:o.regularMarketPrice,d=c!=null?c.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";return`<tr>
        <td class="mkt-name">${e}</td>
        <td class="num mono">${d}</td>
        ${O(o==null?void 0:o.pct1d)}
        ${O(o==null?void 0:o.pct1w)}
        ${O(o==null?void 0:o.pct1m)}
        ${O(o==null?void 0:o.pct3m)}
        ${O(o==null?void 0:o.pctYtd)}
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
    </div>`}function Zt(t){const n=Pt.map(({symbol:s,name:a})=>{const e=t.get(s),o=(e==null?void 0:e.regularMarketPrice)??null;return{name:a,yld:o,change1d:(e==null?void 0:e.change1d)??null,change1w:(e==null?void 0:e.change1w)??null,change1m:(e==null?void 0:e.change1m)??null,change3m:(e==null?void 0:e.change3m)??null,changeYtd:(e==null?void 0:e.changeYtd)??null}}),r=Math.max(.01,...n.map(s=>s.yld??0));return`
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
        <tbody>${n.map(({name:s,yld:a,change1d:e,change1w:o,change1m:c,change3m:d,changeYtd:i})=>{const m=[e,o,c,d,i].map(Kt),b=a!=null?a.toFixed(2)+"%":"—",h=a!=null?a/r*100:0;return`<tr>
      <td class="mkt-name">${s}</td>
      <td class="num mono">${b}</td>
      <td class="yc-bar-cell"><span class="yc-bar" style="width:${h.toFixed(1)}%"></span></td>
      ${m.map(p=>`<td class="num pct-cell ${p.cls}">${p.text}</td>`).join("")}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function te(t){return`<div class="mkt-panel">
    <div class="mkt-panel-label">Global Bond Markets · price proxies</div>
    <table class="mkt-table">
      <thead><tr><th>Instrument</th><th class="num">Level</th><th class="num">1D</th><th class="num">1M</th><th class="num">YTD</th></tr></thead>
      <tbody>${Ft.map(({symbol:r,name:l,region:s})=>{const a=t.get(r),e=a==null?void 0:a.regularMarketPrice,o=j(a==null?void 0:a.pct1d),c=j(a==null?void 0:a.pct1m),d=j(a==null?void 0:a.pctYtd);return`<tr>
      <td><span class="mkt-name">${l}</span><span class="mkt-unit">${s}</span></td>
      <td class="num mono">${e!=null?rt(e):"—"}</td>
      <td class="num pct-cell ${o.cls}">${o.text}</td>
      <td class="num pct-cell ${c.cls}">${c.text}</td>
      <td class="num pct-cell ${d.cls}">${d.text}</td>
    </tr>`}).join("")}</tbody>
    </table>
  </div>`}function ee(t){const n={USD:1};bt.forEach(({code:e,symbol:o,invert:c})=>{var i;if(!o)return;const d=(i=t.get(o))==null?void 0:i.regularMarketPrice;d!=null&&(n[e]=c?1/d:d)});const r=e=>e==null?"—":e>=100?e.toFixed(2):e>=10?e.toFixed(3):e.toFixed(4),l=bt.map(e=>e.code),s=l.map(e=>`<th class="num fx-col-hdr">${e}</th>`).join(""),a=l.map(e=>{const o=l.map(c=>{if(e===c)return'<td class="fx-diag">—</td>';const d=n[e],i=n[c],m=d!=null&&i!=null&&i!==0?d/i:null;return`<td class="num fx-cell">${r(m)}</td>`}).join("");return`<tr><th class="fx-row-hdr">${e}</th>${o}</tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Cross Rates <span class="mkt-panel-sub">1 row = X column</span></div>
      <div class="fx-matrix-wrap">
        <table class="fx-matrix">
          <thead><tr><th></th>${s}</tr></thead>
          <tbody>${a}</tbody>
        </table>
      </div>
    </div>`}function ae(t){const n=["Metals","Energy","Agri"];let r="";return n.forEach(l=>{const s=It.filter(a=>a.group===l);r+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,r+=s.map(({symbol:a,name:e,unit:o})=>{const c=t.get(a),d=c==null?void 0:c.regularMarketPrice,i=d!=null?"$"+rt(d):"—";return`<tr>
        <td class="mkt-name">${e}<span class="mkt-unit">${o}</span></td>
        <td class="num mono">${i}</td>
        ${O(c==null?void 0:c.pct1d)}
        ${O(c==null?void 0:c.pct1w)}
        ${O(c==null?void 0:c.pct1m)}
        ${O(c==null?void 0:c.pctYtd)}
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
    </div>`}function se(t){const n=Ut.map(({symbol:s,name:a})=>{const e=t.get(s);return{name:a,pct1d:(e==null?void 0:e.pct1d)??null,pct1m:(e==null?void 0:e.pct1m)??null,pctYtd:(e==null?void 0:e.pctYtd)??null}});n.sort((s,a)=>(a.pct1d??-999)-(s.pct1d??-999));const r=Math.max(.01,...n.map(s=>Math.abs(s.pct1d??0)));return`
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
        <tbody>${n.map(({name:s,pct1d:a,pct1m:e,pctYtd:o})=>{const c=j(a),d=j(e),i=j(o),m=a!=null?Math.abs(a)/r*100:0;return`<tr>
      <td class="mkt-name sec-name">${s}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${c.cls}" style="width:${m.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${c.cls}">${c.text}</td>
      <td class="num pct-cell ${d.cls}">${d.text}</td>
      <td class="num pct-cell ${i.cls}">${i.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function ne(t){return`
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
        <tbody>${Rt.map(({symbol:r,name:l,abbr:s})=>{const a=t.get(r),e=a==null?void 0:a.regularMarketPrice,o=e!=null?"$"+e.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:e>=100?2:4}):"—";return`<tr>
      <td class="mkt-name">${l} <span class="mkt-abbr">${s}</span></td>
      <td class="num mono">${o}</td>
      ${O(a==null?void 0:a.pct1d)}
      ${O(a==null?void 0:a.pct1w)}
      ${O(a==null?void 0:a.pct1m)}
      ${O(a==null?void 0:a.pctYtd)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}async function le(t){t.innerHTML=`
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
        <table class="mkt-table"><tbody>${Q(18)}</tbody></table>
      </div>
    </section>

    <!-- Bonds + FX -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Treasuries</div>
          <table class="mkt-table"><tbody>${Q(4,8)}</tbody></table>
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
        <table class="mkt-table"><tbody>${Q(4,5)}</tbody></table>
      </div>
    </section>

    <!-- Commodities + Sectors -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-commodities">
        <div class="mkt-panel">
          <div class="mkt-panel-label">Commodities</div>
          <table class="mkt-table"><tbody>${Q(8,6)}</tbody></table>
        </div>
      </div>
      <div id="mkt-sectors">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Equity Sectors</div>
          <table class="mkt-table"><tbody>${Q(11,5)}</tbody></table>
        </div>
      </div>
    </section>

    <!-- Crypto -->
    <section class="mkt-section" id="mkt-crypto">
      <div class="mkt-panel">
        <div class="mkt-panel-label">Crypto</div>
        <table class="mkt-table"><tbody>${Q(4,6)}</tbody></table>
      </div>
    </section>
  `;const n=t.querySelector("#mkt-refresh");async function r(){const s=t.querySelector("#mkt-timestamp");s.textContent="Loading…";const a=await Gt(ct);if(!t.isConnected)return;t.querySelector("#mkt-stats").innerHTML=Jt(a),t.querySelector("#mkt-equities").innerHTML=Qt(a),t.querySelector("#mkt-bonds").innerHTML=Zt(a),t.querySelector("#mkt-fx").innerHTML=ee(a),t.querySelector("#mkt-global-bonds").innerHTML=te(a),t.querySelector("#mkt-commodities").innerHTML=ae(a),t.querySelector("#mkt-sectors").innerHTML=se(a),t.querySelector("#mkt-crypto").innerHTML=ne(a);const e=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"}),o=ct.length-a.size;s.textContent=`Updated ${e} · ${a.size}/${ct.length} instruments${o?` · ${o} unavailable`:""}`}n.addEventListener("click",r),await r();const l=setInterval(r,30*60*1e3);return()=>clearInterval(l)}const oe="modulepreload",re=function(t){return"/investment-dash/"+t},kt={},Ht=function(n,r,l){let s=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const e=document.querySelector("meta[property=csp-nonce]"),o=(e==null?void 0:e.nonce)||(e==null?void 0:e.getAttribute("nonce"));s=Promise.allSettled(r.map(c=>{if(c=re(c),c in kt)return;kt[c]=!0;const d=c.endsWith(".css"),i=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${i}`))return;const m=document.createElement("link");if(m.rel=d?"stylesheet":oe,d||(m.as="script"),m.crossOrigin="",m.href=c,o&&m.setAttribute("nonce",o),document.head.appendChild(m),d)return new Promise((b,h)=>{m.addEventListener("load",b),m.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(e){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=e,window.dispatchEvent(o),!o.defaultPrevented)throw e}return s.then(e=>{for(const o of e||[])o.status==="rejected"&&a(o.reason);return n().catch(a)})},dt=[{label:"US (NYSE / NASDAQ)",suffix:"",example:"AAPL"},{label:"Australia (ASX)",suffix:".AX",example:"CBA.AX"},{label:"UK (LSE)",suffix:".L",example:"HSBA.L"},{label:"Canada (TSX)",suffix:".TO",example:"RY.TO"},{label:"Germany (XETRA)",suffix:".DE",example:"SAP.DE"},{label:"Japan (TSE)",suffix:".T",example:"7203.T"},{label:"Hong Kong (HKEX)",suffix:".HK",example:"0700.HK"}],ut=[{label:"1W",range:"5d",interval:"1d"},{label:"1M",range:"1mo",interval:"1d"},{label:"3M",range:"3mo",interval:"1d"},{label:"6M",range:"6mo",interval:"1d"},{label:"1Y",range:"1y",interval:"1d"},{label:"2Y",range:"2y",interval:"1wk"},{label:"5Y",range:"5y",interval:"1wk"},{label:"MAX",range:"max",interval:"1mo"}],ie={ma20:{period:20,color:"#fbbf24",label:"MA 20D"},ma50:{period:50,color:"#60a5fa",label:"MA 50D"},ma200:{period:200,color:"#f87171",label:"MA 200D"}};function Bt(t,n){const r=[];for(let l=n-1;l<t.length;l++){const s=t.slice(l-n+1,l+1).reduce((a,e)=>a+e.close,0);r.push({time:t[l].time,value:+(s/n).toFixed(4)})}return r}function ce(t,n,r){const l=Bt(t,n);let s=0,a=null;return r.map(e=>{for(;s<l.length&&l[s].time<=e.time;)a=l[s].value,s+=1;return a==null?null:{time:e.time,value:a}}).filter(Boolean)}function de(t,n=20,r=2){const l=Bt(t,n),s=[],a=[];for(let e=0;e<l.length;e++){const o=e+n-1,c=t.slice(o-n+1,o+1).map(m=>m.close),d=l[e].value,i=Math.sqrt(c.reduce((m,b)=>m+(b-d)**2,0)/n);s.push({time:l[e].time,value:+(d+r*i).toFixed(4)}),a.push({time:l[e].time,value:+(d-r*i).toFixed(4)})}return{upper:s,mid:l,lower:a}}const it=new Map,$t=new Map,vt=5*60*1e3;function Ot(t){const n=new Date(t*1e3);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`}async function wt(t,n,r){var p,k;const l=`${t}:${n}:${r}`,s=it.get(l);if(s&&Date.now()-s.ts<vt)return s.data;const a=`/v8/finance/chart/${encodeURIComponent(t)}?range=${n}&interval=${r}&includePrePost=false`,e=await fetch(tt(a),{headers:{Accept:"application/json"}});if(!e.ok)throw new Error(`HTTP ${e.status}`);const o=await e.json(),c=(k=(p=o==null?void 0:o.chart)==null?void 0:p.result)==null?void 0:k[0];if(!c)throw new Error("Symbol not found");const d=c.timestamp??[],i=c.indicators.quote[0],m=[],b=[];for(let f=0;f<d.length;f++){if(i.open[f]==null||i.close[f]==null)continue;const S=Ot(d[f]);m.push({time:S,open:+i.open[f].toFixed(4),high:+i.high[f].toFixed(4),low:+i.low[f].toFixed(4),close:+i.close[f].toFixed(4)}),b.push({time:S,value:i.volume[f]??0,color:i.close[f]>=i.open[f]?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"})}const h={candles:m,volumes:b,meta:c.meta};return it.set(l,{ts:Date.now(),data:h}),h}async function ue(t){var d,i,m,b,h,p;const n=`${t}:indicator-history`,r=it.get(n);if(r&&Date.now()-r.ts<vt)return r.data;const l=`/v8/finance/chart/${encodeURIComponent(t)}?range=10y&interval=1d&includePrePost=false`,s=await fetch(tt(l),{headers:{Accept:"application/json"}});if(!s.ok)throw new Error(`HTTP ${s.status}`);const a=(m=(i=(d=await s.json())==null?void 0:d.chart)==null?void 0:i.result)==null?void 0:m[0];if(!a)throw new Error("Indicator history unavailable");const e=a.timestamp??[],o=((p=(h=(b=a.indicators)==null?void 0:b.quote)==null?void 0:h[0])==null?void 0:p.close)??[],c=e.map((k,f)=>o[f]==null?null:{time:Ot(k),close:+o[f].toFixed(4)}).filter(Boolean);return it.set(n,{ts:Date.now(),data:c}),c}async function me(t){var e,o;const n=$t.get(t);if(n&&Date.now()-n.ts<vt)return n.data;const r=["annualTotalRevenue","annualGrossProfit","annualOperatingIncome","annualNetIncome","annualDilutedEPS"],l=Math.floor(Date.now()/1e3),s=l-370*24*60*60,a=`/ws/fundamentals-timeseries/v1/finance/timeseries/${encodeURIComponent(t)}?type=${r.join(",")}&period1=${s}&period2=${l}`;try{const c=await fetch(tt(a),{headers:{Accept:"application/json"}});if(!c.ok)return null;const d=((o=(e=await c.json())==null?void 0:e.timeseries)==null?void 0:o.result)??[],i=k=>{var f,S,D,L;return((L=(D=(S=(f=d.find(T=>{var R,F,x,U;return((x=(F=(R=T.meta)==null?void 0:R.symbol)==null?void 0:F.includes)==null?void 0:x.call(F,t))&&((U=T[k])==null?void 0:U.length)}))==null?void 0:f[k])==null?void 0:S.at(-1))==null?void 0:D.reportedValue)==null?void 0:L.raw)??null},m=i("annualTotalRevenue"),b=i("annualGrossProfit"),h=i("annualOperatingIncome"),p={financialData:{totalRevenue:{raw:m},grossMargins:{raw:m&&b?b/m:null},operatingMargins:{raw:m&&h?h/m:null}},defaultKeyStatistics:{trailingEps:{raw:i("annualDilutedEPS")}}};return $t.set(t,{ts:Date.now(),data:p}),p}catch{return null}}const _=(t,n={})=>t==null?"—":t.toLocaleString("en-US",n),at=t=>t==null?"—":`${t>=0?"+":""}${(t*100).toFixed(2)}%`,mt=t=>t==null?"—":t>=1e12?`$${(t/1e12).toFixed(2)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString()}`;function pt(t,n){var i,m,b,h,p,k,f,S,D,L,T,R,F,x,U;if(!n){t.innerHTML='<div class="sa-no-data">Fundamental data unavailable.</div>';return}const r=n.price??{},l=n.summaryDetail??{},s=n.defaultKeyStatistics??{},a=n.financialData??{},e=n.assetProfile??{},c=[["Market Cap",mt((i=r.marketCap)==null?void 0:i.raw)],["P/E (TTM)",_((m=l.trailingPE)==null?void 0:m.raw,{maximumFractionDigits:1})],["Fwd P/E",_((b=l.forwardPE)==null?void 0:b.raw,{maximumFractionDigits:1})],["EPS (TTM)",((h=s.trailingEps)==null?void 0:h.raw)!=null?`$${s.trailingEps.raw.toFixed(2)}`:"—"],["52W High",_((p=l.fiftyTwoWeekHigh)==null?void 0:p.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["52W Low",_((k=l.fiftyTwoWeekLow)==null?void 0:k.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["Div Yield",at((f=l.dividendYield)==null?void 0:f.raw)],["Beta",_((S=l.beta)==null?void 0:S.raw,{maximumFractionDigits:2})],["Revenue TTM",mt((D=a.totalRevenue)==null?void 0:D.raw)],["Gross Margin",at((L=a.grossMargins)==null?void 0:L.raw)],["Op Margin",at((T=a.operatingMargins)==null?void 0:T.raw)],["ROE",at((R=a.returnOnEquity)==null?void 0:R.raw)],["P/B Ratio",_((F=s.priceToBook)==null?void 0:F.raw,{maximumFractionDigits:2})],["Avg Volume",_((x=l.averageVolume)==null?void 0:x.raw)],["Employees",_(e.fullTimeEmployees)],["Free Cash Flow",mt((U=a.freeCashflow)==null?void 0:U.raw)]].map(([X,Y])=>`
    <div class="sa-fund-card">
      <div class="sa-fund-label">${X}</div>
      <div class="sa-fund-val">${Y}</div>
    </div>`).join(""),d=[e.sector,e.industry].filter(Boolean).map(X=>`<span class="sa-badge">${X}</span>`).join("");t.innerHTML=`
    <div class="sa-section-label">Key Metrics</div>
    <div class="sa-fund-grid">${c}</div>
    ${e.longBusinessSummary?`
      <div class="sa-about">
        <div class="sa-section-label">About ${d}</div>
        <p class="sa-about-text">${e.longBusinessSummary}</p>
      </div>`:""}
  `}function st(t,n,r){var i,m,b;const l=(r==null?void 0:r.price)??{},s=l.longName||l.shortName||(n==null?void 0:n.symbol)||"",a=((i=l.regularMarketPrice)==null?void 0:i.raw)??(n==null?void 0:n.regularMarketPrice)??0,e=(((m=l.regularMarketChangePercent)==null?void 0:m.raw)??0)*100,o=((b=l.regularMarketChange)==null?void 0:b.raw)??0,c=l.exchangeName||(n==null?void 0:n.exchangeName)||"",d=e>=0;t.innerHTML=`
    <div class="sa-hdr-left">
      <div class="sa-hdr-name">${s} <span class="sa-hdr-sym">${(n==null?void 0:n.symbol)??""}</span></div>
      <div class="sa-hdr-exch">${c}</div>
    </div>
    <div class="sa-hdr-right">
      <div class="sa-hdr-price">${a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div class="sa-hdr-chg ${d?"up":"dn"}">${d?"+":""}${o.toFixed(2)} (${d?"+":""}${e.toFixed(2)}%)</div>
    </div>
  `}let ot=null;async function xt(){return ot||(ot=await Ht(()=>import("./lightweight-charts.production-C-4kb1nc.js"),[])),ot}async function pe(t){const n=dt.map((u,v)=>`<option value="${v}">${u.label}</option>`).join(""),r=ut.map((u,v)=>`<button class="sa-range-btn${v===4?" active":""}" data-ri="${v}">${u.label}</button>`).join("");t.innerHTML=`
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
        <div class="sa-funds" id="sa-funds"></div>
      </div>
    </div>
  `;let l=null,s={},a=new Map,e=null,o=[],c=1,d=!1,i=new Set(["vol"]),m="line",b=4,h=null,p=null;const k=t.querySelector("#sa-ph"),f=t.querySelector("#sa-main"),S=t.querySelector("#sa-hdr"),D=t.querySelector("#sa-instruments"),L=t.querySelector("#sa-chart"),T=t.querySelector("#sa-overlay"),R=t.querySelector("#sa-tt"),F=t.querySelector("#sa-annot-list"),x=t.querySelector("#sa-funds"),U=t.querySelector("#sa-mkt"),X=t.querySelector("#sa-ticker"),Y=t.querySelector("#sa-go"),M=t.querySelector("#sa-annot-btn"),B=t.querySelector("#sa-level-input"),N=t.querySelector("#sa-level-add");function W(){const u=document.documentElement.dataset.theme;return u==="more-visible"?{background:"#fffdf7",text:"#101820",grid:"#c3d0d9",border:"#293c4a",level:"#005a9c",fontSize:15,lineWidth:3,colors:["#005a9c","#9b3d00","#006b3c","#7b2f83","#8a4b00","#005b70","#a51d37","#34495e"],volumeUp:"rgba(0,107,60,0.45)",volumeDown:"rgba(180,35,24,0.45)"}:u==="light"?{background:"#f3f0e8",text:"#5e665e",grid:"#ded8cc",border:"#b7ad9d",level:"#9b641d",fontSize:11,lineWidth:2,colors:["#9b641d","#3575a8","#b34f43","#37845b","#805b96","#86751a","#34817d","#a34f73"],volumeUp:"rgba(55,132,91,0.36)",volumeDown:"rgba(179,79,67,0.36)"}:{background:"#111413",text:"#99a49b",grid:"#303a33",border:"#47564b",level:"#e3a857",fontSize:11,lineWidth:2,colors:["#e3a857","#63a7d8","#d77d72","#72b58a","#bc91cf","#d9ca68","#55b9b3","#e28dab"],volumeUp:"rgba(101,193,140,0.4)",volumeDown:"rgba(223,124,112,0.4)"}}async function G(){if(l)return;const{createChart:u,CrosshairMode:v}=await xt(),w=W();l=u(L,{width:L.clientWidth||900,height:480,layout:{background:{color:w.background},textColor:w.text,fontSize:w.fontSize,fontFamily:"'DM Mono', monospace"},grid:{vertLines:{color:w.grid},horzLines:{color:w.grid}},crosshair:{mode:v.Normal},leftPriceScale:{visible:!0,borderColor:w.border},rightPriceScale:{borderColor:w.border},timeScale:{borderColor:w.border,timeVisible:!0,secondsVisible:!1}}),p=()=>{if(!l)return;const g=W();l.applyOptions({layout:{background:{color:g.background},textColor:g.text,fontSize:g.fontSize},grid:{vertLines:{color:g.grid},horzLines:{color:g.grid}},leftPriceScale:{borderColor:g.border},rightPriceScale:{borderColor:g.border},timeScale:{borderColor:g.border}}),[...a.values()].forEach((y,$)=>{var H,K;y.color=g.colors[$%g.colors.length];const C=s[y.symbol]??{};(H=C.main)==null||H.applyOptions({color:y.color,lineWidth:g.lineWidth}),(K=C.vol)==null||K.setData(y.priceData.volumes.map(J=>({...J,color:J.color.includes("52,211,153")||J.color.includes("101,193,140")?g.volumeUp:g.volumeDown})))}),o.forEach(y=>{var $;if(y.line){try{($=s[y.symbol])==null||$.main.removePriceLine(y.line)}catch{}y.line=E(y.price,y.symbol)}})},document.addEventListener("macro-theme-change",p),h=new ResizeObserver(()=>{l&&L.clientWidth&&l.resize(L.clientWidth,480)}),h.observe(L),l.subscribeCrosshairMove(g=>{if(!g.time||!g.point){R.style.display="none";return}const y=[...a.values()].map($=>{var J;const C=(J=s[$.symbol])==null?void 0:J.main,H=C&&g.seriesData.get(C);if(!H)return"";const K="close"in H?H.close:H.value;return`<span class="sa-tt-instrument"><i style="background:${$.color}"></i>${$.symbol} <b>${Number(K).toLocaleString("en-US",{maximumFractionDigits:4})}</b></span>`}).filter(Boolean).join("");if(!y){R.style.display="none";return}R.innerHTML=`<span class="sa-tt-date">${g.time}</span>${y}`,R.style.display="block"}),l.subscribeClick(g=>{var C;const y=e&&((C=s[e])==null?void 0:C.main);if(!d||!g.point||!y)return;const $=y.coordinateToPrice(g.point.y);$!=null&&V($,e)})}async function A(){const{LineStyle:u}=await xt();Object.values(s).flatMap(g=>Object.values(g)).forEach(g=>{try{l.removeSeries(g)}catch{}}),s={},o.forEach(g=>{g.line=null}),z();const v=W();l.priceScale("left").applyOptions({visible:!0,borderColor:v.border,scaleMargins:{top:.06,bottom:i.has("vol")?.22:.04}}),l.priceScale("right").applyOptions({visible:!0,borderColor:v.border,scaleMargins:{top:.06,bottom:i.has("vol")?.22:.04}});for(const[g,y]of[...a.values()].entries()){y.color=v.colors[g%v.colors.length];const $=y.axis;s[y.symbol]={},m==="candle"?(s[y.symbol].main=l.addCandlestickSeries({priceScaleId:$,upColor:"#65c18c",downColor:"#df7c70",borderVisible:!1,wickUpColor:"#65c18c",wickDownColor:"#df7c70"}),s[y.symbol].main.setData(y.priceData.candles)):(s[y.symbol].main=l.addLineSeries({color:y.color,lineWidth:v.lineWidth,priceScaleId:$,title:y.symbol}),s[y.symbol].main.setData(y.priceData.candles.map(C=>({time:C.time,value:C.close}))));for(const[C,H]of Object.entries(ie))!i.has(C)||y.indicatorCandles.length<H.period||(s[y.symbol][C]=l.addLineSeries({color:H.color,lineWidth:1,title:`${y.symbol} ${H.label}`,priceScaleId:$}),s[y.symbol][C].setData(ce(y.indicatorCandles,H.period,y.priceData.candles)));if(i.has("bb")&&y.priceData.candles.length>=20){const{upper:C,mid:H,lower:K}=de(y.priceData.candles);s[y.symbol].bbU=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:u.Dashed,priceScaleId:$}),s[y.symbol].bbM=l.addLineSeries({color:"rgba(124,106,247,0.4)",lineWidth:1,priceScaleId:$}),s[y.symbol].bbL=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:u.Dashed,priceScaleId:$}),s[y.symbol].bbU.setData(C),s[y.symbol].bbM.setData(H),s[y.symbol].bbL.setData(K)}}const w=a.values().next().value;i.has("vol")&&w&&(s[w.symbol].vol=l.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"vol"}),l.priceScale("vol").applyOptions({scaleMargins:{top:.82,bottom:0}}),s[w.symbol].vol.setData(w.priceData.volumes.map(g=>({...g,color:g.color.includes("52,211,153")||g.color.includes("101,193,140")?v.volumeUp:v.volumeDown})))),o.forEach(g=>{var $;const y=($=s[g.symbol])==null?void 0:$.main;g.line=y?E(g.price,g.symbol):null}),l.timeScale().fitContent()}function E(u,v){const{LineStyle:w}=ot,g=W().level;return s[v].main.createPriceLine({price:u,color:g,lineWidth:1,lineStyle:w.Dashed,axisLabelVisible:!0,title:`${v} ${u.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`})}function V(u,v=e){var w;!Number.isFinite(u)||!((w=s[v])!=null&&w.main)||(o.push({id:c++,price:u,symbol:v,line:E(u,v)}),z())}function z(){var u;if(!o.length){F.innerHTML="";return}F.innerHTML=`
      <div class="sa-annot-wrap">
        <span class="sa-section-label">Price Levels</span>
        <div class="sa-annot-pills">
          ${o.map(v=>`
            <span class="sa-annot-pill">
              ${v.symbol} · ${v.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              <button class="sa-annot-x" data-id="${v.id}" aria-label="Remove price level ${v.price}" title="Remove level">×</button>
            </span>`).join("")}
          ${o.length>1?'<button class="sa-clear-levels" type="button">Clear all</button>':""}
        </div>
      </div>`,F.querySelectorAll(".sa-annot-x").forEach(v=>{v.addEventListener("click",()=>{var y;const w=Number(v.dataset.id),g=o.findIndex($=>$.id===w);if(!(g<0)){try{o[g].line&&((y=s[o[g].symbol])==null||y.main.removePriceLine(o[g].line))}catch{}o.splice(g,1),z()}})}),(u=F.querySelector(".sa-clear-levels"))==null||u.addEventListener("click",()=>{o.forEach(v=>{var w;try{v.line&&((w=s[v.symbol])==null||w.main.removePriceLine(v.line))}catch{}}),o=[],z()})}function et(){D.innerHTML=[...a.values()].map(u=>`
      <div class="sa-instrument-row${u.symbol===e?" active":""}" data-symbol="${u.symbol}">
        <span class="sa-instrument-swatch" style="--instrument-color:${u.color}"></span>
        <button class="sa-instrument-focus" type="button" data-focus="${u.symbol}" title="Focus ${u.symbol}">${u.symbol}</button>
        <span class="sa-instrument-name">${u.name}</span>
        <label class="sa-axis-label" for="axis-${encodeURIComponent(u.symbol)}">Axis</label>
        <select class="sa-axis-select" id="axis-${encodeURIComponent(u.symbol)}" data-axis="${u.symbol}" aria-label="Price axis for ${u.symbol}">
          <option value="left"${u.axis==="left"?" selected":""}>Left</option>
          <option value="right"${u.axis==="right"?" selected":""}>Right</option>
        </select>
        <button class="sa-instrument-remove" type="button" data-remove="${u.symbol}" aria-label="Remove ${u.symbol}" title="Remove ${u.symbol}">×</button>
      </div>`).join(""),D.querySelectorAll("[data-focus]").forEach(u=>{u.addEventListener("click",()=>ft(u.dataset.focus))}),D.querySelectorAll("[data-axis]").forEach(u=>{u.addEventListener("change",async()=>{const v=a.get(u.dataset.axis);v&&(v.axis=u.value,await A())})}),D.querySelectorAll("[data-remove]").forEach(u=>{u.addEventListener("click",()=>Yt(u.dataset.remove))})}function ft(u){const v=a.get(u);v&&(e=u,et(),st(S,v.priceData.meta,v.funds),pt(x,v.funds))}async function Yt(u){if(!a.has(u))return;if(a.delete(u),o=o.filter(w=>w.symbol!==u),e===u&&(e=[...a.keys()].at(-1)??null),!a.size){f.style.display="none",k.style.display="flex",S.innerHTML="",x.innerHTML="",z(),et(),await A();return}const v=a.get(e);st(S,v.priceData.meta,v.funds),pt(x,v.funds),et(),z(),await A()}async function Wt(u){if(a.has(u)){ft(u);return}const{range:v,interval:w}=ut[b];T.style.display="flex",k.style.display="none",f.style.display="block",S.innerHTML=`<div class="sa-hdr-loading">Loading ${u}…</div>`,x.innerHTML="";try{await G();const[g,y,$]=await Promise.all([wt(u,v,w),ue(u),me(u)]),C={symbol:u,name:g.meta.longName||g.meta.shortName||u,priceData:g,indicatorCandles:y,funds:$,axis:a.size===0?"right":a.size%2?"left":"right",color:"#e3a857"};a.set(u,C),e=u,st(S,g.meta,$),et(),await A(),pt(x,$)}catch{S.innerHTML=`<div class="sa-error">Symbol <b>${u}</b> not found or no data available.</div>`,x.innerHTML=""}finally{T.style.display="none"}}async function jt(u){if(!a.size)return;b=u,t.querySelectorAll(".sa-range-btn").forEach((g,y)=>g.classList.toggle("active",y===u));const{range:v,interval:w}=ut[u];T.style.display="flex";try{(await Promise.all([...a.values()].map(async $=>({symbol:$.symbol,data:await wt($.symbol,v,w)})))).forEach(({symbol:$,data:C})=>{a.get($).priceData=C});const y=a.get(e);st(S,y.priceData.meta,y.funds),await A()}finally{T.style.display="none"}}t.querySelectorAll(".sa-range-btn").forEach((u,v)=>u.addEventListener("click",()=>jt(v))),U.addEventListener("change",()=>{X.placeholder=`Ticker (e.g. ${dt[+U.value].example})`});async function yt(){const u=X.value.trim().toUpperCase(),v=dt[+U.value];if(!u)return;const w=v.suffix&&!u.endsWith(v.suffix)?`${u}${v.suffix}`:u;await Wt(w)}Y.addEventListener("click",yt),X.addEventListener("keydown",u=>{u.key==="Enter"&&yt()}),t.querySelectorAll("[data-type]").forEach(u=>u.addEventListener("click",async()=>{m=u.dataset.type,t.querySelectorAll("[data-type]").forEach(v=>v.classList.remove("active")),u.classList.add("active"),a.size&&await A()})),t.querySelectorAll("[data-ind]").forEach(u=>u.addEventListener("click",async()=>{const v=u.dataset.ind;i.has(v)?i.delete(v):i.add(v),u.classList.toggle("active",i.has(v)),a.size&&await A()})),M.addEventListener("click",()=>{d=!d,M.classList.toggle("active",d),M.setAttribute("aria-pressed",String(d)),M.textContent=d?"Click to place":"Place on chart",t.querySelector("#sa-chart-wrap").classList.toggle("sa-annotating",d)});function gt(){const u=Number(B.value);if(!B.value.trim()||!Number.isFinite(u)){B.focus();return}V(u),B.value="",B.focus()}return N.addEventListener("click",gt),B.addEventListener("keydown",u=>{u.key==="Enter"&&gt()}),()=>{h==null||h.disconnect(),p&&document.removeEventListener("macro-theme-change",p),l&&(l.remove(),l=null),s={},o=[]}}const Xt="portv1",Et={symbol:"^GSPC"},he=[{label:"US",suffix:""},{label:"ASX",suffix:".AX"},{label:"LSE",suffix:".L"},{label:"TSX",suffix:".TO"},{label:"XETRA",suffix:".DE"},{label:"TSE",suffix:".T"},{label:"HKEX",suffix:".HK"}];let P=[],nt=63,q=null;function ht(){try{localStorage.setItem(Xt,JSON.stringify(P))}catch{}}function be(){try{return JSON.parse(localStorage.getItem(Xt)??"[]")}catch{return[]}}const Lt=new Map,ve=10*60*1e3;async function fe(t,n){var l,s,a,e,o;const r=Lt.get(t);if(r&&Date.now()-r.ts<ve)return r.data;try{const c=`/v8/finance/chart/${encodeURIComponent(t)}?range=1y&interval=1d`,d=await fetch(tt(c),{headers:{Accept:"application/json"},signal:n});if(!d.ok)return null;const i=await d.json(),m=(s=(l=i==null?void 0:i.chart)==null?void 0:l.result)==null?void 0:s[0];if(!m)return null;const b=m.timestamp??[],h=((o=(e=(a=m.indicators)==null?void 0:a.quote)==null?void 0:e[0])==null?void 0:o.close)??[],p=m.meta,k=[];for(let S=1;S<b.length;S++)h[S]!=null&&h[S-1]!=null&&h[S-1]!==0&&k.push({date:b[S],ret:(h[S]-h[S-1])/h[S-1]});const f={symbol:t,name:p.longName||p.shortName||t,price:p.regularMarketPrice,retData:k};return Lt.set(t,{ts:Date.now(),data:f}),f}catch{return null}}async function ye(t){var n,r,l,s;try{const a=`/v8/finance/chart/${encodeURIComponent(t)}?range=1d&interval=1d`,e=await fetch(tt(a),{headers:{Accept:"application/json"}});if(!e.ok)return null;const o=(s=(l=(r=(n=await e.json())==null?void 0:n.chart)==null?void 0:r.result)==null?void 0:l[0])==null?void 0:s.meta;return o?{name:o.longName||o.shortName||t,price:o.regularMarketPrice}:null}catch{return null}}function ge(t){const n=new Date((t+43200)*1e3);return`${n.getUTCFullYear()}-${String(n.getUTCMonth()+1).padStart(2,"0")}-${String(n.getUTCDate()).padStart(2,"0")}`}function Se(t){const n=t.map(a=>a.map(e=>({key:ge(e.date),ret:e.ret}))),r=new Set;n.forEach(a=>a.forEach(e=>r.add(e.key)));const l=[...r].sort(),s=n.map(a=>{const e=new Map(a.map(o=>[o.key,o.ret]));return l.map(o=>e.get(o)??0)});return{dates:l,aligned:s}}function ke(t,n){var c;const r=t.length,l=((c=t[0])==null?void 0:c.length)??0;if(l<10||r<1)return null;const s=Math.exp(-Math.LN2/n),a=Array.from({length:r},()=>new Array(r).fill(0));let e=0,o=1;for(let d=l-1;d>=0;d--){for(let i=0;i<r;i++)for(let m=0;m<r;m++)a[i][m]+=o*t[i][d]*t[m][d];e+=o,o*=s}for(let d=0;d<r;d++)for(let i=0;i<r;i++)a[d][i]=a[d][i]/e*252;return a}function $e(t){const n=t.length;return Array.from({length:n},(r,l)=>Array.from({length:n},(s,a)=>{const e=Math.sqrt(t[l][l]*t[a][a]);return e>0?t[l][a]/e:l===a?1:0}))}function we(t,n){t.length;const r=t.map((i,m)=>t.reduce((b,h,p)=>b+n[m][p]*h,0)),l=t.reduce((i,m,b)=>i+m*r[b],0),s=Math.sqrt(Math.max(0,l)),a=t.map((i,m)=>s>0?i*r[m]/s:0),e=a.map(i=>s>0?i/s:0),o=n.map((i,m)=>Math.sqrt(Math.max(0,n[m][m]))),c=t.reduce((i,m,b)=>i+m*o[b],0),d=s>0?c/s:1;return{portVol:s,RC:a,pctRC:e,indivVols:o,divRatio:d}}function xe(t,n){const r=t.length;if(r<5)return null;let l=1,s=1,a=0;const e=[],o=[];for(const f of t){l*=1+f,e.push(l),l>s&&(s=l);const S=l/s-1;o.push(S),-S>a&&(a=-S)}const c=Math.pow(Math.max(l,1e-9),252/r)-1,d=t.reduce((f,S)=>f+S,0)/r,i=Math.sqrt(t.reduce((f,S)=>f+(S-d)**2,0)/(r-1)*252),m=i>0?(c-.04)/i:null,b=a>0?c/a:null;let h=null;if((n==null?void 0:n.length)===r){const f=n.reduce((L,T)=>L+T,0)/r;let S=0,D=0;t.forEach((L,T)=>{S+=(L-d)*(n[T]-f),D+=(n[T]-f)**2}),h=D>0?S/D:null}let p=1;const k=(n==null?void 0:n.map(f=>(p*=1+f,p)))??[];return{annRet:c,vol:i,sharpe:m,beta:h,maxDD:a,calmar:b,navSeries:e,ddSeries:o,bmkNav:k}}const I={pct:(t,n=2)=>t==null||isNaN(t)?"—":`${t>=0?"+":""}${(t*100).toFixed(n)}%`,num:(t,n=2)=>t==null||isNaN(t)?"—":t.toFixed(n),price:t=>t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),cls:t=>t==null||isNaN(t)?"":t>=0?"up":"dn"};function Ee(t){if(t==null||isNaN(t))return"transparent";const n=Math.max(-1,Math.min(1,t)),r=(Math.abs(n)*.65+.08).toFixed(2);return n>=0?`rgba(248,113,113,${r})`:`rgba(52,211,153,${r})`}function Le(t){return`<div class="port-metrics-strip">
    ${[["Ann. Return",I.pct(t.annRet),I.cls(t.annRet)],["Ann. Vol",I.pct(t.vol),""],["Sharpe",I.num(t.sharpe),I.cls(t.sharpe)],["Beta (SPX)",I.num(t.beta),""],["Max Drawdown",I.pct(-t.maxDD),"dn"],["Calmar",I.num(t.calmar),I.cls(t.calmar)]].map(([r,l,s])=>`
      <div class="port-metric-card">
        <div class="port-metric-label">${r}</div>
        <div class="port-metric-val ${s}">${l}</div>
      </div>`).join("")}
  </div>`}function Me(t,n,r){const{portVol:l,pctRC:s,indivVols:a,divRatio:e}=we(n,r),o=Math.max(1e-9,...s.map(Math.abs)),c=t.map((d,i)=>`
    <div class="port-risk-row">
      <div class="port-risk-lbl">${d}</div>
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
      <div class="port-risk-rows">${c}</div>
    </div>`}function De(t,n,r){const l=n.reduce((a,e,o)=>a+e*n.reduce((c,d,i)=>c+d*r[o][i],0),0);return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Volatility & Contribution Beta</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Ann. Vol</th><th class="num">β → Port</th>
        </tr></thead>
        <tbody>${t.map((a,e)=>{const o=Math.sqrt(Math.max(0,r[e][e])),c=n.reduce((i,m,b)=>i+m*r[e][b],0),d=l>0?c/l:null;return`<tr>
      <td class="mkt-name">${a}</td>
      <td class="num">${(n[e]*100).toFixed(1)}%</td>
      <td class="num">${(o*100).toFixed(1)}%</td>
      <td class="num">${I.num(d)}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Te(t,n,r){const l=$e(n),s=t.map(e=>`<th class="corr-col-hdr">${e}</th>`).join(""),a=t.map((e,o)=>`<tr><th class="corr-row-hdr">${e}</th>${t.map((c,d)=>{const i=l[o][d],m=o===d;return`<td class="corr-cell${m?" corr-diag":""}"
        style="background:${m?"var(--bg-base)":Ee(i)}">${m?"—":i.toFixed(2)}</td>`}).join("")}</tr>`).join("");return`
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
    </div>`}function Ae(t,n,r,l,s){const a=l.length,e={"1d":1,"1w":5,"1m":21,"3m":63};let o;if(s==="ytd"){const h=String(new Date().getFullYear());o=l.findIndex(p=>p.startsWith(h)),o<0&&(o=0)}else o=Math.max(0,a-(e[s]??1));const c=r.map(h=>h.slice(o).reduce((p,k)=>p*(1+k),1)-1),d=c.reduce((h,p,k)=>h+n[k]*p,0),i=Math.max(1e-9,...c.map(h=>Math.abs(h))),m=["1d","1w","1m","3m","ytd"].map(h=>`<button class="port-period-btn${h===s?" active":""}" data-period="${h}">${h.toUpperCase()}</button>`).join(""),b=t.map((h,p)=>{const k=c[p],f=n[p]*k,S=(Math.abs(k)/i*100).toFixed(1);return`<tr>
      <td class="mkt-name">${h}</td>
      <td class="num">${(n[p]*100).toFixed(1)}%</td>
      <td class="num ${I.cls(k)}">${I.pct(k)}</td>
      <td class="num ${I.cls(f)}">${I.pct(f)}</td>
      <td class="port-attr-bar-cell">
        <span class="port-attr-bar ${k>=0?"up":"dn"}" style="width:${S}%"></span>
      </td>
    </tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="port-attr-hdr">
        <span class="mkt-panel-label" style="border:none;padding:10px 14px 8px">Return Attribution</span>
        <div class="port-attr-periods" id="port-attr-periods">${m}</div>
      </div>
      <div class="port-attr-summary">
        Portfolio return: <strong class="${I.cls(d)}">${I.pct(d)}</strong>
      </div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Return</th><th class="num">Contribution</th><th></th>
        </tr></thead>
        <tbody>${b}</tbody>
      </table>
    </div>`}async function Ce(t,n,r,l){var b;const s=t.querySelector("#port-chart-wrap");if(!s)return;q&&(q(),q=null);const{createChart:a}=await Ht(async()=>{const{createChart:h}=await import("./lightweight-charts.production-C-4kb1nc.js");return{createChart:h}},[]);s.innerHTML="";const e=document.createElement("div");e.style.height="280px",s.appendChild(e);const o=a(e,{layout:{background:{color:"transparent"},textColor:"#6b7280"},grid:{vertLines:{color:"#22253a"},horzLines:{color:"#22253a"}},rightPriceScale:{borderColor:"#22253a"},timeScale:{borderColor:"#22253a"}}),c=o.addLineSeries({color:"#7c6af7",lineWidth:2,title:"Portfolio"}),d=o.addLineSeries({color:"#4b5563",lineWidth:1,lineStyle:2,title:"S&P 500"});function i(h){if(h==="cumret")c.setData(n.map((p,k)=>({time:p,value:+((r[k]-1)*100).toFixed(3)}))),d.setData(n.map((p,k)=>({time:p,value:+((l[k]-1)*100).toFixed(3)})));else{let p=1;c.setData(n.map((k,f)=>(r[f]>p&&(p=r[f]),{time:k,value:+((r[f]/p-1)*100).toFixed(3)}))),d.setData([])}o.timeScale().fitContent()}i("cumret"),(b=t.querySelector("#port-chart-toggle"))==null||b.querySelectorAll("[data-mode]").forEach(h=>{h.addEventListener("click",()=>{t.querySelectorAll("#port-chart-toggle [data-mode]").forEach(p=>p.classList.toggle("active",p===h)),i(h.dataset.mode)})});const m=new ResizeObserver(()=>o.resize(e.offsetWidth,280));m.observe(e),q=()=>{m.disconnect(),o.remove()}}function Pe(t,n,r,l,s,a){t.innerHTML=`
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
  `,t.querySelector("#port-metrics-strip").innerHTML=Le(a);function e(d){const i=ke(n,d);i&&(t.querySelector("#port-risk-panel").innerHTML=Me(l,s,i),t.querySelector("#port-vol-panel").innerHTML=De(l,s,i),t.querySelector("#port-corr-panel").innerHTML=Te(l,i,d),o())}function o(){const d=t.querySelector("#port-hl-slider"),i=t.querySelector("#port-hl-val");d&&d.addEventListener("input",()=>{nt=+d.value,i&&(i.textContent=`${nt}d`),e(nt)})}function c(d="1d"){var i;t.querySelector("#port-attr-panel").innerHTML=Ae(l,s,n,r,d),(i=t.querySelector("#port-attr-periods"))==null||i.querySelectorAll(".port-period-btn").forEach(m=>{m.addEventListener("click",()=>c(m.dataset.period))})}e(nt),c("1d"),Ce(t,r,a.navSeries,a.bmkNav)}function Fe(t){P=be(),Array.isArray(P)||(P=[]),t.innerHTML=`
    <div class="port-layout">
      <div class="mkt-panel port-holdings-panel">
        <div class="mkt-panel-label">Portfolio Holdings</div>

        <div class="port-add-form">
          <select id="port-market" class="sa-market-sel">
            ${he.map(b=>`<option value="${b.suffix}">${b.label}</option>`).join("")}
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
  `;let n=P.reduce((b,h)=>Math.max(b,h.id??0),0)+1,r=null;const l=t.querySelector("#port-analytics"),s=t.querySelector("#port-add-btn"),a=t.querySelector("#port-analyze-btn"),e=t.querySelector("#port-add-err"),o=t.querySelector("#port-ticker"),c=t.querySelector("#port-market"),d=t.querySelector("#port-weight-inp"),i=t.querySelector("#port-holdings-body");function m(){const b=P.reduce((p,k)=>p+k.weight,0);i.innerHTML=P.length===0?'<tr><td colspan="5" class="port-empty">No holdings yet — add a ticker above.</td></tr>':P.map(p=>`
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
          <td class="num">${I.price(p.price)}</td>
          <td><button class="port-remove" data-id="${p.id}" title="Remove">×</button></td>
        </tr>`).join("");const h=t.querySelector("#port-total");h&&(h.textContent=`Total: ${b.toFixed(1)}%`,h.className=`port-total ${b>100.01?"dn":Math.abs(b-100)<.01?"up":""}`),i.querySelectorAll(".port-wt-inp").forEach(p=>{p.addEventListener("change",k=>{const f=P.find(S=>S.id===+k.target.dataset.id);f&&(f.weight=parseFloat(k.target.value)||0,ht(),m())})}),i.querySelectorAll(".port-remove").forEach(p=>{p.addEventListener("click",k=>{P=P.filter(f=>f.id!==+k.target.dataset.id),ht(),m()})})}return s.addEventListener("click",async()=>{const b=c.value,h=o.value.trim().toUpperCase();if(!h){e.textContent="Enter a ticker";return}const p=h+b;if(P.some(S=>S.symbol===p)){e.textContent="Already added";return}const k=parseFloat(d.value)||0;s.disabled=!0,e.textContent="Looking up…";const f=await ye(p);if(s.disabled=!1,!f){e.textContent=`"${p}" not found`;return}P.push({id:n++,symbol:p,displaySymbol:h,name:f.name,price:f.price,weight:k}),ht(),o.value="",d.value="",e.textContent="",m()}),o.addEventListener("keydown",b=>{b.key==="Enter"&&s.click()}),a.addEventListener("click",async()=>{if(P.length<2){l.innerHTML='<div class="port-msg port-err">Add at least 2 holdings to analyze.</div>';return}r==null||r.abort(),r=new AbortController,l.innerHTML=`<div class="port-msg port-loading"><div class="sa-spinner"></div><span>Fetching 1Y data for ${P.length} holdings…</span></div>`,a.disabled=!0;const b=[...new Set([Et.symbol,...P.map(M=>M.symbol)])],h=await Promise.all(b.map(M=>fe(M,r.signal)));a.disabled=!1;const p=new Map(b.map((M,B)=>[M,h[B]])),k=P.filter(M=>!p.get(M.symbol));if(k.length){l.innerHTML=`<div class="port-msg port-err">Could not load data for: ${k.map(M=>M.displaySymbol).join(", ")}</div>`;return}const f=p.get(Et.symbol),S=P.map(M=>p.get(M.symbol).retData),D=f?[...S,f.retData]:S,{dates:L,aligned:T}=Se(D),R=T.slice(0,P.length),F=f?T[T.length-1]:null,x=P.map(M=>M.weight/100),U=L.map((M,B)=>x.reduce((N,W,G)=>N+W*(R[G][B]??0),0)),X=xe(U,F);if(!X){l.innerHTML='<div class="port-msg port-err">Insufficient data for analysis (need ≥5 aligned trading days).</div>';return}const Y=P.map(M=>M.displaySymbol);Pe(l,R,L,Y,x,X)}),m(),()=>{r==null||r.abort(),q&&(q(),q=null)}}const Ie=["market","stock","portfolio"],Ue={market:"Macro monitor",stock:"Single name",portfolio:"Portfolio lab"},Re={market:"01",stock:"02",portfolio:"03"};let lt="market",Z=null;const Nt="macro-monitor-theme";function He(){try{const t=localStorage.getItem(Nt);return["dark","light","more-visible"].includes(t)?t:"dark"}catch{return"dark"}}function Mt(t){document.documentElement.dataset.theme=t,document.dispatchEvent(new CustomEvent("macro-theme-change",{detail:{theme:t}}))}function Be(t){const n=He();Mt(n),t.innerHTML=`
    <div class="app-frame">
      <header class="topbar">
        <div class="brand-lockup"><div class="logo">MACRO MONITOR</div><div class="brand-sub">GLOBAL MULTI-ASSET RESEARCH</div></div>
        <div class="topbar-center"><nav class="tabs" id="main-tabs">
          ${Ie.map(e=>`<button class="tab ${e===lt?"active":""}" data-tab="${e}"><span class="tab-num">${Re[e]}</span>${Ue[e]}</button>`).join("")}
        </nav></div>
        <div class="topbar-right"><span class="market-status"><i></i> DATA LINKED</span><span class="topbar-date">${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span><label class="theme-select-label" for="theme-select">Theme</label><select class="theme-select" id="theme-select" aria-label="Colour theme"><option value="dark"${n==="dark"?" selected":""}>Dark</option><option value="light"${n==="light"?" selected":""}>Light</option><option value="more-visible"${n==="more-visible"?" selected":""}>More Visible</option></select></div>
      </header>
      <main class="main-content" id="tab-content"></main>
      <footer class="app-footer"><span>NSM / TERMINAL</span><span>MARKET DATA: YAHOO FINANCE · DELAYED / INDICATIVE</span><span>LOCAL SESSION</span></footer>
    </div>
  `;const r=t.querySelector("#main-tabs"),l=t.querySelector("#tab-content"),s=t.querySelector("#theme-select");s.addEventListener("change",()=>{const e=s.value;Mt(e);try{localStorage.setItem(Nt,e)}catch{}});function a(e){e!==lt&&(lt=e,r.querySelectorAll(".tab").forEach(o=>{o.classList.toggle("active",o.dataset.tab===e)}),Dt(l,e))}r.addEventListener("click",e=>{const o=e.target.closest(".tab");o&&a(o.dataset.tab)}),Dt(l,lt)}function Dt(t,n){Z&&(Z(),Z=null),t.innerHTML="",n==="market"?le(t).then(r=>{Z=r??null}):n==="stock"?pe(t).then(r=>{Z=r??null}):n==="portfolio"&&(Z=Fe(t)??null)}Be(document.getElementById("app"));
