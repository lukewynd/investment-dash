(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function l(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(e){if(e.ep)return;e.ep=!0;const n=l(e);fetch(e.href,n)}})();const ht="https://yf-proxy.lukewynd.workers.dev";function V(t){return`${ht}${t}`}function Lt(t){const s=encodeURIComponent(t);return`${ht}/v8/finance/chart/${s}?range=1y&interval=1d`}const rt=new Map,Ct=5*60*1e3;async function Tt(t){var l,r,e,n,a;const s=rt.get(t);if(s&&Date.now()-s.ts<Ct)return s.data;try{const o=await fetch(Lt(t),{headers:{Accept:"application/json"}});if(!o.ok)return null;const i=await o.json(),d=(r=(l=i==null?void 0:i.chart)==null?void 0:l.result)==null?void 0:r[0];if(!d)return null;const c=d.meta,u=((a=(n=(e=d.indicators)==null?void 0:e.quote)==null?void 0:n[0])==null?void 0:a.close)??[],h=c.regularMarketPrice??null,m=c.regularMarketChange??null,p=h!=null&&m!=null?h-m:null,f=p!=null&&p!==0?m/p*100:null;let b=u.length-1;for(;b>=0&&u[b]==null;)b--;const x=h??(b>=0?u[b]:null),M=C=>{let P=b-C;for(;P>=0&&u[P]==null;)P--;const S=P>=0?u[P]:null;return S!=null&&x!=null&&S!==0?(x-S)/S*100:null},L=new Date().getFullYear(),D=d.timestamp??[];let A=null;for(let C=0;C<D.length;C++)if(new Date(D[C]*1e3).getFullYear()===L&&u[C]!=null){A=u[C];break}const F=A!=null&&A!==0&&x!=null?(x-A)/A*100:null,H={symbol:t,regularMarketPrice:h,regularMarketChangePercent:f,regularMarketChange:m,quoteType:c.instrumentType??"",ytdPct:F,pct1d:f,pct1w:M(5),pct1m:M(21),pct3m:M(63),pctYtd:F};return rt.set(t,{ts:Date.now(),data:H}),H}catch{return null}}async function At(t){const l=new Map;for(let r=0;r<t.length;r+=8){const e=t.slice(r,r+8),n=await Promise.allSettled(e.map(a=>Tt(a)));e.forEach((a,o)=>{const i=n[o].status==="fulfilled"?n[o].value:null;i&&l.set(a,i)})}return l}const vt=[{symbol:"^GSPC",name:"S&P 500",type:"index"},{symbol:"^VIX",name:"VIX",type:"vix"},{symbol:"^TNX",name:"US 10Y",type:"yield"},{symbol:"DX-Y.NYB",name:"DXY",type:"index"},{symbol:"GC=F",name:"Gold",type:"commodity"},{symbol:"BTC-USD",name:"Bitcoin",type:"crypto"}],bt=[{symbol:"^GSPC",name:"S&P 500",region:"Americas"},{symbol:"^IXIC",name:"NASDAQ Comp.",region:"Americas"},{symbol:"^DJI",name:"Dow Jones",region:"Americas"},{symbol:"^RUT",name:"Russell 2000",region:"Americas"},{symbol:"^BVSP",name:"Bovespa",region:"Americas"},{symbol:"^MXX",name:"IPC Mexico",region:"Americas"},{symbol:"^FTSE",name:"FTSE 100",region:"Europe"},{symbol:"^GDAXI",name:"DAX",region:"Europe"},{symbol:"^FCHI",name:"CAC 40",region:"Europe"},{symbol:"^STOXX50E",name:"Euro Stoxx 50",region:"Europe"},{symbol:"^SSMI",name:"SMI",region:"Europe"},{symbol:"^AEX",name:"AEX",region:"Europe"},{symbol:"^N225",name:"Nikkei 225",region:"Asia-Pacific"},{symbol:"^HSI",name:"Hang Seng",region:"Asia-Pacific"},{symbol:"000001.SS",name:"Shanghai Comp.",region:"Asia-Pacific"},{symbol:"^AXJO",name:"ASX 200",region:"Asia-Pacific"},{symbol:"^KS11",name:"KOSPI",region:"Asia-Pacific"},{symbol:"^STI",name:"Straits Times",region:"Asia-Pacific"}],ft=[{symbol:"^IRX",name:"3-Month"},{symbol:"^FVX",name:"5-Year"},{symbol:"^TNX",name:"10-Year"},{symbol:"^TYX",name:"30-Year"}],et=[{code:"USD",name:"US Dollar",symbol:null,invert:!1},{code:"EUR",name:"Euro",symbol:"EURUSD=X",invert:!1},{code:"GBP",name:"Sterling",symbol:"GBPUSD=X",invert:!1},{code:"JPY",name:"Yen",symbol:"USDJPY=X",invert:!0},{code:"AUD",name:"Aus Dollar",symbol:"AUDUSD=X",invert:!1},{code:"CAD",name:"Can Dollar",symbol:"USDCAD=X",invert:!0},{code:"CHF",name:"Swiss Franc",symbol:"USDCHF=X",invert:!0}],Et=et.filter(t=>t.symbol).map(t=>t.symbol),yt=[{symbol:"GC=F",name:"Gold",unit:"/oz",group:"Metals"},{symbol:"SI=F",name:"Silver",unit:"/oz",group:"Metals"},{symbol:"HG=F",name:"Copper",unit:"/lb",group:"Metals"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl",group:"Energy"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl",group:"Energy"},{symbol:"NG=F",name:"Nat. Gas",unit:"/MMBtu",group:"Energy"},{symbol:"ZW=F",name:"Wheat",unit:"/bu",group:"Agri"},{symbol:"ZC=F",name:"Corn",unit:"/bu",group:"Agri"}],gt=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],St=[{symbol:"BTC-USD",name:"Bitcoin",abbr:"BTC"},{symbol:"ETH-USD",name:"Ethereum",abbr:"ETH"},{symbol:"SOL-USD",name:"Solana",abbr:"SOL"},{symbol:"XRP-USD",name:"XRP",abbr:"XRP"}],Dt=[...new Set([...vt.map(t=>t.symbol),...bt.map(t=>t.symbol),...ft.map(t=>t.symbol),...Et,...yt.map(t=>t.symbol),...gt.map(t=>t.symbol),...St.map(t=>t.symbol)])];function at(t,s=2){return t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:s,maximumFractionDigits:s})}function Y(t){if(t==null)return{text:"—",cls:""};const s=t>=0?"+":"",l=t>=0?"up":"dn",r=Math.abs(t)>=3?" strong":"";return{text:`${s}${t.toFixed(2)}%`,cls:l+r}}function Ft(t){if(t==null)return{text:"—",cls:""};const s=Math.round(t*100),l=s>=0?"+":"",r=s>=0?"up":"dn";return{text:`${l}${s}bps`,cls:r}}function E(t){const s=Y(t);return`<td class="num pct-cell ${s.cls}">${s.text}</td>`}function N(t,s=7){return Array.from({length:t},()=>`<tr>${Array.from({length:s},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function Pt(t){return vt.map(({symbol:s,name:l,type:r})=>{const e=t.get(s),n=e==null?void 0:e.regularMarketPrice,a=Y((e==null?void 0:e.pct1d)??null),o=Y((e==null?void 0:e.pctYtd)??null);let i="—";return n!=null&&(r==="yield"?i=n.toFixed(2)+"%":r==="crypto"?i="$"+n.toLocaleString("en-US",{maximumFractionDigits:0}):r==="commodity"?i="$"+at(n):i=at(n)),`
      <div class="mkt-stat-card">
        <div class="mkt-stat-name">${l}</div>
        <div class="mkt-stat-price">${i}</div>
        <div class="mkt-stat-chg ${a.cls}">${a.text}</div>
        <div class="mkt-stat-ytd ${o.cls}">${o.text} YTD</div>
      </div>`}).join("")}function Ht(t){const s=["Americas","Europe","Asia-Pacific"];let l="";return s.forEach(r=>{const e=bt.filter(n=>n.region===r);l+=`<tr class="mkt-region-sep"><td colspan="7">${r}</td></tr>`,l+=e.map(({symbol:n,name:a})=>{const o=t.get(n),i=o==null?void 0:o.regularMarketPrice,d=i!=null?i.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";return`<tr>
        <td class="mkt-name">${a}</td>
        <td class="num mono">${d}</td>
        ${E(o==null?void 0:o.pct1d)}
        ${E(o==null?void 0:o.pct1w)}
        ${E(o==null?void 0:o.pct1m)}
        ${E(o==null?void 0:o.pct3m)}
        ${E(o==null?void 0:o.pctYtd)}
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
        <tbody>${l}</tbody>
      </table>
    </div>`}function Ut(t){const s=ft.map(({symbol:e,name:n})=>{const a=t.get(e),o=(a==null?void 0:a.regularMarketPrice)??null,i=(a==null?void 0:a.regularMarketChange)??null;return{name:n,yld:o,chg:i}}),l=Math.max(.01,...s.map(e=>e.yld??0));return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">US Treasuries</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Tenor</th>
          <th class="num">Yield</th>
          <th></th>
          <th class="num">1D Chg</th>
        </tr></thead>
        <tbody>${s.map(({name:e,yld:n,chg:a})=>{const o=Ft(a),i=n!=null?n.toFixed(2)+"%":"—",d=n!=null?n/l*100:0;return`<tr>
      <td class="mkt-name">${e}</td>
      <td class="num mono">${i}</td>
      <td class="yc-bar-cell"><span class="yc-bar" style="width:${d.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${o.cls}">${o.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Xt(t){const s={USD:1};et.forEach(({code:a,symbol:o,invert:i})=>{var c;if(!o)return;const d=(c=t.get(o))==null?void 0:c.regularMarketPrice;d!=null&&(s[a]=i?1/d:d)});const l=a=>a==null?"—":a>=100?a.toFixed(2):a>=10?a.toFixed(3):a.toFixed(4),r=et.map(a=>a.code),e=r.map(a=>`<th class="num fx-col-hdr">${a}</th>`).join(""),n=r.map(a=>{const o=r.map(i=>{if(a===i)return'<td class="fx-diag">—</td>';const d=s[a],c=s[i],u=d!=null&&c!=null&&c!==0?d/c:null;return`<td class="num fx-cell">${l(u)}</td>`}).join("");return`<tr><th class="fx-row-hdr">${a}</th>${o}</tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Cross Rates <span class="mkt-panel-sub">1 row = X column</span></div>
      <div class="fx-matrix-wrap">
        <table class="fx-matrix">
          <thead><tr><th></th>${e}</tr></thead>
          <tbody>${n}</tbody>
        </table>
      </div>
    </div>`}function Bt(t){const s=["Metals","Energy","Agri"];let l="";return s.forEach(r=>{const e=yt.filter(n=>n.group===r);l+=`<tr class="mkt-region-sep"><td colspan="7">${r}</td></tr>`,l+=e.map(({symbol:n,name:a,unit:o})=>{const i=t.get(n),d=i==null?void 0:i.regularMarketPrice,c=d!=null?"$"+at(d):"—";return`<tr>
        <td class="mkt-name">${a}<span class="mkt-unit">${o}</span></td>
        <td class="num mono">${c}</td>
        ${E(i==null?void 0:i.pct1d)}
        ${E(i==null?void 0:i.pct1w)}
        ${E(i==null?void 0:i.pct1m)}
        ${E(i==null?void 0:i.pctYtd)}
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
        <tbody>${l}</tbody>
      </table>
    </div>`}function Rt(t){const s=gt.map(({symbol:e,name:n})=>{const a=t.get(e);return{name:n,pct1d:(a==null?void 0:a.pct1d)??null,pct1m:(a==null?void 0:a.pct1m)??null,pctYtd:(a==null?void 0:a.pctYtd)??null}});s.sort((e,n)=>(n.pct1d??-999)-(e.pct1d??-999));const l=Math.max(.01,...s.map(e=>Math.abs(e.pct1d??0)));return`
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
        <tbody>${s.map(({name:e,pct1d:n,pct1m:a,pctYtd:o})=>{const i=Y(n),d=Y(a),c=Y(o),u=n!=null?Math.abs(n)/l*100:0;return`<tr>
      <td class="mkt-name sec-name">${e}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${i.cls}" style="width:${u.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${i.cls}">${i.text}</td>
      <td class="num pct-cell ${d.cls}">${d.text}</td>
      <td class="num pct-cell ${c.cls}">${c.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function It(t){return`
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
        <tbody>${St.map(({symbol:l,name:r,abbr:e})=>{const n=t.get(l),a=n==null?void 0:n.regularMarketPrice,o=a!=null?"$"+a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:a>=100?2:4}):"—";return`<tr>
      <td class="mkt-name">${r} <span class="mkt-abbr">${e}</span></td>
      <td class="num mono">${o}</td>
      ${E(n==null?void 0:n.pct1d)}
      ${E(n==null?void 0:n.pct1w)}
      ${E(n==null?void 0:n.pct1m)}
      ${E(n==null?void 0:n.pctYtd)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}async function Yt(t){t.innerHTML=`
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
        <table class="mkt-table"><tbody>${N(18)}</tbody></table>
      </div>
    </section>

    <!-- Bonds + FX -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Treasuries</div>
          <table class="mkt-table"><tbody>${N(4,4)}</tbody></table>
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
          <table class="mkt-table"><tbody>${N(8,6)}</tbody></table>
        </div>
      </div>
      <div id="mkt-sectors">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Equity Sectors</div>
          <table class="mkt-table"><tbody>${N(11,5)}</tbody></table>
        </div>
      </div>
    </section>

    <!-- Crypto -->
    <section class="mkt-section" id="mkt-crypto">
      <div class="mkt-panel">
        <div class="mkt-panel-label">Crypto</div>
        <table class="mkt-table"><tbody>${N(4,6)}</tbody></table>
      </div>
    </section>
  `;const s=t.querySelector("#mkt-refresh");async function l(){const e=t.querySelector("#mkt-timestamp");e.textContent="Loading…";const n=await At(Dt);if(!t.isConnected)return;t.querySelector("#mkt-stats").innerHTML=Pt(n),t.querySelector("#mkt-equities").innerHTML=Ht(n),t.querySelector("#mkt-bonds").innerHTML=Ut(n),t.querySelector("#mkt-fx").innerHTML=Xt(n),t.querySelector("#mkt-commodities").innerHTML=Bt(n),t.querySelector("#mkt-sectors").innerHTML=Rt(n),t.querySelector("#mkt-crypto").innerHTML=It(n);const a=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});e.textContent=`Updated ${a}`}s.addEventListener("click",l),await l();const r=setInterval(l,30*60*1e3);return()=>clearInterval(r)}const Nt="modulepreload",Ot=function(t){return"/investment-dash/"+t},lt={},kt=function(s,l,r){let e=Promise.resolve();if(l&&l.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),o=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));e=Promise.allSettled(l.map(i=>{if(i=Ot(i),i in lt)return;lt[i]=!0;const d=i.endsWith(".css"),c=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${c}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":Nt,d||(u.as="script"),u.crossOrigin="",u.href=i,o&&u.setAttribute("nonce",o),document.head.appendChild(u),d)return new Promise((h,m)=>{u.addEventListener("load",h),u.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${i}`)))})}))}function n(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return e.then(a=>{for(const o of a||[])o.status==="rejected"&&n(o.reason);return s().catch(n)})},J=[{label:"US (NYSE / NASDAQ)",suffix:"",example:"AAPL"},{label:"Australia (ASX)",suffix:".AX",example:"CBA.AX"},{label:"UK (LSE)",suffix:".L",example:"HSBA.L"},{label:"Canada (TSX)",suffix:".TO",example:"RY.TO"},{label:"Germany (XETRA)",suffix:".DE",example:"SAP.DE"},{label:"Japan (TSE)",suffix:".T",example:"7203.T"},{label:"Hong Kong (HKEX)",suffix:".HK",example:"0700.HK"}],Q=[{label:"1W",range:"5d",interval:"1d"},{label:"1M",range:"1mo",interval:"1d"},{label:"3M",range:"3mo",interval:"1d"},{label:"6M",range:"6mo",interval:"1d"},{label:"1Y",range:"1y",interval:"1d"},{label:"2Y",range:"2y",interval:"1wk"},{label:"5Y",range:"5y",interval:"1wk"},{label:"MAX",range:"max",interval:"1mo"}],qt={ma20:{period:20,color:"#fbbf24",label:"MA 20"},ma50:{period:50,color:"#60a5fa",label:"MA 50"},ma200:{period:200,color:"#f87171",label:"MA 200"}};function $t(t,s){const l=[];for(let r=s-1;r<t.length;r++){const e=t.slice(r-s+1,r+1).reduce((n,a)=>n+a.close,0);l.push({time:t[r].time,value:+(e/s).toFixed(4)})}return l}function Wt(t,s=20,l=2){const r=$t(t,s),e=[],n=[];for(let a=0;a<r.length;a++){const o=a+s-1,i=t.slice(o-s+1,o+1).map(u=>u.close),d=r[a].value,c=Math.sqrt(i.reduce((u,h)=>u+(h-d)**2,0)/s);e.push({time:r[a].time,value:+(d+l*c).toFixed(4)}),n.push({time:r[a].time,value:+(d-l*c).toFixed(4)})}return{upper:e,mid:r,lower:n}}const ot=new Map,it=new Map,wt=5*60*1e3;function jt(t){const s=new Date(t*1e3);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}-${String(s.getDate()).padStart(2,"0")}`}async function ct(t,s,l){var p,f;const r=`${t}:${s}:${l}`,e=ot.get(r);if(e&&Date.now()-e.ts<wt)return e.data;const n=`/v8/finance/chart/${encodeURIComponent(t)}?range=${s}&interval=${l}&includePrePost=false`,a=await fetch(V(n),{headers:{Accept:"application/json"}});if(!a.ok)throw new Error(`HTTP ${a.status}`);const o=await a.json(),i=(f=(p=o==null?void 0:o.chart)==null?void 0:p.result)==null?void 0:f[0];if(!i)throw new Error("Symbol not found");const d=i.timestamp??[],c=i.indicators.quote[0],u=[],h=[];for(let v=0;v<d.length;v++){if(c.open[v]==null||c.close[v]==null)continue;const b=jt(d[v]);u.push({time:b,open:+c.open[v].toFixed(4),high:+c.high[v].toFixed(4),low:+c.low[v].toFixed(4),close:+c.close[v].toFixed(4)}),h.push({time:b,value:c.volume[v]??0,color:c.close[v]>=c.open[v]?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"})}const m={candles:u,volumes:h,meta:i.meta};return ot.set(r,{ts:Date.now(),data:m}),m}async function _t(t){var o,i;const s=it.get(t);if(s&&Date.now()-s.ts<wt)return s.data;const r=`/v10/finance/quoteSummary/${encodeURIComponent(t)}?modules=price,summaryDetail,defaultKeyStatistics,financialData,assetProfile`,e=await fetch(V(r),{headers:{Accept:"application/json"}});if(!e.ok)return null;const n=await e.json(),a=((i=(o=n==null?void 0:n.quoteSummary)==null?void 0:o.result)==null?void 0:i[0])??null;return a&&it.set(t,{ts:Date.now(),data:a}),a}const U=(t,s={})=>t==null?"—":t.toLocaleString("en-US",s),q=t=>t==null?"—":`${t>=0?"+":""}${(t*100).toFixed(2)}%`,Z=t=>t==null?"—":t>=1e12?`$${(t/1e12).toFixed(2)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString()}`;function Vt(t,s){var c,u,h,m,p,f,v,b,x,M,L,D,A,F,H;if(!s){t.innerHTML='<div class="sa-no-data">Fundamental data unavailable.</div>';return}const l=s.price??{},r=s.summaryDetail??{},e=s.defaultKeyStatistics??{},n=s.financialData??{},a=s.assetProfile??{},i=[["Market Cap",Z((c=l.marketCap)==null?void 0:c.raw)],["P/E (TTM)",U((u=r.trailingPE)==null?void 0:u.raw,{maximumFractionDigits:1})],["Fwd P/E",U((h=r.forwardPE)==null?void 0:h.raw,{maximumFractionDigits:1})],["EPS (TTM)",((m=e.trailingEps)==null?void 0:m.raw)!=null?`$${e.trailingEps.raw.toFixed(2)}`:"—"],["52W High",U((p=r.fiftyTwoWeekHigh)==null?void 0:p.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["52W Low",U((f=r.fiftyTwoWeekLow)==null?void 0:f.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["Div Yield",q((v=r.dividendYield)==null?void 0:v.raw)],["Beta",U((b=r.beta)==null?void 0:b.raw,{maximumFractionDigits:2})],["Revenue TTM",Z((x=n.totalRevenue)==null?void 0:x.raw)],["Gross Margin",q((M=n.grossMargins)==null?void 0:M.raw)],["Op Margin",q((L=n.operatingMargins)==null?void 0:L.raw)],["ROE",q((D=n.returnOnEquity)==null?void 0:D.raw)],["P/B Ratio",U((A=e.priceToBook)==null?void 0:A.raw,{maximumFractionDigits:2})],["Avg Volume",U((F=r.averageVolume)==null?void 0:F.raw)],["Employees",U(a.fullTimeEmployees)],["Free Cash Flow",Z((H=n.freeCashflow)==null?void 0:H.raw)]].map(([C,P])=>`
    <div class="sa-fund-card">
      <div class="sa-fund-label">${C}</div>
      <div class="sa-fund-val">${P}</div>
    </div>`).join(""),d=[a.sector,a.industry].filter(Boolean).map(C=>`<span class="sa-badge">${C}</span>`).join("");t.innerHTML=`
    <div class="sa-section-label">Key Metrics</div>
    <div class="sa-fund-grid">${i}</div>
    ${a.longBusinessSummary?`
      <div class="sa-about">
        <div class="sa-section-label">About ${d}</div>
        <p class="sa-about-text">${a.longBusinessSummary}</p>
      </div>`:""}
  `}function Kt(t,s,l){var c,u,h;const r=(l==null?void 0:l.price)??{},e=r.longName||r.shortName||(s==null?void 0:s.symbol)||"",n=((c=r.regularMarketPrice)==null?void 0:c.raw)??(s==null?void 0:s.regularMarketPrice)??0,a=(((u=r.regularMarketChangePercent)==null?void 0:u.raw)??0)*100,o=((h=r.regularMarketChange)==null?void 0:h.raw)??0,i=r.exchangeName||(s==null?void 0:s.exchangeName)||"",d=a>=0;t.innerHTML=`
    <div class="sa-hdr-left">
      <div class="sa-hdr-name">${e} <span class="sa-hdr-sym">${(s==null?void 0:s.symbol)??""}</span></div>
      <div class="sa-hdr-exch">${i}</div>
    </div>
    <div class="sa-hdr-right">
      <div class="sa-hdr-price">${n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div class="sa-hdr-chg ${d?"up":"dn"}">${d?"+":""}${o.toFixed(2)} (${d?"+":""}${a.toFixed(2)}%)</div>
    </div>
  `}let _=null;async function dt(){return _||(_=await kt(()=>import("./lightweight-charts.production-C-4kb1nc.js"),[])),_}async function Gt(t){const s=J.map((y,g)=>`<option value="${g}">${y.label}</option>`).join(""),l=Q.map((y,g)=>`<button class="sa-range-btn${g===4?" active":""}" data-ri="${g}">${y.label}</button>`).join("");t.innerHTML=`
    <div class="sa-layout">
      <div class="sa-search-bar">
        <select class="sa-market-sel" id="sa-mkt">${s}</select>
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
          <div class="sa-ranges">${l}</div>
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
  `;let r=null,e={},n=[],a=!1,o=new Set(["vol"]),i="candle",d=[],c=[],u=4,h=null,m=null;const p=t.querySelector("#sa-ph"),f=t.querySelector("#sa-main"),v=t.querySelector("#sa-hdr"),b=t.querySelector("#sa-chart"),x=t.querySelector("#sa-overlay"),M=t.querySelector("#sa-tt"),L=t.querySelector("#sa-annot-list"),D=t.querySelector("#sa-funds"),A=t.querySelector("#sa-mkt"),F=t.querySelector("#sa-ticker"),H=t.querySelector("#sa-go"),C=t.querySelector("#sa-annot-btn");async function P(){if(r)return;const{createChart:y,CrosshairMode:g}=await dt();r=y(b,{width:b.clientWidth||900,height:480,layout:{background:{color:"#0b0d14"},textColor:"#8892a4",fontSize:11,fontFamily:"'DM Mono', monospace"},grid:{vertLines:{color:"#1a1d26"},horzLines:{color:"#1a1d26"}},crosshair:{mode:g.Normal},rightPriceScale:{borderColor:"#2a2d3e"},timeScale:{borderColor:"#2a2d3e",timeVisible:!0,secondsVisible:!1}}),m=new ResizeObserver(()=>{r&&b.clientWidth&&r.resize(b.clientWidth,480)}),m.observe(b),r.subscribeCrosshairMove($=>{var nt;if(!$.time||!$.point||!e.main){M.style.display="none";return}const k=$.seriesData.get(e.main);if(!k){M.style.display="none";return}const z="open"in k?`O <b>${k.open}</b>  H <b>${k.high}</b>  L <b>${k.low}</b>  C <b>${k.close}</b>`:`<b>${(nt=k.value)==null?void 0:nt.toFixed(4)}</b>`,st=$.seriesData.get(e.vol),Mt=st?`  Vol <b>${U(st.value)}</b>`:"";M.innerHTML=`<span class="sa-tt-date">${$.time}</span>  ${z}${Mt}`,M.style.display="block"}),r.subscribeClick($=>{if(!a||!$.point||!e.main)return;const k=e.main.coordinateToPrice($.point.y);if(k==null)return;const{LineStyle:B}=_,z=e.main.createPriceLine({price:k,color:"#7c6af7",lineWidth:1,lineStyle:B.Dashed,axisLabelVisible:!0,title:k.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})});n.push({pl:z,price:k}),X()})}async function S(){const{LineStyle:y}=await dt();Object.values(e).forEach(g=>{try{r.removeSeries(g)}catch{}}),e={},n=[],X(),o.has("vol")&&(e.vol=r.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"vol"}),r.priceScale("vol").applyOptions({scaleMargins:{top:.82,bottom:0}}),e.vol.setData(c)),r.priceScale("right").applyOptions({scaleMargins:{top:.06,bottom:o.has("vol")?.22:.04}}),i==="candle"?(e.main=r.addCandlestickSeries({upColor:"#34d399",downColor:"#f87171",borderVisible:!1,wickUpColor:"#34d399",wickDownColor:"#f87171"}),e.main.setData(d)):(e.main=r.addLineSeries({color:"#7c6af7",lineWidth:2}),e.main.setData(d.map(g=>({time:g.time,value:g.close}))));for(const[g,$]of Object.entries(qt))!o.has(g)||d.length<$.period||(e[g]=r.addLineSeries({color:$.color,lineWidth:1,title:$.label}),e[g].setData($t(d,$.period)));if(o.has("bb")&&d.length>=20){const{upper:g,mid:$,lower:k}=Wt(d);e.bbU=r.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:y.Dashed}),e.bbM=r.addLineSeries({color:"rgba(124,106,247,0.4)",lineWidth:1}),e.bbL=r.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:y.Dashed}),e.bbU.setData(g),e.bbM.setData($),e.bbL.setData(k)}r.timeScale().fitContent()}function X(){if(!n.length){L.innerHTML="";return}L.innerHTML=`
      <div class="sa-annot-wrap">
        <span class="sa-section-label">Price Levels</span>
        <div class="sa-annot-pills">
          ${n.map((y,g)=>`
            <span class="sa-annot-pill">
              ${y.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              <button class="sa-annot-x" data-i="${g}">×</button>
            </span>`).join("")}
        </div>
      </div>`,L.querySelectorAll(".sa-annot-x").forEach(y=>{y.addEventListener("click",()=>{const g=+y.dataset.i;try{e.main.removePriceLine(n[g].pl)}catch{}n.splice(g,1),X()})})}async function K(y){h=y;const{range:g,interval:$}=Q[u];x.style.display="flex",p.style.display="none",f.style.display="block",v.innerHTML=`<div class="sa-hdr-loading">Loading ${y}…</div>`,D.innerHTML="";try{await P();const[k,B]=await Promise.all([ct(y,g,$),_t(y)]);d=k.candles,c=k.volumes,Kt(v,k.meta,B),await S(),Vt(D,B)}catch{v.innerHTML=`<div class="sa-error">Symbol <b>${y}</b> not found or no data available.</div>`,D.innerHTML=""}finally{x.style.display="none"}}async function G(y){if(!h)return;u=y,t.querySelectorAll(".sa-range-btn").forEach((k,B)=>k.classList.toggle("active",B===y));const{range:g,interval:$}=Q[y];x.style.display="flex";try{const k=await ct(h,g,$);d=k.candles,c=k.volumes,await S()}finally{x.style.display="none"}}t.querySelectorAll(".sa-range-btn").forEach((y,g)=>y.addEventListener("click",()=>G(g))),A.addEventListener("change",()=>{F.placeholder=`Ticker (e.g. ${J[+A.value].example})`});async function O(){const y=F.value.trim().toUpperCase(),g=J[+A.value];if(!y)return;const $=g.suffix&&!y.endsWith(g.suffix)?`${y}${g.suffix}`:y;await K($)}return H.addEventListener("click",O),F.addEventListener("keydown",y=>{y.key==="Enter"&&O()}),t.querySelectorAll("[data-type]").forEach(y=>y.addEventListener("click",async()=>{i=y.dataset.type,t.querySelectorAll("[data-type]").forEach(g=>g.classList.remove("active")),y.classList.add("active"),d.length&&await S()})),t.querySelectorAll("[data-ind]").forEach(y=>y.addEventListener("click",async()=>{const g=y.dataset.ind;o.has(g)?o.delete(g):o.add(g),y.classList.toggle("active",o.has(g)),d.length&&await S()})),C.addEventListener("click",()=>{a=!a,C.classList.toggle("active",a),t.querySelector("#sa-chart-wrap").classList.toggle("sa-annotating",a)}),()=>{m==null||m.disconnect(),r&&(r.remove(),r=null),e={},n=[]}}const xt="portv1",ut={symbol:"^GSPC"},zt=[{label:"US",suffix:""},{label:"ASX",suffix:".AX"},{label:"LSE",suffix:".L"},{label:"TSX",suffix:".TO"},{label:"XETRA",suffix:".DE"},{label:"TSE",suffix:".T"},{label:"HKEX",suffix:".HK"}];let w=[],W=63,R=null;function tt(){try{localStorage.setItem(xt,JSON.stringify(w))}catch{}}function Jt(){try{return JSON.parse(localStorage.getItem(xt)??"[]")}catch{return[]}}const mt=new Map,Qt=10*60*1e3;async function Zt(t,s){var r,e,n,a,o;const l=mt.get(t);if(l&&Date.now()-l.ts<Qt)return l.data;try{const i=`/v8/finance/chart/${encodeURIComponent(t)}?range=1y&interval=1d`,d=await fetch(V(i),{headers:{Accept:"application/json"},signal:s});if(!d.ok)return null;const c=await d.json(),u=(e=(r=c==null?void 0:c.chart)==null?void 0:r.result)==null?void 0:e[0];if(!u)return null;const h=u.timestamp??[],m=((o=(a=(n=u.indicators)==null?void 0:n.quote)==null?void 0:a[0])==null?void 0:o.close)??[],p=u.meta,f=[];for(let b=1;b<h.length;b++)m[b]!=null&&m[b-1]!=null&&m[b-1]!==0&&f.push({date:h[b],ret:(m[b]-m[b-1])/m[b-1]});const v={symbol:t,name:p.longName||p.shortName||t,price:p.regularMarketPrice,retData:f};return mt.set(t,{ts:Date.now(),data:v}),v}catch{return null}}async function te(t){var s,l,r,e;try{const n=`/v8/finance/chart/${encodeURIComponent(t)}?range=1d&interval=1d`,a=await fetch(V(n),{headers:{Accept:"application/json"}});if(!a.ok)return null;const o=(e=(r=(l=(s=await a.json())==null?void 0:s.chart)==null?void 0:l.result)==null?void 0:r[0])==null?void 0:e.meta;return o?{name:o.longName||o.shortName||t,price:o.regularMarketPrice}:null}catch{return null}}function ee(t){const s=new Date((t+43200)*1e3);return`${s.getUTCFullYear()}-${String(s.getUTCMonth()+1).padStart(2,"0")}-${String(s.getUTCDate()).padStart(2,"0")}`}function ae(t){const s=t.map(n=>n.map(a=>({key:ee(a.date),ret:a.ret}))),l=new Set;s.forEach(n=>n.forEach(a=>l.add(a.key)));const r=[...l].sort(),e=s.map(n=>{const a=new Map(n.map(o=>[o.key,o.ret]));return r.map(o=>a.get(o)??0)});return{dates:r,aligned:e}}function se(t,s){var i;const l=t.length,r=((i=t[0])==null?void 0:i.length)??0;if(r<10||l<1)return null;const e=Math.exp(-Math.LN2/s),n=Array.from({length:l},()=>new Array(l).fill(0));let a=0,o=1;for(let d=r-1;d>=0;d--){for(let c=0;c<l;c++)for(let u=0;u<l;u++)n[c][u]+=o*t[c][d]*t[u][d];a+=o,o*=e}for(let d=0;d<l;d++)for(let c=0;c<l;c++)n[d][c]=n[d][c]/a*252;return n}function ne(t){const s=t.length;return Array.from({length:s},(l,r)=>Array.from({length:s},(e,n)=>{const a=Math.sqrt(t[r][r]*t[n][n]);return a>0?t[r][n]/a:r===n?1:0}))}function re(t,s){t.length;const l=t.map((c,u)=>t.reduce((h,m,p)=>h+s[u][p]*m,0)),r=t.reduce((c,u,h)=>c+u*l[h],0),e=Math.sqrt(Math.max(0,r)),n=t.map((c,u)=>e>0?c*l[u]/e:0),a=n.map(c=>e>0?c/e:0),o=s.map((c,u)=>Math.sqrt(Math.max(0,s[u][u]))),i=t.reduce((c,u,h)=>c+u*o[h],0),d=e>0?i/e:1;return{portVol:e,RC:n,pctRC:a,indivVols:o,divRatio:d}}function le(t,s){const l=t.length;if(l<5)return null;let r=1,e=1,n=0;const a=[],o=[];for(const v of t){r*=1+v,a.push(r),r>e&&(e=r);const b=r/e-1;o.push(b),-b>n&&(n=-b)}const i=Math.pow(Math.max(r,1e-9),252/l)-1,d=t.reduce((v,b)=>v+b,0)/l,c=Math.sqrt(t.reduce((v,b)=>v+(b-d)**2,0)/(l-1)*252),u=c>0?(i-.04)/c:null,h=n>0?i/n:null;let m=null;if((s==null?void 0:s.length)===l){const v=s.reduce((M,L)=>M+L,0)/l;let b=0,x=0;t.forEach((M,L)=>{b+=(M-d)*(s[L]-v),x+=(s[L]-v)**2}),m=x>0?b/x:null}let p=1;const f=(s==null?void 0:s.map(v=>(p*=1+v,p)))??[];return{annRet:i,vol:c,sharpe:u,beta:m,maxDD:n,calmar:h,navSeries:a,ddSeries:o,bmkNav:f}}const T={pct:(t,s=2)=>t==null||isNaN(t)?"—":`${t>=0?"+":""}${(t*100).toFixed(s)}%`,num:(t,s=2)=>t==null||isNaN(t)?"—":t.toFixed(s),price:t=>t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),cls:t=>t==null||isNaN(t)?"":t>=0?"up":"dn"};function oe(t){if(t==null||isNaN(t))return"transparent";const s=Math.max(-1,Math.min(1,t)),l=(Math.abs(s)*.65+.08).toFixed(2);return s>=0?`rgba(248,113,113,${l})`:`rgba(52,211,153,${l})`}function ie(t){return`<div class="port-metrics-strip">
    ${[["Ann. Return",T.pct(t.annRet),T.cls(t.annRet)],["Ann. Vol",T.pct(t.vol),""],["Sharpe",T.num(t.sharpe),T.cls(t.sharpe)],["Beta (SPX)",T.num(t.beta),""],["Max Drawdown",T.pct(-t.maxDD),"dn"],["Calmar",T.num(t.calmar),T.cls(t.calmar)]].map(([l,r,e])=>`
      <div class="port-metric-card">
        <div class="port-metric-label">${l}</div>
        <div class="port-metric-val ${e}">${r}</div>
      </div>`).join("")}
  </div>`}function ce(t,s,l){const{portVol:r,pctRC:e,indivVols:n,divRatio:a}=re(s,l),o=Math.max(1e-9,...e.map(Math.abs)),i=t.map((d,c)=>`
    <div class="port-risk-row">
      <div class="port-risk-lbl">${d}</div>
      <div class="port-risk-bar-wrap">
        <div class="port-risk-bar" style="width:${(Math.abs(e[c])/o*100).toFixed(1)}%"></div>
      </div>
      <div class="port-risk-pct">${(e[c]*100).toFixed(1)}%</div>
      <div class="port-risk-vol">${(n[c]*100).toFixed(1)}% vol</div>
    </div>`).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Risk Contribution</div>
      <div class="port-risk-meta">
        Portfolio Vol <strong>${(r*100).toFixed(2)}%</strong>
        &nbsp;·&nbsp; Div. Ratio <strong>${a.toFixed(2)}×</strong>
      </div>
      <div class="port-risk-rows">${i}</div>
    </div>`}function de(t,s,l){const r=s.reduce((n,a,o)=>n+a*s.reduce((i,d,c)=>i+d*l[o][c],0),0);return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Volatility & Contribution Beta</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Ann. Vol</th><th class="num">β → Port</th>
        </tr></thead>
        <tbody>${t.map((n,a)=>{const o=Math.sqrt(Math.max(0,l[a][a])),i=s.reduce((c,u,h)=>c+u*l[a][h],0),d=r>0?i/r:null;return`<tr>
      <td class="mkt-name">${n}</td>
      <td class="num">${(s[a]*100).toFixed(1)}%</td>
      <td class="num">${(o*100).toFixed(1)}%</td>
      <td class="num">${T.num(d)}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function ue(t,s,l){const r=ne(s),e=t.map(a=>`<th class="corr-col-hdr">${a}</th>`).join(""),n=t.map((a,o)=>`<tr><th class="corr-row-hdr">${a}</th>${t.map((i,d)=>{const c=r[o][d],u=o===d;return`<td class="corr-cell${u?" corr-diag":""}"
        style="background:${u?"var(--bg-base)":oe(c)}">${u?"—":c.toFixed(2)}</td>`}).join("")}</tr>`).join("");return`
    <div class="mkt-panel">
      <div class="port-corr-hdr">
        <span class="mkt-panel-label" style="border:none;padding:10px 14px 8px">EWMA Correlation Matrix</span>
        <div class="port-hl-ctrl">
          <span class="port-hl-label">Half-life</span>
          <input type="range" id="port-hl-slider" class="port-hl-slider" min="5" max="252" value="${l}" step="1">
          <span id="port-hl-val" class="port-hl-val">${l}d</span>
        </div>
      </div>
      <div class="corr-legend">
        <span class="corr-leg corr-leg-neg">■ Diversifying (negative)</span>
        <span class="corr-leg corr-leg-pos">■ Correlated (positive)</span>
      </div>
      <div class="corr-scroll">
        <table class="corr-table">
          <thead><tr><th></th>${e}</tr></thead>
          <tbody>${n}</tbody>
        </table>
      </div>
    </div>`}function me(t,s,l,r,e){const n=r.length,a={"1d":1,"1w":5,"1m":21,"3m":63};let o;if(e==="ytd"){const m=String(new Date().getFullYear());o=r.findIndex(p=>p.startsWith(m)),o<0&&(o=0)}else o=Math.max(0,n-(a[e]??1));const i=l.map(m=>m.slice(o).reduce((p,f)=>p*(1+f),1)-1),d=i.reduce((m,p,f)=>m+s[f]*p,0),c=Math.max(1e-9,...i.map(m=>Math.abs(m))),u=["1d","1w","1m","3m","ytd"].map(m=>`<button class="port-period-btn${m===e?" active":""}" data-period="${m}">${m.toUpperCase()}</button>`).join(""),h=t.map((m,p)=>{const f=i[p],v=s[p]*f,b=(Math.abs(f)/c*100).toFixed(1);return`<tr>
      <td class="mkt-name">${m}</td>
      <td class="num">${(s[p]*100).toFixed(1)}%</td>
      <td class="num ${T.cls(f)}">${T.pct(f)}</td>
      <td class="num ${T.cls(v)}">${T.pct(v)}</td>
      <td class="port-attr-bar-cell">
        <span class="port-attr-bar ${f>=0?"up":"dn"}" style="width:${b}%"></span>
      </td>
    </tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="port-attr-hdr">
        <span class="mkt-panel-label" style="border:none;padding:10px 14px 8px">Return Attribution</span>
        <div class="port-attr-periods" id="port-attr-periods">${u}</div>
      </div>
      <div class="port-attr-summary">
        Portfolio return: <strong class="${T.cls(d)}">${T.pct(d)}</strong>
      </div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Return</th><th class="num">Contribution</th><th></th>
        </tr></thead>
        <tbody>${h}</tbody>
      </table>
    </div>`}async function pe(t,s,l,r){var h;const e=t.querySelector("#port-chart-wrap");if(!e)return;R&&(R(),R=null);const{createChart:n}=await kt(async()=>{const{createChart:m}=await import("./lightweight-charts.production-C-4kb1nc.js");return{createChart:m}},[]);e.innerHTML="";const a=document.createElement("div");a.style.height="280px",e.appendChild(a);const o=n(a,{layout:{background:{color:"transparent"},textColor:"#6b7280"},grid:{vertLines:{color:"#22253a"},horzLines:{color:"#22253a"}},rightPriceScale:{borderColor:"#22253a"},timeScale:{borderColor:"#22253a"}}),i=o.addLineSeries({color:"#7c6af7",lineWidth:2,title:"Portfolio"}),d=o.addLineSeries({color:"#4b5563",lineWidth:1,lineStyle:2,title:"S&P 500"});function c(m){if(m==="cumret")i.setData(s.map((p,f)=>({time:p,value:+((l[f]-1)*100).toFixed(3)}))),d.setData(s.map((p,f)=>({time:p,value:+((r[f]-1)*100).toFixed(3)})));else{let p=1;i.setData(s.map((f,v)=>(l[v]>p&&(p=l[v]),{time:f,value:+((l[v]/p-1)*100).toFixed(3)}))),d.setData([])}o.timeScale().fitContent()}c("cumret"),(h=t.querySelector("#port-chart-toggle"))==null||h.querySelectorAll("[data-mode]").forEach(m=>{m.addEventListener("click",()=>{t.querySelectorAll("#port-chart-toggle [data-mode]").forEach(p=>p.classList.toggle("active",p===m)),c(m.dataset.mode)})});const u=new ResizeObserver(()=>o.resize(a.offsetWidth,280));u.observe(a),R=()=>{u.disconnect(),o.remove()}}function he(t,s,l,r,e,n){t.innerHTML=`
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
  `,t.querySelector("#port-metrics-strip").innerHTML=ie(n);function a(d){const c=se(s,d);c&&(t.querySelector("#port-risk-panel").innerHTML=ce(r,e,c),t.querySelector("#port-vol-panel").innerHTML=de(r,e,c),t.querySelector("#port-corr-panel").innerHTML=ue(r,c,d),o())}function o(){const d=t.querySelector("#port-hl-slider"),c=t.querySelector("#port-hl-val");d&&d.addEventListener("input",()=>{W=+d.value,c&&(c.textContent=`${W}d`),a(W)})}function i(d="1d"){var c;t.querySelector("#port-attr-panel").innerHTML=me(r,e,s,l,d),(c=t.querySelector("#port-attr-periods"))==null||c.querySelectorAll(".port-period-btn").forEach(u=>{u.addEventListener("click",()=>i(u.dataset.period))})}a(W),i("1d"),pe(t,l,n.navSeries,n.bmkNav)}function ve(t){w=Jt(),Array.isArray(w)||(w=[]),t.innerHTML=`
    <div class="port-layout">
      <div class="mkt-panel port-holdings-panel">
        <div class="mkt-panel-label">Portfolio Holdings</div>

        <div class="port-add-form">
          <select id="port-market" class="sa-market-sel">
            ${zt.map(h=>`<option value="${h.suffix}">${h.label}</option>`).join("")}
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
  `;let s=w.reduce((h,m)=>Math.max(h,m.id??0),0)+1,l=null;const r=t.querySelector("#port-analytics"),e=t.querySelector("#port-add-btn"),n=t.querySelector("#port-analyze-btn"),a=t.querySelector("#port-add-err"),o=t.querySelector("#port-ticker"),i=t.querySelector("#port-market"),d=t.querySelector("#port-weight-inp"),c=t.querySelector("#port-holdings-body");function u(){const h=w.reduce((p,f)=>p+f.weight,0);c.innerHTML=w.length===0?'<tr><td colspan="5" class="port-empty">No holdings yet — add a ticker above.</td></tr>':w.map(p=>`
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
          <td class="num">${T.price(p.price)}</td>
          <td><button class="port-remove" data-id="${p.id}" title="Remove">×</button></td>
        </tr>`).join("");const m=t.querySelector("#port-total");m&&(m.textContent=`Total: ${h.toFixed(1)}%`,m.className=`port-total ${h>100.01?"dn":Math.abs(h-100)<.01?"up":""}`),c.querySelectorAll(".port-wt-inp").forEach(p=>{p.addEventListener("change",f=>{const v=w.find(b=>b.id===+f.target.dataset.id);v&&(v.weight=parseFloat(f.target.value)||0,tt(),u())})}),c.querySelectorAll(".port-remove").forEach(p=>{p.addEventListener("click",f=>{w=w.filter(v=>v.id!==+f.target.dataset.id),tt(),u()})})}return e.addEventListener("click",async()=>{const h=i.value,m=o.value.trim().toUpperCase();if(!m){a.textContent="Enter a ticker";return}const p=m+h;if(w.some(b=>b.symbol===p)){a.textContent="Already added";return}const f=parseFloat(d.value)||0;e.disabled=!0,a.textContent="Looking up…";const v=await te(p);if(e.disabled=!1,!v){a.textContent=`"${p}" not found`;return}w.push({id:s++,symbol:p,displaySymbol:m,name:v.name,price:v.price,weight:f}),tt(),o.value="",d.value="",a.textContent="",u()}),o.addEventListener("keydown",h=>{h.key==="Enter"&&e.click()}),n.addEventListener("click",async()=>{if(w.length<2){r.innerHTML='<div class="port-msg port-err">Add at least 2 holdings to analyze.</div>';return}l==null||l.abort(),l=new AbortController,r.innerHTML=`<div class="port-msg port-loading"><div class="sa-spinner"></div><span>Fetching 1Y data for ${w.length} holdings…</span></div>`,n.disabled=!0;const h=[...new Set([ut.symbol,...w.map(S=>S.symbol)])],m=await Promise.all(h.map(S=>Zt(S,l.signal)));n.disabled=!1;const p=new Map(h.map((S,X)=>[S,m[X]])),f=w.filter(S=>!p.get(S.symbol));if(f.length){r.innerHTML=`<div class="port-msg port-err">Could not load data for: ${f.map(S=>S.displaySymbol).join(", ")}</div>`;return}const v=p.get(ut.symbol),b=w.map(S=>p.get(S.symbol).retData),x=v?[...b,v.retData]:b,{dates:M,aligned:L}=ae(x),D=L.slice(0,w.length),A=v?L[L.length-1]:null,F=w.map(S=>S.weight/100),H=M.map((S,X)=>F.reduce((K,G,O)=>K+G*(D[O][X]??0),0)),C=le(H,A);if(!C){r.innerHTML='<div class="port-msg port-err">Insufficient data for analysis (need ≥5 aligned trading days).</div>';return}const P=w.map(S=>S.displaySymbol);he(r,D,M,P,F,C)}),u(),()=>{l==null||l.abort(),R&&(R(),R=null)}}const be=["market","stock","portfolio"],fe={market:"Markets",stock:"Stock Analysis",portfolio:"Portfolio"};let j="market",I=null;function ye(t){t.innerHTML=`
    <div class="topbar">
      <div class="topbar-left">
        <div class="logo">invest<span>.</span>dash</div>
      </div>
      <div class="topbar-center">
        <div class="tabs" id="main-tabs">
          ${be.map(e=>`
            <button class="tab ${e===j?"active":""}" data-tab="${e}">
              ${fe[e]}
            </button>`).join("")}
        </div>
      </div>
      <div class="topbar-right"></div>
    </div>

    <div class="main-content" id="tab-content"></div>
  `;const s=t.querySelector("#main-tabs"),l=t.querySelector("#tab-content");function r(e){e!==j&&(j=e,s.querySelectorAll(".tab").forEach(n=>{n.classList.toggle("active",n.dataset.tab===e)}),pt(l,e))}s.addEventListener("click",e=>{const n=e.target.closest(".tab");n&&r(n.dataset.tab)}),pt(l,j)}function pt(t,s){I&&(I(),I=null),t.innerHTML="",s==="market"?Yt(t).then(l=>{I=l??null}):s==="stock"?Gt(t).then(l=>{I=l??null}):s==="portfolio"&&(I=ve(t)??null)}ye(document.getElementById("app"));
