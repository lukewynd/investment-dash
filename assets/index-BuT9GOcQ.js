(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&l(a)}).observe(document,{childList:!0,subtree:!0});function r(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerPolicy&&(s.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?s.credentials="include":e.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function l(e){if(e.ep)return;e.ep=!0;const s=r(e);fetch(e.href,s)}})();const nt="https://yf-proxy.lukewynd.workers.dev";function lt(t){return`${nt}${t}`}function ft(t){const n=encodeURIComponent(t);return`${nt}/v8/finance/chart/${n}?range=1y&interval=1d`}const z=new Map,yt=5*60*1e3;async function gt(t){var r,l,e,s,a;const n=z.get(t);if(n&&Date.now()-n.ts<yt)return n.data;try{const i=await fetch(ft(t),{headers:{Accept:"application/json"}});if(!i.ok)return null;const o=await i.json(),c=(l=(r=o==null?void 0:o.chart)==null?void 0:r.result)==null?void 0:l[0];if(!c)return null;const d=c.meta,p=((a=(s=(e=c.indicators)==null?void 0:e.quote)==null?void 0:s[0])==null?void 0:a.close)??[],h=d.regularMarketPrice??null,y=d.regularMarketChange??null,L=h!=null&&y!=null?h-y:null,M=L!=null&&L!==0?y/L*100:null;let g=p.length-1;for(;g>=0&&p[g]==null;)g--;const $=h??(g>=0?p[g]:null),x=S=>{let D=g-S;for(;D>=0&&p[D]==null;)D--;const T=D>=0?p[D]:null;return T!=null&&$!=null&&T!==0?($-T)/T*100:null},P=new Date().getFullYear(),E=c.timestamp??[];let w=null;for(let S=0;S<E.length;S++)if(new Date(E[S]*1e3).getFullYear()===P&&p[S]!=null){w=p[S];break}const C=w!=null&&w!==0&&$!=null?($-w)/w*100:null,F={symbol:t,regularMarketPrice:h,regularMarketChangePercent:M,regularMarketChange:y,quoteType:d.instrumentType??"",ytdPct:C,pct1d:M,pct1w:x(5),pct1m:x(21),pct3m:x(63),pctYtd:C};return z.set(t,{ts:Date.now(),data:F}),F}catch{return null}}async function St(t){const r=new Map;for(let l=0;l<t.length;l+=8){const e=t.slice(l,l+8),s=await Promise.allSettled(e.map(a=>gt(a)));e.forEach((a,i)=>{const o=s[i].status==="fulfilled"?s[i].value:null;o&&r.set(a,o)})}return r}const it=[{symbol:"^GSPC",name:"S&P 500",type:"index"},{symbol:"^VIX",name:"VIX",type:"vix"},{symbol:"^TNX",name:"US 10Y",type:"yield"},{symbol:"DX-Y.NYB",name:"DXY",type:"index"},{symbol:"GC=F",name:"Gold",type:"commodity"},{symbol:"BTC-USD",name:"Bitcoin",type:"crypto"}],ot=[{symbol:"^GSPC",name:"S&P 500",region:"Americas"},{symbol:"^IXIC",name:"NASDAQ Comp.",region:"Americas"},{symbol:"^DJI",name:"Dow Jones",region:"Americas"},{symbol:"^RUT",name:"Russell 2000",region:"Americas"},{symbol:"^BVSP",name:"Bovespa",region:"Americas"},{symbol:"^MXX",name:"IPC Mexico",region:"Americas"},{symbol:"^FTSE",name:"FTSE 100",region:"Europe"},{symbol:"^GDAXI",name:"DAX",region:"Europe"},{symbol:"^FCHI",name:"CAC 40",region:"Europe"},{symbol:"^STOXX50E",name:"Euro Stoxx 50",region:"Europe"},{symbol:"^SSMI",name:"SMI",region:"Europe"},{symbol:"^AEX",name:"AEX",region:"Europe"},{symbol:"^N225",name:"Nikkei 225",region:"Asia-Pacific"},{symbol:"^HSI",name:"Hang Seng",region:"Asia-Pacific"},{symbol:"000001.SS",name:"Shanghai Comp.",region:"Asia-Pacific"},{symbol:"^AXJO",name:"ASX 200",region:"Asia-Pacific"},{symbol:"^KS11",name:"KOSPI",region:"Asia-Pacific"},{symbol:"^STI",name:"Straits Times",region:"Asia-Pacific"}],rt=[{symbol:"^IRX",name:"3-Month"},{symbol:"^FVX",name:"5-Year"},{symbol:"^TNX",name:"10-Year"},{symbol:"^TYX",name:"30-Year"}],G=[{code:"USD",name:"US Dollar",symbol:null,invert:!1},{code:"EUR",name:"Euro",symbol:"EURUSD=X",invert:!1},{code:"GBP",name:"Sterling",symbol:"GBPUSD=X",invert:!1},{code:"JPY",name:"Yen",symbol:"USDJPY=X",invert:!0},{code:"AUD",name:"Aus Dollar",symbol:"AUDUSD=X",invert:!1},{code:"CAD",name:"Can Dollar",symbol:"USDCAD=X",invert:!0},{code:"CHF",name:"Swiss Franc",symbol:"USDCHF=X",invert:!0}],kt=G.filter(t=>t.symbol).map(t=>t.symbol),ct=[{symbol:"GC=F",name:"Gold",unit:"/oz",group:"Metals"},{symbol:"SI=F",name:"Silver",unit:"/oz",group:"Metals"},{symbol:"HG=F",name:"Copper",unit:"/lb",group:"Metals"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl",group:"Energy"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl",group:"Energy"},{symbol:"NG=F",name:"Nat. Gas",unit:"/MMBtu",group:"Energy"},{symbol:"ZW=F",name:"Wheat",unit:"/bu",group:"Agri"},{symbol:"ZC=F",name:"Corn",unit:"/bu",group:"Agri"}],dt=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],mt=[{symbol:"BTC-USD",name:"Bitcoin",abbr:"BTC"},{symbol:"ETH-USD",name:"Ethereum",abbr:"ETH"},{symbol:"SOL-USD",name:"Solana",abbr:"SOL"},{symbol:"XRP-USD",name:"XRP",abbr:"XRP"}],$t=[...new Set([...it.map(t=>t.symbol),...ot.map(t=>t.symbol),...rt.map(t=>t.symbol),...kt,...ct.map(t=>t.symbol),...dt.map(t=>t.symbol),...mt.map(t=>t.symbol)])];function K(t,n=2){return t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:n,maximumFractionDigits:n})}function X(t){if(t==null)return{text:"—",cls:""};const n=t>=0?"+":"",r=t>=0?"up":"dn",l=Math.abs(t)>=3?" strong":"";return{text:`${n}${t.toFixed(2)}%`,cls:r+l}}function wt(t){if(t==null)return{text:"—",cls:""};const n=Math.round(t*100),r=n>=0?"+":"",l=n>=0?"up":"dn";return{text:`${r}${n}bps`,cls:l}}function k(t){const n=X(t);return`<td class="num pct-cell ${n.cls}">${n.text}</td>`}function H(t,n=7){return Array.from({length:t},()=>`<tr>${Array.from({length:n},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function Lt(t){return it.map(({symbol:n,name:r,type:l})=>{const e=t.get(n),s=e==null?void 0:e.regularMarketPrice,a=X((e==null?void 0:e.pct1d)??null),i=X((e==null?void 0:e.pctYtd)??null);let o="—";return s!=null&&(l==="yield"?o=s.toFixed(2)+"%":l==="crypto"?o="$"+s.toLocaleString("en-US",{maximumFractionDigits:0}):l==="commodity"?o="$"+K(s):o=K(s)),`
      <div class="mkt-stat-card">
        <div class="mkt-stat-name">${r}</div>
        <div class="mkt-stat-price">${o}</div>
        <div class="mkt-stat-chg ${a.cls}">${a.text}</div>
        <div class="mkt-stat-ytd ${i.cls}">${i.text} YTD</div>
      </div>`}).join("")}function xt(t){const n=["Americas","Europe","Asia-Pacific"];let r="";return n.forEach(l=>{const e=ot.filter(s=>s.region===l);r+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,r+=e.map(({symbol:s,name:a})=>{const i=t.get(s),o=i==null?void 0:i.regularMarketPrice,c=o!=null?o.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";return`<tr>
        <td class="mkt-name">${a}</td>
        <td class="num mono">${c}</td>
        ${k(i==null?void 0:i.pct1d)}
        ${k(i==null?void 0:i.pct1w)}
        ${k(i==null?void 0:i.pct1m)}
        ${k(i==null?void 0:i.pct3m)}
        ${k(i==null?void 0:i.pctYtd)}
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
    </div>`}function Mt(t){const n=rt.map(({symbol:e,name:s})=>{const a=t.get(e),i=(a==null?void 0:a.regularMarketPrice)??null,o=(a==null?void 0:a.regularMarketChange)??null;return{name:s,yld:i,chg:o}}),r=Math.max(.01,...n.map(e=>e.yld??0));return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">US Treasuries</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Tenor</th>
          <th class="num">Yield</th>
          <th></th>
          <th class="num">1D Chg</th>
        </tr></thead>
        <tbody>${n.map(({name:e,yld:s,chg:a})=>{const i=wt(a),o=s!=null?s.toFixed(2)+"%":"—",c=s!=null?s/r*100:0;return`<tr>
      <td class="mkt-name">${e}</td>
      <td class="num mono">${o}</td>
      <td class="yc-bar-cell"><span class="yc-bar" style="width:${c.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${i.cls}">${i.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Et(t){const n={USD:1};G.forEach(({code:a,symbol:i,invert:o})=>{var d;if(!i)return;const c=(d=t.get(i))==null?void 0:d.regularMarketPrice;c!=null&&(n[a]=o?1/c:c)});const r=a=>a==null?"—":a>=100?a.toFixed(2):a>=10?a.toFixed(3):a.toFixed(4),l=G.map(a=>a.code),e=l.map(a=>`<th class="num fx-col-hdr">${a}</th>`).join(""),s=l.map(a=>{const i=l.map(o=>{if(a===o)return'<td class="fx-diag">—</td>';const c=n[a],d=n[o],p=c!=null&&d!=null&&d!==0?c/d:null;return`<td class="num fx-cell">${r(p)}</td>`}).join("");return`<tr><th class="fx-row-hdr">${a}</th>${i}</tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Cross Rates <span class="mkt-panel-sub">1 row = X column</span></div>
      <div class="fx-matrix-wrap">
        <table class="fx-matrix">
          <thead><tr><th></th>${e}</tr></thead>
          <tbody>${s}</tbody>
        </table>
      </div>
    </div>`}function Ct(t){const n=["Metals","Energy","Agri"];let r="";return n.forEach(l=>{const e=ct.filter(s=>s.group===l);r+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,r+=e.map(({symbol:s,name:a,unit:i})=>{const o=t.get(s),c=o==null?void 0:o.regularMarketPrice,d=c!=null?"$"+K(c):"—";return`<tr>
        <td class="mkt-name">${a}<span class="mkt-unit">${i}</span></td>
        <td class="num mono">${d}</td>
        ${k(o==null?void 0:o.pct1d)}
        ${k(o==null?void 0:o.pct1w)}
        ${k(o==null?void 0:o.pct1m)}
        ${k(o==null?void 0:o.pctYtd)}
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
    </div>`}function Dt(t){const n=dt.map(({symbol:e,name:s})=>{const a=t.get(e);return{name:s,pct1d:(a==null?void 0:a.pct1d)??null,pct1m:(a==null?void 0:a.pct1m)??null,pctYtd:(a==null?void 0:a.pctYtd)??null}});n.sort((e,s)=>(s.pct1d??-999)-(e.pct1d??-999));const r=Math.max(.01,...n.map(e=>Math.abs(e.pct1d??0)));return`
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
        <tbody>${n.map(({name:e,pct1d:s,pct1m:a,pctYtd:i})=>{const o=X(s),c=X(a),d=X(i),p=s!=null?Math.abs(s)/r*100:0;return`<tr>
      <td class="mkt-name sec-name">${e}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${o.cls}" style="width:${p.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${o.cls}">${o.text}</td>
      <td class="num pct-cell ${c.cls}">${c.text}</td>
      <td class="num pct-cell ${d.cls}">${d.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Tt(t){return`
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
        <tbody>${mt.map(({symbol:r,name:l,abbr:e})=>{const s=t.get(r),a=s==null?void 0:s.regularMarketPrice,i=a!=null?"$"+a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:a>=100?2:4}):"—";return`<tr>
      <td class="mkt-name">${l} <span class="mkt-abbr">${e}</span></td>
      <td class="num mono">${i}</td>
      ${k(s==null?void 0:s.pct1d)}
      ${k(s==null?void 0:s.pct1w)}
      ${k(s==null?void 0:s.pct1m)}
      ${k(s==null?void 0:s.pctYtd)}
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
        <table class="mkt-table"><tbody>${H(18)}</tbody></table>
      </div>
    </section>

    <!-- Bonds + FX -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Treasuries</div>
          <table class="mkt-table"><tbody>${H(4,4)}</tbody></table>
        </div>
      </div>
      <div id="mkt-fx">
        <div class="mkt-panel">
          <div class="mkt-panel-label">FX Cross Rates</div>
          <div class="fx-matrix-wrap"><span class="skel" style="display:block;height:160px;margin:14px"></span></div>
        </div>
      </div>
    </section>

    <!-- Commodities + Sectors -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-commodities">
        <div class="mkt-panel">
          <div class="mkt-panel-label">Commodities</div>
          <table class="mkt-table"><tbody>${H(8,6)}</tbody></table>
        </div>
      </div>
      <div id="mkt-sectors">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Equity Sectors</div>
          <table class="mkt-table"><tbody>${H(11,5)}</tbody></table>
        </div>
      </div>
    </section>

    <!-- Crypto -->
    <section class="mkt-section" id="mkt-crypto">
      <div class="mkt-panel">
        <div class="mkt-panel-label">Crypto</div>
        <table class="mkt-table"><tbody>${H(4,6)}</tbody></table>
      </div>
    </section>
  `;const n=t.querySelector("#mkt-refresh");async function r(){const e=t.querySelector("#mkt-timestamp");e.textContent="Loading…";const s=await St($t);if(!t.isConnected)return;t.querySelector("#mkt-stats").innerHTML=Lt(s),t.querySelector("#mkt-equities").innerHTML=xt(s),t.querySelector("#mkt-bonds").innerHTML=Mt(s),t.querySelector("#mkt-fx").innerHTML=Et(s),t.querySelector("#mkt-commodities").innerHTML=Ct(s),t.querySelector("#mkt-sectors").innerHTML=Dt(s),t.querySelector("#mkt-crypto").innerHTML=Tt(s);const a=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});e.textContent=`Updated ${a}`}n.addEventListener("click",r),await r();const l=setInterval(r,30*60*1e3);return()=>clearInterval(l)}const Pt="modulepreload",Ft=function(t){return"/investment-dash/"+t},Q={},Ut=function(n,r,l){let e=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),i=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));e=Promise.allSettled(r.map(o=>{if(o=Ft(o),o in Q)return;Q[o]=!0;const c=o.endsWith(".css"),d=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${d}`))return;const p=document.createElement("link");if(p.rel=c?"stylesheet":Pt,c||(p.as="script"),p.crossOrigin="",p.href=o,i&&p.setAttribute("nonce",i),document.head.appendChild(p),c)return new Promise((h,y)=>{p.addEventListener("load",h),p.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${o}`)))})}))}function s(a){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=a,window.dispatchEvent(i),!i.defaultPrevented)throw a}return e.then(a=>{for(const i of a||[])i.status==="rejected"&&s(i.reason);return n().catch(s)})},j=[{label:"US (NYSE / NASDAQ)",suffix:"",example:"AAPL"},{label:"Australia (ASX)",suffix:".AX",example:"CBA.AX"},{label:"UK (LSE)",suffix:".L",example:"HSBA.L"},{label:"Canada (TSX)",suffix:".TO",example:"RY.TO"},{label:"Germany (XETRA)",suffix:".DE",example:"SAP.DE"},{label:"Japan (TSE)",suffix:".T",example:"7203.T"},{label:"Hong Kong (HKEX)",suffix:".HK",example:"0700.HK"}],N=[{label:"1W",range:"5d",interval:"1d"},{label:"1M",range:"1mo",interval:"1d"},{label:"3M",range:"3mo",interval:"1d"},{label:"6M",range:"6mo",interval:"1d"},{label:"1Y",range:"1y",interval:"1d"},{label:"2Y",range:"2y",interval:"1wk"},{label:"5Y",range:"5y",interval:"1wk"},{label:"MAX",range:"max",interval:"1mo"}],Xt={ma20:{period:20,color:"#fbbf24",label:"MA 20"},ma50:{period:50,color:"#60a5fa",label:"MA 50"},ma200:{period:200,color:"#f87171",label:"MA 200"}};function ut(t,n){const r=[];for(let l=n-1;l<t.length;l++){const e=t.slice(l-n+1,l+1).reduce((s,a)=>s+a.close,0);r.push({time:t[l].time,value:+(e/n).toFixed(4)})}return r}function Ht(t,n=20,r=2){const l=ut(t,n),e=[],s=[];for(let a=0;a<l.length;a++){const i=a+n-1,o=t.slice(i-n+1,i+1).map(p=>p.close),c=l[a].value,d=Math.sqrt(o.reduce((p,h)=>p+(h-c)**2,0)/n);e.push({time:l[a].time,value:+(c+r*d).toFixed(4)}),s.push({time:l[a].time,value:+(c-r*d).toFixed(4)})}return{upper:e,mid:l,lower:s}}const Z=new Map,tt=new Map,pt=5*60*1e3;function Bt(t){const n=new Date(t*1e3);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`}async function et(t,n,r){var L,M;const l=`${t}:${n}:${r}`,e=Z.get(l);if(e&&Date.now()-e.ts<pt)return e.data;const s=`/v8/finance/chart/${encodeURIComponent(t)}?range=${n}&interval=${r}&includePrePost=false`,a=await fetch(lt(s),{headers:{Accept:"application/json"}});if(!a.ok)throw new Error(`HTTP ${a.status}`);const i=await a.json(),o=(M=(L=i==null?void 0:i.chart)==null?void 0:L.result)==null?void 0:M[0];if(!o)throw new Error("Symbol not found");const c=o.timestamp??[],d=o.indicators.quote[0],p=[],h=[];for(let f=0;f<c.length;f++){if(d.open[f]==null||d.close[f]==null)continue;const g=Bt(c[f]);p.push({time:g,open:+d.open[f].toFixed(4),high:+d.high[f].toFixed(4),low:+d.low[f].toFixed(4),close:+d.close[f].toFixed(4)}),h.push({time:g,value:d.volume[f]??0,color:d.close[f]>=d.open[f]?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"})}const y={candles:p,volumes:h,meta:o.meta};return Z.set(l,{ts:Date.now(),data:y}),y}async function Yt(t){var i,o;const n=tt.get(t);if(n&&Date.now()-n.ts<pt)return n.data;const l=`/v10/finance/quoteSummary/${encodeURIComponent(t)}?modules=price,summaryDetail,defaultKeyStatistics,financialData,assetProfile`,e=await fetch(lt(l),{headers:{Accept:"application/json"}});if(!e.ok)return null;const s=await e.json(),a=((o=(i=s==null?void 0:s.quoteSummary)==null?void 0:i.result)==null?void 0:o[0])??null;return a&&tt.set(t,{ts:Date.now(),data:a}),a}const A=(t,n={})=>t==null?"—":t.toLocaleString("en-US",n),Y=t=>t==null?"—":`${t>=0?"+":""}${(t*100).toFixed(2)}%`,_=t=>t==null?"—":t>=1e12?`$${(t/1e12).toFixed(2)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString()}`;function Rt(t,n){var d,p,h,y,L,M,f,g,$,x,P,E,w,C,F;if(!n){t.innerHTML='<div class="sa-no-data">Fundamental data unavailable.</div>';return}const r=n.price??{},l=n.summaryDetail??{},e=n.defaultKeyStatistics??{},s=n.financialData??{},a=n.assetProfile??{},o=[["Market Cap",_((d=r.marketCap)==null?void 0:d.raw)],["P/E (TTM)",A((p=l.trailingPE)==null?void 0:p.raw,{maximumFractionDigits:1})],["Fwd P/E",A((h=l.forwardPE)==null?void 0:h.raw,{maximumFractionDigits:1})],["EPS (TTM)",((y=e.trailingEps)==null?void 0:y.raw)!=null?`$${e.trailingEps.raw.toFixed(2)}`:"—"],["52W High",A((L=l.fiftyTwoWeekHigh)==null?void 0:L.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["52W Low",A((M=l.fiftyTwoWeekLow)==null?void 0:M.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["Div Yield",Y((f=l.dividendYield)==null?void 0:f.raw)],["Beta",A((g=l.beta)==null?void 0:g.raw,{maximumFractionDigits:2})],["Revenue TTM",_(($=s.totalRevenue)==null?void 0:$.raw)],["Gross Margin",Y((x=s.grossMargins)==null?void 0:x.raw)],["Op Margin",Y((P=s.operatingMargins)==null?void 0:P.raw)],["ROE",Y((E=s.returnOnEquity)==null?void 0:E.raw)],["P/B Ratio",A((w=e.priceToBook)==null?void 0:w.raw,{maximumFractionDigits:2})],["Avg Volume",A((C=l.averageVolume)==null?void 0:C.raw)],["Employees",A(a.fullTimeEmployees)],["Free Cash Flow",_((F=s.freeCashflow)==null?void 0:F.raw)]].map(([S,D])=>`
    <div class="sa-fund-card">
      <div class="sa-fund-label">${S}</div>
      <div class="sa-fund-val">${D}</div>
    </div>`).join(""),c=[a.sector,a.industry].filter(Boolean).map(S=>`<span class="sa-badge">${S}</span>`).join("");t.innerHTML=`
    <div class="sa-section-label">Key Metrics</div>
    <div class="sa-fund-grid">${o}</div>
    ${a.longBusinessSummary?`
      <div class="sa-about">
        <div class="sa-section-label">About ${c}</div>
        <p class="sa-about-text">${a.longBusinessSummary}</p>
      </div>`:""}
  `}function It(t,n,r){var d,p,h;const l=(r==null?void 0:r.price)??{},e=l.longName||l.shortName||(n==null?void 0:n.symbol)||"",s=((d=l.regularMarketPrice)==null?void 0:d.raw)??(n==null?void 0:n.regularMarketPrice)??0,a=(((p=l.regularMarketChangePercent)==null?void 0:p.raw)??0)*100,i=((h=l.regularMarketChange)==null?void 0:h.raw)??0,o=l.exchangeName||(n==null?void 0:n.exchangeName)||"",c=a>=0;t.innerHTML=`
    <div class="sa-hdr-left">
      <div class="sa-hdr-name">${e} <span class="sa-hdr-sym">${(n==null?void 0:n.symbol)??""}</span></div>
      <div class="sa-hdr-exch">${o}</div>
    </div>
    <div class="sa-hdr-right">
      <div class="sa-hdr-price">${s.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div class="sa-hdr-chg ${c?"up":"dn"}">${c?"+":""}${i.toFixed(2)} (${c?"+":""}${a.toFixed(2)}%)</div>
    </div>
  `}let I=null;async function st(){return I||(I=await Ut(()=>import("./lightweight-charts.production-C-4kb1nc.js"),[])),I}async function Ot(t){const n=j.map((m,u)=>`<option value="${u}">${m.label}</option>`).join(""),r=N.map((m,u)=>`<button class="sa-range-btn${u===4?" active":""}" data-ri="${u}">${m.label}</button>`).join("");t.innerHTML=`
    <div class="sa-layout">
      <div class="sa-search-bar">
        <select class="sa-market-sel" id="sa-mkt">${n}</select>
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
  `;let l=null,e={},s=[],a=!1,i=new Set(["vol"]),o="candle",c=[],d=[],p=4,h=null,y=null;const L=t.querySelector("#sa-ph"),M=t.querySelector("#sa-main"),f=t.querySelector("#sa-hdr"),g=t.querySelector("#sa-chart"),$=t.querySelector("#sa-overlay"),x=t.querySelector("#sa-tt"),P=t.querySelector("#sa-annot-list"),E=t.querySelector("#sa-funds"),w=t.querySelector("#sa-mkt"),C=t.querySelector("#sa-ticker"),F=t.querySelector("#sa-go"),S=t.querySelector("#sa-annot-btn");async function D(){if(l)return;const{createChart:m,CrosshairMode:u}=await st();l=m(g,{width:g.clientWidth||900,height:480,layout:{background:{color:"#0b0d14"},textColor:"#8892a4",fontSize:11,fontFamily:"'DM Mono', monospace"},grid:{vertLines:{color:"#1a1d26"},horzLines:{color:"#1a1d26"}},crosshair:{mode:u.Normal},rightPriceScale:{borderColor:"#2a2d3e"},timeScale:{borderColor:"#2a2d3e",timeVisible:!0,secondsVisible:!1}}),y=new ResizeObserver(()=>{l&&g.clientWidth&&l.resize(g.clientWidth,480)}),y.observe(g),l.subscribeCrosshairMove(v=>{var J;if(!v.time||!v.point||!e.main){x.style.display="none";return}const b=v.seriesData.get(e.main);if(!b){x.style.display="none";return}const W="open"in b?`O <b>${b.open}</b>  H <b>${b.high}</b>  L <b>${b.low}</b>  C <b>${b.close}</b>`:`<b>${(J=b.value)==null?void 0:J.toFixed(4)}</b>`,q=v.seriesData.get(e.vol),vt=q?`  Vol <b>${A(q.value)}</b>`:"";x.innerHTML=`<span class="sa-tt-date">${v.time}</span>  ${W}${vt}`,x.style.display="block"}),l.subscribeClick(v=>{if(!a||!v.point||!e.main)return;const b=e.main.coordinateToPrice(v.point.y);if(b==null)return;const{LineStyle:U}=I,W=e.main.createPriceLine({price:b,color:"#7c6af7",lineWidth:1,lineStyle:U.Dashed,axisLabelVisible:!0,title:b.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})});s.push({pl:W,price:b}),O()})}async function T(){const{LineStyle:m}=await st();Object.values(e).forEach(u=>{try{l.removeSeries(u)}catch{}}),e={},s=[],O(),i.has("vol")&&(e.vol=l.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"vol"}),l.priceScale("vol").applyOptions({scaleMargins:{top:.82,bottom:0}}),e.vol.setData(d)),l.priceScale("right").applyOptions({scaleMargins:{top:.06,bottom:i.has("vol")?.22:.04}}),o==="candle"?(e.main=l.addCandlestickSeries({upColor:"#34d399",downColor:"#f87171",borderVisible:!1,wickUpColor:"#34d399",wickDownColor:"#f87171"}),e.main.setData(c)):(e.main=l.addLineSeries({color:"#7c6af7",lineWidth:2}),e.main.setData(c.map(u=>({time:u.time,value:u.close}))));for(const[u,v]of Object.entries(Xt))!i.has(u)||c.length<v.period||(e[u]=l.addLineSeries({color:v.color,lineWidth:1,title:v.label}),e[u].setData(ut(c,v.period)));if(i.has("bb")&&c.length>=20){const{upper:u,mid:v,lower:b}=Ht(c);e.bbU=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:m.Dashed}),e.bbM=l.addLineSeries({color:"rgba(124,106,247,0.4)",lineWidth:1}),e.bbL=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:m.Dashed}),e.bbU.setData(u),e.bbM.setData(v),e.bbL.setData(b)}l.timeScale().fitContent()}function O(){if(!s.length){P.innerHTML="";return}P.innerHTML=`
      <div class="sa-annot-wrap">
        <span class="sa-section-label">Price Levels</span>
        <div class="sa-annot-pills">
          ${s.map((m,u)=>`
            <span class="sa-annot-pill">
              ${m.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              <button class="sa-annot-x" data-i="${u}">×</button>
            </span>`).join("")}
        </div>
      </div>`,P.querySelectorAll(".sa-annot-x").forEach(m=>{m.addEventListener("click",()=>{const u=+m.dataset.i;try{e.main.removePriceLine(s[u].pl)}catch{}s.splice(u,1),O()})})}async function bt(m){h=m;const{range:u,interval:v}=N[p];$.style.display="flex",L.style.display="none",M.style.display="block",f.innerHTML=`<div class="sa-hdr-loading">Loading ${m}…</div>`,E.innerHTML="";try{await D();const[b,U]=await Promise.all([et(m,u,v),Yt(m)]);c=b.candles,d=b.volumes,It(f,b.meta,U),await T(),Rt(E,U)}catch{f.innerHTML=`<div class="sa-error">Symbol <b>${m}</b> not found or no data available.</div>`,E.innerHTML=""}finally{$.style.display="none"}}async function ht(m){if(!h)return;p=m,t.querySelectorAll(".sa-range-btn").forEach((b,U)=>b.classList.toggle("active",U===m));const{range:u,interval:v}=N[m];$.style.display="flex";try{const b=await et(h,u,v);c=b.candles,d=b.volumes,await T()}finally{$.style.display="none"}}t.querySelectorAll(".sa-range-btn").forEach((m,u)=>m.addEventListener("click",()=>ht(u))),w.addEventListener("change",()=>{C.placeholder=`Ticker (e.g. ${j[+w.value].example})`});async function V(){const m=C.value.trim().toUpperCase(),u=j[+w.value];if(!m)return;const v=u.suffix&&!m.endsWith(u.suffix)?`${m}${u.suffix}`:m;await bt(v)}return F.addEventListener("click",V),C.addEventListener("keydown",m=>{m.key==="Enter"&&V()}),t.querySelectorAll("[data-type]").forEach(m=>m.addEventListener("click",async()=>{o=m.dataset.type,t.querySelectorAll("[data-type]").forEach(u=>u.classList.remove("active")),m.classList.add("active"),c.length&&await T()})),t.querySelectorAll("[data-ind]").forEach(m=>m.addEventListener("click",async()=>{const u=m.dataset.ind;i.has(u)?i.delete(u):i.add(u),m.classList.toggle("active",i.has(u)),c.length&&await T()})),S.addEventListener("click",()=>{a=!a,S.classList.toggle("active",a),t.querySelector("#sa-chart-wrap").classList.toggle("sa-annotating",a)}),()=>{y==null||y.disconnect(),l&&(l.remove(),l=null),e={},s=[]}}function Wt(t){t.innerHTML=`
    <div class="placeholder-view">
      <div class="placeholder-icon">💼</div>
      <div class="placeholder-title">Portfolio Analysis</div>
      <p class="placeholder-body">
        Track your holdings, view allocation breakdowns, monitor performance
        vs benchmarks, and analyse risk. Coming soon.
      </p>
    </div>
  `}const jt=["market","stock","portfolio"],Nt={market:"Markets",stock:"Stock Analysis",portfolio:"Portfolio"};let R="market",B=null;function _t(t){t.innerHTML=`
    <div class="topbar">
      <div class="topbar-left">
        <div class="logo">invest<span>.</span>dash</div>
      </div>
      <div class="topbar-center">
        <div class="tabs" id="main-tabs">
          ${jt.map(e=>`
            <button class="tab ${e===R?"active":""}" data-tab="${e}">
              ${Nt[e]}
            </button>`).join("")}
        </div>
      </div>
      <div class="topbar-right"></div>
    </div>

    <div class="main-content" id="tab-content"></div>
  `;const n=t.querySelector("#main-tabs"),r=t.querySelector("#tab-content");function l(e){e!==R&&(R=e,n.querySelectorAll(".tab").forEach(s=>{s.classList.toggle("active",s.dataset.tab===e)}),at(r,e))}n.addEventListener("click",e=>{const s=e.target.closest(".tab");s&&l(s.dataset.tab)}),at(r,R)}function at(t,n){B&&(B(),B=null),t.innerHTML="",n==="market"?At(t).then(r=>{B=r??null}):n==="stock"?Ot(t).then(r=>{B=r??null}):n==="portfolio"&&Wt(t)}_t(document.getElementById("app"));
