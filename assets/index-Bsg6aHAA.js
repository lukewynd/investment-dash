(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function l(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(e){if(e.ep)return;e.ep=!0;const a=l(e);fetch(e.href,a)}})();const ht="https://yf-proxy.lukewynd.workers.dev";function V(t){return`${ht}${t}`}function Lt(t){const n=encodeURIComponent(t);return`${ht}/v8/finance/chart/${n}?range=1y&interval=1d`}const rt=new Map,Ct=5*60*1e3;async function At(t){var l,r,e,a,s;const n=rt.get(t);if(n&&Date.now()-n.ts<Ct)return n.data;try{const o=await fetch(Lt(t),{headers:{Accept:"application/json"}});if(!o.ok)return null;const i=await o.json(),d=(r=(l=i==null?void 0:i.chart)==null?void 0:l.result)==null?void 0:r[0];if(!d)return null;const c=d.meta,u=((s=(a=(e=d.indicators)==null?void 0:e.quote)==null?void 0:a[0])==null?void 0:s.close)??[],v=c.regularMarketPrice??null,p=c.regularMarketChange??null,m=v!=null&&p!=null?v-p:null,b=m!=null&&m!==0?p/m*100:null;let f=u.length-1;for(;f>=0&&u[f]==null;)f--;const x=v??(f>=0?u[f]:null),M=C=>{let P=f-C;for(;P>=0&&u[P]==null;)P--;const S=P>=0?u[P]:null;return S!=null&&x!=null&&S!==0?(x-S)/S*100:null},L=new Date().getFullYear(),D=d.timestamp??[];let T=null;for(let C=0;C<D.length;C++)if(new Date(D[C]*1e3).getFullYear()===L&&u[C]!=null){T=u[C];break}const F=T!=null&&T!==0&&x!=null?(x-T)/T*100:null,H={symbol:t,regularMarketPrice:v,regularMarketChangePercent:b,regularMarketChange:p,quoteType:c.instrumentType??"",ytdPct:F,pct1d:b,pct1w:M(5),pct1m:M(21),pct3m:M(63),pctYtd:F};return rt.set(t,{ts:Date.now(),data:H}),H}catch{return null}}async function Tt(t){const l=new Map;for(let r=0;r<t.length;r+=8){const e=t.slice(r,r+8),a=await Promise.allSettled(e.map(s=>At(s)));e.forEach((s,o)=>{const i=a[o].status==="fulfilled"?a[o].value:null;i&&l.set(s,i)})}return l}const vt=[{symbol:"^GSPC",name:"S&P 500",type:"index"},{symbol:"^VIX",name:"VIX",type:"vix"},{symbol:"^TNX",name:"US 10Y",type:"yield"},{symbol:"DX-Y.NYB",name:"DXY",type:"index"},{symbol:"GC=F",name:"Gold",type:"commodity"},{symbol:"BTC-USD",name:"Bitcoin",type:"crypto"}],bt=[{symbol:"^GSPC",name:"S&P 500",region:"Americas"},{symbol:"^IXIC",name:"NASDAQ Comp.",region:"Americas"},{symbol:"^DJI",name:"Dow Jones",region:"Americas"},{symbol:"^RUT",name:"Russell 2000",region:"Americas"},{symbol:"^BVSP",name:"Bovespa",region:"Americas"},{symbol:"^MXX",name:"IPC Mexico",region:"Americas"},{symbol:"^FTSE",name:"FTSE 100",region:"Europe"},{symbol:"^GDAXI",name:"DAX",region:"Europe"},{symbol:"^FCHI",name:"CAC 40",region:"Europe"},{symbol:"^STOXX50E",name:"Euro Stoxx 50",region:"Europe"},{symbol:"^SSMI",name:"SMI",region:"Europe"},{symbol:"^AEX",name:"AEX",region:"Europe"},{symbol:"^N225",name:"Nikkei 225",region:"Asia-Pacific"},{symbol:"^HSI",name:"Hang Seng",region:"Asia-Pacific"},{symbol:"000001.SS",name:"Shanghai Comp.",region:"Asia-Pacific"},{symbol:"^AXJO",name:"ASX 200",region:"Asia-Pacific"},{symbol:"^KS11",name:"KOSPI",region:"Asia-Pacific"},{symbol:"^STI",name:"Straits Times",region:"Asia-Pacific"}],ft=[{symbol:"^IRX",name:"3-Month"},{symbol:"^FVX",name:"5-Year"},{symbol:"^TNX",name:"10-Year"},{symbol:"^TYX",name:"30-Year"}],et=[{code:"USD",name:"US Dollar",symbol:null,invert:!1},{code:"EUR",name:"Euro",symbol:"EURUSD=X",invert:!1},{code:"GBP",name:"Sterling",symbol:"GBPUSD=X",invert:!1},{code:"JPY",name:"Yen",symbol:"USDJPY=X",invert:!0},{code:"AUD",name:"Aus Dollar",symbol:"AUDUSD=X",invert:!1},{code:"CAD",name:"Can Dollar",symbol:"USDCAD=X",invert:!0},{code:"CHF",name:"Swiss Franc",symbol:"USDCHF=X",invert:!0}],Et=et.filter(t=>t.symbol).map(t=>t.symbol),yt=[{symbol:"GC=F",name:"Gold",unit:"/oz",group:"Metals"},{symbol:"SI=F",name:"Silver",unit:"/oz",group:"Metals"},{symbol:"HG=F",name:"Copper",unit:"/lb",group:"Metals"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl",group:"Energy"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl",group:"Energy"},{symbol:"NG=F",name:"Nat. Gas",unit:"/MMBtu",group:"Energy"},{symbol:"ZW=F",name:"Wheat",unit:"/bu",group:"Agri"},{symbol:"ZC=F",name:"Corn",unit:"/bu",group:"Agri"}],gt=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],St=[{symbol:"BTC-USD",name:"Bitcoin",abbr:"BTC"},{symbol:"ETH-USD",name:"Ethereum",abbr:"ETH"},{symbol:"SOL-USD",name:"Solana",abbr:"SOL"},{symbol:"XRP-USD",name:"XRP",abbr:"XRP"}],Dt=[...new Set([...vt.map(t=>t.symbol),...bt.map(t=>t.symbol),...ft.map(t=>t.symbol),...Et,...yt.map(t=>t.symbol),...gt.map(t=>t.symbol),...St.map(t=>t.symbol)])];function at(t,n=2){return t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:n,maximumFractionDigits:n})}function Y(t){if(t==null)return{text:"—",cls:""};const n=t>=0?"+":"",l=t>=0?"up":"dn",r=Math.abs(t)>=3?" strong":"";return{text:`${n}${t.toFixed(2)}%`,cls:l+r}}function Ft(t){if(t==null)return{text:"—",cls:""};const n=Math.round(t*100),l=n>=0?"+":"",r=n>=0?"up":"dn";return{text:`${l}${n}bps`,cls:r}}function E(t){const n=Y(t);return`<td class="num pct-cell ${n.cls}">${n.text}</td>`}function N(t,n=7){return Array.from({length:t},()=>`<tr>${Array.from({length:n},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function Pt(t){return vt.map(({symbol:n,name:l,type:r})=>{const e=t.get(n),a=e==null?void 0:e.regularMarketPrice,s=Y((e==null?void 0:e.pct1d)??null),o=Y((e==null?void 0:e.pctYtd)??null);let i="—";return a!=null&&(r==="yield"?i=a.toFixed(2)+"%":r==="crypto"?i="$"+a.toLocaleString("en-US",{maximumFractionDigits:0}):r==="commodity"?i="$"+at(a):i=at(a)),`
      <div class="mkt-stat-card">
        <div class="mkt-stat-name">${l}</div>
        <div class="mkt-stat-price">${i}</div>
        <div class="mkt-stat-chg ${s.cls}">${s.text}</div>
        <div class="mkt-stat-ytd ${o.cls}">${o.text} YTD</div>
      </div>`}).join("")}function Ht(t){const n=["Americas","Europe","Asia-Pacific"];let l="";return n.forEach(r=>{const e=bt.filter(a=>a.region===r);l+=`<tr class="mkt-region-sep"><td colspan="7">${r}</td></tr>`,l+=e.map(({symbol:a,name:s})=>{const o=t.get(a),i=o==null?void 0:o.regularMarketPrice,d=i!=null?i.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";return`<tr>
        <td class="mkt-name">${s}</td>
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
    </div>`}function Ut(t){const n=ft.map(({symbol:e,name:a})=>{const s=t.get(e),o=(s==null?void 0:s.regularMarketPrice)??null,i=(s==null?void 0:s.regularMarketChange)??null;return{name:a,yld:o,chg:i}}),l=Math.max(.01,...n.map(e=>e.yld??0));return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">US Treasuries</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Tenor</th>
          <th class="num">Yield</th>
          <th></th>
          <th class="num">1D Chg</th>
        </tr></thead>
        <tbody>${n.map(({name:e,yld:a,chg:s})=>{const o=Ft(s),i=a!=null?a.toFixed(2)+"%":"—",d=a!=null?a/l*100:0;return`<tr>
      <td class="mkt-name">${e}</td>
      <td class="num mono">${i}</td>
      <td class="yc-bar-cell"><span class="yc-bar" style="width:${d.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${o.cls}">${o.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Xt(t){const n={USD:1};et.forEach(({code:s,symbol:o,invert:i})=>{var c;if(!o)return;const d=(c=t.get(o))==null?void 0:c.regularMarketPrice;d!=null&&(n[s]=i?1/d:d)});const l=s=>s==null?"—":s>=100?s.toFixed(2):s>=10?s.toFixed(3):s.toFixed(4),r=et.map(s=>s.code),e=r.map(s=>`<th class="num fx-col-hdr">${s}</th>`).join(""),a=r.map(s=>{const o=r.map(i=>{if(s===i)return'<td class="fx-diag">—</td>';const d=n[s],c=n[i],u=d!=null&&c!=null&&c!==0?d/c:null;return`<td class="num fx-cell">${l(u)}</td>`}).join("");return`<tr><th class="fx-row-hdr">${s}</th>${o}</tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Cross Rates <span class="mkt-panel-sub">1 row = X column</span></div>
      <div class="fx-matrix-wrap">
        <table class="fx-matrix">
          <thead><tr><th></th>${e}</tr></thead>
          <tbody>${a}</tbody>
        </table>
      </div>
    </div>`}function Bt(t){const n=["Metals","Energy","Agri"];let l="";return n.forEach(r=>{const e=yt.filter(a=>a.group===r);l+=`<tr class="mkt-region-sep"><td colspan="7">${r}</td></tr>`,l+=e.map(({symbol:a,name:s,unit:o})=>{const i=t.get(a),d=i==null?void 0:i.regularMarketPrice,c=d!=null?"$"+at(d):"—";return`<tr>
        <td class="mkt-name">${s}<span class="mkt-unit">${o}</span></td>
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
    </div>`}function Rt(t){const n=gt.map(({symbol:e,name:a})=>{const s=t.get(e);return{name:a,pct1d:(s==null?void 0:s.pct1d)??null,pct1m:(s==null?void 0:s.pct1m)??null,pctYtd:(s==null?void 0:s.pctYtd)??null}});n.sort((e,a)=>(a.pct1d??-999)-(e.pct1d??-999));const l=Math.max(.01,...n.map(e=>Math.abs(e.pct1d??0)));return`
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
        <tbody>${n.map(({name:e,pct1d:a,pct1m:s,pctYtd:o})=>{const i=Y(a),d=Y(s),c=Y(o),u=a!=null?Math.abs(a)/l*100:0;return`<tr>
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
        <tbody>${St.map(({symbol:l,name:r,abbr:e})=>{const a=t.get(l),s=a==null?void 0:a.regularMarketPrice,o=s!=null?"$"+s.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:s>=100?2:4}):"—";return`<tr>
      <td class="mkt-name">${r} <span class="mkt-abbr">${e}</span></td>
      <td class="num mono">${o}</td>
      ${E(a==null?void 0:a.pct1d)}
      ${E(a==null?void 0:a.pct1w)}
      ${E(a==null?void 0:a.pct1m)}
      ${E(a==null?void 0:a.pctYtd)}
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
  `;const n=t.querySelector("#mkt-refresh");async function l(){const e=t.querySelector("#mkt-timestamp");e.textContent="Loading…";const a=await Tt(Dt);if(!t.isConnected)return;t.querySelector("#mkt-stats").innerHTML=Pt(a),t.querySelector("#mkt-equities").innerHTML=Ht(a),t.querySelector("#mkt-bonds").innerHTML=Ut(a),t.querySelector("#mkt-fx").innerHTML=Xt(a),t.querySelector("#mkt-commodities").innerHTML=Bt(a),t.querySelector("#mkt-sectors").innerHTML=Rt(a),t.querySelector("#mkt-crypto").innerHTML=It(a);const s=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});e.textContent=`Updated ${s}`}n.addEventListener("click",l),await l();const r=setInterval(l,30*60*1e3);return()=>clearInterval(r)}const Nt="modulepreload",Ot=function(t){return"/investment-dash/"+t},lt={},kt=function(n,l,r){let e=Promise.resolve();if(l&&l.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),o=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));e=Promise.allSettled(l.map(i=>{if(i=Ot(i),i in lt)return;lt[i]=!0;const d=i.endsWith(".css"),c=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${c}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":Nt,d||(u.as="script"),u.crossOrigin="",u.href=i,o&&u.setAttribute("nonce",o),document.head.appendChild(u),d)return new Promise((v,p)=>{u.addEventListener("load",v),u.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${i}`)))})}))}function a(s){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=s,window.dispatchEvent(o),!o.defaultPrevented)throw s}return e.then(s=>{for(const o of s||[])o.status==="rejected"&&a(o.reason);return n().catch(a)})},J=[{label:"US (NYSE / NASDAQ)",suffix:"",example:"AAPL"},{label:"Australia (ASX)",suffix:".AX",example:"CBA.AX"},{label:"UK (LSE)",suffix:".L",example:"HSBA.L"},{label:"Canada (TSX)",suffix:".TO",example:"RY.TO"},{label:"Germany (XETRA)",suffix:".DE",example:"SAP.DE"},{label:"Japan (TSE)",suffix:".T",example:"7203.T"},{label:"Hong Kong (HKEX)",suffix:".HK",example:"0700.HK"}],Q=[{label:"1W",range:"5d",interval:"1d"},{label:"1M",range:"1mo",interval:"1d"},{label:"3M",range:"3mo",interval:"1d"},{label:"6M",range:"6mo",interval:"1d"},{label:"1Y",range:"1y",interval:"1d"},{label:"2Y",range:"2y",interval:"1wk"},{label:"5Y",range:"5y",interval:"1wk"},{label:"MAX",range:"max",interval:"1mo"}],qt={ma20:{period:20,color:"#fbbf24",label:"MA 20"},ma50:{period:50,color:"#60a5fa",label:"MA 50"},ma200:{period:200,color:"#f87171",label:"MA 200"}};function $t(t,n){const l=[];for(let r=n-1;r<t.length;r++){const e=t.slice(r-n+1,r+1).reduce((a,s)=>a+s.close,0);l.push({time:t[r].time,value:+(e/n).toFixed(4)})}return l}function Wt(t,n=20,l=2){const r=$t(t,n),e=[],a=[];for(let s=0;s<r.length;s++){const o=s+n-1,i=t.slice(o-n+1,o+1).map(u=>u.close),d=r[s].value,c=Math.sqrt(i.reduce((u,v)=>u+(v-d)**2,0)/n);e.push({time:r[s].time,value:+(d+l*c).toFixed(4)}),a.push({time:r[s].time,value:+(d-l*c).toFixed(4)})}return{upper:e,mid:r,lower:a}}const ot=new Map,it=new Map,wt=5*60*1e3;function jt(t){const n=new Date(t*1e3);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`}async function ct(t,n,l){var m,b;const r=`${t}:${n}:${l}`,e=ot.get(r);if(e&&Date.now()-e.ts<wt)return e.data;const a=`/v8/finance/chart/${encodeURIComponent(t)}?range=${n}&interval=${l}&includePrePost=false`,s=await fetch(V(a),{headers:{Accept:"application/json"}});if(!s.ok)throw new Error(`HTTP ${s.status}`);const o=await s.json(),i=(b=(m=o==null?void 0:o.chart)==null?void 0:m.result)==null?void 0:b[0];if(!i)throw new Error("Symbol not found");const d=i.timestamp??[],c=i.indicators.quote[0],u=[],v=[];for(let h=0;h<d.length;h++){if(c.open[h]==null||c.close[h]==null)continue;const f=jt(d[h]);u.push({time:f,open:+c.open[h].toFixed(4),high:+c.high[h].toFixed(4),low:+c.low[h].toFixed(4),close:+c.close[h].toFixed(4)}),v.push({time:f,value:c.volume[h]??0,color:c.close[h]>=c.open[h]?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"})}const p={candles:u,volumes:v,meta:i.meta};return ot.set(r,{ts:Date.now(),data:p}),p}async function _t(t){var o,i;const n=it.get(t);if(n&&Date.now()-n.ts<wt)return n.data;const r=`/v10/finance/quoteSummary/${encodeURIComponent(t)}?modules=price,summaryDetail,defaultKeyStatistics,financialData,assetProfile`,e=await fetch(V(r),{headers:{Accept:"application/json"}});if(!e.ok)return null;const a=await e.json(),s=((i=(o=a==null?void 0:a.quoteSummary)==null?void 0:o.result)==null?void 0:i[0])??null;return s&&it.set(t,{ts:Date.now(),data:s}),s}const U=(t,n={})=>t==null?"—":t.toLocaleString("en-US",n),q=t=>t==null?"—":`${t>=0?"+":""}${(t*100).toFixed(2)}%`,Z=t=>t==null?"—":t>=1e12?`$${(t/1e12).toFixed(2)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString()}`;function Vt(t,n){var c,u,v,p,m,b,h,f,x,M,L,D,T,F,H;if(!n){t.innerHTML='<div class="sa-no-data">Fundamental data unavailable.</div>';return}const l=n.price??{},r=n.summaryDetail??{},e=n.defaultKeyStatistics??{},a=n.financialData??{},s=n.assetProfile??{},i=[["Market Cap",Z((c=l.marketCap)==null?void 0:c.raw)],["P/E (TTM)",U((u=r.trailingPE)==null?void 0:u.raw,{maximumFractionDigits:1})],["Fwd P/E",U((v=r.forwardPE)==null?void 0:v.raw,{maximumFractionDigits:1})],["EPS (TTM)",((p=e.trailingEps)==null?void 0:p.raw)!=null?`$${e.trailingEps.raw.toFixed(2)}`:"—"],["52W High",U((m=r.fiftyTwoWeekHigh)==null?void 0:m.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["52W Low",U((b=r.fiftyTwoWeekLow)==null?void 0:b.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["Div Yield",q((h=r.dividendYield)==null?void 0:h.raw)],["Beta",U((f=r.beta)==null?void 0:f.raw,{maximumFractionDigits:2})],["Revenue TTM",Z((x=a.totalRevenue)==null?void 0:x.raw)],["Gross Margin",q((M=a.grossMargins)==null?void 0:M.raw)],["Op Margin",q((L=a.operatingMargins)==null?void 0:L.raw)],["ROE",q((D=a.returnOnEquity)==null?void 0:D.raw)],["P/B Ratio",U((T=e.priceToBook)==null?void 0:T.raw,{maximumFractionDigits:2})],["Avg Volume",U((F=r.averageVolume)==null?void 0:F.raw)],["Employees",U(s.fullTimeEmployees)],["Free Cash Flow",Z((H=a.freeCashflow)==null?void 0:H.raw)]].map(([C,P])=>`
    <div class="sa-fund-card">
      <div class="sa-fund-label">${C}</div>
      <div class="sa-fund-val">${P}</div>
    </div>`).join(""),d=[s.sector,s.industry].filter(Boolean).map(C=>`<span class="sa-badge">${C}</span>`).join("");t.innerHTML=`
    <div class="sa-section-label">Key Metrics</div>
    <div class="sa-fund-grid">${i}</div>
    ${s.longBusinessSummary?`
      <div class="sa-about">
        <div class="sa-section-label">About ${d}</div>
        <p class="sa-about-text">${s.longBusinessSummary}</p>
      </div>`:""}
  `}function Kt(t,n,l){var c,u,v;const r=(l==null?void 0:l.price)??{},e=r.longName||r.shortName||(n==null?void 0:n.symbol)||"",a=((c=r.regularMarketPrice)==null?void 0:c.raw)??(n==null?void 0:n.regularMarketPrice)??0,s=(((u=r.regularMarketChangePercent)==null?void 0:u.raw)??0)*100,o=((v=r.regularMarketChange)==null?void 0:v.raw)??0,i=r.exchangeName||(n==null?void 0:n.exchangeName)||"",d=s>=0;t.innerHTML=`
    <div class="sa-hdr-left">
      <div class="sa-hdr-name">${e} <span class="sa-hdr-sym">${(n==null?void 0:n.symbol)??""}</span></div>
      <div class="sa-hdr-exch">${i}</div>
    </div>
    <div class="sa-hdr-right">
      <div class="sa-hdr-price">${a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div class="sa-hdr-chg ${d?"up":"dn"}">${d?"+":""}${o.toFixed(2)} (${d?"+":""}${s.toFixed(2)}%)</div>
    </div>
  `}let _=null;async function dt(){return _||(_=await kt(()=>import("./lightweight-charts.production-C-4kb1nc.js"),[])),_}async function Gt(t){const n=J.map((y,g)=>`<option value="${g}">${y.label}</option>`).join(""),l=Q.map((y,g)=>`<button class="sa-range-btn${g===4?" active":""}" data-ri="${g}">${y.label}</button>`).join("");t.innerHTML=`
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
  `;let r=null,e={},a=[],s=!1,o=new Set(["vol"]),i="candle",d=[],c=[],u=4,v=null,p=null;const m=t.querySelector("#sa-ph"),b=t.querySelector("#sa-main"),h=t.querySelector("#sa-hdr"),f=t.querySelector("#sa-chart"),x=t.querySelector("#sa-overlay"),M=t.querySelector("#sa-tt"),L=t.querySelector("#sa-annot-list"),D=t.querySelector("#sa-funds"),T=t.querySelector("#sa-mkt"),F=t.querySelector("#sa-ticker"),H=t.querySelector("#sa-go"),C=t.querySelector("#sa-annot-btn");async function P(){if(r)return;const{createChart:y,CrosshairMode:g}=await dt();r=y(f,{width:f.clientWidth||900,height:480,layout:{background:{color:"#0b0d14"},textColor:"#8892a4",fontSize:11,fontFamily:"'DM Mono', monospace"},grid:{vertLines:{color:"#1a1d26"},horzLines:{color:"#1a1d26"}},crosshair:{mode:g.Normal},rightPriceScale:{borderColor:"#2a2d3e"},timeScale:{borderColor:"#2a2d3e",timeVisible:!0,secondsVisible:!1}}),p=new ResizeObserver(()=>{r&&f.clientWidth&&r.resize(f.clientWidth,480)}),p.observe(f),r.subscribeCrosshairMove($=>{var nt;if(!$.time||!$.point||!e.main){M.style.display="none";return}const k=$.seriesData.get(e.main);if(!k){M.style.display="none";return}const z="open"in k?`O <b>${k.open}</b>  H <b>${k.high}</b>  L <b>${k.low}</b>  C <b>${k.close}</b>`:`<b>${(nt=k.value)==null?void 0:nt.toFixed(4)}</b>`,st=$.seriesData.get(e.vol),Mt=st?`  Vol <b>${U(st.value)}</b>`:"";M.innerHTML=`<span class="sa-tt-date">${$.time}</span>  ${z}${Mt}`,M.style.display="block"}),r.subscribeClick($=>{if(!s||!$.point||!e.main)return;const k=e.main.coordinateToPrice($.point.y);if(k==null)return;const{LineStyle:B}=_,z=e.main.createPriceLine({price:k,color:"#7c6af7",lineWidth:1,lineStyle:B.Dashed,axisLabelVisible:!0,title:k.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})});a.push({pl:z,price:k}),X()})}async function S(){const{LineStyle:y}=await dt();Object.values(e).forEach(g=>{try{r.removeSeries(g)}catch{}}),e={},a=[],X(),o.has("vol")&&(e.vol=r.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"vol"}),r.priceScale("vol").applyOptions({scaleMargins:{top:.82,bottom:0}}),e.vol.setData(c)),r.priceScale("right").applyOptions({scaleMargins:{top:.06,bottom:o.has("vol")?.22:.04}}),i==="candle"?(e.main=r.addCandlestickSeries({upColor:"#34d399",downColor:"#f87171",borderVisible:!1,wickUpColor:"#34d399",wickDownColor:"#f87171"}),e.main.setData(d)):(e.main=r.addLineSeries({color:"#7c6af7",lineWidth:2}),e.main.setData(d.map(g=>({time:g.time,value:g.close}))));for(const[g,$]of Object.entries(qt))!o.has(g)||d.length<$.period||(e[g]=r.addLineSeries({color:$.color,lineWidth:1,title:$.label}),e[g].setData($t(d,$.period)));if(o.has("bb")&&d.length>=20){const{upper:g,mid:$,lower:k}=Wt(d);e.bbU=r.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:y.Dashed}),e.bbM=r.addLineSeries({color:"rgba(124,106,247,0.4)",lineWidth:1}),e.bbL=r.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:y.Dashed}),e.bbU.setData(g),e.bbM.setData($),e.bbL.setData(k)}r.timeScale().fitContent()}function X(){if(!a.length){L.innerHTML="";return}L.innerHTML=`
      <div class="sa-annot-wrap">
        <span class="sa-section-label">Price Levels</span>
        <div class="sa-annot-pills">
          ${a.map((y,g)=>`
            <span class="sa-annot-pill">
              ${y.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              <button class="sa-annot-x" data-i="${g}">×</button>
            </span>`).join("")}
        </div>
      </div>`,L.querySelectorAll(".sa-annot-x").forEach(y=>{y.addEventListener("click",()=>{const g=+y.dataset.i;try{e.main.removePriceLine(a[g].pl)}catch{}a.splice(g,1),X()})})}async function K(y){v=y;const{range:g,interval:$}=Q[u];x.style.display="flex",m.style.display="none",b.style.display="block",h.innerHTML=`<div class="sa-hdr-loading">Loading ${y}…</div>`,D.innerHTML="";try{await P();const[k,B]=await Promise.all([ct(y,g,$),_t(y)]);d=k.candles,c=k.volumes,Kt(h,k.meta,B),await S(),Vt(D,B)}catch{h.innerHTML=`<div class="sa-error">Symbol <b>${y}</b> not found or no data available.</div>`,D.innerHTML=""}finally{x.style.display="none"}}async function G(y){if(!v)return;u=y,t.querySelectorAll(".sa-range-btn").forEach((k,B)=>k.classList.toggle("active",B===y));const{range:g,interval:$}=Q[y];x.style.display="flex";try{const k=await ct(v,g,$);d=k.candles,c=k.volumes,await S()}finally{x.style.display="none"}}t.querySelectorAll(".sa-range-btn").forEach((y,g)=>y.addEventListener("click",()=>G(g))),T.addEventListener("change",()=>{F.placeholder=`Ticker (e.g. ${J[+T.value].example})`});async function O(){const y=F.value.trim().toUpperCase(),g=J[+T.value];if(!y)return;const $=g.suffix&&!y.endsWith(g.suffix)?`${y}${g.suffix}`:y;await K($)}return H.addEventListener("click",O),F.addEventListener("keydown",y=>{y.key==="Enter"&&O()}),t.querySelectorAll("[data-type]").forEach(y=>y.addEventListener("click",async()=>{i=y.dataset.type,t.querySelectorAll("[data-type]").forEach(g=>g.classList.remove("active")),y.classList.add("active"),d.length&&await S()})),t.querySelectorAll("[data-ind]").forEach(y=>y.addEventListener("click",async()=>{const g=y.dataset.ind;o.has(g)?o.delete(g):o.add(g),y.classList.toggle("active",o.has(g)),d.length&&await S()})),C.addEventListener("click",()=>{s=!s,C.classList.toggle("active",s),t.querySelector("#sa-chart-wrap").classList.toggle("sa-annotating",s)}),()=>{p==null||p.disconnect(),r&&(r.remove(),r=null),e={},a=[]}}const xt="portv1",ut={symbol:"^GSPC"},zt=[{label:"US",suffix:""},{label:"ASX",suffix:".AX"},{label:"LSE",suffix:".L"},{label:"TSX",suffix:".TO"},{label:"XETRA",suffix:".DE"},{label:"TSE",suffix:".T"},{label:"HKEX",suffix:".HK"}];let w=[],W=63,R=null;function tt(){try{localStorage.setItem(xt,JSON.stringify(w))}catch{}}function Jt(){try{return JSON.parse(localStorage.getItem(xt)??"[]")}catch{return[]}}const mt=new Map,Qt=10*60*1e3;async function Zt(t,n){var r,e,a,s,o;const l=mt.get(t);if(l&&Date.now()-l.ts<Qt)return l.data;try{const i=`/v8/finance/chart/${encodeURIComponent(t)}?range=1y&interval=1d`,d=await fetch(V(i),{headers:{Accept:"application/json"},signal:n});if(!d.ok)return null;const c=await d.json(),u=(e=(r=c==null?void 0:c.chart)==null?void 0:r.result)==null?void 0:e[0];if(!u)return null;const v=u.timestamp??[],p=((o=(s=(a=u.indicators)==null?void 0:a.quote)==null?void 0:s[0])==null?void 0:o.close)??[],m=u.meta,b=[];for(let f=1;f<v.length;f++)p[f]!=null&&p[f-1]!=null&&p[f-1]!==0&&b.push({date:v[f],ret:(p[f]-p[f-1])/p[f-1]});const h={symbol:t,name:m.longName||m.shortName||t,price:m.regularMarketPrice,retData:b};return mt.set(t,{ts:Date.now(),data:h}),h}catch{return null}}async function te(t){var n,l,r,e;try{const a=`/v8/finance/chart/${encodeURIComponent(t)}?range=1d&interval=1d`,s=await fetch(V(a),{headers:{Accept:"application/json"}});if(!s.ok)return null;const o=(e=(r=(l=(n=await s.json())==null?void 0:n.chart)==null?void 0:l.result)==null?void 0:r[0])==null?void 0:e.meta;return o?{name:o.longName||o.shortName||t,price:o.regularMarketPrice}:null}catch{return null}}function ee(t){const n=t.map(e=>new Set(e.map(a=>a.date))),l=[...n[0]].filter(e=>n.every(a=>a.has(e))).sort((e,a)=>e-a),r=t.map(e=>{const a=new Map(e.map(s=>[s.date,s.ret]));return l.map(s=>a.get(s)??0)});return{dates:l,aligned:r}}function ae(t,n){var i;const l=t.length,r=((i=t[0])==null?void 0:i.length)??0;if(r<10||l<1)return null;const e=Math.exp(-Math.LN2/n),a=Array.from({length:l},()=>new Array(l).fill(0));let s=0,o=1;for(let d=r-1;d>=0;d--){for(let c=0;c<l;c++)for(let u=0;u<l;u++)a[c][u]+=o*t[c][d]*t[u][d];s+=o,o*=e}for(let d=0;d<l;d++)for(let c=0;c<l;c++)a[d][c]=a[d][c]/s*252;return a}function se(t){const n=t.length;return Array.from({length:n},(l,r)=>Array.from({length:n},(e,a)=>{const s=Math.sqrt(t[r][r]*t[a][a]);return s>0?t[r][a]/s:r===a?1:0}))}function ne(t,n){t.length;const l=t.map((c,u)=>t.reduce((v,p,m)=>v+n[u][m]*p,0)),r=t.reduce((c,u,v)=>c+u*l[v],0),e=Math.sqrt(Math.max(0,r)),a=t.map((c,u)=>e>0?c*l[u]/e:0),s=a.map(c=>e>0?c/e:0),o=n.map((c,u)=>Math.sqrt(Math.max(0,n[u][u]))),i=t.reduce((c,u,v)=>c+u*o[v],0),d=e>0?i/e:1;return{portVol:e,RC:a,pctRC:s,indivVols:o,divRatio:d}}function re(t,n){const l=t.length;if(l<5)return null;let r=1,e=1,a=0;const s=[],o=[];for(const h of t){r*=1+h,s.push(r),r>e&&(e=r);const f=r/e-1;o.push(f),-f>a&&(a=-f)}const i=Math.pow(Math.max(r,1e-9),252/l)-1,d=t.reduce((h,f)=>h+f,0)/l,c=Math.sqrt(t.reduce((h,f)=>h+(f-d)**2,0)/(l-1)*252),u=c>0?(i-.04)/c:null,v=a>0?i/a:null;let p=null;if((n==null?void 0:n.length)===l){const h=n.reduce((M,L)=>M+L,0)/l;let f=0,x=0;t.forEach((M,L)=>{f+=(M-d)*(n[L]-h),x+=(n[L]-h)**2}),p=x>0?f/x:null}let m=1;const b=(n==null?void 0:n.map(h=>(m*=1+h,m)))??[];return{annRet:i,vol:c,sharpe:u,beta:p,maxDD:a,calmar:v,navSeries:s,ddSeries:o,bmkNav:b}}const A={pct:(t,n=2)=>t==null||isNaN(t)?"—":`${t>=0?"+":""}${(t*100).toFixed(n)}%`,num:(t,n=2)=>t==null||isNaN(t)?"—":t.toFixed(n),price:t=>t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),cls:t=>t==null||isNaN(t)?"":t>=0?"up":"dn"};function le(t){if(t==null||isNaN(t))return"transparent";const n=Math.max(-1,Math.min(1,t)),l=(Math.abs(n)*.65+.08).toFixed(2);return n>=0?`rgba(248,113,113,${l})`:`rgba(52,211,153,${l})`}function oe(t){return`<div class="port-metrics-strip">
    ${[["Ann. Return",A.pct(t.annRet),A.cls(t.annRet)],["Ann. Vol",A.pct(t.vol),""],["Sharpe",A.num(t.sharpe),A.cls(t.sharpe)],["Beta (SPX)",A.num(t.beta),""],["Max Drawdown",A.pct(-t.maxDD),"dn"],["Calmar",A.num(t.calmar),A.cls(t.calmar)]].map(([l,r,e])=>`
      <div class="port-metric-card">
        <div class="port-metric-label">${l}</div>
        <div class="port-metric-val ${e}">${r}</div>
      </div>`).join("")}
  </div>`}function ie(t,n,l){const{portVol:r,pctRC:e,indivVols:a,divRatio:s}=ne(n,l),o=Math.max(1e-9,...e.map(Math.abs)),i=t.map((d,c)=>`
    <div class="port-risk-row">
      <div class="port-risk-lbl">${d}</div>
      <div class="port-risk-bar-wrap">
        <div class="port-risk-bar" style="width:${(Math.abs(e[c])/o*100).toFixed(1)}%"></div>
      </div>
      <div class="port-risk-pct">${(e[c]*100).toFixed(1)}%</div>
      <div class="port-risk-vol">${(a[c]*100).toFixed(1)}% vol</div>
    </div>`).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Risk Contribution</div>
      <div class="port-risk-meta">
        Portfolio Vol <strong>${(r*100).toFixed(2)}%</strong>
        &nbsp;·&nbsp; Div. Ratio <strong>${s.toFixed(2)}×</strong>
      </div>
      <div class="port-risk-rows">${i}</div>
    </div>`}function ce(t,n,l){const r=n.reduce((a,s,o)=>a+s*n.reduce((i,d,c)=>i+d*l[o][c],0),0);return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Volatility & Contribution Beta</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Ann. Vol</th><th class="num">β → Port</th>
        </tr></thead>
        <tbody>${t.map((a,s)=>{const o=Math.sqrt(Math.max(0,l[s][s])),i=n.reduce((c,u,v)=>c+u*l[s][v],0),d=r>0?i/r:null;return`<tr>
      <td class="mkt-name">${a}</td>
      <td class="num">${(n[s]*100).toFixed(1)}%</td>
      <td class="num">${(o*100).toFixed(1)}%</td>
      <td class="num">${A.num(d)}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function de(t,n,l){const r=se(n),e=t.map(s=>`<th class="corr-col-hdr">${s}</th>`).join(""),a=t.map((s,o)=>`<tr><th class="corr-row-hdr">${s}</th>${t.map((i,d)=>{const c=r[o][d],u=o===d;return`<td class="corr-cell${u?" corr-diag":""}"
        style="background:${u?"var(--bg-base)":le(c)}">${u?"—":c.toFixed(2)}</td>`}).join("")}</tr>`).join("");return`
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
          <tbody>${a}</tbody>
        </table>
      </div>
    </div>`}function ue(t,n,l,r,e){const a=r.length,s={"1d":1,"1w":5,"1m":21,"3m":63};let o;if(e==="ytd"){const p=new Date().getFullYear();o=r.findIndex(m=>new Date(m*1e3).getFullYear()===p),o<0&&(o=0)}else o=Math.max(0,a-(s[e]??1));const i=l.map(p=>p.slice(o).reduce((m,b)=>m*(1+b),1)-1),d=i.reduce((p,m,b)=>p+n[b]*m,0),c=Math.max(1e-9,...i.map(p=>Math.abs(p))),u=["1d","1w","1m","3m","ytd"].map(p=>`<button class="port-period-btn${p===e?" active":""}" data-period="${p}">${p.toUpperCase()}</button>`).join(""),v=t.map((p,m)=>{const b=i[m],h=n[m]*b,f=(Math.abs(b)/c*100).toFixed(1);return`<tr>
      <td class="mkt-name">${p}</td>
      <td class="num">${(n[m]*100).toFixed(1)}%</td>
      <td class="num ${A.cls(b)}">${A.pct(b)}</td>
      <td class="num ${A.cls(h)}">${A.pct(h)}</td>
      <td class="port-attr-bar-cell">
        <span class="port-attr-bar ${b>=0?"up":"dn"}" style="width:${f}%"></span>
      </td>
    </tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="port-attr-hdr">
        <span class="mkt-panel-label" style="border:none;padding:10px 14px 8px">Return Attribution</span>
        <div class="port-attr-periods" id="port-attr-periods">${u}</div>
      </div>
      <div class="port-attr-summary">
        Portfolio return: <strong class="${A.cls(d)}">${A.pct(d)}</strong>
      </div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Return</th><th class="num">Contribution</th><th></th>
        </tr></thead>
        <tbody>${v}</tbody>
      </table>
    </div>`}async function me(t,n,l,r){var p;const e=t.querySelector("#port-chart-wrap");if(!e)return;R&&(R(),R=null);const{createChart:a}=await kt(async()=>{const{createChart:m}=await import("./lightweight-charts.production-C-4kb1nc.js");return{createChart:m}},[]);e.innerHTML="";const s=document.createElement("div");s.style.height="280px",e.appendChild(s);const o=a(s,{layout:{background:{color:"transparent"},textColor:"#6b7280"},grid:{vertLines:{color:"#22253a"},horzLines:{color:"#22253a"}},rightPriceScale:{borderColor:"#22253a"},timeScale:{borderColor:"#22253a"}}),i=m=>{const b=new Date(m*1e3);return`${b.getFullYear()}-${String(b.getMonth()+1).padStart(2,"0")}-${String(b.getDate()).padStart(2,"0")}`},d=o.addLineSeries({color:"#7c6af7",lineWidth:2,title:"Portfolio"}),c=o.addLineSeries({color:"#4b5563",lineWidth:1,lineStyle:2,title:"S&P 500"});function u(m){if(m==="cumret")d.setData(n.map((b,h)=>({time:i(b),value:+((l[h]-1)*100).toFixed(3)}))),c.setData(n.map((b,h)=>({time:i(b),value:+((r[h]-1)*100).toFixed(3)})));else{let b=1;d.setData(n.map((h,f)=>(l[f]>b&&(b=l[f]),{time:i(h),value:+((l[f]/b-1)*100).toFixed(3)}))),c.setData([])}o.timeScale().fitContent()}u("cumret"),(p=t.querySelector("#port-chart-toggle"))==null||p.querySelectorAll("[data-mode]").forEach(m=>{m.addEventListener("click",()=>{t.querySelectorAll("#port-chart-toggle [data-mode]").forEach(b=>b.classList.toggle("active",b===m)),u(m.dataset.mode)})});const v=new ResizeObserver(()=>o.resize(s.offsetWidth,280));v.observe(s),R=()=>{v.disconnect(),o.remove()}}function pe(t,n,l,r,e,a){t.innerHTML=`
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
  `,t.querySelector("#port-metrics-strip").innerHTML=oe(a);function s(d){const c=ae(n,d);c&&(t.querySelector("#port-risk-panel").innerHTML=ie(r,e,c),t.querySelector("#port-vol-panel").innerHTML=ce(r,e,c),t.querySelector("#port-corr-panel").innerHTML=de(r,c,d),o())}function o(){const d=t.querySelector("#port-hl-slider"),c=t.querySelector("#port-hl-val");d&&d.addEventListener("input",()=>{W=+d.value,c&&(c.textContent=`${W}d`),s(W)})}function i(d="1d"){var c;t.querySelector("#port-attr-panel").innerHTML=ue(r,e,n,l,d),(c=t.querySelector("#port-attr-periods"))==null||c.querySelectorAll(".port-period-btn").forEach(u=>{u.addEventListener("click",()=>i(u.dataset.period))})}s(W),i("1d"),me(t,l,a.navSeries,a.bmkNav)}function he(t){w=Jt(),Array.isArray(w)||(w=[]),t.innerHTML=`
    <div class="port-layout">
      <div class="mkt-panel port-holdings-panel">
        <div class="mkt-panel-label">Portfolio Holdings</div>

        <div class="port-add-form">
          <select id="port-market" class="sa-market-sel">
            ${zt.map(v=>`<option value="${v.suffix}">${v.label}</option>`).join("")}
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
  `;let n=w.reduce((v,p)=>Math.max(v,p.id??0),0)+1,l=null;const r=t.querySelector("#port-analytics"),e=t.querySelector("#port-add-btn"),a=t.querySelector("#port-analyze-btn"),s=t.querySelector("#port-add-err"),o=t.querySelector("#port-ticker"),i=t.querySelector("#port-market"),d=t.querySelector("#port-weight-inp"),c=t.querySelector("#port-holdings-body");function u(){const v=w.reduce((m,b)=>m+b.weight,0);c.innerHTML=w.length===0?'<tr><td colspan="5" class="port-empty">No holdings yet — add a ticker above.</td></tr>':w.map(m=>`
        <tr>
          <td class="mkt-name mono">${m.displaySymbol}</td>
          <td class="port-name-cell">${m.name}</td>
          <td>
            <div class="port-wt-cell">
              <input type="number" class="port-wt-inp" data-id="${m.id}"
                value="${m.weight}" min="0" max="100" step="0.5">
              <span class="port-weight-pct">%</span>
            </div>
          </td>
          <td class="num">${A.price(m.price)}</td>
          <td><button class="port-remove" data-id="${m.id}" title="Remove">×</button></td>
        </tr>`).join("");const p=t.querySelector("#port-total");p&&(p.textContent=`Total: ${v.toFixed(1)}%`,p.className=`port-total ${v>100.01?"dn":Math.abs(v-100)<.01?"up":""}`),c.querySelectorAll(".port-wt-inp").forEach(m=>{m.addEventListener("change",b=>{const h=w.find(f=>f.id===+b.target.dataset.id);h&&(h.weight=parseFloat(b.target.value)||0,tt(),u())})}),c.querySelectorAll(".port-remove").forEach(m=>{m.addEventListener("click",b=>{w=w.filter(h=>h.id!==+b.target.dataset.id),tt(),u()})})}return e.addEventListener("click",async()=>{const v=i.value,p=o.value.trim().toUpperCase();if(!p){s.textContent="Enter a ticker";return}const m=p+v;if(w.some(f=>f.symbol===m)){s.textContent="Already added";return}const b=parseFloat(d.value)||0;e.disabled=!0,s.textContent="Looking up…";const h=await te(m);if(e.disabled=!1,!h){s.textContent=`"${m}" not found`;return}w.push({id:n++,symbol:m,displaySymbol:p,name:h.name,price:h.price,weight:b}),tt(),o.value="",d.value="",s.textContent="",u()}),o.addEventListener("keydown",v=>{v.key==="Enter"&&e.click()}),a.addEventListener("click",async()=>{if(w.length<2){r.innerHTML='<div class="port-msg port-err">Add at least 2 holdings to analyze.</div>';return}l==null||l.abort(),l=new AbortController,r.innerHTML=`<div class="port-msg port-loading"><div class="sa-spinner"></div><span>Fetching 1Y data for ${w.length} holdings…</span></div>`,a.disabled=!0;const v=[...new Set([ut.symbol,...w.map(S=>S.symbol)])],p=await Promise.all(v.map(S=>Zt(S,l.signal)));a.disabled=!1;const m=new Map(v.map((S,X)=>[S,p[X]])),b=w.filter(S=>!m.get(S.symbol));if(b.length){r.innerHTML=`<div class="port-msg port-err">Could not load data for: ${b.map(S=>S.displaySymbol).join(", ")}</div>`;return}const h=m.get(ut.symbol),f=w.map(S=>m.get(S.symbol).retData),x=h?[...f,h.retData]:f,{dates:M,aligned:L}=ee(x),D=L.slice(0,w.length),T=h?L[L.length-1]:null,F=w.map(S=>S.weight/100),H=M.map((S,X)=>F.reduce((K,G,O)=>K+G*(D[O][X]??0),0)),C=re(H,T);if(!C){r.innerHTML='<div class="port-msg port-err">Insufficient data for analysis (need ≥5 aligned trading days).</div>';return}const P=w.map(S=>S.displaySymbol);pe(r,D,M,P,F,C)}),u(),()=>{l==null||l.abort(),R&&(R(),R=null)}}const ve=["market","stock","portfolio"],be={market:"Markets",stock:"Stock Analysis",portfolio:"Portfolio"};let j="market",I=null;function fe(t){t.innerHTML=`
    <div class="topbar">
      <div class="topbar-left">
        <div class="logo">invest<span>.</span>dash</div>
      </div>
      <div class="topbar-center">
        <div class="tabs" id="main-tabs">
          ${ve.map(e=>`
            <button class="tab ${e===j?"active":""}" data-tab="${e}">
              ${be[e]}
            </button>`).join("")}
        </div>
      </div>
      <div class="topbar-right"></div>
    </div>

    <div class="main-content" id="tab-content"></div>
  `;const n=t.querySelector("#main-tabs"),l=t.querySelector("#tab-content");function r(e){e!==j&&(j=e,n.querySelectorAll(".tab").forEach(a=>{a.classList.toggle("active",a.dataset.tab===e)}),pt(l,e))}n.addEventListener("click",e=>{const a=e.target.closest(".tab");a&&r(a.dataset.tab)}),pt(l,j)}function pt(t,n){I&&(I(),I=null),t.innerHTML="",n==="market"?Yt(t).then(l=>{I=l??null}):n==="stock"?Gt(t).then(l=>{I=l??null}):n==="portfolio"&&(I=he(t)??null)}fe(document.getElementById("app"));
