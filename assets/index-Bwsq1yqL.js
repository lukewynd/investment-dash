(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))l(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const e of a.addedNodes)e.tagName==="LINK"&&e.rel==="modulepreload"&&l(e)}).observe(document,{childList:!0,subtree:!0});function r(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function l(s){if(s.ep)return;s.ep=!0;const a=r(s);fetch(s.href,a)}})();const Et="https://yf-proxy.lukewynd.workers.dev";function J(t){return`${Et}${t}`}function Yt(t){const n=encodeURIComponent(t);return`${Et}/v8/finance/chart/${n}?range=1y&interval=1d`}const ft=new Map,jt=5*60*1e3;async function Wt(t){var r,l,s,a,e,o;const n=ft.get(t);if(n&&Date.now()-n.ts<jt)return n.data;try{const c=await fetch(Yt(t),{headers:{Accept:"application/json"}});if(!c.ok)return null;const d=await c.json(),i=(l=(r=d==null?void 0:d.chart)==null?void 0:r.result)==null?void 0:l[0];if(!i)return null;const m=i.meta,b=((e=(a=(s=i.indicators)==null?void 0:s.quote)==null?void 0:a[0])==null?void 0:e.close)??[],h=I=>{for(let w=I;w>=0;w--)if(b[w]!=null)return{index:w,value:b[w]};return null},p=h(b.length-1),y=p?h(p.index-1):null,g=m.regularMarketPrice??null??(p==null?void 0:p.value)??null,E=(y==null?void 0:y.value)??null,M=g!=null&&E!=null?g-E:null,A=M!=null&&E!==0?M/E*100:null,H=b.length,C=(p==null?void 0:p.index)??-1,D=g,R=I=>{let w=C-I;for(;w>=0&&b[w]==null;)w--;const Y=w>=0?b[w]:null;return Y!=null&&D!=null&&Y!==0?(D-Y)/Y*100:null},N=I=>{let w=C-I;for(;w>=0&&b[w]==null;)w--;return w>=0?b[w]:null},B=I=>{const w=N(I);return w!=null&&D!=null?D-w:null},L=new Date().getFullYear(),W=i.timestamp??[];let O=null;for(let I=0;I<W.length;I++)if(new Date(W[I]*1e3).getFullYear()===L&&b[I]!=null){O=b[I];break}const X=O!=null&&O!==0&&D!=null?(D-O)/O*100:null,G={symbol:t,regularMarketPrice:g,regularMarketChangePercent:A,regularMarketChange:M,previousClose:E,dataTimestamp:((o=i.timestamp)==null?void 0:o[C])??null,source:"Yahoo Finance chart",quoteType:m.instrumentType??"",ytdPct:X,pct1d:A,pct1w:R(5),pct1m:R(21),pct3m:R(63),pctYtd:X,change1d:M,change1w:B(5),change1m:B(21),change3m:B(63),changeYtd:O!=null&&D!=null?D-O:null};return ft.set(t,{ts:Date.now(),data:G}),G}catch{return null}}async function _t(t){const r=new Map;for(let l=0;l<t.length;l+=8){const s=t.slice(l,l+8),a=await Promise.allSettled(s.map(e=>Wt(e)));s.forEach((e,o)=>{const c=a[o].status==="fulfilled"?a[o].value:null;c&&r.set(e,c)})}return r}const Mt=[{symbol:"^GSPC",name:"S&P 500",type:"index"},{symbol:"^VIX",name:"VIX",type:"vix"},{symbol:"^TNX",name:"US 10Y",type:"yield"},{symbol:"DX-Y.NYB",name:"DXY",type:"index"},{symbol:"GC=F",name:"Gold",type:"commodity"},{symbol:"BTC-USD",name:"Bitcoin",type:"crypto"}],At=[{symbol:"^GSPC",name:"S&P 500",region:"Americas"},{symbol:"^IXIC",name:"NASDAQ Comp.",region:"Americas"},{symbol:"^DJI",name:"Dow Jones",region:"Americas"},{symbol:"^RUT",name:"Russell 2000",region:"Americas"},{symbol:"^BVSP",name:"Bovespa",region:"Americas"},{symbol:"^MXX",name:"IPC Mexico",region:"Americas"},{symbol:"^FTSE",name:"FTSE 100",region:"Europe"},{symbol:"^GDAXI",name:"DAX",region:"Europe"},{symbol:"^FCHI",name:"CAC 40",region:"Europe"},{symbol:"^STOXX50E",name:"Euro Stoxx 50",region:"Europe"},{symbol:"^SSMI",name:"SMI",region:"Europe"},{symbol:"^AEX",name:"AEX",region:"Europe"},{symbol:"^N225",name:"Nikkei 225",region:"Asia-Pacific"},{symbol:"^HSI",name:"Hang Seng",region:"Asia-Pacific"},{symbol:"000001.SS",name:"Shanghai Comp.",region:"Asia-Pacific"},{symbol:"^AXJO",name:"ASX 200",region:"Asia-Pacific"},{symbol:"^KS11",name:"KOSPI",region:"Asia-Pacific"},{symbol:"^STI",name:"Straits Times",region:"Asia-Pacific"}],Dt=[{symbol:"^IRX",name:"3-Month"},{symbol:"^FVX",name:"5-Year"},{symbol:"^TNX",name:"10-Year"},{symbol:"^TYX",name:"30-Year"}],Tt=[{symbol:"BWX",name:"Global ex-US Treasuries",region:"Global"},{symbol:"IGOV",name:"International Treasuries",region:"Developed"},{symbol:"EMB",name:"Emerging Market Sovereign",region:"Emerging"},{symbol:"EWJ",name:"Japan rates proxy",region:"Japan"}],mt=[{code:"USD",name:"US Dollar",symbol:null,invert:!1},{code:"EUR",name:"Euro",symbol:"EURUSD=X",invert:!1},{code:"GBP",name:"Sterling",symbol:"GBPUSD=X",invert:!1},{code:"JPY",name:"Yen",symbol:"USDJPY=X",invert:!0},{code:"AUD",name:"Aus Dollar",symbol:"AUDUSD=X",invert:!1},{code:"CAD",name:"Can Dollar",symbol:"USDCAD=X",invert:!0},{code:"CHF",name:"Swiss Franc",symbol:"USDCHF=X",invert:!0}],qt=mt.filter(t=>t.symbol).map(t=>t.symbol),Ct=[{symbol:"GC=F",name:"Gold",unit:"/oz",group:"Metals"},{symbol:"SI=F",name:"Silver",unit:"/oz",group:"Metals"},{symbol:"HG=F",name:"Copper",unit:"/lb",group:"Metals"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl",group:"Energy"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl",group:"Energy"},{symbol:"NG=F",name:"Nat. Gas",unit:"/MMBtu",group:"Energy"},{symbol:"ZW=F",name:"Wheat",unit:"/bu",group:"Agri"},{symbol:"ZC=F",name:"Corn",unit:"/bu",group:"Agri"}],Pt=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],Ft=[{symbol:"BTC-USD",name:"Bitcoin",abbr:"BTC"},{symbol:"ETH-USD",name:"Ethereum",abbr:"ETH"},{symbol:"SOL-USD",name:"Solana",abbr:"SOL"},{symbol:"XRP-USD",name:"XRP",abbr:"XRP"}],ot=[...new Set([...Mt.map(t=>t.symbol),...At.map(t=>t.symbol),...Dt.map(t=>t.symbol),...Tt.map(t=>t.symbol),...qt,...Ct.map(t=>t.symbol),...Pt.map(t=>t.symbol),...Ft.map(t=>t.symbol)])];function nt(t,n=2){return t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:n,maximumFractionDigits:n})}function j(t){if(t==null)return{text:"—",cls:""};const n=t>=0?"+":"",r=t>=0?"up":"dn",l=Math.abs(t)>=3?" strong":"";return{text:`${n}${t.toFixed(2)}%`,cls:r+l}}function Gt(t){if(t==null)return{text:"—",cls:""};const n=Math.round(t*100),r=n>=0?"+":"",l=n>=0?"up":"dn";return{text:`${r}${n}bps`,cls:l}}function U(t){const n=j(t);return`<td class="num pct-cell ${n.cls}">${n.text}</td>`}function K(t,n=7){return Array.from({length:t},()=>`<tr>${Array.from({length:n},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function Vt(t){return Mt.map(({symbol:n,name:r,type:l})=>{const s=t.get(n),a=s==null?void 0:s.regularMarketPrice,e=j((s==null?void 0:s.pct1d)??null),o=j((s==null?void 0:s.pctYtd)??null);let c="—";return a!=null&&(l==="yield"?c=a.toFixed(2)+"%":l==="crypto"?c="$"+a.toLocaleString("en-US",{maximumFractionDigits:0}):l==="commodity"?c="$"+nt(a):c=nt(a)),`
      <div class="mkt-stat-card">
        <div class="mkt-stat-name">${r}</div>
        <div class="mkt-stat-price">${c}</div>
        <div class="mkt-stat-chg ${e.cls}">${e.text}</div>
        <div class="mkt-stat-ytd ${o.cls}">${o.text} YTD</div>
      </div>`}).join("")}function Kt(t){const n=["Americas","Europe","Asia-Pacific"];let r="";return n.forEach(l=>{const s=At.filter(a=>a.region===l);r+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,r+=s.map(({symbol:a,name:e})=>{const o=t.get(a),c=o==null?void 0:o.regularMarketPrice,d=c!=null?c.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";return`<tr>
        <td class="mkt-name">${e}</td>
        <td class="num mono">${d}</td>
        ${U(o==null?void 0:o.pct1d)}
        ${U(o==null?void 0:o.pct1w)}
        ${U(o==null?void 0:o.pct1m)}
        ${U(o==null?void 0:o.pct3m)}
        ${U(o==null?void 0:o.pctYtd)}
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
    </div>`}function zt(t){const n=Dt.map(({symbol:s,name:a})=>{const e=t.get(s),o=(e==null?void 0:e.regularMarketPrice)??null;return{name:a,yld:o,change1d:(e==null?void 0:e.change1d)??null,change1w:(e==null?void 0:e.change1w)??null,change1m:(e==null?void 0:e.change1m)??null,change3m:(e==null?void 0:e.change3m)??null,changeYtd:(e==null?void 0:e.changeYtd)??null}}),r=Math.max(.01,...n.map(s=>s.yld??0));return`
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
        <tbody>${n.map(({name:s,yld:a,change1d:e,change1w:o,change1m:c,change3m:d,changeYtd:i})=>{const m=[e,o,c,d,i].map(Gt),b=a!=null?a.toFixed(2)+"%":"—",h=a!=null?a/r*100:0;return`<tr>
      <td class="mkt-name">${s}</td>
      <td class="num mono">${b}</td>
      <td class="yc-bar-cell"><span class="yc-bar" style="width:${h.toFixed(1)}%"></span></td>
      ${m.map(p=>`<td class="num pct-cell ${p.cls}">${p.text}</td>`).join("")}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Jt(t){return`<div class="mkt-panel">
    <div class="mkt-panel-label">Global Bond Markets · price proxies</div>
    <table class="mkt-table">
      <thead><tr><th>Instrument</th><th class="num">Level</th><th class="num">1D</th><th class="num">1M</th><th class="num">YTD</th></tr></thead>
      <tbody>${Tt.map(({symbol:r,name:l,region:s})=>{const a=t.get(r),e=a==null?void 0:a.regularMarketPrice,o=j(a==null?void 0:a.pct1d),c=j(a==null?void 0:a.pct1m),d=j(a==null?void 0:a.pctYtd);return`<tr>
      <td><span class="mkt-name">${l}</span><span class="mkt-unit">${s}</span></td>
      <td class="num mono">${e!=null?nt(e):"—"}</td>
      <td class="num pct-cell ${o.cls}">${o.text}</td>
      <td class="num pct-cell ${c.cls}">${c.text}</td>
      <td class="num pct-cell ${d.cls}">${d.text}</td>
    </tr>`}).join("")}</tbody>
    </table>
  </div>`}function Qt(t){const n={USD:1};mt.forEach(({code:e,symbol:o,invert:c})=>{var i;if(!o)return;const d=(i=t.get(o))==null?void 0:i.regularMarketPrice;d!=null&&(n[e]=c?1/d:d)});const r=e=>e==null?"—":e>=100?e.toFixed(2):e>=10?e.toFixed(3):e.toFixed(4),l=mt.map(e=>e.code),s=l.map(e=>`<th class="num fx-col-hdr">${e}</th>`).join(""),a=l.map(e=>{const o=l.map(c=>{if(e===c)return'<td class="fx-diag">—</td>';const d=n[e],i=n[c],m=d!=null&&i!=null&&i!==0?d/i:null;return`<td class="num fx-cell">${r(m)}</td>`}).join("");return`<tr><th class="fx-row-hdr">${e}</th>${o}</tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Cross Rates <span class="mkt-panel-sub">1 row = X column</span></div>
      <div class="fx-matrix-wrap">
        <table class="fx-matrix">
          <thead><tr><th></th>${s}</tr></thead>
          <tbody>${a}</tbody>
        </table>
      </div>
    </div>`}function Zt(t){const n=["Metals","Energy","Agri"];let r="";return n.forEach(l=>{const s=Ct.filter(a=>a.group===l);r+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,r+=s.map(({symbol:a,name:e,unit:o})=>{const c=t.get(a),d=c==null?void 0:c.regularMarketPrice,i=d!=null?"$"+nt(d):"—";return`<tr>
        <td class="mkt-name">${e}<span class="mkt-unit">${o}</span></td>
        <td class="num mono">${i}</td>
        ${U(c==null?void 0:c.pct1d)}
        ${U(c==null?void 0:c.pct1w)}
        ${U(c==null?void 0:c.pct1m)}
        ${U(c==null?void 0:c.pctYtd)}
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
    </div>`}function te(t){const n=Pt.map(({symbol:s,name:a})=>{const e=t.get(s);return{name:a,pct1d:(e==null?void 0:e.pct1d)??null,pct1m:(e==null?void 0:e.pct1m)??null,pctYtd:(e==null?void 0:e.pctYtd)??null}});n.sort((s,a)=>(a.pct1d??-999)-(s.pct1d??-999));const r=Math.max(.01,...n.map(s=>Math.abs(s.pct1d??0)));return`
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
    </div>`}function ee(t){return`
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
        <tbody>${Ft.map(({symbol:r,name:l,abbr:s})=>{const a=t.get(r),e=a==null?void 0:a.regularMarketPrice,o=e!=null?"$"+e.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:e>=100?2:4}):"—";return`<tr>
      <td class="mkt-name">${l} <span class="mkt-abbr">${s}</span></td>
      <td class="num mono">${o}</td>
      ${U(a==null?void 0:a.pct1d)}
      ${U(a==null?void 0:a.pct1w)}
      ${U(a==null?void 0:a.pct1m)}
      ${U(a==null?void 0:a.pctYtd)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}async function ae(t){t.innerHTML=`
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
        <table class="mkt-table"><tbody>${K(18)}</tbody></table>
      </div>
    </section>

    <!-- Bonds + FX -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Treasuries</div>
          <table class="mkt-table"><tbody>${K(4,8)}</tbody></table>
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
        <table class="mkt-table"><tbody>${K(4,5)}</tbody></table>
      </div>
    </section>

    <!-- Commodities + Sectors -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-commodities">
        <div class="mkt-panel">
          <div class="mkt-panel-label">Commodities</div>
          <table class="mkt-table"><tbody>${K(8,6)}</tbody></table>
        </div>
      </div>
      <div id="mkt-sectors">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Equity Sectors</div>
          <table class="mkt-table"><tbody>${K(11,5)}</tbody></table>
        </div>
      </div>
    </section>

    <!-- Crypto -->
    <section class="mkt-section" id="mkt-crypto">
      <div class="mkt-panel">
        <div class="mkt-panel-label">Crypto</div>
        <table class="mkt-table"><tbody>${K(4,6)}</tbody></table>
      </div>
    </section>
  `;const n=t.querySelector("#mkt-refresh");async function r(){const s=t.querySelector("#mkt-timestamp");s.textContent="Loading…";const a=await _t(ot);if(!t.isConnected)return;t.querySelector("#mkt-stats").innerHTML=Vt(a),t.querySelector("#mkt-equities").innerHTML=Kt(a),t.querySelector("#mkt-bonds").innerHTML=zt(a),t.querySelector("#mkt-fx").innerHTML=Qt(a),t.querySelector("#mkt-global-bonds").innerHTML=Jt(a),t.querySelector("#mkt-commodities").innerHTML=Zt(a),t.querySelector("#mkt-sectors").innerHTML=te(a),t.querySelector("#mkt-crypto").innerHTML=ee(a);const e=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"}),o=ot.length-a.size;s.textContent=`Updated ${e} · ${a.size}/${ot.length} instruments${o?` · ${o} unavailable`:""}`}n.addEventListener("click",r),await r();const l=setInterval(r,30*60*1e3);return()=>clearInterval(l)}const se="modulepreload",ne=function(t){return"/investment-dash/"+t},yt={},It=function(n,r,l){let s=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const e=document.querySelector("meta[property=csp-nonce]"),o=(e==null?void 0:e.nonce)||(e==null?void 0:e.getAttribute("nonce"));s=Promise.allSettled(r.map(c=>{if(c=ne(c),c in yt)return;yt[c]=!0;const d=c.endsWith(".css"),i=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${i}`))return;const m=document.createElement("link");if(m.rel=d?"stylesheet":se,d||(m.as="script"),m.crossOrigin="",m.href=c,o&&m.setAttribute("nonce",o),document.head.appendChild(m),d)return new Promise((b,h)=>{m.addEventListener("load",b),m.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(e){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=e,window.dispatchEvent(o),!o.defaultPrevented)throw e}return s.then(e=>{for(const o of e||[])o.status==="rejected"&&a(o.reason);return n().catch(a)})},rt=[{label:"US (NYSE / NASDAQ)",suffix:"",example:"AAPL"},{label:"Australia (ASX)",suffix:".AX",example:"CBA.AX"},{label:"UK (LSE)",suffix:".L",example:"HSBA.L"},{label:"Canada (TSX)",suffix:".TO",example:"RY.TO"},{label:"Germany (XETRA)",suffix:".DE",example:"SAP.DE"},{label:"Japan (TSE)",suffix:".T",example:"7203.T"},{label:"Hong Kong (HKEX)",suffix:".HK",example:"0700.HK"}],it=[{label:"1W",range:"5d",interval:"1d"},{label:"1M",range:"1mo",interval:"1d"},{label:"3M",range:"3mo",interval:"1d"},{label:"6M",range:"6mo",interval:"1d"},{label:"1Y",range:"1y",interval:"1d"},{label:"2Y",range:"2y",interval:"1wk"},{label:"5Y",range:"5y",interval:"1wk"},{label:"MAX",range:"max",interval:"1mo"}],le={ma20:{period:20,color:"#fbbf24",label:"MA 20D"},ma50:{period:50,color:"#60a5fa",label:"MA 50D"},ma200:{period:200,color:"#f87171",label:"MA 200D"}};function Rt(t,n){const r=[];for(let l=n-1;l<t.length;l++){const s=t.slice(l-n+1,l+1).reduce((a,e)=>a+e.close,0);r.push({time:t[l].time,value:+(s/n).toFixed(4)})}return r}function oe(t,n,r){const l=Rt(t,n);let s=0,a=null;return r.map(e=>{for(;s<l.length&&l[s].time<=e.time;)a=l[s].value,s+=1;return a==null?null:{time:e.time,value:a}}).filter(Boolean)}function re(t,n=20,r=2){const l=Rt(t,n),s=[],a=[];for(let e=0;e<l.length;e++){const o=e+n-1,c=t.slice(o-n+1,o+1).map(m=>m.close),d=l[e].value,i=Math.sqrt(c.reduce((m,b)=>m+(b-d)**2,0)/n);s.push({time:l[e].time,value:+(d+r*i).toFixed(4)}),a.push({time:l[e].time,value:+(d-r*i).toFixed(4)})}return{upper:s,mid:l,lower:a}}const lt=new Map,gt=new Map,pt=5*60*1e3;function Ht(t){const n=new Date(t*1e3);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`}async function St(t,n,r){var p,y;const l=`${t}:${n}:${r}`,s=lt.get(l);if(s&&Date.now()-s.ts<pt)return s.data;const a=`/v8/finance/chart/${encodeURIComponent(t)}?range=${n}&interval=${r}&includePrePost=false`,e=await fetch(J(a),{headers:{Accept:"application/json"}});if(!e.ok)throw new Error(`HTTP ${e.status}`);const o=await e.json(),c=(y=(p=o==null?void 0:o.chart)==null?void 0:p.result)==null?void 0:y[0];if(!c)throw new Error("Symbol not found");const d=c.timestamp??[],i=c.indicators.quote[0],m=[],b=[];for(let v=0;v<d.length;v++){if(i.open[v]==null||i.close[v]==null)continue;const g=Ht(d[v]);m.push({time:g,open:+i.open[v].toFixed(4),high:+i.high[v].toFixed(4),low:+i.low[v].toFixed(4),close:+i.close[v].toFixed(4)}),b.push({time:g,value:i.volume[v]??0,color:i.close[v]>=i.open[v]?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"})}const h={candles:m,volumes:b,meta:c.meta};return lt.set(l,{ts:Date.now(),data:h}),h}async function ie(t){var d,i,m,b,h,p;const n=`${t}:indicator-history`,r=lt.get(n);if(r&&Date.now()-r.ts<pt)return r.data;const l=`/v8/finance/chart/${encodeURIComponent(t)}?range=10y&interval=1d&includePrePost=false`,s=await fetch(J(l),{headers:{Accept:"application/json"}});if(!s.ok)throw new Error(`HTTP ${s.status}`);const a=(m=(i=(d=await s.json())==null?void 0:d.chart)==null?void 0:i.result)==null?void 0:m[0];if(!a)throw new Error("Indicator history unavailable");const e=a.timestamp??[],o=((p=(h=(b=a.indicators)==null?void 0:b.quote)==null?void 0:h[0])==null?void 0:p.close)??[],c=e.map((y,v)=>o[v]==null?null:{time:Ht(y),close:+o[v].toFixed(4)}).filter(Boolean);return lt.set(n,{ts:Date.now(),data:c}),c}async function ce(t){var e,o;const n=gt.get(t);if(n&&Date.now()-n.ts<pt)return n.data;const r=["annualTotalRevenue","annualGrossProfit","annualOperatingIncome","annualNetIncome","annualDilutedEPS"],l=Math.floor(Date.now()/1e3),s=l-370*24*60*60,a=`/ws/fundamentals-timeseries/v1/finance/timeseries/${encodeURIComponent(t)}?type=${r.join(",")}&period1=${s}&period2=${l}`;try{const c=await fetch(J(a),{headers:{Accept:"application/json"}});if(!c.ok)return null;const d=((o=(e=await c.json())==null?void 0:e.timeseries)==null?void 0:o.result)??[],i=y=>{var v,g,E,M;return((M=(E=(g=(v=d.find(A=>{var H,C,D,R;return((D=(C=(H=A.meta)==null?void 0:H.symbol)==null?void 0:C.includes)==null?void 0:D.call(C,t))&&((R=A[y])==null?void 0:R.length)}))==null?void 0:v[y])==null?void 0:g.at(-1))==null?void 0:E.reportedValue)==null?void 0:M.raw)??null},m=i("annualTotalRevenue"),b=i("annualGrossProfit"),h=i("annualOperatingIncome"),p={financialData:{totalRevenue:{raw:m},grossMargins:{raw:m&&b?b/m:null},operatingMargins:{raw:m&&h?h/m:null}},defaultKeyStatistics:{trailingEps:{raw:i("annualDilutedEPS")}}};return gt.set(t,{ts:Date.now(),data:p}),p}catch{return null}}const q=(t,n={})=>t==null?"—":t.toLocaleString("en-US",n),Z=t=>t==null?"—":`${t>=0?"+":""}${(t*100).toFixed(2)}%`,ct=t=>t==null?"—":t>=1e12?`$${(t/1e12).toFixed(2)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString()}`;function dt(t,n){var i,m,b,h,p,y,v,g,E,M,A,H,C,D,R;if(!n){t.innerHTML='<div class="sa-no-data">Fundamental data unavailable.</div>';return}const r=n.price??{},l=n.summaryDetail??{},s=n.defaultKeyStatistics??{},a=n.financialData??{},e=n.assetProfile??{},c=[["Market Cap",ct((i=r.marketCap)==null?void 0:i.raw)],["P/E (TTM)",q((m=l.trailingPE)==null?void 0:m.raw,{maximumFractionDigits:1})],["Fwd P/E",q((b=l.forwardPE)==null?void 0:b.raw,{maximumFractionDigits:1})],["EPS (TTM)",((h=s.trailingEps)==null?void 0:h.raw)!=null?`$${s.trailingEps.raw.toFixed(2)}`:"—"],["52W High",q((p=l.fiftyTwoWeekHigh)==null?void 0:p.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["52W Low",q((y=l.fiftyTwoWeekLow)==null?void 0:y.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["Div Yield",Z((v=l.dividendYield)==null?void 0:v.raw)],["Beta",q((g=l.beta)==null?void 0:g.raw,{maximumFractionDigits:2})],["Revenue TTM",ct((E=a.totalRevenue)==null?void 0:E.raw)],["Gross Margin",Z((M=a.grossMargins)==null?void 0:M.raw)],["Op Margin",Z((A=a.operatingMargins)==null?void 0:A.raw)],["ROE",Z((H=a.returnOnEquity)==null?void 0:H.raw)],["P/B Ratio",q((C=s.priceToBook)==null?void 0:C.raw,{maximumFractionDigits:2})],["Avg Volume",q((D=l.averageVolume)==null?void 0:D.raw)],["Employees",q(e.fullTimeEmployees)],["Free Cash Flow",ct((R=a.freeCashflow)==null?void 0:R.raw)]].map(([N,B])=>`
    <div class="sa-fund-card">
      <div class="sa-fund-label">${N}</div>
      <div class="sa-fund-val">${B}</div>
    </div>`).join(""),d=[e.sector,e.industry].filter(Boolean).map(N=>`<span class="sa-badge">${N}</span>`).join("");t.innerHTML=`
    <div class="sa-section-label">Key Metrics</div>
    <div class="sa-fund-grid">${c}</div>
    ${e.longBusinessSummary?`
      <div class="sa-about">
        <div class="sa-section-label">About ${d}</div>
        <p class="sa-about-text">${e.longBusinessSummary}</p>
      </div>`:""}
  `}function tt(t,n,r){var i,m,b;const l=(r==null?void 0:r.price)??{},s=l.longName||l.shortName||(n==null?void 0:n.symbol)||"",a=((i=l.regularMarketPrice)==null?void 0:i.raw)??(n==null?void 0:n.regularMarketPrice)??0,e=(((m=l.regularMarketChangePercent)==null?void 0:m.raw)??0)*100,o=((b=l.regularMarketChange)==null?void 0:b.raw)??0,c=l.exchangeName||(n==null?void 0:n.exchangeName)||"",d=e>=0;t.innerHTML=`
    <div class="sa-hdr-left">
      <div class="sa-hdr-name">${s} <span class="sa-hdr-sym">${(n==null?void 0:n.symbol)??""}</span></div>
      <div class="sa-hdr-exch">${c}</div>
    </div>
    <div class="sa-hdr-right">
      <div class="sa-hdr-price">${a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div class="sa-hdr-chg ${d?"up":"dn"}">${d?"+":""}${o.toFixed(2)} (${d?"+":""}${e.toFixed(2)}%)</div>
    </div>
  `}let st=null;async function kt(){return st||(st=await It(()=>import("./lightweight-charts.production-C-4kb1nc.js"),[])),st}async function de(t){const n=rt.map((u,f)=>`<option value="${f}">${u.label}</option>`).join(""),r=it.map((u,f)=>`<button class="sa-range-btn${f===4?" active":""}" data-ri="${f}">${u.label}</button>`).join("");t.innerHTML=`
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
  `;let l=null,s={},a=new Map,e=null,o=[],c=1,d=!1,i=new Set(["vol"]),m="line",b=4,h=null;const p=t.querySelector("#sa-ph"),y=t.querySelector("#sa-main"),v=t.querySelector("#sa-hdr"),g=t.querySelector("#sa-instruments"),E=t.querySelector("#sa-chart"),M=t.querySelector("#sa-overlay"),A=t.querySelector("#sa-tt"),H=t.querySelector("#sa-annot-list"),C=t.querySelector("#sa-funds"),D=t.querySelector("#sa-mkt"),R=t.querySelector("#sa-ticker"),N=t.querySelector("#sa-go"),B=t.querySelector("#sa-annot-btn"),L=t.querySelector("#sa-level-input"),W=t.querySelector("#sa-level-add");async function O(){if(l)return;const{createChart:u,CrosshairMode:f}=await kt();l=u(E,{width:E.clientWidth||900,height:480,layout:{background:{color:"#0b0d14"},textColor:"#8892a4",fontSize:11,fontFamily:"'DM Mono', monospace"},grid:{vertLines:{color:"#1a1d26"},horzLines:{color:"#1a1d26"}},crosshair:{mode:f.Normal},rightPriceScale:{borderColor:"#2a2d3e"},timeScale:{borderColor:"#2a2d3e",timeVisible:!0,secondsVisible:!1}}),h=new ResizeObserver(()=>{l&&E.clientWidth&&l.resize(E.clientWidth,480)}),h.observe(E),l.subscribeCrosshairMove($=>{if(!$.time||!$.point){A.style.display="none";return}const k=[...a.values()].map(S=>{var Q;const x=(Q=s[S.symbol])==null?void 0:Q.main,P=x&&$.seriesData.get(x);if(!P)return"";const _="close"in P?P.close:P.value;return`<span class="sa-tt-instrument"><i style="background:${S.color}"></i>${S.symbol} <b>${Number(_).toLocaleString("en-US",{maximumFractionDigits:4})}</b></span>`}).filter(Boolean).join("");if(!k){A.style.display="none";return}A.innerHTML=`<span class="sa-tt-date">${$.time}</span>${k}`,A.style.display="block"}),l.subscribeClick($=>{var x;const k=e&&((x=s[e])==null?void 0:x.main);if(!d||!$.point||!k)return;const S=k.coordinateToPrice($.point.y);S!=null&&I(S,e)})}async function X(){const{LineStyle:u}=await kt();Object.values(s).flatMap(k=>Object.values(k)).forEach(k=>{try{l.removeSeries(k)}catch{}}),s={},o.forEach(k=>{k.line=null}),w(),l.priceScale("left").applyOptions({visible:!0,borderColor:"#2a2d3e",scaleMargins:{top:.06,bottom:i.has("vol")?.22:.04}}),l.priceScale("right").applyOptions({visible:!0,borderColor:"#2a2d3e",scaleMargins:{top:.06,bottom:i.has("vol")?.22:.04}});const f=["#e3a857","#63a7d8","#d77d72","#72b58a","#bc91cf","#d9ca68","#55b9b3","#e28dab"];for(const[k,S]of[...a.values()].entries()){S.color=f[k%f.length];const x=S.axis;s[S.symbol]={},m==="candle"?(s[S.symbol].main=l.addCandlestickSeries({priceScaleId:x,upColor:"#65c18c",downColor:"#df7c70",borderVisible:!1,wickUpColor:"#65c18c",wickDownColor:"#df7c70"}),s[S.symbol].main.setData(S.priceData.candles)):(s[S.symbol].main=l.addLineSeries({color:S.color,lineWidth:2,priceScaleId:x,title:S.symbol}),s[S.symbol].main.setData(S.priceData.candles.map(P=>({time:P.time,value:P.close}))));for(const[P,_]of Object.entries(le))!i.has(P)||S.indicatorCandles.length<_.period||(s[S.symbol][P]=l.addLineSeries({color:_.color,lineWidth:1,title:`${S.symbol} ${_.label}`,priceScaleId:x}),s[S.symbol][P].setData(oe(S.indicatorCandles,_.period,S.priceData.candles)));if(i.has("bb")&&S.priceData.candles.length>=20){const{upper:P,mid:_,lower:Q}=re(S.priceData.candles);s[S.symbol].bbU=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:u.Dashed,priceScaleId:x}),s[S.symbol].bbM=l.addLineSeries({color:"rgba(124,106,247,0.4)",lineWidth:1,priceScaleId:x}),s[S.symbol].bbL=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:u.Dashed,priceScaleId:x}),s[S.symbol].bbU.setData(P),s[S.symbol].bbM.setData(_),s[S.symbol].bbL.setData(Q)}}const $=a.values().next().value;i.has("vol")&&$&&(s[$.symbol].vol=l.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"vol"}),l.priceScale("vol").applyOptions({scaleMargins:{top:.82,bottom:0}}),s[$.symbol].vol.setData($.priceData.volumes)),o.forEach(k=>{var x;const S=(x=s[k.symbol])==null?void 0:x.main;k.line=S?G(k.price,k.symbol):null}),l.timeScale().fitContent()}function G(u,f){var k;const{LineStyle:$}=st;return s[f].main.createPriceLine({price:u,color:((k=a.get(f))==null?void 0:k.color)??"#e3a857",lineWidth:1,lineStyle:$.Dashed,axisLabelVisible:!0,title:`${f} ${u.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`})}function I(u,f=e){var $;!Number.isFinite(u)||!(($=s[f])!=null&&$.main)||(o.push({id:c++,price:u,symbol:f,line:G(u,f)}),w())}function w(){var u;if(!o.length){H.innerHTML="";return}H.innerHTML=`
      <div class="sa-annot-wrap">
        <span class="sa-section-label">Price Levels</span>
        <div class="sa-annot-pills">
          ${o.map(f=>`
            <span class="sa-annot-pill">
              ${f.symbol} · ${f.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              <button class="sa-annot-x" data-id="${f.id}" aria-label="Remove price level ${f.price}" title="Remove level">×</button>
            </span>`).join("")}
          ${o.length>1?'<button class="sa-clear-levels" type="button">Clear all</button>':""}
        </div>
      </div>`,H.querySelectorAll(".sa-annot-x").forEach(f=>{f.addEventListener("click",()=>{var S;const $=Number(f.dataset.id),k=o.findIndex(x=>x.id===$);if(!(k<0)){try{o[k].line&&((S=s[o[k].symbol])==null||S.main.removePriceLine(o[k].line))}catch{}o.splice(k,1),w()}})}),(u=H.querySelector(".sa-clear-levels"))==null||u.addEventListener("click",()=>{o.forEach(f=>{var $;try{f.line&&(($=s[f.symbol])==null||$.main.removePriceLine(f.line))}catch{}}),o=[],w()})}function Y(){g.innerHTML=[...a.values()].map(u=>`
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
      </div>`).join(""),g.querySelectorAll("[data-focus]").forEach(u=>{u.addEventListener("click",()=>ht(u.dataset.focus))}),g.querySelectorAll("[data-axis]").forEach(u=>{u.addEventListener("change",async()=>{const f=a.get(u.dataset.axis);f&&(f.axis=u.value,await X())})}),g.querySelectorAll("[data-remove]").forEach(u=>{u.addEventListener("click",()=>Xt(u.dataset.remove))})}function ht(u){const f=a.get(u);f&&(e=u,Y(),tt(v,f.priceData.meta,f.funds),dt(C,f.funds))}async function Xt(u){if(!a.has(u))return;if(a.delete(u),o=o.filter($=>$.symbol!==u),e===u&&(e=[...a.keys()].at(-1)??null),!a.size){y.style.display="none",p.style.display="flex",v.innerHTML="",C.innerHTML="",w(),Y(),await X();return}const f=a.get(e);tt(v,f.priceData.meta,f.funds),dt(C,f.funds),Y(),w(),await X()}async function Ot(u){if(a.has(u)){ht(u);return}const{range:f,interval:$}=it[b];M.style.display="flex",p.style.display="none",y.style.display="block",v.innerHTML=`<div class="sa-hdr-loading">Loading ${u}…</div>`,C.innerHTML="";try{await O();const[k,S,x]=await Promise.all([St(u,f,$),ie(u),ce(u)]),P={symbol:u,name:k.meta.longName||k.meta.shortName||u,priceData:k,indicatorCandles:S,funds:x,axis:a.size===0?"right":a.size%2?"left":"right",color:"#e3a857"};a.set(u,P),e=u,tt(v,k.meta,x),Y(),await X(),dt(C,x)}catch{v.innerHTML=`<div class="sa-error">Symbol <b>${u}</b> not found or no data available.</div>`,C.innerHTML=""}finally{M.style.display="none"}}async function Nt(u){if(!a.size)return;b=u,t.querySelectorAll(".sa-range-btn").forEach((k,S)=>k.classList.toggle("active",S===u));const{range:f,interval:$}=it[u];M.style.display="flex";try{(await Promise.all([...a.values()].map(async x=>({symbol:x.symbol,data:await St(x.symbol,f,$)})))).forEach(({symbol:x,data:P})=>{a.get(x).priceData=P});const S=a.get(e);tt(v,S.priceData.meta,S.funds),await X()}finally{M.style.display="none"}}t.querySelectorAll(".sa-range-btn").forEach((u,f)=>u.addEventListener("click",()=>Nt(f))),D.addEventListener("change",()=>{R.placeholder=`Ticker (e.g. ${rt[+D.value].example})`});async function bt(){const u=R.value.trim().toUpperCase(),f=rt[+D.value];if(!u)return;const $=f.suffix&&!u.endsWith(f.suffix)?`${u}${f.suffix}`:u;await Ot($)}N.addEventListener("click",bt),R.addEventListener("keydown",u=>{u.key==="Enter"&&bt()}),t.querySelectorAll("[data-type]").forEach(u=>u.addEventListener("click",async()=>{m=u.dataset.type,t.querySelectorAll("[data-type]").forEach(f=>f.classList.remove("active")),u.classList.add("active"),a.size&&await X()})),t.querySelectorAll("[data-ind]").forEach(u=>u.addEventListener("click",async()=>{const f=u.dataset.ind;i.has(f)?i.delete(f):i.add(f),u.classList.toggle("active",i.has(f)),a.size&&await X()})),B.addEventListener("click",()=>{d=!d,B.classList.toggle("active",d),B.setAttribute("aria-pressed",String(d)),B.textContent=d?"Click to place":"Place on chart",t.querySelector("#sa-chart-wrap").classList.toggle("sa-annotating",d)});function vt(){const u=Number(L.value);if(!L.value.trim()||!Number.isFinite(u)){L.focus();return}I(u),L.value="",L.focus()}return W.addEventListener("click",vt),L.addEventListener("keydown",u=>{u.key==="Enter"&&vt()}),()=>{h==null||h.disconnect(),l&&(l.remove(),l=null),s={},o=[]}}const Ut="portv1",$t={symbol:"^GSPC"},ue=[{label:"US",suffix:""},{label:"ASX",suffix:".AX"},{label:"LSE",suffix:".L"},{label:"TSX",suffix:".TO"},{label:"XETRA",suffix:".DE"},{label:"TSE",suffix:".T"},{label:"HKEX",suffix:".HK"}];let T=[],et=63,V=null;function ut(){try{localStorage.setItem(Ut,JSON.stringify(T))}catch{}}function me(){try{return JSON.parse(localStorage.getItem(Ut)??"[]")}catch{return[]}}const wt=new Map,pe=10*60*1e3;async function he(t,n){var l,s,a,e,o;const r=wt.get(t);if(r&&Date.now()-r.ts<pe)return r.data;try{const c=`/v8/finance/chart/${encodeURIComponent(t)}?range=1y&interval=1d`,d=await fetch(J(c),{headers:{Accept:"application/json"},signal:n});if(!d.ok)return null;const i=await d.json(),m=(s=(l=i==null?void 0:i.chart)==null?void 0:l.result)==null?void 0:s[0];if(!m)return null;const b=m.timestamp??[],h=((o=(e=(a=m.indicators)==null?void 0:a.quote)==null?void 0:e[0])==null?void 0:o.close)??[],p=m.meta,y=[];for(let g=1;g<b.length;g++)h[g]!=null&&h[g-1]!=null&&h[g-1]!==0&&y.push({date:b[g],ret:(h[g]-h[g-1])/h[g-1]});const v={symbol:t,name:p.longName||p.shortName||t,price:p.regularMarketPrice,retData:y};return wt.set(t,{ts:Date.now(),data:v}),v}catch{return null}}async function be(t){var n,r,l,s;try{const a=`/v8/finance/chart/${encodeURIComponent(t)}?range=1d&interval=1d`,e=await fetch(J(a),{headers:{Accept:"application/json"}});if(!e.ok)return null;const o=(s=(l=(r=(n=await e.json())==null?void 0:n.chart)==null?void 0:r.result)==null?void 0:l[0])==null?void 0:s.meta;return o?{name:o.longName||o.shortName||t,price:o.regularMarketPrice}:null}catch{return null}}function ve(t){const n=new Date((t+43200)*1e3);return`${n.getUTCFullYear()}-${String(n.getUTCMonth()+1).padStart(2,"0")}-${String(n.getUTCDate()).padStart(2,"0")}`}function fe(t){const n=t.map(a=>a.map(e=>({key:ve(e.date),ret:e.ret}))),r=new Set;n.forEach(a=>a.forEach(e=>r.add(e.key)));const l=[...r].sort(),s=n.map(a=>{const e=new Map(a.map(o=>[o.key,o.ret]));return l.map(o=>e.get(o)??0)});return{dates:l,aligned:s}}function ye(t,n){var c;const r=t.length,l=((c=t[0])==null?void 0:c.length)??0;if(l<10||r<1)return null;const s=Math.exp(-Math.LN2/n),a=Array.from({length:r},()=>new Array(r).fill(0));let e=0,o=1;for(let d=l-1;d>=0;d--){for(let i=0;i<r;i++)for(let m=0;m<r;m++)a[i][m]+=o*t[i][d]*t[m][d];e+=o,o*=s}for(let d=0;d<r;d++)for(let i=0;i<r;i++)a[d][i]=a[d][i]/e*252;return a}function ge(t){const n=t.length;return Array.from({length:n},(r,l)=>Array.from({length:n},(s,a)=>{const e=Math.sqrt(t[l][l]*t[a][a]);return e>0?t[l][a]/e:l===a?1:0}))}function Se(t,n){t.length;const r=t.map((i,m)=>t.reduce((b,h,p)=>b+n[m][p]*h,0)),l=t.reduce((i,m,b)=>i+m*r[b],0),s=Math.sqrt(Math.max(0,l)),a=t.map((i,m)=>s>0?i*r[m]/s:0),e=a.map(i=>s>0?i/s:0),o=n.map((i,m)=>Math.sqrt(Math.max(0,n[m][m]))),c=t.reduce((i,m,b)=>i+m*o[b],0),d=s>0?c/s:1;return{portVol:s,RC:a,pctRC:e,indivVols:o,divRatio:d}}function ke(t,n){const r=t.length;if(r<5)return null;let l=1,s=1,a=0;const e=[],o=[];for(const v of t){l*=1+v,e.push(l),l>s&&(s=l);const g=l/s-1;o.push(g),-g>a&&(a=-g)}const c=Math.pow(Math.max(l,1e-9),252/r)-1,d=t.reduce((v,g)=>v+g,0)/r,i=Math.sqrt(t.reduce((v,g)=>v+(g-d)**2,0)/(r-1)*252),m=i>0?(c-.04)/i:null,b=a>0?c/a:null;let h=null;if((n==null?void 0:n.length)===r){const v=n.reduce((M,A)=>M+A,0)/r;let g=0,E=0;t.forEach((M,A)=>{g+=(M-d)*(n[A]-v),E+=(n[A]-v)**2}),h=E>0?g/E:null}let p=1;const y=(n==null?void 0:n.map(v=>(p*=1+v,p)))??[];return{annRet:c,vol:i,sharpe:m,beta:h,maxDD:a,calmar:b,navSeries:e,ddSeries:o,bmkNav:y}}const F={pct:(t,n=2)=>t==null||isNaN(t)?"—":`${t>=0?"+":""}${(t*100).toFixed(n)}%`,num:(t,n=2)=>t==null||isNaN(t)?"—":t.toFixed(n),price:t=>t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),cls:t=>t==null||isNaN(t)?"":t>=0?"up":"dn"};function $e(t){if(t==null||isNaN(t))return"transparent";const n=Math.max(-1,Math.min(1,t)),r=(Math.abs(n)*.65+.08).toFixed(2);return n>=0?`rgba(248,113,113,${r})`:`rgba(52,211,153,${r})`}function we(t){return`<div class="port-metrics-strip">
    ${[["Ann. Return",F.pct(t.annRet),F.cls(t.annRet)],["Ann. Vol",F.pct(t.vol),""],["Sharpe",F.num(t.sharpe),F.cls(t.sharpe)],["Beta (SPX)",F.num(t.beta),""],["Max Drawdown",F.pct(-t.maxDD),"dn"],["Calmar",F.num(t.calmar),F.cls(t.calmar)]].map(([r,l,s])=>`
      <div class="port-metric-card">
        <div class="port-metric-label">${r}</div>
        <div class="port-metric-val ${s}">${l}</div>
      </div>`).join("")}
  </div>`}function xe(t,n,r){const{portVol:l,pctRC:s,indivVols:a,divRatio:e}=Se(n,r),o=Math.max(1e-9,...s.map(Math.abs)),c=t.map((d,i)=>`
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
    </div>`}function Le(t,n,r){const l=n.reduce((a,e,o)=>a+e*n.reduce((c,d,i)=>c+d*r[o][i],0),0);return`
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
      <td class="num">${F.num(d)}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Ee(t,n,r){const l=ge(n),s=t.map(e=>`<th class="corr-col-hdr">${e}</th>`).join(""),a=t.map((e,o)=>`<tr><th class="corr-row-hdr">${e}</th>${t.map((c,d)=>{const i=l[o][d],m=o===d;return`<td class="corr-cell${m?" corr-diag":""}"
        style="background:${m?"var(--bg-base)":$e(i)}">${m?"—":i.toFixed(2)}</td>`}).join("")}</tr>`).join("");return`
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
    </div>`}function Me(t,n,r,l,s){const a=l.length,e={"1d":1,"1w":5,"1m":21,"3m":63};let o;if(s==="ytd"){const h=String(new Date().getFullYear());o=l.findIndex(p=>p.startsWith(h)),o<0&&(o=0)}else o=Math.max(0,a-(e[s]??1));const c=r.map(h=>h.slice(o).reduce((p,y)=>p*(1+y),1)-1),d=c.reduce((h,p,y)=>h+n[y]*p,0),i=Math.max(1e-9,...c.map(h=>Math.abs(h))),m=["1d","1w","1m","3m","ytd"].map(h=>`<button class="port-period-btn${h===s?" active":""}" data-period="${h}">${h.toUpperCase()}</button>`).join(""),b=t.map((h,p)=>{const y=c[p],v=n[p]*y,g=(Math.abs(y)/i*100).toFixed(1);return`<tr>
      <td class="mkt-name">${h}</td>
      <td class="num">${(n[p]*100).toFixed(1)}%</td>
      <td class="num ${F.cls(y)}">${F.pct(y)}</td>
      <td class="num ${F.cls(v)}">${F.pct(v)}</td>
      <td class="port-attr-bar-cell">
        <span class="port-attr-bar ${y>=0?"up":"dn"}" style="width:${g}%"></span>
      </td>
    </tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="port-attr-hdr">
        <span class="mkt-panel-label" style="border:none;padding:10px 14px 8px">Return Attribution</span>
        <div class="port-attr-periods" id="port-attr-periods">${m}</div>
      </div>
      <div class="port-attr-summary">
        Portfolio return: <strong class="${F.cls(d)}">${F.pct(d)}</strong>
      </div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Return</th><th class="num">Contribution</th><th></th>
        </tr></thead>
        <tbody>${b}</tbody>
      </table>
    </div>`}async function Ae(t,n,r,l){var b;const s=t.querySelector("#port-chart-wrap");if(!s)return;V&&(V(),V=null);const{createChart:a}=await It(async()=>{const{createChart:h}=await import("./lightweight-charts.production-C-4kb1nc.js");return{createChart:h}},[]);s.innerHTML="";const e=document.createElement("div");e.style.height="280px",s.appendChild(e);const o=a(e,{layout:{background:{color:"transparent"},textColor:"#6b7280"},grid:{vertLines:{color:"#22253a"},horzLines:{color:"#22253a"}},rightPriceScale:{borderColor:"#22253a"},timeScale:{borderColor:"#22253a"}}),c=o.addLineSeries({color:"#7c6af7",lineWidth:2,title:"Portfolio"}),d=o.addLineSeries({color:"#4b5563",lineWidth:1,lineStyle:2,title:"S&P 500"});function i(h){if(h==="cumret")c.setData(n.map((p,y)=>({time:p,value:+((r[y]-1)*100).toFixed(3)}))),d.setData(n.map((p,y)=>({time:p,value:+((l[y]-1)*100).toFixed(3)})));else{let p=1;c.setData(n.map((y,v)=>(r[v]>p&&(p=r[v]),{time:y,value:+((r[v]/p-1)*100).toFixed(3)}))),d.setData([])}o.timeScale().fitContent()}i("cumret"),(b=t.querySelector("#port-chart-toggle"))==null||b.querySelectorAll("[data-mode]").forEach(h=>{h.addEventListener("click",()=>{t.querySelectorAll("#port-chart-toggle [data-mode]").forEach(p=>p.classList.toggle("active",p===h)),i(h.dataset.mode)})});const m=new ResizeObserver(()=>o.resize(e.offsetWidth,280));m.observe(e),V=()=>{m.disconnect(),o.remove()}}function De(t,n,r,l,s,a){t.innerHTML=`
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
  `,t.querySelector("#port-metrics-strip").innerHTML=we(a);function e(d){const i=ye(n,d);i&&(t.querySelector("#port-risk-panel").innerHTML=xe(l,s,i),t.querySelector("#port-vol-panel").innerHTML=Le(l,s,i),t.querySelector("#port-corr-panel").innerHTML=Ee(l,i,d),o())}function o(){const d=t.querySelector("#port-hl-slider"),i=t.querySelector("#port-hl-val");d&&d.addEventListener("input",()=>{et=+d.value,i&&(i.textContent=`${et}d`),e(et)})}function c(d="1d"){var i;t.querySelector("#port-attr-panel").innerHTML=Me(l,s,n,r,d),(i=t.querySelector("#port-attr-periods"))==null||i.querySelectorAll(".port-period-btn").forEach(m=>{m.addEventListener("click",()=>c(m.dataset.period))})}e(et),c("1d"),Ae(t,r,a.navSeries,a.bmkNav)}function Te(t){T=me(),Array.isArray(T)||(T=[]),t.innerHTML=`
    <div class="port-layout">
      <div class="mkt-panel port-holdings-panel">
        <div class="mkt-panel-label">Portfolio Holdings</div>

        <div class="port-add-form">
          <select id="port-market" class="sa-market-sel">
            ${ue.map(b=>`<option value="${b.suffix}">${b.label}</option>`).join("")}
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
  `;let n=T.reduce((b,h)=>Math.max(b,h.id??0),0)+1,r=null;const l=t.querySelector("#port-analytics"),s=t.querySelector("#port-add-btn"),a=t.querySelector("#port-analyze-btn"),e=t.querySelector("#port-add-err"),o=t.querySelector("#port-ticker"),c=t.querySelector("#port-market"),d=t.querySelector("#port-weight-inp"),i=t.querySelector("#port-holdings-body");function m(){const b=T.reduce((p,y)=>p+y.weight,0);i.innerHTML=T.length===0?'<tr><td colspan="5" class="port-empty">No holdings yet — add a ticker above.</td></tr>':T.map(p=>`
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
          <td class="num">${F.price(p.price)}</td>
          <td><button class="port-remove" data-id="${p.id}" title="Remove">×</button></td>
        </tr>`).join("");const h=t.querySelector("#port-total");h&&(h.textContent=`Total: ${b.toFixed(1)}%`,h.className=`port-total ${b>100.01?"dn":Math.abs(b-100)<.01?"up":""}`),i.querySelectorAll(".port-wt-inp").forEach(p=>{p.addEventListener("change",y=>{const v=T.find(g=>g.id===+y.target.dataset.id);v&&(v.weight=parseFloat(y.target.value)||0,ut(),m())})}),i.querySelectorAll(".port-remove").forEach(p=>{p.addEventListener("click",y=>{T=T.filter(v=>v.id!==+y.target.dataset.id),ut(),m()})})}return s.addEventListener("click",async()=>{const b=c.value,h=o.value.trim().toUpperCase();if(!h){e.textContent="Enter a ticker";return}const p=h+b;if(T.some(g=>g.symbol===p)){e.textContent="Already added";return}const y=parseFloat(d.value)||0;s.disabled=!0,e.textContent="Looking up…";const v=await be(p);if(s.disabled=!1,!v){e.textContent=`"${p}" not found`;return}T.push({id:n++,symbol:p,displaySymbol:h,name:v.name,price:v.price,weight:y}),ut(),o.value="",d.value="",e.textContent="",m()}),o.addEventListener("keydown",b=>{b.key==="Enter"&&s.click()}),a.addEventListener("click",async()=>{if(T.length<2){l.innerHTML='<div class="port-msg port-err">Add at least 2 holdings to analyze.</div>';return}r==null||r.abort(),r=new AbortController,l.innerHTML=`<div class="port-msg port-loading"><div class="sa-spinner"></div><span>Fetching 1Y data for ${T.length} holdings…</span></div>`,a.disabled=!0;const b=[...new Set([$t.symbol,...T.map(L=>L.symbol)])],h=await Promise.all(b.map(L=>he(L,r.signal)));a.disabled=!1;const p=new Map(b.map((L,W)=>[L,h[W]])),y=T.filter(L=>!p.get(L.symbol));if(y.length){l.innerHTML=`<div class="port-msg port-err">Could not load data for: ${y.map(L=>L.displaySymbol).join(", ")}</div>`;return}const v=p.get($t.symbol),g=T.map(L=>p.get(L.symbol).retData),E=v?[...g,v.retData]:g,{dates:M,aligned:A}=fe(E),H=A.slice(0,T.length),C=v?A[A.length-1]:null,D=T.map(L=>L.weight/100),R=M.map((L,W)=>D.reduce((O,X,G)=>O+X*(H[G][W]??0),0)),N=ke(R,C);if(!N){l.innerHTML='<div class="port-msg port-err">Insufficient data for analysis (need ≥5 aligned trading days).</div>';return}const B=T.map(L=>L.displaySymbol);De(l,H,M,B,D,N)}),m(),()=>{r==null||r.abort(),V&&(V(),V=null)}}const Ce=["market","stock","portfolio"],Pe={market:"Macro monitor",stock:"Single name",portfolio:"Portfolio lab"},Fe={market:"01",stock:"02",portfolio:"03"};let at="market",z=null;const Bt="macro-monitor-theme";function Ie(){try{return localStorage.getItem(Bt)==="light"?"light":"dark"}catch{return"dark"}}function xt(t){document.documentElement.dataset.theme=t}function Re(t){const n=Ie();xt(n),t.innerHTML=`
    <div class="app-frame">
      <header class="topbar">
        <div class="brand-lockup"><div class="logo">MACRO MONITOR</div><div class="brand-sub">GLOBAL MULTI-ASSET RESEARCH</div></div>
        <div class="topbar-center"><nav class="tabs" id="main-tabs">
          ${Ce.map(e=>`<button class="tab ${e===at?"active":""}" data-tab="${e}"><span class="tab-num">${Fe[e]}</span>${Pe[e]}</button>`).join("")}
        </nav></div>
        <div class="topbar-right"><span class="market-status"><i></i> DATA LINKED</span><span class="topbar-date">${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span><button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to light theme" aria-pressed="${n==="light"}"><span class="theme-icon" aria-hidden="true">${n==="light"?"D":"L"}</span><span class="theme-label">${n==="light"?"Dark":"Light"}</span></button></div>
      </header>
      <main class="main-content" id="tab-content"></main>
      <footer class="app-footer"><span>NSM / TERMINAL</span><span>MARKET DATA: YAHOO FINANCE · DELAYED / INDICATIVE</span><span>LOCAL SESSION</span></footer>
    </div>
  `;const r=t.querySelector("#main-tabs"),l=t.querySelector("#tab-content"),s=t.querySelector("#theme-toggle");s.addEventListener("click",()=>{const e=document.documentElement.dataset.theme==="light"?"dark":"light";xt(e),s.setAttribute("aria-pressed",String(e==="light")),s.setAttribute("aria-label",`Switch to ${e==="light"?"dark":"light"} theme`),s.querySelector(".theme-icon").textContent=e==="light"?"D":"L",s.querySelector(".theme-label").textContent=e==="light"?"Dark":"Light";try{localStorage.setItem(Bt,e)}catch{}});function a(e){e!==at&&(at=e,r.querySelectorAll(".tab").forEach(o=>{o.classList.toggle("active",o.dataset.tab===e)}),Lt(l,e))}r.addEventListener("click",e=>{const o=e.target.closest(".tab");o&&a(o.dataset.tab)}),Lt(l,at)}function Lt(t,n){z&&(z(),z=null),t.innerHTML="",n==="market"?ae(t).then(r=>{z=r??null}):n==="stock"?de(t).then(r=>{z=r??null}):n==="portfolio"&&(z=Te(t)??null)}Re(document.getElementById("app"));
