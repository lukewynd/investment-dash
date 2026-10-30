(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))n(l);new MutationObserver(l=>{for(const e of l)if(e.type==="childList")for(const s of e.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function o(l){const e={};return l.integrity&&(e.integrity=l.integrity),l.referrerPolicy&&(e.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?e.credentials="include":l.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function n(l){if(l.ep)return;l.ep=!0;const e=o(l);fetch(l.href,e)}})();const Fe="https://yf-proxy.lukewynd.workers.dev";function Ht(t){return`${Fe}${t}`}function Qe(t){const a=encodeURIComponent(t);return`${Fe}/v8/finance/chart/${a}?range=1y&interval=1d`}const pe=new Map,Je=5*60*1e3;async function Ze(t){var o,n,l,e,s,r;const a=pe.get(t);if(a&&Date.now()-a.ts<Je)return a.data;try{const i=await fetch(Qe(t),{headers:{Accept:"application/json"}});if(!i.ok)return null;const c=await i.json(),h=(n=(o=c==null?void 0:c.chart)==null?void 0:o.result)==null?void 0:n[0];if(!h)return null;const f=h.meta,b=((s=(e=(l=h.indicators)==null?void 0:l.quote)==null?void 0:e[0])==null?void 0:s.close)??[],L=q=>{for(let X=q;X>=0;X--)if(b[X]!=null)return{index:X,value:b[X]};return null},A=L(b.length-1),x=A?L(A.index-1):null,k=f.regularMarketPrice??null??(A==null?void 0:A.value)??null,Y=(x==null?void 0:x.value)??null,H=k!=null&&Y!=null?k-Y:null,E=H!=null&&Y!==0?H/Y*100:null,M=b.length,R=(A==null?void 0:A.index)??-1,N=k,I=q=>{let X=R-q;for(;X>=0&&b[X]==null;)X--;const ut=X>=0?b[X]:null;return ut!=null&&N!=null&&ut!==0?(N-ut)/ut*100:null},st=q=>{let X=R-q;for(;X>=0&&b[X]==null;)X--;return X>=0?b[X]:null},K=q=>{const X=st(q);return X!=null&&N!=null?N-X:null},Z=new Date().getFullYear(),z=h.timestamp??[];let lt=null;for(let q=0;q<z.length;q++)if(new Date(z[q]*1e3).getFullYear()===Z&&b[q]!=null){lt=b[q];break}const O=lt!=null&&lt!==0&&N!=null?(N-lt)/lt*100:null,Q={symbol:t,regularMarketPrice:k,regularMarketChangePercent:E,regularMarketChange:H,previousClose:Y,dataTimestamp:((r=h.timestamp)==null?void 0:r[R])??null,source:"Yahoo Finance chart",quoteType:f.instrumentType??"",ytdPct:O,pct1d:E,pct1w:I(5),pct1m:I(21),pct3m:I(63),pctYtd:O,change1d:H,change1w:K(5),change1m:K(21),change3m:K(63),changeYtd:lt!=null&&N!=null?N-lt:null};return pe.set(t,{ts:Date.now(),data:Q}),Q}catch{return null}}async function ts(t){const o=new Map;for(let n=0;n<t.length;n+=8){const l=t.slice(n,n+8),e=await Promise.allSettled(l.map(s=>Ze(s)));l.forEach((s,r)=>{const i=e[r].status==="fulfilled"?e[r].value:null;i&&o.set(s,i)})}return o}const Pe=[{symbol:"^GSPC",name:"S&P 500",type:"index"},{symbol:"^VIX",name:"VIX",type:"vix"},{symbol:"^TNX",name:"US 10Y",type:"yield"},{symbol:"DX-Y.NYB",name:"DXY",type:"index"},{symbol:"GC=F",name:"Gold",type:"commodity"},{symbol:"BTC-USD",name:"Bitcoin",type:"crypto"}],Re=[{symbol:"^GSPC",name:"S&P 500",region:"Americas"},{symbol:"^IXIC",name:"NASDAQ Comp.",region:"Americas"},{symbol:"^DJI",name:"Dow Jones",region:"Americas"},{symbol:"^RUT",name:"Russell 2000",region:"Americas"},{symbol:"^BVSP",name:"Bovespa",region:"Americas"},{symbol:"^MXX",name:"IPC Mexico",region:"Americas"},{symbol:"^FTSE",name:"FTSE 100",region:"Europe"},{symbol:"^GDAXI",name:"DAX",region:"Europe"},{symbol:"^FCHI",name:"CAC 40",region:"Europe"},{symbol:"^STOXX50E",name:"Euro Stoxx 50",region:"Europe"},{symbol:"^SSMI",name:"SMI",region:"Europe"},{symbol:"^AEX",name:"AEX",region:"Europe"},{symbol:"^N225",name:"Nikkei 225",region:"Asia-Pacific"},{symbol:"^HSI",name:"Hang Seng",region:"Asia-Pacific"},{symbol:"000001.SS",name:"Shanghai Comp.",region:"Asia-Pacific"},{symbol:"^AXJO",name:"ASX 200",region:"Asia-Pacific"},{symbol:"^KS11",name:"KOSPI",region:"Asia-Pacific"},{symbol:"^STI",name:"Straits Times",region:"Asia-Pacific"}],Ie=[{symbol:"^IRX",name:"3-Month"},{symbol:"^FVX",name:"5-Year"},{symbol:"^TNX",name:"10-Year"},{symbol:"^TYX",name:"30-Year"}],Ue=[{symbol:"BWX",name:"Global ex-US Treasuries",region:"Global"},{symbol:"IGOV",name:"International Treasuries",region:"Developed"},{symbol:"EMB",name:"Emerging Market Sovereign",region:"Emerging"},{symbol:"EWJ",name:"Japan rates proxy",region:"Japan"}],oe=[{code:"USD",name:"US Dollar",symbol:null,invert:!1},{code:"EUR",name:"Euro",symbol:"EURUSD=X",invert:!1},{code:"GBP",name:"Sterling",symbol:"GBPUSD=X",invert:!1},{code:"JPY",name:"Yen",symbol:"USDJPY=X",invert:!0},{code:"AUD",name:"Aus Dollar",symbol:"AUDUSD=X",invert:!1},{code:"CAD",name:"Can Dollar",symbol:"USDCAD=X",invert:!0},{code:"CHF",name:"Swiss Franc",symbol:"USDCHF=X",invert:!0}],es=oe.filter(t=>t.symbol).map(t=>t.symbol),Be=[{symbol:"GC=F",name:"Gold",unit:"/oz",group:"Metals"},{symbol:"SI=F",name:"Silver",unit:"/oz",group:"Metals"},{symbol:"HG=F",name:"Copper",unit:"/lb",group:"Metals"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl",group:"Energy"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl",group:"Energy"},{symbol:"NG=F",name:"Nat. Gas",unit:"/MMBtu",group:"Energy"},{symbol:"ZW=F",name:"Wheat",unit:"/bu",group:"Agri"},{symbol:"ZC=F",name:"Corn",unit:"/bu",group:"Agri"}],Ne=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],Oe=[{symbol:"BTC-USD",name:"Bitcoin",abbr:"BTC"},{symbol:"ETH-USD",name:"Ethereum",abbr:"ETH"},{symbol:"SOL-USD",name:"Solana",abbr:"SOL"},{symbol:"XRP-USD",name:"XRP",abbr:"XRP"}],Zt=[...new Set([...Pe.map(t=>t.symbol),...Re.map(t=>t.symbol),...Ie.map(t=>t.symbol),...Ue.map(t=>t.symbol),...es,...Be.map(t=>t.symbol),...Ne.map(t=>t.symbol),...Oe.map(t=>t.symbol)])];function zt(t,a=2){return t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:a,maximumFractionDigits:a})}function Mt(t){if(t==null)return{text:"—",cls:""};const a=t>=0?"+":"",o=t>=0?"up":"dn",n=Math.abs(t)>=3?" strong":"";return{text:`${a}${t.toFixed(2)}%`,cls:o+n}}function ss(t){if(t==null)return{text:"—",cls:""};const a=Math.round(t*100),o=a>=0?"+":"",n=a>=0?"up":"dn";return{text:`${o}${a}bps`,cls:n}}function $t(t){const a=Mt(t);return`<td class="num pct-cell ${a.cls}">${a.text}</td>`}function Ft(t,a=7){return Array.from({length:t},()=>`<tr>${Array.from({length:a},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function as(t){return Pe.map(({symbol:a,name:o,type:n})=>{const l=t.get(a),e=l==null?void 0:l.regularMarketPrice,s=Mt((l==null?void 0:l.pct1d)??null),r=Mt((l==null?void 0:l.pctYtd)??null);let i="—";return e!=null&&(n==="yield"?i=e.toFixed(2)+"%":n==="crypto"?i="$"+e.toLocaleString("en-US",{maximumFractionDigits:0}):n==="commodity"?i="$"+zt(e):i=zt(e)),`
      <div class="mkt-stat-card">
        <div class="mkt-stat-name">${o}</div>
        <div class="mkt-stat-price">${i}</div>
        <div class="mkt-stat-chg ${s.cls}">${s.text}</div>
        <div class="mkt-stat-ytd ${r.cls}">${r.text} YTD</div>
      </div>`}).join("")}function ns(t){const a=["Americas","Europe","Asia-Pacific"];let o="";return a.forEach(n=>{const l=Re.filter(e=>e.region===n);o+=`<tr class="mkt-region-sep"><td colspan="7">${n}</td></tr>`,o+=l.map(({symbol:e,name:s})=>{const r=t.get(e),i=r==null?void 0:r.regularMarketPrice,c=i!=null?i.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";return`<tr>
        <td class="mkt-name">${s}</td>
        <td class="num mono">${c}</td>
        ${$t(r==null?void 0:r.pct1d)}
        ${$t(r==null?void 0:r.pct1w)}
        ${$t(r==null?void 0:r.pct1m)}
        ${$t(r==null?void 0:r.pct3m)}
        ${$t(r==null?void 0:r.pctYtd)}
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
        <tbody>${o}</tbody>
      </table>
    </div>`}function ls(t){const a=Ie.map(({symbol:l,name:e})=>{const s=t.get(l),r=(s==null?void 0:s.regularMarketPrice)??null;return{name:e,yld:r,change1d:(s==null?void 0:s.change1d)??null,change1w:(s==null?void 0:s.change1w)??null,change1m:(s==null?void 0:s.change1m)??null,change3m:(s==null?void 0:s.change3m)??null,changeYtd:(s==null?void 0:s.changeYtd)??null}}),o=Math.max(.01,...a.map(l=>l.yld??0));return`
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
        <tbody>${a.map(({name:l,yld:e,change1d:s,change1w:r,change1m:i,change3m:c,changeYtd:h})=>{const f=[s,r,i,c,h].map(ss),b=e!=null?e.toFixed(2)+"%":"—",L=e!=null?e/o*100:0;return`<tr>
      <td class="mkt-name">${l}</td>
      <td class="num mono">${b}</td>
      <td class="yc-bar-cell"><span class="yc-bar" style="width:${L.toFixed(1)}%"></span></td>
      ${f.map(A=>`<td class="num pct-cell ${A.cls}">${A.text}</td>`).join("")}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function os(t){return`<div class="mkt-panel">
    <div class="mkt-panel-label">Global Bond Markets · price proxies</div>
    <table class="mkt-table">
      <thead><tr><th>Instrument</th><th class="num">Level</th><th class="num">1D</th><th class="num">1M</th><th class="num">YTD</th></tr></thead>
      <tbody>${Ue.map(({symbol:o,name:n,region:l})=>{const e=t.get(o),s=e==null?void 0:e.regularMarketPrice,r=Mt(e==null?void 0:e.pct1d),i=Mt(e==null?void 0:e.pct1m),c=Mt(e==null?void 0:e.pctYtd);return`<tr>
      <td><span class="mkt-name">${n}</span><span class="mkt-unit">${l}</span></td>
      <td class="num mono">${s!=null?zt(s):"—"}</td>
      <td class="num pct-cell ${r.cls}">${r.text}</td>
      <td class="num pct-cell ${i.cls}">${i.text}</td>
      <td class="num pct-cell ${c.cls}">${c.text}</td>
    </tr>`}).join("")}</tbody>
    </table>
  </div>`}function rs(t){const a={USD:1};oe.forEach(({code:s,symbol:r,invert:i})=>{var h;if(!r)return;const c=(h=t.get(r))==null?void 0:h.regularMarketPrice;c!=null&&(a[s]=i?1/c:c)});const o=s=>s==null?"—":s>=100?s.toFixed(2):s>=10?s.toFixed(3):s.toFixed(4),n=oe.map(s=>s.code),l=n.map(s=>`<th class="num fx-col-hdr">${s}</th>`).join(""),e=n.map(s=>{const r=n.map(i=>{if(s===i)return'<td class="fx-diag">—</td>';const c=a[s],h=a[i],f=c!=null&&h!=null&&h!==0?c/h:null;return`<td class="num fx-cell">${o(f)}</td>`}).join("");return`<tr><th class="fx-row-hdr">${s}</th>${r}</tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Cross Rates <span class="mkt-panel-sub">1 row = X column</span></div>
      <div class="fx-matrix-wrap">
        <table class="fx-matrix">
          <thead><tr><th></th>${l}</tr></thead>
          <tbody>${e}</tbody>
        </table>
      </div>
    </div>`}function is(t){const a=["Metals","Energy","Agri"];let o="";return a.forEach(n=>{const l=Be.filter(e=>e.group===n);o+=`<tr class="mkt-region-sep"><td colspan="7">${n}</td></tr>`,o+=l.map(({symbol:e,name:s,unit:r})=>{const i=t.get(e),c=i==null?void 0:i.regularMarketPrice,h=c!=null?"$"+zt(c):"—";return`<tr>
        <td class="mkt-name">${s}<span class="mkt-unit">${r}</span></td>
        <td class="num mono">${h}</td>
        ${$t(i==null?void 0:i.pct1d)}
        ${$t(i==null?void 0:i.pct1w)}
        ${$t(i==null?void 0:i.pct1m)}
        ${$t(i==null?void 0:i.pctYtd)}
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
        <tbody>${o}</tbody>
      </table>
    </div>`}function cs(t){const a=Ne.map(({symbol:l,name:e})=>{const s=t.get(l);return{name:e,pct1d:(s==null?void 0:s.pct1d)??null,pct1m:(s==null?void 0:s.pct1m)??null,pctYtd:(s==null?void 0:s.pctYtd)??null}});a.sort((l,e)=>(e.pct1d??-999)-(l.pct1d??-999));const o=Math.max(.01,...a.map(l=>Math.abs(l.pct1d??0)));return`
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
        <tbody>${a.map(({name:l,pct1d:e,pct1m:s,pctYtd:r})=>{const i=Mt(e),c=Mt(s),h=Mt(r),f=e!=null?Math.abs(e)/o*100:0;return`<tr>
      <td class="mkt-name sec-name">${l}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${i.cls}" style="width:${f.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${i.cls}">${i.text}</td>
      <td class="num pct-cell ${c.cls}">${c.text}</td>
      <td class="num pct-cell ${h.cls}">${h.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function ds(t){return`
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
        <tbody>${Oe.map(({symbol:o,name:n,abbr:l})=>{const e=t.get(o),s=e==null?void 0:e.regularMarketPrice,r=s!=null?"$"+s.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:s>=100?2:4}):"—";return`<tr>
      <td class="mkt-name">${n} <span class="mkt-abbr">${l}</span></td>
      <td class="num mono">${r}</td>
      ${$t(e==null?void 0:e.pct1d)}
      ${$t(e==null?void 0:e.pct1w)}
      ${$t(e==null?void 0:e.pct1m)}
      ${$t(e==null?void 0:e.pctYtd)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}async function us(t){t.innerHTML=`
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
        <table class="mkt-table"><tbody>${Ft(18)}</tbody></table>
      </div>
    </section>

    <!-- Bonds + FX -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Treasuries</div>
          <table class="mkt-table"><tbody>${Ft(4,8)}</tbody></table>
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
        <table class="mkt-table"><tbody>${Ft(4,5)}</tbody></table>
      </div>
    </section>

    <!-- Commodities + Sectors -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-commodities">
        <div class="mkt-panel">
          <div class="mkt-panel-label">Commodities</div>
          <table class="mkt-table"><tbody>${Ft(8,6)}</tbody></table>
        </div>
      </div>
      <div id="mkt-sectors">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Equity Sectors</div>
          <table class="mkt-table"><tbody>${Ft(11,5)}</tbody></table>
        </div>
      </div>
    </section>

    <!-- Crypto -->
    <section class="mkt-section" id="mkt-crypto">
      <div class="mkt-panel">
        <div class="mkt-panel-label">Crypto</div>
        <table class="mkt-table"><tbody>${Ft(4,6)}</tbody></table>
      </div>
    </section>
  `;const a=t.querySelector("#mkt-refresh");async function o(){const l=t.querySelector("#mkt-timestamp");l.textContent="Loading…";const e=await ts(Zt);if(!t.isConnected)return;t.querySelector("#mkt-stats").innerHTML=as(e),t.querySelector("#mkt-equities").innerHTML=ns(e),t.querySelector("#mkt-bonds").innerHTML=ls(e),t.querySelector("#mkt-fx").innerHTML=rs(e),t.querySelector("#mkt-global-bonds").innerHTML=os(e),t.querySelector("#mkt-commodities").innerHTML=is(e),t.querySelector("#mkt-sectors").innerHTML=cs(e),t.querySelector("#mkt-crypto").innerHTML=ds(e);const s=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"}),r=Zt.length-e.size;l.textContent=`Updated ${s} · ${e.size}/${Zt.length} instruments${r?` · ${r} unavailable`:""}`}a.addEventListener("click",o),await o();const n=setInterval(o,30*60*1e3);return()=>clearInterval(n)}const ps="modulepreload",ms=function(t){return"/investment-dash/"+t},me={},je=function(a,o,n){let l=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),r=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));l=Promise.allSettled(o.map(i=>{if(i=ms(i),i in me)return;me[i]=!0;const c=i.endsWith(".css"),h=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${h}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":ps,c||(f.as="script"),f.crossOrigin="",f.href=i,r&&f.setAttribute("nonce",r),document.head.appendChild(f),c)return new Promise((b,L)=>{f.addEventListener("load",b),f.addEventListener("error",()=>L(new Error(`Unable to preload CSS for ${i}`)))})}))}function e(s){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=s,window.dispatchEvent(r),!r.defaultPrevented)throw s}return l.then(s=>{for(const r of s||[])r.status==="rejected"&&e(r.reason);return a().catch(e)})},te=[{label:"US (NYSE / NASDAQ)",suffix:"",example:"AAPL"},{label:"Australia (ASX)",suffix:".AX",example:"CBA.AX"},{label:"UK (LSE)",suffix:".L",example:"HSBA.L"},{label:"Canada (TSX)",suffix:".TO",example:"RY.TO"},{label:"Germany (XETRA)",suffix:".DE",example:"SAP.DE"},{label:"Japan (TSE)",suffix:".T",example:"7203.T"},{label:"Hong Kong (HKEX)",suffix:".HK",example:"0700.HK"}],ee=[{label:"1W",range:"5d",interval:"1d"},{label:"1M",range:"1mo",interval:"1d"},{label:"3M",range:"3mo",interval:"1d"},{label:"6M",range:"6mo",interval:"1d"},{label:"1Y",range:"1y",interval:"1d"},{label:"2Y",range:"2y",interval:"1wk"},{label:"5Y",range:"5y",interval:"1wk"},{label:"MAX",range:"max",interval:"1mo"}],hs={ma20:{period:20,color:"#fbbf24",label:"MA 20D"},ma50:{period:50,color:"#60a5fa",label:"MA 50D"},ma200:{period:200,color:"#f87171",label:"MA 200D"}};function He(t,a){const o=[];for(let n=a-1;n<t.length;n++){const l=t.slice(n-a+1,n+1).reduce((e,s)=>e+s.close,0);o.push({time:t[n].time,value:+(l/a).toFixed(4)})}return o}function bs(t,a,o){const n=He(t,a);let l=0,e=null;return o.map(s=>{for(;l<n.length&&n[l].time<=s.time;)e=n[l].value,l+=1;return e==null?null:{time:s.time,value:e}}).filter(Boolean)}function fs(t,a=20,o=2){const n=He(t,a),l=[],e=[];for(let s=0;s<n.length;s++){const r=s+a-1,i=t.slice(r-a+1,r+1).map(f=>f.close),c=n[s].value,h=Math.sqrt(i.reduce((f,b)=>f+(b-c)**2,0)/a);l.push({time:n[s].time,value:+(c+o*h).toFixed(4)}),e.push({time:n[s].time,value:+(c-o*h).toFixed(4)})}return{upper:l,mid:n,lower:e}}const Qt=new Map,he=new Map,ue=5*60*1e3;function re(t){const a=new Date(t*1e3);return`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}-${String(a.getDate()).padStart(2,"0")}`}async function be(t,a,o){var x,P;const n=`${t}:${a}:${o}`,l=Qt.get(n);if(l&&Date.now()-l.ts<ue)return l.data;const e=`/v8/finance/chart/${encodeURIComponent(t)}?range=${a}&interval=${o}&includePrePost=false`,s=await fetch(Ht(e),{headers:{Accept:"application/json"}});if(!s.ok)throw new Error(`HTTP ${s.status}`);const r=await s.json(),i=(P=(x=r==null?void 0:r.chart)==null?void 0:x.result)==null?void 0:P[0];if(!i)throw new Error("Symbol not found");const c=i.timestamp??[],h=i.indicators.quote[0],f=new Map;for(let k=0;k<c.length;k++){if(h.open[k]==null||h.close[k]==null)continue;const Y=re(c[k]);f.set(Y,{time:Y,open:+h.open[k].toFixed(4),high:+h.high[k].toFixed(4),low:+h.low[k].toFixed(4),close:+h.close[k].toFixed(4),volume:h.volume[k]??0})}const b=[...f.values()].sort((k,Y)=>k.time.localeCompare(Y.time)),L=b.map(k=>({time:k.time,value:k.volume,color:k.close>=k.open?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"}));b.forEach(k=>delete k.volume);const A={candles:b,volumes:L,meta:i.meta};return Qt.set(n,{ts:Date.now(),data:A}),A}async function vs(t){var h,f,b,L,A,x;const a=`${t}:indicator-history`,o=Qt.get(a);if(o&&Date.now()-o.ts<ue)return o.data;const n=`/v8/finance/chart/${encodeURIComponent(t)}?range=10y&interval=1d&includePrePost=false`,l=await fetch(Ht(n),{headers:{Accept:"application/json"}});if(!l.ok)throw new Error(`HTTP ${l.status}`);const e=(b=(f=(h=await l.json())==null?void 0:h.chart)==null?void 0:f.result)==null?void 0:b[0];if(!e)throw new Error("Indicator history unavailable");const s=e.timestamp??[],r=((x=(A=(L=e.indicators)==null?void 0:L.quote)==null?void 0:A[0])==null?void 0:x.close)??[],i=new Map;s.forEach((P,k)=>{r[k]!=null&&i.set(re(P),{time:re(P),close:+r[k].toFixed(4)})});const c=[...i.values()].sort((P,k)=>P.time.localeCompare(k.time));return Qt.set(a,{ts:Date.now(),data:c}),c}async function gs(t){var s,r;const a=he.get(t);if(a&&Date.now()-a.ts<ue)return a.data;const o=["annualTotalRevenue","annualGrossProfit","annualOperatingIncome","annualNetIncome","annualDilutedEPS"],n=Math.floor(Date.now()/1e3),l=n-370*24*60*60,e=`/ws/fundamentals-timeseries/v1/finance/timeseries/${encodeURIComponent(t)}?type=${o.join(",")}&period1=${l}&period2=${n}`;try{const i=await fetch(Ht(e),{headers:{Accept:"application/json"}});if(!i.ok)return null;const c=((r=(s=await i.json())==null?void 0:s.timeseries)==null?void 0:r.result)??[],h=x=>{var P,k,Y,H;return((H=(Y=(k=(P=c.find(E=>{var M,R,N,I;return((N=(R=(M=E.meta)==null?void 0:M.symbol)==null?void 0:R.includes)==null?void 0:N.call(R,t))&&((I=E[x])==null?void 0:I.length)}))==null?void 0:P[x])==null?void 0:k.at(-1))==null?void 0:Y.reportedValue)==null?void 0:H.raw)??null},f=h("annualTotalRevenue"),b=h("annualGrossProfit"),L=h("annualOperatingIncome"),A={financialData:{totalRevenue:{raw:f},grossMargins:{raw:f&&b?b/f:null},operatingMargins:{raw:f&&L?L/f:null}},defaultKeyStatistics:{trailingEps:{raw:h("annualDilutedEPS")}}};return he.set(t,{ts:Date.now(),data:A}),A}catch{return null}}const Et=(t,a={})=>t==null?"—":t.toLocaleString("en-US",a),Wt=t=>t==null?"—":`${t>=0?"+":""}${(t*100).toFixed(2)}%`,se=t=>t==null?"—":t>=1e12?`$${(t/1e12).toFixed(2)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString()}`;function ae(t,a){var h,f,b,L,A,x,P,k,Y,H,E,M,R,N,I;if(!a){t.innerHTML='<div class="sa-no-data">Fundamental data unavailable.</div>';return}const o=a.price??{},n=a.summaryDetail??{},l=a.defaultKeyStatistics??{},e=a.financialData??{},s=a.assetProfile??{},i=[["Market Cap",se((h=o.marketCap)==null?void 0:h.raw)],["P/E (TTM)",Et((f=n.trailingPE)==null?void 0:f.raw,{maximumFractionDigits:1})],["Fwd P/E",Et((b=n.forwardPE)==null?void 0:b.raw,{maximumFractionDigits:1})],["EPS (TTM)",((L=l.trailingEps)==null?void 0:L.raw)!=null?`$${l.trailingEps.raw.toFixed(2)}`:"—"],["52W High",Et((A=n.fiftyTwoWeekHigh)==null?void 0:A.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["52W Low",Et((x=n.fiftyTwoWeekLow)==null?void 0:x.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["Div Yield",Wt((P=n.dividendYield)==null?void 0:P.raw)],["Beta",Et((k=n.beta)==null?void 0:k.raw,{maximumFractionDigits:2})],["Revenue TTM",se((Y=e.totalRevenue)==null?void 0:Y.raw)],["Gross Margin",Wt((H=e.grossMargins)==null?void 0:H.raw)],["Op Margin",Wt((E=e.operatingMargins)==null?void 0:E.raw)],["ROE",Wt((M=e.returnOnEquity)==null?void 0:M.raw)],["P/B Ratio",Et((R=l.priceToBook)==null?void 0:R.raw,{maximumFractionDigits:2})],["Avg Volume",Et((N=n.averageVolume)==null?void 0:N.raw)],["Employees",Et(s.fullTimeEmployees)],["Free Cash Flow",se((I=e.freeCashflow)==null?void 0:I.raw)]].map(([st,K])=>`
    <div class="sa-fund-card">
      <div class="sa-fund-label">${st}</div>
      <div class="sa-fund-val">${K}</div>
    </div>`).join(""),c=[s.sector,s.industry].filter(Boolean).map(st=>`<span class="sa-badge">${st}</span>`).join("");t.innerHTML=`
    <div class="sa-section-label">Key Metrics</div>
    <div class="sa-fund-grid">${i}</div>
    ${s.longBusinessSummary?`
      <div class="sa-about">
        <div class="sa-section-label">About ${c}</div>
        <p class="sa-about-text">${s.longBusinessSummary}</p>
      </div>`:""}
  `}function Yt(t,a,o){var h,f,b;const n=(o==null?void 0:o.price)??{},l=n.longName||n.shortName||(a==null?void 0:a.symbol)||"",e=((h=n.regularMarketPrice)==null?void 0:h.raw)??(a==null?void 0:a.regularMarketPrice)??0,s=(((f=n.regularMarketChangePercent)==null?void 0:f.raw)??0)*100,r=((b=n.regularMarketChange)==null?void 0:b.raw)??0,i=n.exchangeName||(a==null?void 0:a.exchangeName)||"",c=s>=0;t.innerHTML=`
    <div class="sa-hdr-left">
      <div class="sa-hdr-name">${l} <span class="sa-hdr-sym">${(a==null?void 0:a.symbol)??""}</span></div>
      <div class="sa-hdr-exch">${i}</div>
    </div>
    <div class="sa-hdr-right">
      <div class="sa-hdr-price">${e.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div class="sa-hdr-chg ${c?"up":"dn"}">${c?"+":""}${r.toFixed(2)} (${c?"+":""}${s.toFixed(2)}%)</div>
    </div>
  `}let Kt=null;async function fe(){return Kt||(Kt=await je(()=>import("./lightweight-charts.production-C-4kb1nc.js"),[])),Kt}async function ys(t){const a=te.map((p,v)=>`<option value="${v}">${p.label}</option>`).join(""),o=ee.map((p,v)=>`<button class="sa-range-btn${v===4?" active":""}" data-ri="${v}">${p.label}</button>`).join("");t.innerHTML=`
    <div class="sa-layout">
      <div class="sa-search-bar">
        <select class="sa-market-sel" id="sa-mkt">${a}</select>
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
          <div class="sa-ranges">${o}</div>
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
  `;let n=null,l={},e=new Map,s=null,r=[],i=1,c=!1,h=!1,f=null,b=[],L=1,A=new Set(["vol"]),x="line",P=4,k=null,Y=null;const H=t.querySelector("#sa-ph"),E=t.querySelector("#sa-main"),M=t.querySelector("#sa-hdr"),R=t.querySelector("#sa-instruments"),N=t.querySelector("#sa-chart"),I=t.querySelector("#sa-overlay"),st=t.querySelector("#sa-tt"),K=t.querySelector("#sa-annot-list"),Z=t.querySelector("#sa-funds"),z=t.querySelector("#sa-mkt"),lt=t.querySelector("#sa-ticker"),O=t.querySelector("#sa-go"),Q=t.querySelector("#sa-annot-btn"),q=t.querySelector("#sa-measure-btn"),X=t.querySelector("#sa-level-input"),ut=t.querySelector("#sa-level-add"),ct=t.querySelector("#sa-measure-list");function nt(){const p=document.documentElement.dataset.theme;return p==="more-visible"?{background:"#fffdf7",text:"#101820",grid:"#c3d0d9",border:"#293c4a",level:"#005a9c",fontSize:15,lineWidth:3,colors:["#005a9c","#9b3d00","#006b3c","#7b2f83","#8a4b00","#005b70","#a51d37","#34495e"],volumeUp:"rgba(0,107,60,0.45)",volumeDown:"rgba(180,35,24,0.45)"}:p==="light"?{background:"#f3f0e8",text:"#5e665e",grid:"#ded8cc",border:"#b7ad9d",level:"#9b641d",fontSize:11,lineWidth:2,colors:["#9b641d","#3575a8","#b34f43","#37845b","#805b96","#86751a","#34817d","#a34f73"],volumeUp:"rgba(55,132,91,0.36)",volumeDown:"rgba(179,79,67,0.36)"}:{background:"#111413",text:"#99a49b",grid:"#303a33",border:"#47564b",level:"#e3a857",fontSize:11,lineWidth:2,colors:["#e3a857","#63a7d8","#d77d72","#72b58a","#bc91cf","#d9ca68","#55b9b3","#e28dab"],volumeUp:"rgba(101,193,140,0.4)",volumeDown:"rgba(223,124,112,0.4)"}}async function St(){if(n)return;const{createChart:p,CrosshairMode:v}=await fe(),U=nt();n=p(N,{width:N.clientWidth||900,height:480,layout:{background:{color:U.background},textColor:U.text,fontSize:U.fontSize,fontFamily:"'DM Mono', monospace"},grid:{vertLines:{color:U.grid},horzLines:{color:U.grid}},crosshair:{mode:v.Normal},leftPriceScale:{visible:!0,borderColor:U.border},rightPriceScale:{borderColor:U.border},timeScale:{borderColor:U.border,timeVisible:!0,secondsVisible:!1}}),Y=()=>{if(!n)return;const w=nt();n.applyOptions({layout:{background:{color:w.background},textColor:w.text,fontSize:w.fontSize},grid:{vertLines:{color:w.grid},horzLines:{color:w.grid}},leftPriceScale:{borderColor:w.border},rightPriceScale:{borderColor:w.border},timeScale:{borderColor:w.border}}),[...e.values()].forEach((T,V)=>{var G,F;T.color=w.colors[V%w.colors.length];const D=l[T.symbol]??{};(G=D.main)==null||G.applyOptions({color:T.color,lineWidth:w.lineWidth}),(F=D.vol)==null||F.setData(T.priceData.volumes.map(W=>({...W,color:W.color.includes("52,211,153")||W.color.includes("101,193,140")?w.volumeUp:w.volumeDown})))}),r.forEach(T=>{var V;if(T.line){try{(V=l[T.symbol])==null||V.main.removePriceLine(T.line)}catch{}T.line=dt(T.price,T.symbol)}})},document.addEventListener("macro-theme-change",Y),k=new ResizeObserver(()=>{n&&N.clientWidth&&n.resize(N.clientWidth,480)}),k.observe(N),n.subscribeCrosshairMove(w=>{if(!w.time||!w.point){st.style.display="none";return}const T=[...e.values()].map(V=>{var W;const D=(W=l[V.symbol])==null?void 0:W.main,G=D&&w.seriesData.get(D);if(!G)return"";const F="close"in G?G.close:G.value;return`<span class="sa-tt-instrument"><i style="background:${V.color}"></i>${V.symbol} <b>${Number(F).toLocaleString("en-US",{maximumFractionDigits:4})}</b></span>`}).filter(Boolean).join("");if(!T){st.style.display="none";return}st.innerHTML=`<span class="sa-tt-date">${w.time}</span>${T}`,st.style.display="block"}),n.subscribeClick(w=>{var D;const T=s&&((D=l[s])==null?void 0:D.main);if(!w.point||!w.time||!T)return;const V=T.coordinateToPrice(w.point.y);if(V!=null){if(h){f?(d(f,{symbol:s,time:w.time,price:V}),f=null,y()):(f={symbol:s,time:w.time,price:V},y());return}c&&wt(V,s)}})}async function ot(){const{LineStyle:p}=await fe();Object.values(l).flatMap(w=>Object.values(w)).forEach(w=>{try{n.removeSeries(w)}catch{}}),l={},r.forEach(w=>{w.line=null}),m();const v=nt();n.priceScale("left").applyOptions({visible:!0,borderColor:v.border,scaleMargins:{top:.06,bottom:A.has("vol")?.22:.04}}),n.priceScale("right").applyOptions({visible:!0,borderColor:v.border,scaleMargins:{top:.06,bottom:A.has("vol")?.22:.04}});for(const[w,T]of[...e.values()].entries()){T.color=v.colors[w%v.colors.length];const V=T.axis;l[T.symbol]={},x==="candle"?(l[T.symbol].main=n.addCandlestickSeries({priceScaleId:V,upColor:"#65c18c",downColor:"#df7c70",borderVisible:!1,wickUpColor:"#65c18c",wickDownColor:"#df7c70"}),l[T.symbol].main.setData(T.priceData.candles)):(l[T.symbol].main=n.addLineSeries({color:T.color,lineWidth:v.lineWidth,priceScaleId:V,title:T.symbol}),l[T.symbol].main.setData(T.priceData.candles.map(D=>({time:D.time,value:D.close}))));for(const[D,G]of Object.entries(hs))!A.has(D)||T.indicatorCandles.length<G.period||(l[T.symbol][D]=n.addLineSeries({color:G.color,lineWidth:1,title:`${T.symbol} ${G.label}`,priceScaleId:V}),l[T.symbol][D].setData(bs(T.indicatorCandles,G.period,T.priceData.candles)));if(A.has("bb")&&T.priceData.candles.length>=20){const{upper:D,mid:G,lower:F}=fs(T.priceData.candles);l[T.symbol].bbU=n.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:p.Dashed,priceScaleId:V}),l[T.symbol].bbM=n.addLineSeries({color:"rgba(124,106,247,0.4)",lineWidth:1,priceScaleId:V}),l[T.symbol].bbL=n.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:p.Dashed,priceScaleId:V}),l[T.symbol].bbU.setData(D),l[T.symbol].bbM.setData(G),l[T.symbol].bbL.setData(F)}}const U=e.values().next().value;A.has("vol")&&U&&(l[U.symbol].vol=n.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"vol"}),n.priceScale("vol").applyOptions({scaleMargins:{top:.82,bottom:0}}),l[U.symbol].vol.setData(U.priceData.volumes.map(w=>({...w,color:w.color.includes("52,211,153")||w.color.includes("101,193,140")?v.volumeUp:v.volumeDown})))),r.forEach(w=>{var V;const T=(V=l[w.symbol])==null?void 0:V.main;w.line=T?dt(w.price,w.symbol):null}),b.forEach(w=>{var V;const T=(V=l[w.symbol])==null?void 0:V.main;w.startLine=T?dt(w.startPrice,w.symbol):null,w.endLine=T?dt(w.endPrice,w.symbol):null}),n.timeScale().fitContent()}function dt(p,v){const{LineStyle:U}=Kt,w=nt().level;return l[v].main.createPriceLine({price:p,color:w,lineWidth:1,lineStyle:U.Dashed,axisLabelVisible:!0,title:`${v} ${p.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`})}function wt(p,v=s){var U;!Number.isFinite(p)||!((U=l[v])!=null&&U.main)||(r.push({id:i++,price:p,symbol:v,line:dt(p,v)}),m())}function u(p){return typeof p=="string"?p:p&&typeof p=="object"?`${p.year}-${String(p.month).padStart(2,"0")}-${String(p.day).padStart(2,"0")}`:"point"}function d(p,v){p.symbol!==v.symbol||p.price===0||(b.push({id:L++,symbol:p.symbol,startTime:u(p.time),endTime:u(v.time),startPrice:p.price,endPrice:v.price,startLine:dt(p.price,p.symbol),endLine:dt(v.price,v.symbol)}),y())}function y(){const p=f?`<div class="sa-measure-pending">${f.symbol} · ${u(f.time)} · ${f.price.toLocaleString("en-US",{maximumFractionDigits:4})} <span>Click a second point</span></div>`:"";if(!b.length){ct.innerHTML=p;return}ct.innerHTML=`${p}${b.map(v=>{const U=v.endPrice-v.startPrice,w=U/v.startPrice*100,T=U>=0?"up":"dn";return`<div class="sa-measure-row">
        <span class="sa-measure-symbol">${v.symbol}</span>
        <span>${v.startTime} → ${v.endTime}</span>
        <strong class="${T}">${U>=0?"+":""}${U.toLocaleString("en-US",{maximumFractionDigits:4})} (${w>=0?"+":""}${w.toFixed(2)}%)</strong>
        <button class="sa-annot-x" data-measure-id="${v.id}" aria-label="Remove measurement">×</button>
      </div>`}).join("")}`,ct.querySelectorAll("[data-measure-id]").forEach(v=>{v.addEventListener("click",()=>{var T,V;const U=b.findIndex(D=>D.id===Number(v.dataset.measureId));if(U<0)return;const w=b[U];try{(T=l[w.symbol])==null||T.main.removePriceLine(w.startLine)}catch{}try{(V=l[w.symbol])==null||V.main.removePriceLine(w.endLine)}catch{}b.splice(U,1),y()})})}function m(){var p;if(!r.length){K.innerHTML="";return}K.innerHTML=`
      <div class="sa-annot-wrap">
        <span class="sa-section-label">Price Levels</span>
        <div class="sa-annot-pills">
          ${r.map(v=>`
            <span class="sa-annot-pill">
              ${v.symbol} · ${v.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              <button class="sa-annot-x" data-id="${v.id}" aria-label="Remove price level ${v.price}" title="Remove level">×</button>
            </span>`).join("")}
          ${r.length>1?'<button class="sa-clear-levels" type="button">Clear all</button>':""}
        </div>
      </div>`,K.querySelectorAll(".sa-annot-x").forEach(v=>{v.addEventListener("click",()=>{var T;const U=Number(v.dataset.id),w=r.findIndex(V=>V.id===U);if(!(w<0)){try{r[w].line&&((T=l[r[w].symbol])==null||T.main.removePriceLine(r[w].line))}catch{}r.splice(w,1),m()}})}),(p=K.querySelector(".sa-clear-levels"))==null||p.addEventListener("click",()=>{r.forEach(v=>{var U;try{v.line&&((U=l[v.symbol])==null||U.main.removePriceLine(v.line))}catch{}}),r=[],m()})}function S(){R.innerHTML=[...e.values()].map(p=>`
      <div class="sa-instrument-row${p.symbol===s?" active":""}" data-symbol="${p.symbol}">
        <span class="sa-instrument-swatch" style="--instrument-color:${p.color}"></span>
        <button class="sa-instrument-focus" type="button" data-focus="${p.symbol}" title="Focus ${p.symbol}">${p.symbol}</button>
        <span class="sa-instrument-name">${p.name}</span>
        <label class="sa-axis-label" for="axis-${encodeURIComponent(p.symbol)}">Axis</label>
        <select class="sa-axis-select" id="axis-${encodeURIComponent(p.symbol)}" data-axis="${p.symbol}" aria-label="Price axis for ${p.symbol}">
          <option value="left"${p.axis==="left"?" selected":""}>Left</option>
          <option value="right"${p.axis==="right"?" selected":""}>Right</option>
        </select>
        <button class="sa-instrument-remove" type="button" data-remove="${p.symbol}" aria-label="Remove ${p.symbol}" title="Remove ${p.symbol}">×</button>
      </div>`).join(""),R.querySelectorAll("[data-focus]").forEach(p=>{p.addEventListener("click",()=>B(p.dataset.focus))}),R.querySelectorAll("[data-axis]").forEach(p=>{p.addEventListener("change",async()=>{const v=e.get(p.dataset.axis);v&&(v.axis=p.value,await ot())})}),R.querySelectorAll("[data-remove]").forEach(p=>{p.addEventListener("click",()=>C(p.dataset.remove))})}function B(p){const v=e.get(p);v&&(s=p,S(),Yt(M,v.priceData.meta,v.funds),ae(Z,v.funds))}async function C(p){if(!e.has(p))return;if(e.delete(p),r=r.filter(U=>U.symbol!==p),b=b.filter(U=>U.symbol!==p),(f==null?void 0:f.symbol)===p&&(f=null),s===p&&(s=[...e.keys()].at(-1)??null),!e.size){E.style.display="none",H.style.display="flex",M.innerHTML="",Z.innerHTML="",m(),S(),await ot();return}const v=e.get(s);Yt(M,v.priceData.meta,v.funds),ae(Z,v.funds),S(),m(),await ot()}async function $(p){if(e.has(p)){B(p);return}const{range:v,interval:U}=ee[P];I.style.display="flex",H.style.display="none",E.style.display="block",M.innerHTML=`<div class="sa-hdr-loading">Loading ${p}…</div>`,Z.innerHTML="";try{await St();const[w,T,V]=await Promise.all([be(p,v,U),vs(p),gs(p)]),D={symbol:p,name:w.meta.longName||w.meta.shortName||p,priceData:w,indicatorCandles:T,funds:V,axis:e.size===0?"right":e.size%2?"left":"right",color:"#e3a857"};e.set(p,D),s=p,Yt(M,w.meta,V),S(),await ot(),ae(Z,V)}catch{M.innerHTML=`<div class="sa-error">Symbol <b>${p}</b> not found or no data available.</div>`,Z.innerHTML=""}finally{I.style.display="none"}}async function j(p){if(!e.size)return;P=p,t.querySelectorAll(".sa-range-btn").forEach((w,T)=>w.classList.toggle("active",T===p));const{range:v,interval:U}=ee[p];I.style.display="flex";try{(await Promise.all([...e.values()].map(async V=>({symbol:V.symbol,data:await be(V.symbol,v,U)})))).forEach(({symbol:V,data:D})=>{e.get(V).priceData=D});const T=e.get(s);Yt(M,T.priceData.meta,T.funds),await ot()}finally{I.style.display="none"}}t.querySelectorAll(".sa-range-btn").forEach((p,v)=>p.addEventListener("click",()=>j(v))),z.addEventListener("change",()=>{lt.placeholder=`Ticker (e.g. ${te[+z.value].example})`});async function at(){const p=lt.value.trim().toUpperCase(),v=te[+z.value];if(!p)return;const U=v.suffix&&!p.endsWith(v.suffix)?`${p}${v.suffix}`:p;await $(U)}O.addEventListener("click",at),lt.addEventListener("keydown",p=>{p.key==="Enter"&&at()}),t.querySelectorAll("[data-type]").forEach(p=>p.addEventListener("click",async()=>{x=p.dataset.type,t.querySelectorAll("[data-type]").forEach(v=>v.classList.remove("active")),p.classList.add("active"),e.size&&await ot()})),t.querySelectorAll("[data-ind]").forEach(p=>p.addEventListener("click",async()=>{const v=p.dataset.ind;A.has(v)?A.delete(v):A.add(v),p.classList.toggle("active",A.has(v)),e.size&&await ot()})),Q.addEventListener("click",()=>{h&&(h=!1,f=null,q.classList.remove("active"),q.setAttribute("aria-pressed","false"),q.textContent="Measure move",y()),c=!c,Q.classList.toggle("active",c),Q.setAttribute("aria-pressed",String(c)),Q.textContent=c?"Click to place":"Place on chart",t.querySelector("#sa-chart-wrap").classList.toggle("sa-annotating",c)}),q.addEventListener("click",()=>{c&&(c=!1,Q.classList.remove("active"),Q.setAttribute("aria-pressed","false"),Q.textContent="Place on chart"),h=!h,f=null,q.classList.toggle("active",h),q.setAttribute("aria-pressed",String(h)),q.textContent=h?"Click first point":"Measure move",t.querySelector("#sa-chart-wrap").classList.toggle("sa-measuring",h),y()});function J(){const p=Number(X.value);if(!X.value.trim()||!Number.isFinite(p)){X.focus();return}wt(p),X.value="",X.focus()}return ut.addEventListener("click",J),X.addEventListener("keydown",p=>{p.key==="Enter"&&J()}),()=>{k==null||k.disconnect(),Y&&document.removeEventListener("macro-theme-change",Y),n&&(n.remove(),n=null),l={},r=[],b=[],f=null}}const vt=252,ve=1.6449;function $s(t){return new Date((t+43200)*1e3).toISOString().slice(0,10)}const Dt=t=>Date.UTC(+t.slice(0,4),+t.slice(5,7)-1,+t.slice(8,10)),ge=(t,a)=>new Date(Dt(t)+a*864e5).toISOString().slice(0,10),Ot=t=>/^\d{4}-\d{2}-\d{2}$/.test(t??"")&&!Number.isNaN(Dt(t));function xt(t,a){const o=new Date(Dt(t));return o.setUTCMonth(o.getUTCMonth()+a),o.toISOString().slice(0,10)}function Ct(){const t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`}const ws=t=>{const a=new Date(Dt(t)).getUTCDay();return a!==0&&a!==6};function jt(t,a){let o=0,n=t.length-1,l=-1;for(;o<=n;){const e=o+n>>1;t[e]<=a?(l=e,o=e+1):n=e-1}return l}function We(t){const a=String(t??"").split(",").map(n=>{const[l,e]=n.split(":").map(s=>s.trim());return l?{symbol:l.toUpperCase(),weight:e==null?1:parseFloat(e)}:null}).filter(n=>n&&n.weight>0),o=a.reduce((n,l)=>n+l.weight,0);return o>0?a.map(n=>({...n,weight:n.weight/o})):[]}function ne(t,a,o){const n=new Float64Array(t.length).fill(NaN);let l=0,e=NaN;for(let s=0;s<t.length;s++){for(;l<a.length&&a[l]<=t[s];)e=o[l++];n[s]=e}return n}function Ss({symbols:t,benchLegs:a,histories:o,fx:n,base:l,fromKey:e}){const s=[...new Set([...t,...a.map(x=>x.symbol)])],r=new Set;s.forEach(x=>{var P;return(P=o.get(x))==null?void 0:P.keys.forEach(k=>{k>=e&&ws(k)&&r.add(k)})});const i=[...r].sort(),c=i.length,h=[],f=new Map,b=x=>{if(x===l)return null;if(!f.has(x)){const P=n.get(x);P||h.push(`No ${x}/${l} FX history — ${x} assets are shown unconverted.`),f.set(x,P?ne(i,P.keys,P.adj):null)}return f.get(x)},L=new Map;s.forEach(x=>{const P=o.get(x),k=ne(i,P.keys,P.adj),Y=ne(i,P.keys,P.close),H=b(P.currency),E=new Float64Array(c),M=new Float64Array(c),R=new Float64Array(c);let N=-1;for(let I=0;I<c;I++){const st=H&&Number.isFinite(H[I])?H[I]:1;if(R[I]=Y[I]*st,N<0&&Number.isFinite(k[I])&&(N=I),I===0||!Number.isFinite(k[I])||!Number.isFinite(k[I-1]))continue;E[I]=k[I]/k[I-1]-1;const K=H&&Number.isFinite(H[I-1])?H[I-1]:1;M[I]=(1+E[I])*(st/K)-1}L.set(x,{symbol:x,currency:P.currency,rLocal:E,rBase:M,priceBase:R,firstIdx:N<0?c:N})});const A=new Float64Array(c);return a.forEach(x=>{const P=L.get(x.symbol).rBase;for(let k=0;k<c;k++)A[k]+=x.weight*P[k]}),{dates:i,base:l,assets:L,bench:A,warnings:h}}const ks={monthly:t=>t.slice(0,7),quarterly:t=>`${t.slice(0,4)}Q${Math.floor((+t.slice(5,7)-1)/3)}`,annual:t=>t.slice(0,4)};function ye(t,{symbols:a,schedule:o,rebalance:n="none",costBps:l=0,rf:e=0}){const{dates:s}=t,r=s.length,i=a.length,c=a.map(O=>t.assets.get(O).rBase),h=[...o].sort((O,Q)=>O.date.localeCompare(Q.date)).map(O=>({date:O.date,target:Float64Array.from(a,Q=>(+O.weights[Q]||0)/100)})),f=s.findIndex(O=>O>=h[0].date);if(f<0||f>=r-1)throw new Error("The first rebalance date is after the last available price.");const b=r-f,L=new Float64Array(b),A=new Float64Array(b),x=new Float64Array(b),P=new Float64Array(b),k=new Float64Array(b),Y=a.map(()=>new Float64Array(b)),H=a.map(()=>new Float64Array(b)),E=[],M=e/vt,R=ks[n];let N=new Float64Array(i),I=1,st=h[0].target,K=0;for(;K<h.length&&h[K].date<=s[f];)st=h[K++].target;const Z=(O,Q)=>{const q=[];let X=0;for(let ct=0;ct<i;ct++){const nt=st[ct]-N[ct];Math.abs(nt)>1e-7&&q.push({symbol:a[ct],i:ct,from:N[ct],to:st[ct],delta:nt}),X+=Math.abs(nt)}const ut=Q==="initial"?0:X*l/1e4;return N=Float64Array.from(st),I=1-N.reduce((ct,nt)=>ct+nt,0),q.length&&E.push({k:O,date:s[f+O],type:Q,legs:q,turnover:Q==="initial"?0:X/2,traded:X,cost:ut,nav:L[O]}),ut},z=O=>{for(let Q=0;Q<i;Q++)Y[Q][O]=N[Q],H[Q][O]=st[Q];P[O]=I};L[0]=1,Z(0,"initial"),z(0);for(let O=1;O<b;O++){const Q=f+O;k[O]=I*M;let q=k[O];for(let nt=0;nt<i;nt++)q+=N[nt]*c[nt][Q];const X=1+q;for(let nt=0;nt<i;nt++)N[nt]=X!==0?N[nt]*(1+c[nt][Q])/X:0;I=X!==0?I*(1+M)/X:0,L[O]=L[O-1]*X;let ut=null;for(;K<h.length&&h[K].date<=s[Q];)st=h[K++].target,ut="scheduled";!ut&&R&&O<b-1&&R(s[Q])!==R(s[Q+1])&&(ut="calendar");const ct=ut?Z(O,ut):0;A[O]=X*(1-ct)-1,x[O]=A[O]-q,L[O]=L[O-1]*(1+A[O]),z(O)}const lt=[];return a.forEach((O,Q)=>{const q=t.assets.get(O).firstIdx;q>f&&h.some(X=>X.target[Q]!==0&&X.date<s[q])&&lt.push(`${O} has no prices before ${s[q]??"the end of the period"} — it earns 0% until then.`)}),{symbols:a,t0:f,dates:s.slice(f),nav:L,ret:A,costs:x,cashW:P,cashRet:k,W:Y,TW:H,trades:E,warnings:lt}}function xs(t,a){const o=t.bench.slice(a);o[0]=0;const n=new Float64Array(o.length);let l=1;return o.forEach((e,s)=>{l*=1+e,n[s]=l}),{ret:o,nav:n}}function Ms(t,a,o,n){var i,c;const l=n?Math.max(0,jt(t,n)):t.length-1,e=t[l],s=(c=(i={"1m":()=>xt(e,-1),"3m":()=>xt(e,-3),"6m":()=>xt(e,-6),ytd:()=>`${+e.slice(0,4)-1}-12-31`,"1y":()=>xt(e,-12),"3y":()=>xt(e,-36),custom:()=>o??t[0]})[a])==null?void 0:c.call(i),r=s?Math.max(0,jt(t,s)):0;return[Math.min(r,Math.max(0,l-1)),l]}function As(t,a,o,n=0,l=t.length-1){const e=l-n;if(e<5)return null;const s=o/vt;let r=1,i=1,c=0,h=1,f=1,b=0,L=0,A=0,x=0,P=0,k=0,Y=0,H=0,E=0,M=0,R=0,N=0,I=0;const st=new Float64Array(e);for(let B=n+1,C=0;B<=l;B++,C++){const $=t[B],j=a[B];r*=1+$,i=Math.max(i,r),c=Math.max(c,1-r/i),h*=1+j,f=Math.max(f,h),b=Math.max(b,1-h/f),L+=$,A+=j,x+=$*$,P+=j*j,k+=$*j,Y+=$-j,H+=($-j)**2,$<s&&(E+=($-s)**2),j>0?(M+=$,R+=j):j<0&&(N+=$,I+=j),st[C]=$}const K=L/e,Z=A/e,z=Y/e,lt=Math.max(0,(x-e*K*K)/(e-1)),O=Math.max(0,(P-e*Z*Z)/(e-1)),Q=(k-e*K*Z)/(e-1),q=e/vt,X=Math.sqrt(lt*vt),ut=Math.sqrt(O*vt),ct=r**(1/q)-1,nt=h**(1/q)-1,St=(K-s)*vt,ot=Math.sqrt(E/e*vt),dt=O>0?Q/O:null,wt=Math.sqrt(Math.max(0,(H-e*z*z)/(e-1))*vt);let u=0,d=0;for(let B=n+1;B<=l;B++){const C=t[B]-K;u+=C**3,d+=C**4}const y=Math.sqrt(lt);st.sort();const m=Math.max(0,Math.floor(.05*e)-1);let S=0;for(let B=0;B<=m;B++)S+=st[B];return{n:e,years:q,total:r-1,cagr:ct,vol:X,maxDD:c,sharpe:X>0?St/X:null,sortino:ot>0?St/ot:null,calmar:c>0?ct/c:null,beta:dt,alpha:dt!=null?(K-s-dt*(Z-s))*vt:null,corr:lt>0&&O>0?Q/Math.sqrt(lt*O):null,te:wt,ir:wt>0?z*vt/wt:null,activeCagr:ct-nt,upCap:R!==0?M/R:null,downCap:I!==0?N/I:null,var95:-st[m],cvar95:-S/(m+1),skew:y>0?u/e/y**3:null,kurt:y>0?d/e/y**4-3:null,best:st[e-1],worst:st[0],btotal:h-1,bcagr:nt,bvol:ut,bMaxDD:b}}function Es(t,a,o,n=63){const l=t.length,e=o/vt,s=()=>new Float64Array(l).fill(NaN),r={vol:s(),bvol:s(),beta:s(),sharpe:s(),bsharpe:s(),te:s()};for(let i=n;i<l;i++){let c=0,h=0,f=0,b=0,L=0,A=0,x=0;for(let M=i-n+1;M<=i;M++){const R=t[M],N=a[M];c+=R,h+=N,f+=R*R,b+=N*N,L+=R*N,A+=R-N,x+=(R-N)**2}const P=c/n,k=h/n,Y=A/n,H=Math.max(0,(f-n*P*P)/(n-1)),E=Math.max(0,(b-n*k*k)/(n-1));r.vol[i]=Math.sqrt(H*vt),r.bvol[i]=Math.sqrt(E*vt),r.beta[i]=E>0?(L-n*P*k)/(n-1)/E:NaN,r.sharpe[i]=H>0?(P-e)*vt/r.vol[i]:NaN,r.bsharpe[i]=E>0?(k-e)*vt/r.bvol[i]:NaN,r.te[i]=Math.sqrt(Math.max(0,(x-n*Y*Y)/(n-1))*vt)}return r}function $e(t){const a=new Float64Array(t.length);let o=-1/0;return t.forEach((n,l)=>{o=Math.max(o,n),a[l]=n/o-1}),a}function Ls(t,a=6){const o=[];let n=0,l=0,e=!1;for(let s=1;s<t.length;s++)t[s]>=t[n]?(e&&o.push({start:n,trough:l,end:s}),e=!1,n=s):(e||(e=!0,l=s),t[s]<t[l]&&(l=s));return e&&o.push({start:n,trough:l,end:null}),o.map(s=>({...s,depth:t[s.trough]/t[s.start]-1})).sort((s,r)=>s.depth-r.depth).slice(0,a)}function Ts(t,a,o){const n=new Map;let l=0,e=t[0].slice(0,7);const s=i=>{if(i<=l)return;const c=+e.slice(0,4),h=+e.slice(5,7)-1;n.has(c)||n.set(c,{year:c,p:Array(12).fill(null),b:Array(12).fill(null)});const f=n.get(c);f.p[h]=a[i]/a[l]-1,f.b[h]=o[i]/o[l]-1,l=i};for(let i=1;i<t.length;i++){const c=t[i].slice(0,7);c!==e&&(s(i-1),e=c)}s(t.length-1);const r=i=>i.some(c=>c!=null)?i.reduce((c,h)=>c*(1+(h??0)),1)-1:null;return[...n.values()].map(i=>({...i,py:r(i.p),by:r(i.b)})).sort((i,c)=>c.year-i.year)}function we(t,a,o,n){const l=a.symbols.length,e=a.symbols.map(E=>t.assets.get(E).rBase),s=a.symbols.map(E=>t.assets.get(E).rLocal),r=n-o,i=new Float64Array(l),c=new Float64Array(l),h=new Float64Array(l),f=new Float64Array(l).fill(1),b=a.symbols.map(()=>new Float64Array(r+1)),L=new Float64Array(r+1),A=new Float64Array(r+1);let x=0,P=0;const k=a.nav[o];for(let E=o+1,M=1;E<=n;E++,M++){const R=a.nav[E-1]/k,N=a.t0+E;for(let I=0;I<l;I++){const st=a.W[I][E-1];i[I]+=st*e[I][N]*R,c[I]+=st*s[I][N]*R,h[I]+=st,f[I]*=1+e[I][N],b[I][M]=i[I]}x+=a.cashRet[E]*R,P+=a.costs[E]*R,L[M]=x,A[M]=P}const Y=a.nav[n]/k-1;return{rows:a.symbols.map((E,M)=>({symbol:E,i:M,avgW:r?h[M]/r:0,endW:a.W[M][n],ret:f[M]-1,contrib:i[M],local:c[M],fx:i[M]-c[M]})),cash:x,cost:P,total:Y,paths:b,cashPath:L,costPath:A,a:o,b:n}}function Cs(t,a,o,n,l,e){const s=n/vt,r=e-l;let i=0,c=0,h=0,f=0;for(let R=l+1;R<=e;R++){const N=t.ret[R]-s,I=o.ret[R]-s;i+=N,c+=I,h+=N*I,f+=I*I}const b=f/r-(c/r)**2,L=b>0?(h/r-i/r*c/r)/b:0;let A=0,x=0,P=0,k=0;const Y=t.nav[l];for(let R=l+1;R<=e;R++){const N=t.nav[R-1]/Y,I=L*(o.ret[R]-s);A+=s*N,x+=I*N,P+=(t.ret[R]-s-I)*N,k+=t.costs[R]*N}const H=t.nav[e]/Y-1,E=a.nav[e]/a.nav[l]-1,M=o.nav[e]/o.nav[l]-1;return{total:H,benchTotal:M,active:H-M,beta:L,rfPart:A,mktPart:x,specPart:P,policyTotal:E,costPart:k,tradingPart:H-E-k}}function Ds(t,a){var i;const o=t.length,n=((i=t[0])==null?void 0:i.length)??0;if(n<10)return null;const l=Math.exp(-Math.LN2/a),e=Array.from({length:o},()=>new Float64Array(o));let s=0,r=1;for(let c=n-1;c>=0;c--){for(let h=0;h<o;h++){const f=t[h][c]*r;if(f!==0)for(let b=h;b<o;b++)e[h][b]+=f*t[b][c]}s+=r,r*=l}for(let c=0;c<o;c++)for(let h=c;h<o;h++)e[h][c]=e[c][h]=e[c][h]/s*vt;return e}function Fs(t,a,o,n,l=756){const e=t.dates.length,s=Math.max(1,e-l),r=[...a.map(E=>t.assets.get(E).rBase),t.bench].map(E=>E.subarray(s)),i=Ds(r,n);if(!i)return null;const c=a.length,h=Array.from({length:c+1},(E,M)=>o.reduce((R,N,I)=>R+i[M][I]*N,0)),f=o.reduce((E,M,R)=>E+M*h[R],0),b=Math.sqrt(Math.max(0,f)),L=Array.from({length:c+1},(E,M)=>Math.sqrt(Math.max(0,i[M][M]))),A=i[c][c],x=f-2*h[c]+A,P=o.reduce((E,M)=>E+Math.abs(M),0),k=o.reduce((E,M)=>E+M*M,0),Y=a.map((E,M)=>{const R=b>0?h[M]/b:0;return{symbol:E,i:M,weight:o[M],vol:L[M],mctr:R,rc:o[M]*R,pctRc:b>0?o[M]*R/b:0,betaPort:f>0?h[M]/f:null,corrBench:L[M]>0&&L[c]>0?i[M][c]/(L[M]*L[c]):null}}),H=Array.from({length:c},(E,M)=>Array.from({length:c},(R,N)=>L[M]>0&&L[N]>0?i[M][N]/(L[M]*L[N]):M===N?1:0));return{vol:b,assets:Y,corr:H,te:Math.sqrt(Math.max(0,x)),beta:A>0?h[c]/A:null,benchVol:L[c],divRatio:b>0?o.reduce((E,M,R)=>E+Math.abs(M)*L[R],0)/b:null,effN:k>0?P*P/k:null,var95:ve*b/Math.sqrt(vt),var95_10d:ve*b*Math.sqrt(10/vt)}}const Ps=[{name:"COVID crash",from:"2020-02-19",to:"2020-03-23"},{name:"COVID rebound",from:"2020-03-23",to:"2020-06-08"},{name:"2022 inflation & rates",from:"2022-01-03",to:"2022-10-12"},{name:"UK gilt / LDI crisis",from:"2022-09-21",to:"2022-09-28"},{name:"SVB banking stress",from:"2023-03-08",to:"2023-03-17"},{name:"Late-2023 rates rally",from:"2023-10-27",to:"2023-12-29"},{name:"Yen carry unwind",from:"2024-07-16",to:"2024-08-05"},{name:"Tariff shock",from:"2025-04-02",to:"2025-04-08"}];function Rs(t,a,o){const{dates:n}=t;return Ps.map(l=>{const e=jt(n,l.from),s=jt(n,l.to);if(e<0||s<=e||n[n.length-1]<l.to)return{...l,available:!1};const r=f=>{let b=1;for(let L=e+1;L<=s;L++)b*=1+f[L];return b-1},i=[];let c=0;a.forEach((f,b)=>{const L=t.assets.get(f);if(L.firstIdx>e){o[b]&&i.push(f);return}c+=o[b]*r(L.rBase)});const h=r(t.bench);return{...l,available:!0,port:c,bench:h,active:c-h,missing:i}})}const Se="portlab:v2",Is="portv1",Rt={benchmark:"SPY",base:"USD",rebalance:"none",costBps:10,rf:4,aum:1e6},At=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);function Jt(t="Untitled portfolio",a={}){const o=Date.now();return{id:At(),name:t,createdAt:o,updatedAt:o,assets:[],schedule:[{id:At(),date:xt(Ct(),-12),weights:{}}],...a,settings:{...Rt,...a.settings??{}}}}function Us(){const t=(o,n,l,e)=>({symbol:o,display:n,name:l,currency:e}),a=(o,n)=>({id:At(),date:o,weights:n});return Jt("Global multi-asset (sample)",{assets:[t("SPY","SPY","SPDR S&P 500 ETF Trust","USD"),t("QQQ","QQQ","Invesco QQQ Trust","USD"),t("EFA","EFA","iShares MSCI EAFE ETF","USD"),t("VAS.AX","VAS","Vanguard Australian Shares Index ETF","AUD"),t("AGG","AGG","iShares Core US Aggregate Bond ETF","USD"),t("GLD","GLD","SPDR Gold Shares","USD")],schedule:[a("2021-01-04",{SPY:35,QQQ:0,EFA:15,"VAS.AX":10,AGG:30,GLD:10}),a("2022-06-01",{SPY:30,QQQ:0,EFA:15,"VAS.AX":10,AGG:25,GLD:15}),a("2023-07-03",{SPY:35,QQQ:10,EFA:10,"VAS.AX":10,AGG:25,GLD:10}),a("2025-01-02",{SPY:30,QQQ:15,EFA:10,"VAS.AX":5,AGG:20,GLD:15})],settings:{benchmark:"ACWI:60,AGG:40",rebalance:"quarterly"}})}function Bs(){try{const t=JSON.parse(localStorage.getItem(Is)??"null");if(!Array.isArray(t)||!t.length)return null;const a=Object.fromEntries(t.map(o=>[o.symbol,+o.weight||0]));return Jt("My portfolio",{assets:t.map(o=>({symbol:o.symbol,display:o.displaySymbol??o.symbol,name:o.name??o.symbol,currency:""})),schedule:[{id:At(),date:xt(Ct(),-12),weights:a}],settings:{benchmark:"^GSPC"}})}catch{return null}}function ie(t,{freshId:a=!1}={}){if(!t||typeof t!="object")throw new Error("Not a portfolio file.");const o=(Array.isArray(t.assets)?t.assets:[]).filter(s=>s&&typeof s.symbol=="string"&&s.symbol.trim()).map(s=>({symbol:s.symbol.trim().toUpperCase(),display:String(s.display??s.symbol).slice(0,16),name:String(s.name??s.symbol).slice(0,120),currency:String(s.currency??"").slice(0,4)})),n=new Set(o.map(s=>s.symbol)),l=(Array.isArray(t.schedule)?t.schedule:[]).filter(s=>s&&Ot(s.date)).map(s=>({id:typeof s.id=="string"?s.id:At(),date:s.date,weights:Object.fromEntries(Object.entries(s.weights??{}).filter(([r,i])=>n.has(r)&&Number.isFinite(+i)).map(([r,i])=>[r,+i]))})).sort((s,r)=>s.date.localeCompare(r.date));l.length||l.push({id:At(),date:xt(Ct(),-12),weights:{}});const e={...Rt,...t.settings??{}};return{id:!a&&typeof t.id=="string"?t.id:At(),name:String(t.name??"Imported portfolio").slice(0,80),createdAt:+t.createdAt||Date.now(),updatedAt:+t.updatedAt||Date.now(),assets:o,schedule:l,settings:{benchmark:String(e.benchmark||Rt.benchmark).slice(0,120),base:/^[A-Z]{3}$/.test(e.base)?e.base:Rt.base,rebalance:["none","monthly","quarterly","annual"].includes(e.rebalance)?e.rebalance:"none",costBps:Math.max(0,+e.costBps||0),rf:Number.isFinite(+e.rf)?+e.rf:Rt.rf,aum:Math.max(0,+e.aum||Rt.aum)}}}function Ns(){return{kind:"local",label:"Local workspace · this browser",async load(){let t=null;try{t=JSON.parse(localStorage.getItem(Se)??"null")}catch{}if(t&&Array.isArray(t.portfolios)&&t.portfolios.length){const o=t.portfolios.flatMap(n=>{try{return[ie(n)]}catch{return[]}});if(o.length)return{version:2,activeId:o.some(n=>n.id===t.activeId)?t.activeId:o[0].id,portfolios:o}}const a=[Bs(),Us()].filter(Boolean);return{version:2,activeId:a[0].id,portfolios:a}},async save(t){localStorage.setItem(Se,JSON.stringify(t))}}}const ke=new Map,Os=15*60*1e3,js={GBp:["GBP",.01],GBX:["GBP",.01],ZAc:["ZAR",.01],ILA:["ILS",.01]};function Ye(t){return js[t]??[t||"USD",1]}async function Hs(t,a,o){var H,E,M,R,N,I,st,K,Z,z;const n=`${t}|${a}`,l=ke.get(n);if(l&&Date.now()-l.ts<Os)return l.data;const e=Math.floor(Dt(a)/1e3),s=Math.floor(Date.now()/1e3)+86400,r=`/v8/finance/chart/${encodeURIComponent(t)}?period1=${e}&period2=${s}&interval=1d&events=div%2Csplit&includePrePost=false`,i=await fetch(Ht(r),{headers:{Accept:"application/json"},signal:o});if(!i.ok)return null;const c=(M=(E=(H=await i.json())==null?void 0:H.chart)==null?void 0:E.result)==null?void 0:M[0];if(!((R=c==null?void 0:c.timestamp)!=null&&R.length))return null;const h=c.meta,[f,b]=Ye(h.currency),L=((st=(I=(N=c.indicators)==null?void 0:N.quote)==null?void 0:I[0])==null?void 0:st.close)??[],A=((z=(Z=(K=c.indicators)==null?void 0:K.adjclose)==null?void 0:Z[0])==null?void 0:z.adjclose)??L,x=[],P=[],k=[];if(c.timestamp.forEach((lt,O)=>{if(!(A[O]>0)||!(L[O]>0))return;const Q=$s(lt);if(x[x.length-1]===Q){P[P.length-1]=A[O],k[k.length-1]=L[O]*b;return}x.push(Q),P.push(A[O]),k.push(L[O]*b)}),!x.length)return null;const Y={symbol:t,currency:f,keys:x,adj:P,close:k,name:h.longName||h.shortName||t,type:h.instrumentType??"",price:h.regularMarketPrice!=null?h.regularMarketPrice*b:k[k.length-1]};return ke.set(n,{ts:Date.now(),data:Y}),Y}async function xe(t){var a,o,n,l;try{const e=`/v8/finance/chart/${encodeURIComponent(t)}?range=5d&interval=1d`,s=await fetch(Ht(e),{headers:{Accept:"application/json"}});if(!s.ok)return null;const r=(l=(n=(o=(a=await s.json())==null?void 0:a.chart)==null?void 0:o.result)==null?void 0:n[0])==null?void 0:l.meta;if(!r)return null;const[i,c]=Ye(r.currency);return{name:r.longName||r.shortName||t,currency:i,price:r.regularMarketPrice!=null?r.regularMarketPrice*c:null}}catch{return null}}async function Me(t,a,o){const n=[...t];await Promise.all(Array.from({length:Math.min(a,n.length)},async()=>{for(;n.length;)await o(n.shift())}))}async function Ws({symbols:t,base:a,fromKey:o,signal:n,onProgress:l}){const e=new Map,s=new Map,r=[];let i=0;const c=f=>Hs(f,o,n).catch(b=>{if(b.name==="AbortError")throw b;return null});await Me(t,6,async f=>{const b=await c(f);b?e.set(f,b):r.push(f),l==null||l(++i,t.length)});const h=[...new Set([...e.values()].map(f=>f.currency))].filter(f=>f!==a);return await Me(h,6,async f=>{const b=await c(`${f}${a}=X`);b&&s.set(f,b)}),{histories:e,fx:s,failed:r}}const ce={dark:["#3987e5","#d95926","#199e70","#c98500","#d55181","#008300","#9085e9","#e66767"],light:["#2a78d6","#eb6834","#1baf7a","#eda100","#e87ba4","#008300","#6250d6","#e34948"]},It=ce.dark.length;function Tt(){const t=document.documentElement.dataset.theme||"dark",a=getComputedStyle(document.documentElement),o=l=>a.getPropertyValue(l).trim(),n=t==="dark";return{dark:n,series:n?ce.dark:ce.light,text:o("--text-muted"),faint:o("--text-faint"),ink:o("--text-primary"),grid:o("--border"),border:o("--border-light"),accent:o("--accent"),up:o("--green"),down:o("--red"),other:n?"#7d867f":"#8e8e86",fontSize:t==="more-visible"?14:11,lineWidth:t==="more-visible"?3:2,mono:o("--font-mono")}}const tt=t=>String(t??"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a]),Ge=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],gt=t=>`${+t.slice(8,10)} ${Ge[+t.slice(5,7)-1]} ${t.slice(2,4)}`,Xe=t=>`${Ge[+t.slice(5,7)-1]} ${t.slice(2,4)}`;function Ve(t,a,o=5){a>t||(a=t+1,t-=1);const n=(a-t)/o,l=10**Math.floor(Math.log10(n)),e=[1,2,2.5,5,10].map(r=>r*l).find(r=>r>=n),s=[];for(let r=Math.floor(t/e+1e-6)*e;r<=a+e*1e-6;r+=e)s.push(+r.toFixed(12));return s[s.length-1]<a-e*1e-6&&s.push(s[s.length-1]+e),s}function _e(t){return`<div class="pl-legend">${t.map(a=>`<span class="pl-legend-item"><i class="${a.dash?"dash":""}" style="--c:${a.color}"></i>${tt(a.label)}</span>`).join("")}</div>`}function qe(t,a,o,n){t.hidden=!1;const l=t.offsetWidth,e=t.offsetHeight,s=a.clientWidth;t.style.left=`${Math.min(Math.max(4,o+14+l>s?o-l-14:o+14),s-l-4)}px`,t.style.top=`${Math.max(4,n-e/2)}px`}function Ke(t,a){let o=0;const n=()=>{t.clientWidth&&t.clientWidth!==o&&(o=t.clientWidth,a())},l=new ResizeObserver(n);return l.observe(t),n(),()=>l.disconnect()}function Ae(t,{dates:a,series:o,stacked:n=!1,height:l=260,fmt:e=c=>c.toFixed(2),rules:s=[],zero:r=!0,total:i}){t.innerHTML=`${_e(o)}<div class="pl-tc-plot" style="height:${l}px"></div><div class="pl-tip" hidden></div>`;const c=t.querySelector(".pl-tc-plot"),h=t.querySelector(".pl-tip"),f=a.length,b=Math.max(1,Math.ceil(f/700)),L=[];for(let Z=0;Z<f;Z+=b)L.push(Z);L[L.length-1]!==f-1&&L.push(f-1);const A=L.length,x=o.map(()=>new Float64Array(A)),P=o.map(()=>new Float64Array(A));let k=r?0:1/0,Y=r?0:-1/0;L.forEach((Z,z)=>{let lt=0,O=0;o.forEach((Q,q)=>{const X=Q.values[Z];if(!Number.isFinite(X)){x[q][z]=P[q][z]=NaN;return}n?X>=0?(x[q][z]=lt,P[q][z]=lt+=X):(P[q][z]=O,x[q][z]=O+=X):x[q][z]=P[q][z]=X,k=Math.min(k,x[q][z]),Y=Math.max(Y,P[q][z])})}),Number.isFinite(k)||(k=0,Y=1);const H={l:56,r:12,t:10,b:26};let E=0,M=()=>0,R=()=>0;const N=Z=>{let z=0,lt=A-1;for(;z<lt;){const O=z+lt>>1;L[O]<Z?z=O+1:lt=O}return z};function I(){E=Math.max(280,c.clientWidth);const Z=l,z=Ve(k,Y),lt=z[0],O=z[z.length-1];M=ot=>H.l+(A<2?0:ot/(A-1)*(E-H.l-H.r)),R=ot=>H.t+(1-(ot-lt)/(O-lt))*(Z-H.t-H.b);const Q=z.map(ot=>`<line class="pl-grid" x1="${H.l}" x2="${E-H.r}" y1="${R(ot)}" y2="${R(ot)}"/>
      <text class="pl-axis" x="${H.l-8}" y="${R(ot)+4}" text-anchor="end">${tt(e(ot))}</text>`).join(""),q=Math.max(2,Math.floor((E-H.l-H.r)/96)),X=Array.from({length:q},(ot,dt)=>Math.round(dt/(q-1)*(A-1))).map((ot,dt)=>`<text class="pl-axis" x="${M(ot)}" y="${Z-8}" text-anchor="${dt===0?"start":dt===q-1?"end":"middle"}">${Xe(a[L[ot]])}</text>`).join(""),ut=s.map(ot=>`<line class="pl-rule" x1="${M(N(ot.index))}" x2="${M(N(ot.index))}" y1="${H.t}" y2="${Z-H.b}"><title>${tt(ot.label)}</title></line>`).join(""),ct=(ot,dt=!1)=>{let wt="",u=!1;return(dt?[...Array(A).keys()].reverse():[...Array(A).keys()]).forEach(y=>{const m=ot[y];if(!Number.isFinite(m)){u=!1;return}wt+=`${u||dt?"L":"M"}${M(y).toFixed(1)},${R(m).toFixed(1)}`,u=!0}),wt},nt=o.map((ot,dt)=>n?`<path class="pl-area" d="${ct(P[dt])}${ct(x[dt],!0)}Z" fill="${ot.color}"/>`:`<path class="pl-line${ot.dash?" dash":""}" d="${ct(P[dt])}" stroke="${ot.color}"/>`).join(""),St=lt<0&&O>0?`<line class="pl-zero" x1="${H.l}" x2="${E-H.r}" y1="${R(0)}" y2="${R(0)}"/>`:"";c.innerHTML=`<svg width="${E}" height="${Z}" role="img">
      ${Q}${X}${nt}${St}${ut}
      <line class="pl-cross" y1="${H.t}" y2="${Z-H.b}" visibility="hidden"/>
      <g class="pl-dots"></g>
    </svg>`}function st(Z){const z=c.getBoundingClientRect(),lt=Z.clientX-z.left,O=Math.max(0,Math.min(A-1,Math.round((lt-H.l)/(E-H.l-H.r)*(A-1)))),Q=L[O],q=M(O),X=c.querySelector(".pl-cross");if(!X)return;X.setAttribute("x1",q),X.setAttribute("x2",q),X.setAttribute("visibility","visible"),c.querySelector(".pl-dots").innerHTML=n?"":o.map((nt,St)=>Number.isFinite(P[St][O])?`<circle cx="${q}" cy="${R(P[St][O])}" r="4" fill="${nt.color}" class="pl-dot"/>`:"").join("");const ut=(n?[...o].reverse():o).filter(nt=>Number.isFinite(nt.values[Q])&&(!n||Math.abs(nt.values[Q])>1e-6)).map(nt=>`<div class="pl-tip-row"><i style="background:${nt.color}"></i><span>${tt(nt.label)}</span><b>${tt(e(nt.values[Q]))}</b></div>`).join(""),ct=i?`<div class="pl-tip-row pl-tip-total"><span>${tt(i.label)}</span><b>${tt(e(i.values[Q]))}</b></div>`:"";h.innerHTML=`<div class="pl-tip-date">${gt(a[Q])}</div>${ut}${ct}`,qe(h,t,q,Z.clientY-t.getBoundingClientRect().top)}function K(){var z;h.hidden=!0,(z=c.querySelector(".pl-cross"))==null||z.setAttribute("visibility","hidden");const Z=c.querySelector(".pl-dots");Z&&(Z.innerHTML="")}return c.addEventListener("pointermove",st),c.addEventListener("pointerleave",K),Ke(c,I)}function Ys(t,{dates:a,events:o,height:n=200,fmt:l=r=>r.toFixed(2),upLabel:e="Buys",downLabel:s="Sells"}){const r=Tt();t.innerHTML=`${_e([{label:e,color:r.up},{label:s,color:r.down}])}
    <div class="pl-tc-plot" style="height:${n}px"></div><div class="pl-tip" hidden></div>`;const i=t.querySelector(".pl-tc-plot"),c=t.querySelector(".pl-tip"),h=a.length,f=Math.max(1e-9,...o.map(A=>Math.max(A.up,A.down))),b={l:56,r:12,t:10,b:26};function L(){const A=Math.max(280,i.clientWidth),x=n,P=Ve(-f,f,4),k=P[0],Y=P[P.length-1],H=K=>b.l+(h<2?0:K/(h-1)*(A-b.l-b.r)),E=K=>b.t+(1-(K-k)/(Y-k))*(x-b.t-b.b),M=Math.max(3,Math.min(14,(A-b.l-b.r)/Math.max(o.length,1)*.6)),R=P.map(K=>`<line class="pl-grid" x1="${b.l}" x2="${A-b.r}" y1="${E(K)}" y2="${E(K)}"/>
      <text class="pl-axis" x="${b.l-8}" y="${E(K)+4}" text-anchor="end">${tt(l(Math.abs(K)))}</text>`).join(""),N=Math.max(2,Math.floor((A-b.l-b.r)/96)),I=Array.from({length:N},(K,Z)=>Math.round(Z/(N-1)*(h-1))).map((K,Z)=>`<text class="pl-axis" x="${H(K)}" y="${x-8}" text-anchor="${Z===0?"start":Z===N-1?"end":"middle"}">${Xe(a[K])}</text>`).join(""),st=o.map((K,Z)=>{const z=H(K.index)-M/2;return`<g class="pl-evt" data-j="${Z}">
        <rect class="pl-hit" x="${z-4}" y="${b.t}" width="${M+8}" height="${x-b.t-b.b}"/>
        ${K.up>0?`<rect x="${z}" y="${E(K.up)}" width="${M}" height="${Math.max(1,E(0)-E(K.up)-1)}" rx="2" fill="${r.up}"/>`:""}
        ${K.down>0?`<rect x="${z}" y="${E(0)+1}" width="${M}" height="${Math.max(1,E(-K.down)-E(0)-1)}" rx="2" fill="${r.down}"/>`:""}
      </g>`}).join("");i.innerHTML=`<svg width="${A}" height="${x}" role="img">${R}${I}
      <line class="pl-zero" x1="${b.l}" x2="${A-b.r}" y1="${E(0)}" y2="${E(0)}"/>${st}</svg>`}return i.addEventListener("pointermove",A=>{var k,Y;const x=(Y=(k=A.target).closest)==null?void 0:Y.call(k,".pl-evt");if(!x){c.hidden=!0;return}c.innerHTML=o[+x.dataset.j].html;const P=t.getBoundingClientRect();qe(c,t,A.clientX-P.left,A.clientY-P.top)}),i.addEventListener("pointerleave",()=>{c.hidden=!0}),Ke(i,L)}const Gs=[{label:"US",suffix:""},{label:"ASX",suffix:".AX"},{label:"LSE",suffix:".L"},{label:"TSX",suffix:".TO"},{label:"XETRA",suffix:".DE"},{label:"TSE",suffix:".T"},{label:"HKEX",suffix:".HK"}],le=[{spec:"SPY",label:"S&P 500 (SPY)"},{spec:"ACWI",label:"MSCI ACWI (ACWI)"},{spec:"QQQ",label:"Nasdaq-100 (QQQ)"},{spec:"STW.AX",label:"S&P/ASX 200 (STW)"},{spec:"AGG",label:"US Aggregate Bond (AGG)"},{spec:"ACWI:60,AGG:40",label:"60/40 Global (ACWI / AGG)"},{spec:"^GSPC",label:"S&P 500 price index"}],Xs=["USD","AUD","EUR","GBP","JPY","CAD","CHF","HKD","NZD","SGD"],Vs=[["none","Drift between dates"],["monthly","Rebalance monthly"],["quarterly","Rebalance quarterly"],["annual","Rebalance annually"]],_s=[["1m","1M"],["3m","3M"],["6m","6M"],["ytd","YTD"],["1y","1Y"],["3y","3Y"],["all","Inception"]],qs=[["overview","Overview"],["attribution","Attribution"],["trading","Trading"],["risk","Risk"]],Ks=[["growth","Growth of 100"],["drawdown","Drawdown"],["active","Relative"],["vol","Rolling vol"],["beta","Rolling beta"],["sharpe","Rolling Sharpe"],["te","Rolling TE"]],Ee=63,Le="2019-12-01",Gt=Ns();let ht=null,it=null,Bt=63;const rt={view:"overview",perfMode:"growth",period:"all",from:null,to:null,weightsMode:"actual",calMode:"p",tradeFilter:"scheduled"},mt=()=>ht.portfolios.find(t=>t.id===ht.activeId)??ht.portfolios[0],kt=t=>t!=null&&Number.isFinite(t),g={pct:(t,a=2)=>kt(t)?`${t>=0?"+":""}${(t*100).toFixed(a)}%`:"—",pctU:(t,a=1)=>kt(t)?`${(t*100).toFixed(a)}%`:"—",num:(t,a=2)=>kt(t)?t.toFixed(a):"—",bps:t=>kt(t)?`${(t*1e4).toFixed(0)} bps`:"—",cls:t=>!kt(t)||Math.abs(t)<5e-7?"":t>0?"up":"dn",money(t,a,o=!1){if(!kt(t))return"—";try{return new Intl.NumberFormat("en-US",{style:"currency",currency:a,notation:o?"compact":"standard",maximumFractionDigits:o?1:0}).format(t)}catch{return t.toFixed(0)}}},Lt=(t,a)=>t<It?a.series[t]:a.other;function Xt(t,a,o="text/csv"){const n=URL.createObjectURL(new Blob([a],{type:o})),l=Object.assign(document.createElement("a"),{href:n,download:t});document.body.appendChild(l),l.click(),l.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e3)}const Vt=t=>t.replace(/[^\w.-]+/g,"_").slice(0,60)||"portfolio",zs=t=>/[",\n]/.test(String(t))?`"${String(t).replace(/"/g,'""')}"`:String(t);function _t(t,a){const o=/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(t.trim());return o?`rgba(${parseInt(o[1],16)},${parseInt(o[2],16)},${parseInt(o[3],16)},${a})`:t}function Nt(t,a,o){return`<div class="pl-seg" role="group">${a.map(([n,l])=>`<button class="port-period-btn${n===o?" active":""}" data-action="${t}" data-value="${n}">${l}</button>`).join("")}</div>`}function yt(t,a,{tools:o="",cls:n=""}={}){return`<section class="mkt-panel pl-panel ${n}">
    <div class="pl-panel-hdr"><span class="mkt-panel-label">${t}</span>${o}</div>${a}</section>`}function pt(t,a,{cls:o="",sub:n=""}={}){return`<div class="pl-kpi"><div class="pl-kpi-label">${t}</div><div class="pl-kpi-val ${o}">${a}</div>${n?`<div class="pl-kpi-sub">${n}</div>`:""}</div>`}const de=(t,a)=>t.assets.reduce((o,n)=>o+(+a.weights[n.symbol]||0),0);function Te(t){const a=[],o=[];t.assets.length||a.push("Add at least one asset.");const n=t.schedule.map(l=>l.date);return n.some(l=>!Ot(l))?a.push("Every rebalance column needs a valid date."):(new Set(n).size!==n.length&&a.push("Two rebalance columns share a date."),n[0]>=Ct()&&a.push("The inception date must be in the past.")),We(t.settings.benchmark).length||a.push("Choose a benchmark."),t.schedule.forEach(l=>{const e=de(t,l);t.assets.length&&Math.abs(e-100)>.05&&Ot(l.date)&&o.push(`${gt(l.date)}: ${e.toFixed(1)}% invested (${e<100?`${(100-e).toFixed(1)}% cash`:`${(e-100).toFixed(1)}% financed`})`)}),{errors:a,notes:o}}function Qs(t){const a=t.trim().split(/\r?\n/).filter(r=>r.trim());if(a.length<2)throw new Error("Paste a header row and at least one rebalance row.");const o=r=>r.split(/[,\t;]/).map(i=>i.trim().replace(/^"|"$/g,"")),n=o(a[0]);if(!/^date$/i.test(n[0]))throw new Error('The first column header must be "date".');const l=n.slice(1).map(r=>r.toUpperCase());if(!l.length||l.some(r=>!r))throw new Error('Every column after "date" needs a ticker.');const e=a.slice(1).map((r,i)=>{const c=o(r);let h=c[0];const f=/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(h);if(f&&(h=`${f[3]}-${f[2].padStart(2,"0")}-${f[1].padStart(2,"0")}`),!Ot(h))throw new Error(`Row ${i+2}: "${c[0]}" is not a date (use YYYY-MM-DD or DD/MM/YYYY).`);const b=l.map((L,A)=>parseFloat((c[A+1]??"").replace("%",""))||0);return{date:h,vals:b}}),s=e.every(r=>r.vals.every(i=>Math.abs(i)<=1.5)&&r.vals.reduce((i,c)=>i+c,0)<=1.5);return{symbols:l,rows:e.map(r=>({date:r.date,weights:Object.fromEntries(l.map((i,c)=>[i,+(s?r.vals[c]*100:r.vals[c]).toFixed(4)]))}))}}function Js(t){t.innerHTML=`
    <div class="mkt-topbar">
      <div class="mkt-topbar-left">
        <div><div class="eyebrow">03 / PORTFOLIO LAB</div><h1 class="mkt-title">Construction, attribution &amp; risk</h1></div>
      </div>
      <div class="mkt-actions"><span class="data-note" id="pl-save-state">Loading workspace…</span></div>
    </div>
    <div class="mkt-panel pl-workbar" id="pl-workbar"></div>
    <div class="mkt-panel pl-builder" id="pl-builder"></div>
    <div id="pl-results"></div>
    <dialog class="pl-dialog" id="pl-csv-dialog">
      <form method="dialog" class="pl-dialog-body">
        <div class="mkt-panel-label">Import schedule from CSV</div>
        <p class="pl-note">One row per rebalance date, one column per Yahoo ticker. Weights as percentages or fractions. Pasting replaces the current schedule; new tickers are looked up and added.</p>
        <pre class="pl-code">date,SPY,AGG,GLD,CBA.AX
2022-01-03,50,30,10,10
2023-07-03,45,30,15,10</pre>
        <textarea id="pl-csv-text" rows="8" spellcheck="false" placeholder="Paste CSV here"></textarea>
        <div class="pl-dialog-foot">
          <span class="port-add-err" id="pl-csv-err"></span>
          <button class="ghost-btn" value="cancel" formnovalidate>Cancel</button>
          <button class="port-analyze-btn" type="button" data-action="csv-apply">Import</button>
        </div>
      </form>
    </dialog>
    <input type="file" id="pl-import-file" accept="application/json,.json" hidden>
  `;const a=u=>t.querySelector(u),o=a("#pl-workbar"),n=a("#pl-builder"),l=a("#pl-results"),e=a("#pl-save-state"),s=a("#pl-csv-dialog"),r=a("#pl-import-file");let i=null,c=null,h=!0,f=[],b=null;const L=()=>{b==null||b(),b=null,f.forEach(u=>u()),f=[]};function A(){return clearTimeout(c),c=null,Gt.save(ht).then(()=>{h&&(e.textContent=`${Gt.label} · saved ${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`)}).catch(()=>{h&&(e.textContent="Could not save — browser storage unavailable")})}function x(){mt().updatedAt=Date.now(),e.textContent="Saving…",clearTimeout(c),c=setTimeout(A,300);const u=t.querySelector("#pl-stale");u&&it&&(u.hidden=mt().updatedAt<=it.ranAt)}function P(){const u=mt();o.innerHTML=`<div class="pl-workbar-row">
      <label class="pl-field pl-field-inline"><span>Portfolio</span>
        <select id="pl-pf-select" class="sa-market-sel">${ht.portfolios.map(d=>`<option value="${d.id}"${d.id===u.id?" selected":""}>${tt(d.name)}</option>`).join("")}</select>
      </label>
      <label class="pl-field pl-field-inline pl-grow"><span>Name</span><input id="pl-name" class="sa-ticker-inp pl-name-inp" value="${tt(u.name)}" maxlength="80"></label>
      <div class="pl-btn-group">
        <button class="ghost-btn" data-action="new">New</button>
        <button class="ghost-btn" data-action="duplicate">Duplicate</button>
        <button class="ghost-btn" data-action="export-json" title="Download this portfolio as a JSON file">Export</button>
        <button class="ghost-btn" data-action="import-json" title="Load a portfolio JSON file">Import</button>
        <button class="ghost-btn pl-danger" data-action="delete">Delete</button>
      </div>
    </div>`}function k(u){if(!u.assets.length)return'<div class="port-empty">No assets yet — add tickers above, or import a schedule from CSV.</div>';const d=Tt(),y=u.schedule;return`<div class="pl-sched-scroll"><table class="pl-sched">
      <thead><tr>
        <th class="pl-sticky">Asset</th>
        ${y.map((m,S)=>`<th class="pl-col-hdr">
          <div class="pl-col-top"><span>${S===0?"Inception":`Rebalance ${S}`}</span>
            ${y.length>1?`<button class="pl-x" data-action="del-col" data-col="${S}" title="Remove this date" aria-label="Remove this date">×</button>`:""}</div>
          <input type="date" class="pl-date-inp" data-col="${S}" value="${m.date}" max="${Ct()}">
        </th>`).join("")}
        <th class="pl-add-col"><button class="ghost-btn" data-action="add-col">+ Date</button></th>
      </tr></thead>
      <tbody>${u.assets.map((m,S)=>`<tr>
        <td class="pl-sticky"><div class="pl-asset">
          <span class="pl-swatch" style="background:${Lt(S,d)}"></span>
          <span class="pl-asset-sym">${tt(m.display)}</span>
          <span class="pl-asset-meta" title="${tt(m.name)}">${tt(m.name)}${m.currency?` · ${tt(m.currency)}`:""}</span>
          <button class="pl-x" data-action="del-asset" data-sym="${tt(m.symbol)}" title="Remove ${tt(m.display)}" aria-label="Remove ${tt(m.display)}">×</button>
        </div></td>
        ${y.map((B,C)=>`<td><input type="number" class="pl-cell" data-col="${C}" data-sym="${tt(m.symbol)}" value="${B.weights[m.symbol]??""}" step="0.5" placeholder="0" aria-label="${tt(m.display)} weight on ${B.date}"></td>`).join("")}
        <td></td>
      </tr>`).join("")}</tbody>
      <tfoot>
        <tr class="pl-total-row"><td class="pl-sticky">Invested</td>${y.map((m,S)=>`<td class="num" data-total="${S}"></td>`).join("")}<td></td></tr>
        <tr class="pl-cash-row"><td class="pl-sticky">Cash</td>${y.map((m,S)=>`<td class="num" data-cash="${S}"></td>`).join("")}<td></td></tr>
        <tr class="pl-tools-row"><td class="pl-sticky"></td>${y.map((m,S)=>`<td>
          <button class="pl-mini-btn" data-action="normalise" data-col="${S}" title="Scale this column to 100%">→100</button>
          <button class="pl-mini-btn" data-action="equal" data-col="${S}" title="Equal-weight this column">EW</button></td>`).join("")}<td></td></tr>
      </tfoot>
    </table></div>`}function Y(){const u=mt(),d=u.settings,y=le.some(m=>m.spec===d.benchmark);n.innerHTML=`
      <div class="mkt-panel-label">Allocation schedule</div>
      <p class="pl-intro">Each column is a target allocation. The portfolio trades to it at the close of that date, then drifts with the market — or resets to the latest target on the calendar policy below — until the next column. Under 100% holds cash at the risk-free rate; over 100% is financed at the same rate. Negative weights are shorts.</p>
      <div class="port-add-form">
        <select id="pl-market" class="sa-market-sel" aria-label="Exchange">${Gs.map(m=>`<option value="${m.suffix}">${m.label}</option>`).join("")}</select>
        <input id="pl-ticker" type="text" class="sa-ticker-inp" placeholder="Ticker (e.g. MSFT, BTC-USD)" maxlength="16" aria-label="Ticker">
        <button class="ghost-btn" data-action="add-asset">+ Add asset</button>
        <span id="pl-add-err" class="port-add-err" role="status"></span>
        <span class="pl-grow"></span>
        <button class="ghost-btn" data-action="csv-open">Paste CSV</button>
        <button class="ghost-btn" data-action="csv-export">Export CSV</button>
      </div>
      ${k(u)}
      <div class="pl-settings">
        <label class="pl-field"><span>Benchmark</span>
          <select id="pl-bench" class="sa-market-sel">${le.map(m=>`<option value="${tt(m.spec)}"${m.spec===d.benchmark?" selected":""}>${m.label}</option>`).join("")}
            <option value="__custom"${y?"":" selected"}>Custom / blend…</option></select>
        </label>
        <label class="pl-field" id="pl-bench-custom-wrap"${y?" hidden":""}><span>Custom benchmark</span>
          <input id="pl-bench-custom" class="sa-ticker-inp" value="${y?"":tt(d.benchmark)}" placeholder="VT or IOZ.AX:70,AGG:30"></label>
        <label class="pl-field"><span>Base currency</span>
          <select class="sa-market-sel" data-setting="base">${Xs.map(m=>`<option${m===d.base?" selected":""}>${m}</option>`).join("")}</select></label>
        <label class="pl-field"><span>Between dates</span>
          <select class="sa-market-sel" data-setting="rebalance">${Vs.map(([m,S])=>`<option value="${m}"${m===d.rebalance?" selected":""}>${S}</option>`).join("")}</select></label>
        <label class="pl-field"><span>Trading cost (bps)</span><input type="number" class="sa-ticker-inp pl-num-inp" data-setting="costBps" value="${d.costBps}" min="0" step="1"></label>
        <label class="pl-field"><span>Risk-free (% p.a.)</span><input type="number" class="sa-ticker-inp pl-num-inp" data-setting="rf" value="${d.rf}" step="0.25"></label>
        <label class="pl-field"><span>Portfolio value (${tt(d.base)})</span><input type="number" class="sa-ticker-inp pl-num-inp pl-aum" data-setting="aum" value="${d.aum}" min="0" step="10000"></label>
      </div>
      <div class="port-holdings-footer">
        <div id="pl-validate" class="pl-validate" role="status"></div>
        <button class="port-analyze-btn" data-action="run">Run backtest</button>
      </div>`,H()}function H(){const u=mt();u.schedule.forEach((S,B)=>{const C=de(u,S),$=n.querySelector(`[data-total="${B}"]`),j=n.querySelector(`[data-cash="${B}"]`);$&&($.textContent=`${C.toFixed(1)}%`,$.className=`num ${Math.abs(C-100)<.05?"up":C>100?"dn":""}`),j&&(j.textContent=`${(100-C).toFixed(1)}%`)});const{errors:d,notes:y}=Te(u),m=n.querySelector("#pl-validate");m&&(m.innerHTML=[...d.map(S=>`<span class="dn">${tt(S)}</span>`),...y.slice(0,3).map(S=>`<span>${tt(S)}</span>`),y.length>3?`<span>+${y.length-3} more columns not fully invested</span>`:""].join(""))}function E(){P(),Y(),Z()}async function M(){var $;const u=mt(),d=n.querySelector("#pl-add-err"),y=n.querySelector('[data-action="add-asset"]'),m=n.querySelector("#pl-ticker").value.trim().toUpperCase();if(!m){d.textContent="Enter a ticker";return}const S=n.querySelector("#pl-market").value,B=m.includes(".")?m:m+S;if(u.assets.some(j=>j.symbol===B)){d.textContent="Already in the portfolio";return}y.disabled=!0,d.textContent="Looking up…";const C=await xe(B);if(h){if(y.disabled=!1,!C){d.textContent=`"${B}" not found`;return}u.assets.push({symbol:B,display:B.replace(/\.[A-Z]+$/,""),name:C.name,currency:C.currency}),x(),Y(),($=n.querySelector("#pl-ticker"))==null||$.focus()}}async function R(){const u=a("#pl-csv-err");let d;try{d=Qs(a("#pl-csv-text").value)}catch($){u.textContent=$.message;return}const y=mt(),m=new Set(y.assets.map($=>$.symbol)),S=d.symbols.filter($=>!m.has($));u.textContent=S.length?`Looking up ${S.length} ticker${S.length>1?"s":""}…`:"";const B=await Promise.all(S.map($=>xe($)));if(!h)return;const C=S.filter(($,j)=>!B[j]);if(C.length){u.textContent=`Not found: ${C.join(", ")}`;return}S.forEach(($,j)=>y.assets.push({symbol:$,display:$.replace(/\.[A-Z]+$/,""),name:B[j].name,currency:B[j].currency})),y.schedule=d.rows.sort(($,j)=>$.date.localeCompare(j.date)).map($=>({id:At(),date:$.date,weights:$.weights})),x(),s.close(),Y()}function N(){const u=mt(),d=[["date",...u.assets.map(y=>y.symbol)].join(",")];u.schedule.forEach(y=>d.push([y.date,...u.assets.map(m=>+y.weights[m.symbol]||0)].join(","))),Xt(`${Vt(u.name)}-schedule.csv`,d.join(`
`))}const I={new(){const u=Jt();ht.portfolios.push(u),ht.activeId=u.id,x(),E()},duplicate(){const u=ie(structuredClone(mt()),{freshId:!0});u.name=`${mt().name} (copy)`,u.createdAt=Date.now(),ht.portfolios.push(u),ht.activeId=u.id,x(),E()},delete(){const u=mt();confirm(`Delete "${u.name}"? This cannot be undone.`)&&(ht.portfolios=ht.portfolios.filter(d=>d.id!==u.id),ht.portfolios.length||ht.portfolios.push(Jt()),ht.activeId=ht.portfolios[0].id,x(),E())},"export-json"(){const u=mt();Xt(`${Vt(u.name)}.portfolio.json`,JSON.stringify({format:"portlab",version:2,...u},null,2),"application/json")},"import-json"(){r.value="",r.click()},"add-asset":M,"del-asset"(u){const d=mt(),y=u.dataset.sym;d.assets=d.assets.filter(m=>m.symbol!==y),d.schedule.forEach(m=>delete m.weights[y]),x(),Y()},"add-col"(){var m;const u=mt(),d=u.schedule[u.schedule.length-1];let y=xt(d.date,3);y>=Ct()&&(y=ge(Ct(),-1)),u.schedule.push({id:At(),date:y,weights:{...d.weights}}),u.schedule.sort((S,B)=>S.date.localeCompare(B.date)),x(),Y(),(m=n.querySelector(".pl-sched-scroll"))==null||m.scrollTo({left:1e6,behavior:"smooth"})},"del-col"(u){mt().schedule.splice(+u.dataset.col,1),x(),Y()},normalise(u){const d=mt(),y=d.schedule[+u.dataset.col],m=de(d,y);m&&(d.assets.forEach(S=>{y.weights[S.symbol]&&(y.weights[S.symbol]=+(y.weights[S.symbol]*100/m).toFixed(2))}),x(),Y())},equal(u){const d=mt(),y=d.schedule[+u.dataset.col];d.assets.forEach(m=>{y.weights[m.symbol]=+(100/d.assets.length).toFixed(2)}),x(),Y()},"csv-open"(){a("#pl-csv-err").textContent="",s.showModal()},"csv-apply":R,"csv-export":N,run:K,view(u){rt.view=u.dataset.value,Z()},"perf-mode"(u){rt.perfMode=u.dataset.value,st(u),O()},"weights-mode"(u){rt.weightsMode=u.dataset.value,st(u),Q()},"cal-mode"(u){rt.calMode=u.dataset.value,st(u),t.querySelector("#pl-monthly").innerHTML=X()},period(u){rt.period=u.dataset.value,rt.from=rt.to=null,z()},"trade-filter"(u){rt.tradeFilter=u.dataset.value,z()},"export-results":ot,"export-trades":dt},st=u=>u.parentElement.querySelectorAll("button").forEach(d=>d.classList.toggle("active",d===u));t.addEventListener("click",u=>{var y;const d=u.target.closest("[data-action]");!d||!ht||d.disabled||(y=I[d.dataset.action])==null||y.call(I,d)}),t.addEventListener("input",u=>{const d=u.target;if(d.classList.contains("pl-cell")){const y=mt().schedule[+d.dataset.col],m=parseFloat(d.value);Number.isFinite(m)?y.weights[d.dataset.sym]=m:delete y.weights[d.dataset.sym],H(),x()}}),t.addEventListener("change",u=>{const d=u.target,y=ht&&mt();if(y)if(d.id==="pl-pf-select")ht.activeId=d.value,x(),E();else if(d.id==="pl-name")y.name=d.value.trim()||"Untitled portfolio",x(),P();else if(d.classList.contains("pl-date-inp")){if(!Ot(d.value)){H();return}y.schedule[+d.dataset.col].date=d.value,y.schedule.sort((m,S)=>m.date.localeCompare(S.date)),x(),Y()}else if(d.id==="pl-bench"){const m=d.value==="__custom";n.querySelector("#pl-bench-custom-wrap").hidden=!m,m?n.querySelector("#pl-bench-custom").focus():(y.settings.benchmark=d.value,x(),H())}else if(d.id==="pl-bench-custom")y.settings.benchmark=d.value.trim().toUpperCase(),x(),H();else if(d.dataset.setting){const m=d.dataset.setting;y.settings[m]=["costBps","rf","aum"].includes(m)?parseFloat(d.value)||0:d.value,x(),m==="base"&&Y()}else(d.id==="pl-attr-from"||d.id==="pl-attr-to")&&(rt.period="custom",rt.from=t.querySelector("#pl-attr-from").value||null,rt.to=t.querySelector("#pl-attr-to").value||null,z())}),t.addEventListener("keydown",u=>{u.key==="Enter"&&u.target.id==="pl-ticker"&&M()}),r.addEventListener("change",async()=>{var d;const u=(d=r.files)==null?void 0:d[0];if(u)try{const y=ie(JSON.parse(await u.text()),{freshId:!0});ht.portfolios.push(y),ht.activeId=y.id,x(),E()}catch(y){alert(`Could not import that file: ${y.message}`)}});async function K(){var p,v;const u=mt(),{errors:d}=Te(u);if(d.length){H();return}i==null||i.abort(),i=new AbortController;const{signal:y}=i,m=n.querySelector('[data-action="run"]');m.disabled=!0,L(),l.innerHTML='<div class="port-msg port-loading"><div class="sa-spinner"></div><span id="pl-progress">Fetching price history…</span></div>';const S=u.settings,B=u.assets.map(U=>U.symbol),C=We(S.benchmark),$=[...u.schedule].sort((U,w)=>U.date.localeCompare(w.date)),j=$[0].date,at=ge(j<Le?j:Le,-10),J=[...new Set([...B,...C.map(U=>U.symbol)])];try{const U=await Ws({symbols:J,base:S.base,fromKey:at,signal:y,onProgress:(W,_)=>{const bt=t.querySelector("#pl-progress");bt&&(bt.textContent=`Fetching price history… ${W}/${_}`)}});if(!h||y.aborted)return;if(U.failed.length)throw new Error(`Could not load price history for: ${U.failed.join(", ")}`);u.assets.forEach(W=>{var _;W.currency||(W.currency=((_=U.histories.get(W.symbol))==null?void 0:_.currency)??"")});const w=Ss({symbols:B,benchLegs:C,histories:U.histories,fx:U.fx,base:S.base,fromKey:at}),T={symbols:B,schedule:$,rebalance:S.rebalance,costBps:S.costBps,rf:S.rf/100},V=ye(w,T),D=ye(w,{...T,schedule:[$[0]],rebalance:"none",costBps:0}),G=xs(w,V.t0),F=S.rf/100;if(it={pfId:u.id,name:u.name,ranAt:Date.now(),settings:{...S},assets:u.assets.map(W=>({...W})),benchLabel:((p=le.find(W=>W.spec===S.benchmark))==null?void 0:p.label)??S.benchmark,panel:w,bt:V,policy:D,bench:G,rf:F,stats:As(V.ret,G.ret,F),roll:Es(V.ret,G.ret,F,Ee),attrAll:we(w,V,0,V.dates.length-1),warnings:[...w.warnings,...V.warnings]},!it.stats)throw new Error("Not enough history after the inception date — need at least a week of prices.");rt.period="all",rt.from=rt.to=null,x(),it.ranAt=mt().updatedAt,Z()}catch(U){if(U.name==="AbortError"||!h)return;it=null,l.innerHTML=`<div class="port-msg port-err">${tt(U.message||"Backtest failed.")}</div>`}finally{h&&((v=n.querySelector('[data-action="run"]'))==null||v.removeAttribute("disabled"))}}function Z(){L();const u=mt();if(!it||it.pfId!==u.id){l.innerHTML=`<div class="pl-empty">
        <div class="pl-empty-title">Run the backtest to analyse “${tt(u.name)}”.</div>
        <div class="pl-empty-body">You'll get performance against the benchmark, weights and trades through time, NAV-linked return attribution with currency effects, and ex-ante risk with historical stress tests.</div>
      </div>`;return}const{bt:d,settings:y}=it;l.innerHTML=`
      <div class="pl-results-head">
        <div class="pl-subtabs" role="tablist">${qs.map(([m,S])=>`<button class="pl-subtab${m===rt.view?" active":""}" role="tab" aria-selected="${m===rt.view}" data-action="view" data-value="${m}">${S}</button>`).join("")}</div>
        <div class="pl-run-meta">
          <span>${gt(d.dates[0])} → ${gt(d.dates[d.dates.length-1])}</span>
          <span>${tt(y.base)} · vs ${tt(it.benchLabel)}</span>
          <span class="pl-stale" id="pl-stale"${mt().updatedAt>it.ranAt?"":" hidden"}>Schedule edited since this run — <button class="pl-link" data-action="run">re-run</button></span>
          <button class="ghost-btn pl-sm" data-action="export-results">Export series CSV</button>
        </div>
      </div>
      ${it.warnings.length?`<div class="pl-warn">${it.warnings.map(m=>`<div>⚠ ${tt(m)}</div>`).join("")}</div>`:""}
      <div id="pl-view" class="pl-view"></div>`,z()}function z(){L();const u=t.querySelector("#pl-view");!u||!it||{overview:lt,attribution:ct,trading:nt,risk:St}[rt.view](u)}function lt(u){const{stats:d}=it;u.innerHTML=`
      <div class="pl-kpis">
        <div class="pl-kpi-group"><div class="pl-kpi-title">Absolute</div><div class="pl-kpi-row">
          ${pt("Total return",g.pct(d.total),{cls:g.cls(d.total),sub:`Bench ${g.pct(d.btotal)}`})}
          ${pt("CAGR",g.pct(d.cagr),{cls:g.cls(d.cagr),sub:`Bench ${g.pct(d.bcagr)}`})}
          ${pt("Volatility",g.pctU(d.vol),{sub:`Bench ${g.pctU(d.bvol)}`})}
          ${pt("Sharpe",g.num(d.sharpe),{sub:`Sortino ${g.num(d.sortino)}`})}
          ${pt("Max drawdown",g.pct(-d.maxDD),{cls:"dn",sub:`Bench ${g.pct(-d.bMaxDD)}`})}
          ${pt("Calmar",g.num(d.calmar),{sub:`${d.years.toFixed(1)} yrs of data`})}
        </div></div>
        <div class="pl-kpi-group"><div class="pl-kpi-title">Relative to benchmark</div><div class="pl-kpi-row">
          ${pt("Active return p.a.",g.pct(d.activeCagr),{cls:g.cls(d.activeCagr)})}
          ${pt("Tracking error",g.pctU(d.te))}
          ${pt("Information ratio",g.num(d.ir),{cls:g.cls(d.ir)})}
          ${pt("Beta",g.num(d.beta),{sub:`Correlation ${g.num(d.corr)}`})}
          ${pt("Alpha p.a.",g.pct(d.alpha),{cls:g.cls(d.alpha),sub:"Jensen, daily"})}
          ${pt("Up / down capture",`${g.num(d.upCap*100,0)} / ${g.num(d.downCap*100,0)}`,{sub:"Daily, % of benchmark"})}
        </div></div>
      </div>
      ${yt("Performance",`<div class="pl-lw-legend" id="pl-perf-legend"></div><div class="pl-lw" id="pl-perf"></div>
        <p class="pl-note">Total return in ${tt(it.settings.base)} after trading costs. ▼ marks scheduled rebalances. Rolling statistics use a ${Ee}-day window.</p>`,{tools:Nt("perf-mode",Ks,rt.perfMode)})}
      ${yt("Weights through time",`<div id="pl-weights" class="pl-chart"></div>
        <p class="pl-note">Actual shows drifted end-of-day weights; target shows the policy in force. Vertical rules are scheduled rebalances.</p>`,{tools:Nt("weights-mode",[["actual","Actual"],["target","Target"]],rt.weightsMode)})}
      ${yt("Current positioning",q())}
      ${yt("Monthly returns",`<div id="pl-monthly" class="pl-table-scroll">${X()}</div>`,{tools:Nt("cal-mode",[["p","Portfolio"],["b","Benchmark"],["a","Active"]],rt.calMode)})}`,O(),Q()}async function O(){b==null||b(),b=null;const u=t.querySelector("#pl-perf"),d=t.querySelector("#pl-perf-legend");if(!u)return;const{createChart:y}=await je(async()=>{const{createChart:G}=await import("./lightweight-charts.production-C-4kb1nc.js");return{createChart:G}},[]);if(!u.isConnected)return;u.innerHTML="";const m=Tt(),{bt:S,bench:B,policy:C,roll:$}=it,j=S.dates,at=rt.perfMode,J=!["growth","beta","sharpe"].includes(at),p=G=>J?`${G.toFixed(1)}%`:G.toFixed(at==="growth"?1:2),v=y(u,{autoSize:!0,layout:{background:{color:"transparent"},textColor:m.text,fontSize:m.fontSize,fontFamily:m.mono},grid:{vertLines:{color:m.grid},horzLines:{color:m.grid}},rightPriceScale:{borderColor:m.border},timeScale:{borderColor:m.border},localization:{priceFormatter:p},crosshair:{mode:0}}),U=[],w=(G,F,W,_=0,bt=m.lineWidth)=>{const et=v.addLineSeries({color:F,lineWidth:bt,lineStyle:_,priceLineVisible:!1,crosshairMarkerRadius:4});return et.setData(j.map((ft,Ut)=>kt(W[Ut])?{time:ft,value:W[Ut]}:{time:ft})),U.push({label:G,color:F,series:et,values:W,style:_}),et},T=(G,F)=>Array.from(G,F);if(at==="growth"){const G=w("Portfolio",m.accent,T(S.nav,F=>F*100));w(it.benchLabel,m.text,T(B.nav,F=>F*100),2,1.5),w("Inception weights, buy & hold",m.faint,T(C.nav,F=>F*100),1,1.5),G.setMarkers(S.trades.filter(F=>F.type==="scheduled").map(F=>({time:F.date,position:"aboveBar",color:m.accent,shape:"arrowDown"})))}else if(at==="drawdown")w("Portfolio",m.accent,T($e(S.nav),G=>G*100)),w(it.benchLabel,m.text,T($e(B.nav),G=>G*100),2,1.5);else if(at==="active"){const G=T(S.nav,(W,_)=>(W/B.nav[_]-1)*100),F=v.addBaselineSeries({baseValue:{type:"price",price:0},lineWidth:m.lineWidth,priceLineVisible:!1,topLineColor:m.up,topFillColor1:_t(m.up,.28),topFillColor2:_t(m.up,.04),bottomLineColor:m.down,bottomFillColor1:_t(m.down,.04),bottomFillColor2:_t(m.down,.28)});F.setData(j.map((W,_)=>({time:W,value:G[_]}))),U.push({label:"Relative wealth vs benchmark",color:m.up,series:F,values:G})}else at==="vol"?(w("Portfolio",m.accent,T($.vol,G=>G*100)),w(it.benchLabel,m.text,T($.bvol,G=>G*100),2,1.5)):at==="beta"?w("Portfolio beta",m.accent,$.beta):at==="sharpe"?(w("Portfolio",m.accent,$.sharpe),w(it.benchLabel,m.text,$.bsharpe,2,1.5)):at==="te"&&w("Tracking error",m.accent,T($.te,G=>G*100));v.timeScale().fitContent();const V=G=>{d.innerHTML=`<span class="pl-lw-date">${gt(j[G])}</span>`+U.map(F=>`<span class="pl-legend-item"><i class="${F.style?"dash":""}" style="--c:${F.color}"></i>${tt(F.label)} <b>${kt(F.values[G])?p(F.values[G]):"—"}</b></span>`).join("")};V(j.length-1);const D=G=>{const F=G.time?jt(j,typeof G.time=="string"?G.time:`${G.time.year}-${String(G.time.month).padStart(2,"0")}-${String(G.time.day).padStart(2,"0")}`):-1;V(F>=0?F:j.length-1)};v.subscribeCrosshairMove(D),b=()=>{v.unsubscribeCrosshairMove(D),v.remove()}}function Q(){const u=t.querySelector("#pl-weights");if(!u)return;const d=Tt(),{bt:y,assets:m}=it,S=rt.weightsMode==="target"?y.TW:y.W,B=y.dates.length,C=[],$=new Float64Array(B);m.forEach((J,p)=>{if(p<It)C.push({label:J.display,color:Lt(p,d),values:S[p]});else for(let v=0;v<B;v++)$[v]+=S[p][v]}),m.length>It&&C.push({label:"Other",color:d.other,values:$});const j=rt.weightsMode==="target"?Float64Array.from({length:B},(J,p)=>1-S.reduce((v,U)=>v+U[p],0)):y.cashW;j.some(J=>Math.abs(J)>5e-4)&&C.push({label:"Cash",color:d.faint,values:j});const at=Ae(u,{dates:y.dates,series:C,stacked:!0,height:280,fmt:J=>`${(J*100).toFixed(1)}%`,rules:y.trades.filter(J=>J.type==="scheduled").map(J=>({index:J.k,label:`Rebalance ${J.date}`}))});f.push(at)}function q(){const{bt:u,assets:d,attrAll:y,panel:m,settings:S}=it,B=u.dates.length-1,C=u.t0+B,$=Tt(),j=d.map((J,p)=>{const v=u.W[p][B],U=u.TW[p][B],w=y.rows[p];return`<tr>
        <td class="mkt-name"><span class="pl-swatch" style="background:${Lt(p,$)}"></span>${tt(J.display)} <span class="pl-asset-meta">${tt(J.name)}</span></td>
        <td>${tt(J.currency)}</td>
        <td class="num">${g.num(m.assets.get(J.symbol).priceBase[C])}</td>
        <td class="num">${g.pctU(U)}</td>
        <td class="num">${g.pctU(v)}</td>
        <td class="num ${Math.abs(v-U)>.02?"dn":""}">${g.pct(v-U,1)}</td>
        <td class="num">${g.money(v*u.nav[B]*S.aum,S.base)}</td>
        <td class="num ${g.cls(w.ret)}">${g.pct(w.ret)}</td>
        <td class="num ${g.cls(w.contrib)}">${g.pct(w.contrib)}</td>
      </tr>`}).join(""),at=u.cashW[B];return`<div class="pl-table-scroll"><table class="mkt-table pl-table">
      <thead><tr><th>Asset</th><th>Ccy</th><th class="num">Price (${tt(S.base)})</th><th class="num">Target</th><th class="num">Actual</th>
        <th class="num">Drift</th><th class="num">Market value</th><th class="num">Return since inception</th><th class="num">Contribution</th></tr></thead>
      <tbody>${j}
        <tr class="pl-sub-row"><td class="mkt-name">Cash</td><td>${tt(S.base)}</td><td></td><td></td><td class="num">${g.pctU(at)}</td><td></td>
          <td class="num">${g.money(at*u.nav[B]*S.aum,S.base)}</td><td></td><td class="num ${g.cls(y.cash)}">${g.pct(y.cash)}</td></tr>
      </tbody>
      <tfoot><tr class="pl-total-row"><td>Total</td><td></td><td></td><td></td><td class="num">100.0%</td><td></td>
        <td class="num">${g.money(u.nav[B]*S.aum,S.base)}</td><td></td><td class="num ${g.cls(y.total)}">${g.pct(y.total)}</td></tr></tfoot>
    </table></div>
    <p class="pl-note">Market value scales ${g.money(S.aum,S.base)} invested at inception. Contribution is NAV-linked and sums to the total including trading costs (${g.pct(y.cost)}).</p>`}function X(){const{bt:u,bench:d}=it,y=Ts(u.dates,u.nav,d.nav),m=(C,$)=>C==null?null:rt.calMode==="p"?C:rt.calMode==="b"?$:C-$,S=C=>{if(!kt(C))return"";const $=Math.min(1,Math.abs(C)/.08)*.55+.05;return` class="num pl-heat ${C>=0?"up":"dn"}" style="--heat:${($*100).toFixed(0)}%"`};return`<table class="mkt-table pl-table pl-cal">
      <thead><tr><th>Year</th>${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(C=>`<th class="num">${C}</th>`).join("")}<th class="num">Year</th><th class="num">Bench</th><th class="num">Active</th></tr></thead>
      <tbody>${y.map(C=>`<tr><td class="mkt-name">${C.year}</td>
        ${C.p.map(($,j)=>{const at=m($,C.b[j]);return`<td${S(at)||' class="num"'}>${at==null?"":(at*100).toFixed(1)}</td>`}).join("")}
        <td class="num pl-strong ${g.cls(m(C.py,C.by))}">${g.pct(m(C.py,C.by),1)}</td>
        <td class="num">${g.pct(C.by,1)}</td>
        <td class="num ${g.cls(C.py-C.by)}">${g.pct(C.py-C.by,1)}</td></tr>`).join("")}</tbody>
    </table>`}function ut(u){let d=0;const y=u.map($=>{const j=$.total?0:d,at=$.total?$.value:d+$.value;return $.total||(d=at),{...$,start:j,end:at}}),m=Math.min(0,...y.map($=>Math.min($.start,$.end))),B=Math.max(0,...y.map($=>Math.max($.start,$.end)))-m||1,C=$=>($-m)/B*100;return`<div class="pl-bridge">${y.map($=>{const j=C(Math.min($.start,$.end)),at=Math.max(.4,Math.abs(C($.end)-C($.start))),J=$.total?"total":$.value>=0?"up":"dn";return`<div class="pl-bridge-row${$.total?" is-total":""}">
        <div class="pl-bridge-label">${$.label}</div>
        <div class="pl-bridge-track"><span class="pl-bridge-zero" style="left:${C(0)}%"></span>
          <span class="pl-bridge-bar ${J}" style="left:${j}%;width:${at}%"></span></div>
        <div class="pl-bridge-val ${$.total?"":g.cls($.value)}">${g.pct($.value)}</div>
      </div>`}).join("")}</div>`}function ct(u){const{bt:d,panel:y,policy:m,bench:S,rf:B,assets:C,settings:$}=it,[j,at]=Ms(d.dates,rt.period,rt.from,rt.to),J=we(y,d,j,at),p=Cs(d,m,S,B,j,at),v=C.some(_=>_.currency&&_.currency!==$.base),U=Tt(),w=[...J.rows].sort((_,bt)=>bt.contrib-_.contrib),T=Math.max(1e-9,...w.map(_=>Math.abs(_.contrib)),Math.abs(J.cost),Math.abs(J.cash)),V=_=>`<div class="pl-cbar"><span class="pl-cbar-mid"></span><span class="pl-cbar-fill ${_>=0?"up":"dn"}" style="${_>=0?"left:50%":"right:50%"};width:${Math.abs(_)/T*50}%"></span></div>`,D=_=>J.total!==0&&Math.abs(J.total)>1e-4?`${(_/J.total*100).toFixed(0)}%`:"—";u.innerHTML=`
      <div class="mkt-panel pl-window">
        ${Nt("period",_s,rt.period)}
        <div class="pl-window-dates">
          <label class="pl-field pl-field-inline"><span>From</span><input type="date" id="pl-attr-from" class="pl-date-inp" value="${d.dates[j]}" min="${d.dates[0]}" max="${d.dates[d.dates.length-1]}"></label>
          <label class="pl-field pl-field-inline"><span>To</span><input type="date" id="pl-attr-to" class="pl-date-inp" value="${d.dates[at]}" min="${d.dates[0]}" max="${d.dates[d.dates.length-1]}"></label>
        </div>
        <div class="pl-window-sum">
          <span>Portfolio <b class="${g.cls(p.total)}">${g.pct(p.total)}</b></span>
          <span>Benchmark <b class="${g.cls(p.benchTotal)}">${g.pct(p.benchTotal)}</b></span>
          <span>Active <b class="${g.cls(p.active)}">${g.pct(p.active)}</b></span>
        </div>
      </div>
      <div class="mkt-two-col mkt-section">
        ${yt("Market vs. specific",`${ut([{label:"Risk-free rate",value:p.rfPart},{label:`Market exposure (β ${p.beta.toFixed(2)})`,value:p.mktPart},{label:"Specific / alpha",value:p.specPart},{label:"Portfolio",value:p.total,total:!0},{label:"Benchmark",value:p.benchTotal,total:!0}])}<p class="pl-note">CAPM fitted over the window: what the portfolio earned from its beta to the benchmark, and what it earned beyond it.</p>`)}
        ${yt("Policy vs. trading",`${ut([{label:"Inception weights, untouched",value:p.policyTotal},{label:"Rebalancing & allocation changes",value:p.tradingPart},{label:"Trading costs",value:p.costPart},{label:"Portfolio",value:p.total,total:!0}])}<p class="pl-note">Value added by every trade after inception, against simply holding the starting allocation.</p>`)}
      </div>
      ${yt("Contribution to return",`<div class="pl-table-scroll"><table class="mkt-table pl-table">
        <thead><tr><th>Asset</th><th class="num">Avg weight</th><th class="num">Return (${tt($.base)})</th><th class="num">Contribution</th><th class="pl-cbar-col"></th>
          ${v?'<th class="num">Local market</th><th class="num">Currency</th>':""}<th class="num">Share</th></tr></thead>
        <tbody>${w.map(_=>`<tr>
          <td class="mkt-name"><span class="pl-swatch" style="background:${Lt(_.i,U)}"></span>${tt(C[_.i].display)}</td>
          <td class="num">${g.pctU(_.avgW)}</td>
          <td class="num ${g.cls(_.ret)}">${g.pct(_.ret)}</td>
          <td class="num ${g.cls(_.contrib)}">${g.pct(_.contrib)}</td>
          <td class="pl-cbar-col">${V(_.contrib)}</td>
          ${v?`<td class="num ${g.cls(_.local)}">${g.pct(_.local)}</td><td class="num ${g.cls(_.fx)}">${g.pct(_.fx)}</td>`:""}
          <td class="num">${D(_.contrib)}</td></tr>`).join("")}
          <tr class="pl-sub-row"><td class="mkt-name">Cash &amp; financing</td><td></td><td></td><td class="num ${g.cls(J.cash)}">${g.pct(J.cash)}</td><td class="pl-cbar-col">${V(J.cash)}</td>${v?"<td></td><td></td>":""}<td class="num">${D(J.cash)}</td></tr>
          <tr class="pl-sub-row"><td class="mkt-name">Trading costs</td><td></td><td></td><td class="num ${g.cls(J.cost)}">${g.pct(J.cost)}</td><td class="pl-cbar-col">${V(J.cost)}</td>${v?"<td></td><td></td>":""}<td class="num">${D(J.cost)}</td></tr>
        </tbody>
        <tfoot><tr class="pl-total-row"><td>Portfolio</td><td></td><td></td><td class="num ${g.cls(J.total)}">${g.pct(J.total)}</td><td></td>
          ${v?`<td class="num">${g.pct(J.rows.reduce((_,bt)=>_+bt.local,0))}</td><td class="num">${g.pct(J.rows.reduce((_,bt)=>_+bt.fx,0))}</td>`:""}<td class="num">100%</td></tr></tfoot>
      </table></div>
      <p class="pl-note">NAV-linked: each day's weight × return is scaled by the portfolio's value at the prior close, so contributions add up exactly to the window return.${v?` Currency is the part of each asset's ${tt($.base)} return that came from its currency moving against the ${tt($.base)}.`:""}</p>`)}
      ${yt("Cumulative contribution",'<div id="pl-cum" class="pl-chart"></div>')}`;const G=d.dates.slice(j,at+1),F=C.slice(0,It).map((_,bt)=>({label:_.display,color:Lt(bt,U),values:J.paths[bt]}));if(C.length>It){const _=new Float64Array(G.length);J.paths.slice(It).forEach(bt=>bt.forEach((et,ft)=>{_[ft]+=et})),F.push({label:"Other",color:U.other,values:_})}const W=Float64Array.from(G,(_,bt)=>d.nav[j+bt]/d.nav[j]-1);F.push({label:"Portfolio",color:U.ink,values:W,dash:!0}),f.push(Ae(u.querySelector("#pl-cum"),{dates:G,series:F,height:300,fmt:_=>g.pct(_,1)}))}function nt(u){const{bt:d,panel:y,assets:m,settings:S,attrAll:B,stats:C}=it,$=Tt(),j=d.trades.filter(F=>F.type!=="initial"),at=j.filter(F=>F.type==="scheduled"),J=j.filter(F=>F.type==="calendar"),p=j.reduce((F,W)=>F+W.turnover,0)/Math.max(C.years,1/12),v=j[j.length-1],U=d.trades.filter(F=>rt.tradeFilter==="all"||F.type!=="calendar"),w=(F,W)=>Math.abs(W.delta)*F.nav*S.aum,T=600;let V=0;const D=U.slice().reverse().map(F=>{if(V>=T)return"";const W=[...F.legs].sort((et,ft)=>Math.abs(ft.delta)-Math.abs(et.delta));V+=W.length;const _=W.filter(et=>et.delta>0).reduce((et,ft)=>et+ft.delta,0),bt=W.filter(et=>et.delta<0).reduce((et,ft)=>et-ft.delta,0);return`<tbody class="pl-trade-group">
        <tr class="pl-trade-head"><td colspan="2"><b>${gt(F.date)}</b> <span class="pl-tag ${F.type}">${F.type==="initial"?"Initial":F.type==="scheduled"?"Scheduled":"Calendar"}</span></td>
          <td class="num">Buys ${g.pctU(_)}</td><td class="num">Sells ${g.pctU(bt)}</td>
          <td class="num">Turnover ${g.pctU(F.turnover)}</td><td class="num">Cost ${g.money(F.cost*F.nav*S.aum,S.base)}</td><td></td></tr>
        ${W.map(et=>{const ft=y.assets.get(et.symbol).priceBase[d.t0+F.k],Ut=w(F,et);return`<tr><td class="mkt-name"><span class="pl-swatch" style="background:${Lt(et.i,$)}"></span>${tt(m[et.i].display)}</td>
            <td class="${et.delta>0?"up":"dn"}">${et.delta>0?"Buy":"Sell"}</td>
            <td class="num">${g.pctU(et.from)}</td><td class="num">${g.pctU(et.to)}</td>
            <td class="num ${g.cls(et.delta)}">${g.pct(et.delta)}</td>
            <td class="num">${g.money(Ut,S.base)}</td>
            <td class="num">${kt(ft)&&ft>0?Math.round(Ut/ft).toLocaleString("en-US"):"—"}</td></tr>`}).join("")}</tbody>`}).join("");u.innerHTML=`
      <div class="pl-kpis"><div class="pl-kpi-group"><div class="pl-kpi-row">
        ${pt("Rebalances",`${at.length}`,{sub:J.length?`+ ${J.length} calendar`:"No calendar resets"})}
        ${pt("Turnover p.a.",g.pctU(p),{sub:"One-way, excl. initial"})}
        ${pt("Avg. per rebalance",g.pctU(j.length?j.reduce((F,W)=>F+W.turnover,0)/j.length:null))}
        ${pt("Trading costs",g.bps(-B.cost),{sub:`${S.costBps} bps per unit traded`})}
        ${pt("Last rebalance",v?gt(v.date):"—",{sub:v?`${Math.round((Dt(d.dates[d.dates.length-1])-Dt(v.date))/864e5)} days ago`:""})}
        ${pt("Positions",`${m.length}`,{sub:`${d.trades.reduce((F,W)=>F+W.legs.length,0)} trade tickets`})}
      </div></div></div>
      ${yt("Trades through time",`<div id="pl-turnover" class="pl-chart"></div>
        <p class="pl-note">Weight bought (up) and sold (down) at each rebalance, as a share of NAV. Hover a bar for the tickets.</p>`)}
      ${yt("Trade blotter",`<div class="pl-table-scroll"><table class="mkt-table pl-table pl-blotter">
          <thead><tr><th>Asset</th><th>Side</th><th class="num">From</th><th class="num">To</th><th class="num">Δ weight</th><th class="num">Est. value (${tt(S.base)})</th><th class="num">Est. units</th></tr></thead>
          ${D}
        </table></div>
        ${V>=T?`<p class="pl-note">Showing the most recent ${T} tickets — export for the full list.</p>`:""}
        <p class="pl-note">Values scale ${g.money(S.aum,S.base)} at inception through the portfolio's NAV. Units use the unadjusted close converted to ${tt(S.base)}.</p>`,{tools:`${Nt("trade-filter",[["scheduled","Scheduled"],["all","Incl. calendar"]],rt.tradeFilter)}<button class="ghost-btn pl-sm" data-action="export-trades">Export CSV</button>`})}`;const G=j.map(F=>{const W=F.legs.filter(et=>et.delta>0).reduce((et,ft)=>et+ft.delta,0),_=F.legs.filter(et=>et.delta<0).reduce((et,ft)=>et-ft.delta,0),bt=[...F.legs].sort((et,ft)=>Math.abs(ft.delta)-Math.abs(et.delta)).slice(0,5);return{index:F.k,up:W,down:_,html:`<div class="pl-tip-date">${gt(F.date)} · ${F.type}</div>
          ${bt.map(et=>`<div class="pl-tip-row"><i style="background:${Lt(et.i,$)}"></i><span>${tt(m[et.i].display)}</span><b>${g.pct(et.delta,1)}</b></div>`).join("")}
          ${F.legs.length>5?`<div class="pl-tip-row"><span>+${F.legs.length-5} more</span></div>`:""}
          <div class="pl-tip-row pl-tip-total"><span>Turnover</span><b>${g.pctU(F.turnover)}</b></div>`}});G.length?f.push(Ys(u.querySelector("#pl-turnover"),{dates:d.dates,events:G,fmt:F=>`${(F*100).toFixed(0)}%`})):u.querySelector("#pl-turnover").innerHTML='<div class="port-empty">No trades after inception — add rebalance dates or a calendar policy.</div>'}function St(u){const{bt:d,panel:y,assets:m,stats:S,settings:B}=it,C=d.dates.length-1,$=d.W.map(D=>D[C]),j=m.map(D=>D.symbol),at=Tt(),J=Ls(d.nav),p=Rs(y,j,$),v=d.nav[C]*B.aum;u.innerHTML=`
      <div class="mkt-panel pl-window">
        <span class="pl-note pl-inline">Ex-ante risk on current (drifted) weights, EWMA covariance over the last 3 years.</span>
        <div class="port-hl-ctrl">
          <span class="port-hl-label">Half-life</span>
          <input type="range" id="pl-hl" class="port-hl-slider" min="10" max="252" value="${Bt}" step="1" aria-label="EWMA half-life in days">
          <span id="pl-hl-val" class="port-hl-val">${Bt}d</span>
        </div>
      </div>
      <div id="pl-risk-live"></div>
      <div class="mkt-two-col mkt-section">
        ${yt("Worst drawdowns",`<div class="pl-table-scroll"><table class="mkt-table pl-table">
          <thead><tr><th>Peak</th><th>Trough</th><th>Recovered</th><th class="num">Depth</th><th class="num">Days to trough</th><th class="num">Days to recover</th></tr></thead>
          <tbody>${J.length?J.map(D=>`<tr><td>${gt(d.dates[D.start])}</td><td>${gt(d.dates[D.trough])}</td>
            <td>${D.end!=null?gt(d.dates[D.end]):'<span class="dn">Not yet</span>'}</td>
            <td class="num dn">${g.pct(D.depth)}</td><td class="num">${D.trough-D.start}</td><td class="num">${D.end!=null?D.end-D.trough:"—"}</td></tr>`).join(""):'<tr><td colspan="6" class="port-empty">No drawdowns in the period.</td></tr>'}</tbody>
        </table></div><p class="pl-note">Realised: 1-day historical VaR 95% ${g.pctU(S.var95)}, CVaR ${g.pctU(S.cvar95)}. Skew ${g.num(S.skew)}, excess kurtosis ${g.num(S.kurt)}.</p>`)}
        ${yt("Historical stress tests",`<div class="pl-table-scroll"><table class="mkt-table pl-table">
          <thead><tr><th>Scenario</th><th>Window</th><th class="num">Portfolio</th><th class="num">Benchmark</th><th class="num">Active</th><th class="num">P&amp;L</th></tr></thead>
          <tbody>${p.map(D=>D.available?`<tr><td class="mkt-name">${D.name}${D.missing.length?` <span class="pl-asset-meta" title="No history for ${tt(D.missing.join(", "))}">partial</span>`:""}</td>
            <td class="pl-asset-meta">${gt(D.from)} – ${gt(D.to)}</td>
            <td class="num ${g.cls(D.port)}">${g.pct(D.port,1)}</td><td class="num ${g.cls(D.bench)}">${g.pct(D.bench,1)}</td>
            <td class="num ${g.cls(D.active)}">${g.pct(D.active,1)}</td><td class="num ${g.cls(D.port)}">${g.money(D.port*v,B.base,!0)}</td></tr>`:`<tr><td class="mkt-name">${D.name}</td><td class="pl-asset-meta">${gt(D.from)} – ${gt(D.to)}</td><td colspan="4" class="pl-asset-meta">No data</td></tr>`).join("")}</tbody>
        </table></div><p class="pl-note">Today's weights replayed through each historical window in ${tt(B.base)}, held static. "Partial" means some assets had not listed yet and are excluded.</p>`)}
      </div>`;const U=u.querySelector("#pl-risk-live"),w=()=>{const D=Fs(y,j,$,Bt);if(!D){U.innerHTML='<div class="port-msg port-err">Not enough history for a covariance estimate.</div>';return}const G=Math.max(1e-9,...D.assets.map(W=>Math.max(Math.abs(W.weight),Math.abs(W.pctRc)))),F=W=>{const _=Math.min(1,Math.abs(W))*.6+.06;return`pl-heat ${W>=0?"dn":"up"}" style="--heat:${(_*100).toFixed(0)}%`};U.innerHTML=`
        <div class="pl-kpis"><div class="pl-kpi-group"><div class="pl-kpi-row">
          ${pt("Ex-ante volatility",g.pctU(D.vol),{sub:`Benchmark ${g.pctU(D.benchVol)}`})}
          ${pt("Ex-ante tracking error",g.pctU(D.te))}
          ${pt("Ex-ante beta",g.num(D.beta))}
          ${pt("VaR 95% · 1 day",g.pctU(D.var95,2),{sub:g.money(D.var95*v,B.base)})}
          ${pt("VaR 95% · 10 day",g.pctU(D.var95_10d,2),{sub:g.money(D.var95_10d*v,B.base)})}
          ${pt("Diversification",`${g.num(D.divRatio)}×`,{sub:`Effective N ${g.num(D.effN,1)}`})}
        </div></div></div>
        ${yt("Risk budget",`<div class="pl-table-scroll"><table class="mkt-table pl-table">
          <thead><tr><th>Asset</th><th class="num">Weight</th><th class="num">Risk share</th><th class="pl-dual-col">
            <span class="pl-key"><i class="w"></i>Weight</span><span class="pl-key"><i class="r"></i>Risk</span></th>
            <th class="num">Vol</th><th class="num">MCTR</th><th class="num">β → port</th><th class="num">ρ → bench</th></tr></thead>
          <tbody>${[...D.assets].sort((W,_)=>_.pctRc-W.pctRc).map(W=>`<tr>
            <td class="mkt-name"><span class="pl-swatch" style="background:${Lt(W.i,at)}"></span>${tt(m[W.i].display)}</td>
            <td class="num">${g.pctU(W.weight)}</td>
            <td class="num ${W.pctRc>W.weight*1.25&&W.pctRc>.05?"dn":""}">${g.pctU(W.pctRc)}</td>
            <td class="pl-dual-col"><div class="pl-dual"><span class="w" style="width:${Math.abs(W.weight)/G*100}%"></span><span class="r" style="width:${Math.abs(W.pctRc)/G*100}%"></span></div></td>
            <td class="num">${g.pctU(W.vol)}</td><td class="num">${g.pctU(W.mctr)}</td>
            <td class="num">${g.num(W.betaPort)}</td><td class="num">${g.num(W.corrBench)}</td></tr>`).join("")}</tbody>
        </table></div>
        <p class="pl-note">Risk share is each position's contribution to portfolio variance (w·Σw / σ²); it sums to 100%. Highlighted where risk share exceeds 1.25× the capital weight. MCTR is the marginal change in volatility per unit of weight.</p>`)}
        ${yt("Correlation matrix",`<div class="pl-table-scroll"><table class="corr-table pl-corr">
          <thead><tr><th></th>${m.map(W=>`<th class="corr-col-hdr">${tt(W.display)}</th>`).join("")}</tr></thead>
          <tbody>${m.map((W,_)=>`<tr><th class="corr-row-hdr">${tt(W.display)}</th>${m.map((bt,et)=>_===et?'<td class="corr-cell corr-diag">—</td>':`<td class="corr-cell ${F(D.corr[_][et])}">${D.corr[_][et].toFixed(2)}</td>`).join("")}</tr>`).join("")}</tbody>
        </table></div>
        <div class="corr-legend"><span class="corr-leg"><span class="pl-key"><i class="neg"></i>Diversifying (negative)</span></span><span class="corr-leg"><span class="pl-key"><i class="pos"></i>Correlated (positive)</span></span></div>`)}`};w();const T=u.querySelector("#pl-hl");let V=0;T.addEventListener("input",()=>{Bt=+T.value,u.querySelector("#pl-hl-val").textContent=`${Bt}d`,cancelAnimationFrame(V),V=requestAnimationFrame(w)})}function ot(){const{bt:u,bench:d,assets:y,name:m}=it,B=[["date","nav","benchmark_nav","return","benchmark_return","trading_cost","cash_weight",...y.map(C=>`w_${C.symbol}`)].join(",")];u.dates.forEach((C,$)=>B.push([C,u.nav[$].toFixed(6),d.nav[$].toFixed(6),u.ret[$].toFixed(6),d.ret[$].toFixed(6),u.costs[$].toFixed(6),u.cashW[$].toFixed(6),...u.W.map(j=>j[$].toFixed(6))].join(","))),Xt(`${Vt(m)}-backtest.csv`,B.join(`
`))}function dt(){const{bt:u,panel:d,settings:y,name:m}=it,S=[["date","type","symbol","side","from_weight","to_weight","delta_weight",`est_value_${y.base}`,"est_units",`cost_${y.base}`].join(",")];u.trades.forEach(B=>B.legs.forEach(C=>{const $=Math.abs(C.delta)*B.nav*y.aum,j=d.assets.get(C.symbol).priceBase[u.t0+B.k];S.push([B.date,B.type,zs(C.symbol),C.delta>0?"BUY":"SELL",C.from.toFixed(6),C.to.toFixed(6),C.delta.toFixed(6),$.toFixed(2),j>0?($/j).toFixed(2):"",(Math.abs(C.delta)*y.costBps/1e4*B.nav*y.aum).toFixed(2)].join(","))})),Xt(`${Vt(m)}-trades.csv`,S.join(`
`))}const wt=()=>{ht&&(Y(),z())};return document.addEventListener("macro-theme-change",wt),Gt.load().then(u=>{h&&(ht=u,e.textContent=Gt.label,E())}),()=>{h=!1,i==null||i.abort(),L(),document.removeEventListener("macro-theme-change",wt),c&&ht&&A()}}const Zs=["market","stock","portfolio"],ta={market:"Macro monitor",stock:"Single name",portfolio:"Portfolio lab"},ea={market:"01",stock:"02",portfolio:"03"};let qt="market",Pt=null;const ze="macro-monitor-theme";function sa(){try{const t=localStorage.getItem(ze);return["dark","light","more-visible"].includes(t)?t:"dark"}catch{return"dark"}}function Ce(t){document.documentElement.dataset.theme=t,document.dispatchEvent(new CustomEvent("macro-theme-change",{detail:{theme:t}}))}function aa(t){const a=sa();Ce(a),t.innerHTML=`
    <div class="app-frame">
      <header class="topbar">
        <div class="brand-lockup"><div class="logo">MACRO MONITOR</div><div class="brand-sub">GLOBAL MULTI-ASSET RESEARCH</div></div>
        <div class="topbar-center"><nav class="tabs" id="main-tabs">
          ${Zs.map(s=>`<button class="tab ${s===qt?"active":""}" data-tab="${s}"><span class="tab-num">${ea[s]}</span>${ta[s]}</button>`).join("")}
        </nav></div>
        <div class="topbar-right"><span class="market-status"><i></i> DATA LINKED</span><span class="topbar-date">${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span><label class="theme-select-label" for="theme-select">Theme</label><select class="theme-select" id="theme-select" aria-label="Colour theme"><option value="dark"${a==="dark"?" selected":""}>Dark</option><option value="light"${a==="light"?" selected":""}>Light</option><option value="more-visible"${a==="more-visible"?" selected":""}>More Visible</option></select></div>
      </header>
      <main class="main-content" id="tab-content"></main>
      <footer class="app-footer"><span>NSM / TERMINAL</span><span>MARKET DATA: YAHOO FINANCE · DELAYED / INDICATIVE</span><span>LOCAL SESSION</span></footer>
    </div>
  `;const o=t.querySelector("#main-tabs"),n=t.querySelector("#tab-content"),l=t.querySelector("#theme-select");l.addEventListener("change",()=>{const s=l.value;Ce(s);try{localStorage.setItem(ze,s)}catch{}});function e(s){s!==qt&&(qt=s,o.querySelectorAll(".tab").forEach(r=>{r.classList.toggle("active",r.dataset.tab===s)}),De(n,s))}o.addEventListener("click",s=>{const r=s.target.closest(".tab");r&&e(r.dataset.tab)}),De(n,qt)}function De(t,a){Pt&&(Pt(),Pt=null),t.innerHTML="",a==="market"?us(t).then(o=>{Pt=o??null}):a==="stock"?ys(t).then(o=>{Pt=o??null}):a==="portfolio"&&(Pt=Js(t)??null)}aa(document.getElementById("app"));
