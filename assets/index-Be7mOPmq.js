(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const e of a.addedNodes)e.tagName==="LINK"&&e.rel==="modulepreload"&&l(e)}).observe(document,{childList:!0,subtree:!0});function o(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function l(n){if(n.ep)return;n.ep=!0;const a=o(n);fetch(n.href,a)}})();const gt="https://yf-proxy.lukewynd.workers.dev";function V(t){return`${gt}${t}`}function Pt(t){const s=encodeURIComponent(t);return`${gt}/v8/finance/chart/${s}?range=1y&interval=1d`}const ct=new Map,Ft=5*60*1e3;async function Ht(t){var o,l,n,a,e,r;const s=ct.get(t);if(s&&Date.now()-s.ts<Ft)return s.data;try{const c=await fetch(Pt(t),{headers:{Accept:"application/json"}});if(!c.ok)return null;const d=await c.json(),i=(l=(o=d==null?void 0:d.chart)==null?void 0:o.result)==null?void 0:l[0];if(!i)return null;const u=i.meta,p=((e=(a=(n=i.indicators)==null?void 0:n.quote)==null?void 0:a[0])==null?void 0:e.close)??[],h=D=>{for(let b=D;b>=0;b--)if(p[b]!=null)return{index:b,value:p[b]};return null},m=h(p.length-1),f=m?h(m.index-1):null,g=u.regularMarketPrice??null??(m==null?void 0:m.value)??null,S=(f==null?void 0:f.value)??null,$=g!=null&&S!=null?g-S:null,w=$!=null&&S!==0?$/S*100:null,P=p.length,E=(m==null?void 0:m.index)??-1,x=g,C=D=>{let b=E-D;for(;b>=0&&p[b]==null;)b--;const y=b>=0?p[b]:null;return y!=null&&x!=null&&y!==0?(x-y)/y*100:null},U=D=>{let b=E-D;for(;b>=0&&p[b]==null;)b--;return b>=0?p[b]:null},R=D=>{const b=U(D);return b!=null&&x!=null?x-b:null},T=new Date().getFullYear(),I=i.timestamp??[];let F=null;for(let D=0;D<I.length;D++)if(new Date(I[D]*1e3).getFullYear()===T&&p[D]!=null){F=p[D];break}const Y=F!=null&&F!==0&&x!=null?(x-F)/F*100:null,N={symbol:t,regularMarketPrice:g,regularMarketChangePercent:w,regularMarketChange:$,previousClose:S,dataTimestamp:((r=i.timestamp)==null?void 0:r[E])??null,source:"Yahoo Finance chart",quoteType:u.instrumentType??"",ytdPct:Y,pct1d:w,pct1w:C(5),pct1m:C(21),pct3m:C(63),pctYtd:Y,change1d:$,change1w:R(5),change1m:R(21),change3m:R(63),changeYtd:F!=null&&x!=null?x-F:null};return ct.set(t,{ts:Date.now(),data:N}),N}catch{return null}}async function It(t){const o=new Map;for(let l=0;l<t.length;l+=8){const n=t.slice(l,l+8),a=await Promise.allSettled(n.map(e=>Ht(e)));n.forEach((e,r)=>{const c=a[r].status==="fulfilled"?a[r].value:null;c&&o.set(e,c)})}return o}const yt=[{symbol:"^GSPC",name:"S&P 500",type:"index"},{symbol:"^VIX",name:"VIX",type:"vix"},{symbol:"^TNX",name:"US 10Y",type:"yield"},{symbol:"DX-Y.NYB",name:"DXY",type:"index"},{symbol:"GC=F",name:"Gold",type:"commodity"},{symbol:"BTC-USD",name:"Bitcoin",type:"crypto"}],St=[{symbol:"^GSPC",name:"S&P 500",region:"Americas"},{symbol:"^IXIC",name:"NASDAQ Comp.",region:"Americas"},{symbol:"^DJI",name:"Dow Jones",region:"Americas"},{symbol:"^RUT",name:"Russell 2000",region:"Americas"},{symbol:"^BVSP",name:"Bovespa",region:"Americas"},{symbol:"^MXX",name:"IPC Mexico",region:"Americas"},{symbol:"^FTSE",name:"FTSE 100",region:"Europe"},{symbol:"^GDAXI",name:"DAX",region:"Europe"},{symbol:"^FCHI",name:"CAC 40",region:"Europe"},{symbol:"^STOXX50E",name:"Euro Stoxx 50",region:"Europe"},{symbol:"^SSMI",name:"SMI",region:"Europe"},{symbol:"^AEX",name:"AEX",region:"Europe"},{symbol:"^N225",name:"Nikkei 225",region:"Asia-Pacific"},{symbol:"^HSI",name:"Hang Seng",region:"Asia-Pacific"},{symbol:"000001.SS",name:"Shanghai Comp.",region:"Asia-Pacific"},{symbol:"^AXJO",name:"ASX 200",region:"Asia-Pacific"},{symbol:"^KS11",name:"KOSPI",region:"Asia-Pacific"},{symbol:"^STI",name:"Straits Times",region:"Asia-Pacific"}],kt=[{symbol:"^IRX",name:"3-Month"},{symbol:"^FVX",name:"5-Year"},{symbol:"^TNX",name:"10-Year"},{symbol:"^TYX",name:"30-Year"}],$t=[{symbol:"BWX",name:"Global ex-US Treasuries",region:"Global"},{symbol:"IGOV",name:"International Treasuries",region:"Developed"},{symbol:"EMB",name:"Emerging Market Sovereign",region:"Emerging"},{symbol:"EWJ",name:"Japan rates proxy",region:"Japan"}],lt=[{code:"USD",name:"US Dollar",symbol:null,invert:!1},{code:"EUR",name:"Euro",symbol:"EURUSD=X",invert:!1},{code:"GBP",name:"Sterling",symbol:"GBPUSD=X",invert:!1},{code:"JPY",name:"Yen",symbol:"USDJPY=X",invert:!0},{code:"AUD",name:"Aus Dollar",symbol:"AUDUSD=X",invert:!1},{code:"CAD",name:"Can Dollar",symbol:"USDCAD=X",invert:!0},{code:"CHF",name:"Swiss Franc",symbol:"USDCHF=X",invert:!0}],Ut=lt.filter(t=>t.symbol).map(t=>t.symbol),wt=[{symbol:"GC=F",name:"Gold",unit:"/oz",group:"Metals"},{symbol:"SI=F",name:"Silver",unit:"/oz",group:"Metals"},{symbol:"HG=F",name:"Copper",unit:"/lb",group:"Metals"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl",group:"Energy"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl",group:"Energy"},{symbol:"NG=F",name:"Nat. Gas",unit:"/MMBtu",group:"Energy"},{symbol:"ZW=F",name:"Wheat",unit:"/bu",group:"Agri"},{symbol:"ZC=F",name:"Corn",unit:"/bu",group:"Agri"}],xt=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],Mt=[{symbol:"BTC-USD",name:"Bitcoin",abbr:"BTC"},{symbol:"ETH-USD",name:"Ethereum",abbr:"ETH"},{symbol:"SOL-USD",name:"Solana",abbr:"SOL"},{symbol:"XRP-USD",name:"XRP",abbr:"XRP"}],tt=[...new Set([...yt.map(t=>t.symbol),...St.map(t=>t.symbol),...kt.map(t=>t.symbol),...$t.map(t=>t.symbol),...Ut,...wt.map(t=>t.symbol),...xt.map(t=>t.symbol),...Mt.map(t=>t.symbol)])];function Q(t,s=2){return t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:s,maximumFractionDigits:s})}function X(t){if(t==null)return{text:"—",cls:""};const s=t>=0?"+":"",o=t>=0?"up":"dn",l=Math.abs(t)>=3?" strong":"";return{text:`${s}${t.toFixed(2)}%`,cls:o+l}}function Rt(t){if(t==null)return{text:"—",cls:""};const s=Math.round(t*100),o=s>=0?"+":"",l=s>=0?"up":"dn";return{text:`${o}${s}bps`,cls:l}}function H(t){const s=X(t);return`<td class="num pct-cell ${s.cls}">${s.text}</td>`}function _(t,s=7){return Array.from({length:t},()=>`<tr>${Array.from({length:s},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function Bt(t){return yt.map(({symbol:s,name:o,type:l})=>{const n=t.get(s),a=n==null?void 0:n.regularMarketPrice,e=X((n==null?void 0:n.pct1d)??null),r=X((n==null?void 0:n.pctYtd)??null);let c="—";return a!=null&&(l==="yield"?c=a.toFixed(2)+"%":l==="crypto"?c="$"+a.toLocaleString("en-US",{maximumFractionDigits:0}):l==="commodity"?c="$"+Q(a):c=Q(a)),`
      <div class="mkt-stat-card">
        <div class="mkt-stat-name">${o}</div>
        <div class="mkt-stat-price">${c}</div>
        <div class="mkt-stat-chg ${e.cls}">${e.text}</div>
        <div class="mkt-stat-ytd ${r.cls}">${r.text} YTD</div>
      </div>`}).join("")}function Xt(t){const s=["Americas","Europe","Asia-Pacific"];let o="";return s.forEach(l=>{const n=St.filter(a=>a.region===l);o+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,o+=n.map(({symbol:a,name:e})=>{const r=t.get(a),c=r==null?void 0:r.regularMarketPrice,d=c!=null?c.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";return`<tr>
        <td class="mkt-name">${e}</td>
        <td class="num mono">${d}</td>
        ${H(r==null?void 0:r.pct1d)}
        ${H(r==null?void 0:r.pct1w)}
        ${H(r==null?void 0:r.pct1m)}
        ${H(r==null?void 0:r.pct3m)}
        ${H(r==null?void 0:r.pctYtd)}
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
    </div>`}function Ot(t){const s=kt.map(({symbol:n,name:a})=>{const e=t.get(n),r=(e==null?void 0:e.regularMarketPrice)??null;return{name:a,yld:r,change1d:(e==null?void 0:e.change1d)??null,change1w:(e==null?void 0:e.change1w)??null,change1m:(e==null?void 0:e.change1m)??null,change3m:(e==null?void 0:e.change3m)??null,changeYtd:(e==null?void 0:e.changeYtd)??null}}),o=Math.max(.01,...s.map(n=>n.yld??0));return`
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
        <tbody>${s.map(({name:n,yld:a,change1d:e,change1w:r,change1m:c,change3m:d,changeYtd:i})=>{const u=[e,r,c,d,i].map(Rt),p=a!=null?a.toFixed(2)+"%":"—",h=a!=null?a/o*100:0;return`<tr>
      <td class="mkt-name">${n}</td>
      <td class="num mono">${p}</td>
      <td class="yc-bar-cell"><span class="yc-bar" style="width:${h.toFixed(1)}%"></span></td>
      ${u.map(m=>`<td class="num pct-cell ${m.cls}">${m.text}</td>`).join("")}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Yt(t){return`<div class="mkt-panel">
    <div class="mkt-panel-label">Global Bond Markets · price proxies</div>
    <table class="mkt-table">
      <thead><tr><th>Instrument</th><th class="num">Level</th><th class="num">1D</th><th class="num">1M</th><th class="num">YTD</th></tr></thead>
      <tbody>${$t.map(({symbol:o,name:l,region:n})=>{const a=t.get(o),e=a==null?void 0:a.regularMarketPrice,r=X(a==null?void 0:a.pct1d),c=X(a==null?void 0:a.pct1m),d=X(a==null?void 0:a.pctYtd);return`<tr>
      <td><span class="mkt-name">${l}</span><span class="mkt-unit">${n}</span></td>
      <td class="num mono">${e!=null?Q(e):"—"}</td>
      <td class="num pct-cell ${r.cls}">${r.text}</td>
      <td class="num pct-cell ${c.cls}">${c.text}</td>
      <td class="num pct-cell ${d.cls}">${d.text}</td>
    </tr>`}).join("")}</tbody>
    </table>
  </div>`}function Nt(t){const s={USD:1};lt.forEach(({code:e,symbol:r,invert:c})=>{var i;if(!r)return;const d=(i=t.get(r))==null?void 0:i.regularMarketPrice;d!=null&&(s[e]=c?1/d:d)});const o=e=>e==null?"—":e>=100?e.toFixed(2):e>=10?e.toFixed(3):e.toFixed(4),l=lt.map(e=>e.code),n=l.map(e=>`<th class="num fx-col-hdr">${e}</th>`).join(""),a=l.map(e=>{const r=l.map(c=>{if(e===c)return'<td class="fx-diag">—</td>';const d=s[e],i=s[c],u=d!=null&&i!=null&&i!==0?d/i:null;return`<td class="num fx-cell">${o(u)}</td>`}).join("");return`<tr><th class="fx-row-hdr">${e}</th>${r}</tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Cross Rates <span class="mkt-panel-sub">1 row = X column</span></div>
      <div class="fx-matrix-wrap">
        <table class="fx-matrix">
          <thead><tr><th></th>${n}</tr></thead>
          <tbody>${a}</tbody>
        </table>
      </div>
    </div>`}function jt(t){const s=["Metals","Energy","Agri"];let o="";return s.forEach(l=>{const n=wt.filter(a=>a.group===l);o+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,o+=n.map(({symbol:a,name:e,unit:r})=>{const c=t.get(a),d=c==null?void 0:c.regularMarketPrice,i=d!=null?"$"+Q(d):"—";return`<tr>
        <td class="mkt-name">${e}<span class="mkt-unit">${r}</span></td>
        <td class="num mono">${i}</td>
        ${H(c==null?void 0:c.pct1d)}
        ${H(c==null?void 0:c.pct1w)}
        ${H(c==null?void 0:c.pct1m)}
        ${H(c==null?void 0:c.pctYtd)}
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
    </div>`}function Wt(t){const s=xt.map(({symbol:n,name:a})=>{const e=t.get(n);return{name:a,pct1d:(e==null?void 0:e.pct1d)??null,pct1m:(e==null?void 0:e.pct1m)??null,pctYtd:(e==null?void 0:e.pctYtd)??null}});s.sort((n,a)=>(a.pct1d??-999)-(n.pct1d??-999));const o=Math.max(.01,...s.map(n=>Math.abs(n.pct1d??0)));return`
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
        <tbody>${s.map(({name:n,pct1d:a,pct1m:e,pctYtd:r})=>{const c=X(a),d=X(e),i=X(r),u=a!=null?Math.abs(a)/o*100:0;return`<tr>
      <td class="mkt-name sec-name">${n}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${c.cls}" style="width:${u.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${c.cls}">${c.text}</td>
      <td class="num pct-cell ${d.cls}">${d.text}</td>
      <td class="num pct-cell ${i.cls}">${i.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function _t(t){return`
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
        <tbody>${Mt.map(({symbol:o,name:l,abbr:n})=>{const a=t.get(o),e=a==null?void 0:a.regularMarketPrice,r=e!=null?"$"+e.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:e>=100?2:4}):"—";return`<tr>
      <td class="mkt-name">${l} <span class="mkt-abbr">${n}</span></td>
      <td class="num mono">${r}</td>
      ${H(a==null?void 0:a.pct1d)}
      ${H(a==null?void 0:a.pct1w)}
      ${H(a==null?void 0:a.pct1m)}
      ${H(a==null?void 0:a.pctYtd)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}async function Gt(t){t.innerHTML=`
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
        <table class="mkt-table"><tbody>${_(18)}</tbody></table>
      </div>
    </section>

    <!-- Bonds + FX -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Treasuries</div>
          <table class="mkt-table"><tbody>${_(4,8)}</tbody></table>
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
        <table class="mkt-table"><tbody>${_(4,5)}</tbody></table>
      </div>
    </section>

    <!-- Commodities + Sectors -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-commodities">
        <div class="mkt-panel">
          <div class="mkt-panel-label">Commodities</div>
          <table class="mkt-table"><tbody>${_(8,6)}</tbody></table>
        </div>
      </div>
      <div id="mkt-sectors">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Equity Sectors</div>
          <table class="mkt-table"><tbody>${_(11,5)}</tbody></table>
        </div>
      </div>
    </section>

    <!-- Crypto -->
    <section class="mkt-section" id="mkt-crypto">
      <div class="mkt-panel">
        <div class="mkt-panel-label">Crypto</div>
        <table class="mkt-table"><tbody>${_(4,6)}</tbody></table>
      </div>
    </section>
  `;const s=t.querySelector("#mkt-refresh");async function o(){const n=t.querySelector("#mkt-timestamp");n.textContent="Loading…";const a=await It(tt);if(!t.isConnected)return;t.querySelector("#mkt-stats").innerHTML=Bt(a),t.querySelector("#mkt-equities").innerHTML=Xt(a),t.querySelector("#mkt-bonds").innerHTML=Ot(a),t.querySelector("#mkt-fx").innerHTML=Nt(a),t.querySelector("#mkt-global-bonds").innerHTML=Yt(a),t.querySelector("#mkt-commodities").innerHTML=jt(a),t.querySelector("#mkt-sectors").innerHTML=Wt(a),t.querySelector("#mkt-crypto").innerHTML=_t(a);const e=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"}),r=tt.length-a.size;n.textContent=`Updated ${e} · ${a.size}/${tt.length} instruments${r?` · ${r} unavailable`:""}`}s.addEventListener("click",o),await o();const l=setInterval(o,30*60*1e3);return()=>clearInterval(l)}const Vt="modulepreload",Kt=function(t){return"/investment-dash/"+t},dt={},Lt=function(s,o,l){let n=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const e=document.querySelector("meta[property=csp-nonce]"),r=(e==null?void 0:e.nonce)||(e==null?void 0:e.getAttribute("nonce"));n=Promise.allSettled(o.map(c=>{if(c=Kt(c),c in dt)return;dt[c]=!0;const d=c.endsWith(".css"),i=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${i}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":Vt,d||(u.as="script"),u.crossOrigin="",u.href=c,r&&u.setAttribute("nonce",r),document.head.appendChild(u),d)return new Promise((p,h)=>{u.addEventListener("load",p),u.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(e){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=e,window.dispatchEvent(r),!r.defaultPrevented)throw e}return n.then(e=>{for(const r of e||[])r.status==="rejected"&&a(r.reason);return s().catch(a)})},et=[{label:"US (NYSE / NASDAQ)",suffix:"",example:"AAPL"},{label:"Australia (ASX)",suffix:".AX",example:"CBA.AX"},{label:"UK (LSE)",suffix:".L",example:"HSBA.L"},{label:"Canada (TSX)",suffix:".TO",example:"RY.TO"},{label:"Germany (XETRA)",suffix:".DE",example:"SAP.DE"},{label:"Japan (TSE)",suffix:".T",example:"7203.T"},{label:"Hong Kong (HKEX)",suffix:".HK",example:"0700.HK"}],at=[{label:"1W",range:"5d",interval:"1d"},{label:"1M",range:"1mo",interval:"1d"},{label:"3M",range:"3mo",interval:"1d"},{label:"6M",range:"6mo",interval:"1d"},{label:"1Y",range:"1y",interval:"1d"},{label:"2Y",range:"2y",interval:"1wk"},{label:"5Y",range:"5y",interval:"1wk"},{label:"MAX",range:"max",interval:"1mo"}],qt={ma20:{period:20,color:"#fbbf24",label:"MA 20D"},ma50:{period:50,color:"#60a5fa",label:"MA 50D"},ma200:{period:200,color:"#f87171",label:"MA 200D"}};function Tt(t,s){const o=[];for(let l=s-1;l<t.length;l++){const n=t.slice(l-s+1,l+1).reduce((a,e)=>a+e.close,0);o.push({time:t[l].time,value:+(n/s).toFixed(4)})}return o}function zt(t,s,o){const l=Tt(t,s);let n=0,a=null;return o.map(e=>{for(;n<l.length&&l[n].time<=e.time;)a=l[n].value,n+=1;return a==null?null:{time:e.time,value:a}}).filter(Boolean)}function Jt(t,s=20,o=2){const l=Tt(t,s),n=[],a=[];for(let e=0;e<l.length;e++){const r=e+s-1,c=t.slice(r-s+1,r+1).map(u=>u.close),d=l[e].value,i=Math.sqrt(c.reduce((u,p)=>u+(p-d)**2,0)/s);n.push({time:l[e].time,value:+(d+o*i).toFixed(4)}),a.push({time:l[e].time,value:+(d-o*i).toFixed(4)})}return{upper:n,mid:l,lower:a}}const Z=new Map,ut=new Map,rt=5*60*1e3;function Et(t){const s=new Date(t*1e3);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}-${String(s.getDate()).padStart(2,"0")}`}async function mt(t,s,o){var m,f;const l=`${t}:${s}:${o}`,n=Z.get(l);if(n&&Date.now()-n.ts<rt)return n.data;const a=`/v8/finance/chart/${encodeURIComponent(t)}?range=${s}&interval=${o}&includePrePost=false`,e=await fetch(V(a),{headers:{Accept:"application/json"}});if(!e.ok)throw new Error(`HTTP ${e.status}`);const r=await e.json(),c=(f=(m=r==null?void 0:r.chart)==null?void 0:m.result)==null?void 0:f[0];if(!c)throw new Error("Symbol not found");const d=c.timestamp??[],i=c.indicators.quote[0],u=[],p=[];for(let v=0;v<d.length;v++){if(i.open[v]==null||i.close[v]==null)continue;const g=Et(d[v]);u.push({time:g,open:+i.open[v].toFixed(4),high:+i.high[v].toFixed(4),low:+i.low[v].toFixed(4),close:+i.close[v].toFixed(4)}),p.push({time:g,value:i.volume[v]??0,color:i.close[v]>=i.open[v]?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"})}const h={candles:u,volumes:p,meta:c.meta};return Z.set(l,{ts:Date.now(),data:h}),h}async function Qt(t){var d,i,u,p,h,m;const s=`${t}:indicator-history`,o=Z.get(s);if(o&&Date.now()-o.ts<rt)return o.data;const l=`/v8/finance/chart/${encodeURIComponent(t)}?range=10y&interval=1d&includePrePost=false`,n=await fetch(V(l),{headers:{Accept:"application/json"}});if(!n.ok)throw new Error(`HTTP ${n.status}`);const a=(u=(i=(d=await n.json())==null?void 0:d.chart)==null?void 0:i.result)==null?void 0:u[0];if(!a)throw new Error("Indicator history unavailable");const e=a.timestamp??[],r=((m=(h=(p=a.indicators)==null?void 0:p.quote)==null?void 0:h[0])==null?void 0:m.close)??[],c=e.map((f,v)=>r[v]==null?null:{time:Et(f),close:+r[v].toFixed(4)}).filter(Boolean);return Z.set(s,{ts:Date.now(),data:c}),c}async function Zt(t){var e,r;const s=ut.get(t);if(s&&Date.now()-s.ts<rt)return s.data;const o=["annualTotalRevenue","annualGrossProfit","annualOperatingIncome","annualNetIncome","annualDilutedEPS"],l=Math.floor(Date.now()/1e3),n=l-370*24*60*60,a=`/ws/fundamentals-timeseries/v1/finance/timeseries/${encodeURIComponent(t)}?type=${o.join(",")}&period1=${n}&period2=${l}`;try{const c=await fetch(V(a),{headers:{Accept:"application/json"}});if(!c.ok)return null;const d=((r=(e=await c.json())==null?void 0:e.timeseries)==null?void 0:r.result)??[],i=f=>{var v,g,S,$;return(($=(S=(g=(v=d.find(w=>{var P,E,x,C;return((x=(E=(P=w.meta)==null?void 0:P.symbol)==null?void 0:E.includes)==null?void 0:x.call(E,t))&&((C=w[f])==null?void 0:C.length)}))==null?void 0:v[f])==null?void 0:g.at(-1))==null?void 0:S.reportedValue)==null?void 0:$.raw)??null},u=i("annualTotalRevenue"),p=i("annualGrossProfit"),h=i("annualOperatingIncome"),m={financialData:{totalRevenue:{raw:u},grossMargins:{raw:u&&p?p/u:null},operatingMargins:{raw:u&&h?h/u:null}},defaultKeyStatistics:{trailingEps:{raw:i("annualDilutedEPS")}}};return ut.set(t,{ts:Date.now(),data:m}),m}catch{return null}}const B=(t,s={})=>t==null?"—":t.toLocaleString("en-US",s),K=t=>t==null?"—":`${t>=0?"+":""}${(t*100).toFixed(2)}%`,nt=t=>t==null?"—":t>=1e12?`$${(t/1e12).toFixed(2)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString()}`;function te(t,s){var i,u,p,h,m,f,v,g,S,$,w,P,E,x,C;if(!s){t.innerHTML='<div class="sa-no-data">Fundamental data unavailable.</div>';return}const o=s.price??{},l=s.summaryDetail??{},n=s.defaultKeyStatistics??{},a=s.financialData??{},e=s.assetProfile??{},c=[["Market Cap",nt((i=o.marketCap)==null?void 0:i.raw)],["P/E (TTM)",B((u=l.trailingPE)==null?void 0:u.raw,{maximumFractionDigits:1})],["Fwd P/E",B((p=l.forwardPE)==null?void 0:p.raw,{maximumFractionDigits:1})],["EPS (TTM)",((h=n.trailingEps)==null?void 0:h.raw)!=null?`$${n.trailingEps.raw.toFixed(2)}`:"—"],["52W High",B((m=l.fiftyTwoWeekHigh)==null?void 0:m.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["52W Low",B((f=l.fiftyTwoWeekLow)==null?void 0:f.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["Div Yield",K((v=l.dividendYield)==null?void 0:v.raw)],["Beta",B((g=l.beta)==null?void 0:g.raw,{maximumFractionDigits:2})],["Revenue TTM",nt((S=a.totalRevenue)==null?void 0:S.raw)],["Gross Margin",K(($=a.grossMargins)==null?void 0:$.raw)],["Op Margin",K((w=a.operatingMargins)==null?void 0:w.raw)],["ROE",K((P=a.returnOnEquity)==null?void 0:P.raw)],["P/B Ratio",B((E=n.priceToBook)==null?void 0:E.raw,{maximumFractionDigits:2})],["Avg Volume",B((x=l.averageVolume)==null?void 0:x.raw)],["Employees",B(e.fullTimeEmployees)],["Free Cash Flow",nt((C=a.freeCashflow)==null?void 0:C.raw)]].map(([U,R])=>`
    <div class="sa-fund-card">
      <div class="sa-fund-label">${U}</div>
      <div class="sa-fund-val">${R}</div>
    </div>`).join(""),d=[e.sector,e.industry].filter(Boolean).map(U=>`<span class="sa-badge">${U}</span>`).join("");t.innerHTML=`
    <div class="sa-section-label">Key Metrics</div>
    <div class="sa-fund-grid">${c}</div>
    ${e.longBusinessSummary?`
      <div class="sa-about">
        <div class="sa-section-label">About ${d}</div>
        <p class="sa-about-text">${e.longBusinessSummary}</p>
      </div>`:""}
  `}function ee(t,s,o){var i,u,p;const l=(o==null?void 0:o.price)??{},n=l.longName||l.shortName||(s==null?void 0:s.symbol)||"",a=((i=l.regularMarketPrice)==null?void 0:i.raw)??(s==null?void 0:s.regularMarketPrice)??0,e=(((u=l.regularMarketChangePercent)==null?void 0:u.raw)??0)*100,r=((p=l.regularMarketChange)==null?void 0:p.raw)??0,c=l.exchangeName||(s==null?void 0:s.exchangeName)||"",d=e>=0;t.innerHTML=`
    <div class="sa-hdr-left">
      <div class="sa-hdr-name">${n} <span class="sa-hdr-sym">${(s==null?void 0:s.symbol)??""}</span></div>
      <div class="sa-hdr-exch">${c}</div>
    </div>
    <div class="sa-hdr-right">
      <div class="sa-hdr-price">${a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div class="sa-hdr-chg ${d?"up":"dn"}">${d?"+":""}${r.toFixed(2)} (${d?"+":""}${e.toFixed(2)}%)</div>
    </div>
  `}let J=null;async function pt(){return J||(J=await Lt(()=>import("./lightweight-charts.production-C-4kb1nc.js"),[])),J}async function ae(t){const s=et.map((b,y)=>`<option value="${y}">${b.label}</option>`).join(""),o=at.map((b,y)=>`<button class="sa-range-btn${y===4?" active":""}" data-ri="${y}">${b.label}</button>`).join("");t.innerHTML=`
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
          <div class="sa-ranges">${o}</div>
          <div class="sa-opts">
            <div class="sa-type-group">
              <button class="sa-opt active" data-type="candle">Candle</button>
              <button class="sa-opt" data-type="line">Line</button>
            </div>
            <div class="sa-ind-group">
              <button class="sa-opt" data-ind="ma20">MA 20D</button>
              <button class="sa-opt" data-ind="ma50">MA 50D</button>
              <button class="sa-opt" data-ind="ma200">MA 200D</button>
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
  `;let l=null,n={},a=[],e=!1,r=new Set(["vol"]),c="candle",d=[],i=[],u=[],p=4,h=null,m=null;const f=t.querySelector("#sa-ph"),v=t.querySelector("#sa-main"),g=t.querySelector("#sa-hdr"),S=t.querySelector("#sa-chart"),$=t.querySelector("#sa-overlay"),w=t.querySelector("#sa-tt"),P=t.querySelector("#sa-annot-list"),E=t.querySelector("#sa-funds"),x=t.querySelector("#sa-mkt"),C=t.querySelector("#sa-ticker"),U=t.querySelector("#sa-go"),R=t.querySelector("#sa-annot-btn");async function T(){if(l)return;const{createChart:b,CrosshairMode:y}=await pt();l=b(S,{width:S.clientWidth||900,height:480,layout:{background:{color:"#0b0d14"},textColor:"#8892a4",fontSize:11,fontFamily:"'DM Mono', monospace"},grid:{vertLines:{color:"#1a1d26"},horzLines:{color:"#1a1d26"}},crosshair:{mode:y.Normal},rightPriceScale:{borderColor:"#2a2d3e"},timeScale:{borderColor:"#2a2d3e",timeVisible:!0,secondsVisible:!1}}),m=new ResizeObserver(()=>{l&&S.clientWidth&&l.resize(S.clientWidth,480)}),m.observe(S),l.subscribeCrosshairMove(M=>{var it;if(!M.time||!M.point||!n.main){w.style.display="none";return}const k=M.seriesData.get(n.main);if(!k){w.style.display="none";return}const W="open"in k?`O <b>${k.open}</b>  H <b>${k.high}</b>  L <b>${k.low}</b>  C <b>${k.close}</b>`:`<b>${(it=k.value)==null?void 0:it.toFixed(4)}</b>`,ot=M.seriesData.get(n.vol),Ct=ot?`  Vol <b>${B(ot.value)}</b>`:"";w.innerHTML=`<span class="sa-tt-date">${M.time}</span>  ${W}${Ct}`,w.style.display="block"}),l.subscribeClick(M=>{if(!e||!M.point||!n.main)return;const k=n.main.coordinateToPrice(M.point.y);if(k==null)return;const{LineStyle:j}=J,W=n.main.createPriceLine({price:k,color:"#7c6af7",lineWidth:1,lineStyle:j.Dashed,axisLabelVisible:!0,title:k.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})});a.push({pl:W,price:k}),F()})}async function I(){const{LineStyle:b}=await pt();Object.values(n).forEach(y=>{try{l.removeSeries(y)}catch{}}),n={},a=[],F(),r.has("vol")&&(n.vol=l.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"vol"}),l.priceScale("vol").applyOptions({scaleMargins:{top:.82,bottom:0}}),n.vol.setData(i)),l.priceScale("right").applyOptions({scaleMargins:{top:.06,bottom:r.has("vol")?.22:.04}}),c==="candle"?(n.main=l.addCandlestickSeries({upColor:"#34d399",downColor:"#f87171",borderVisible:!1,wickUpColor:"#34d399",wickDownColor:"#f87171"}),n.main.setData(d)):(n.main=l.addLineSeries({color:"#7c6af7",lineWidth:2}),n.main.setData(d.map(y=>({time:y.time,value:y.close}))));for(const[y,M]of Object.entries(qt))!r.has(y)||u.length<M.period||(n[y]=l.addLineSeries({color:M.color,lineWidth:1,title:M.label}),n[y].setData(zt(u,M.period,d)));if(r.has("bb")&&d.length>=20){const{upper:y,mid:M,lower:k}=Jt(d);n.bbU=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:b.Dashed}),n.bbM=l.addLineSeries({color:"rgba(124,106,247,0.4)",lineWidth:1}),n.bbL=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:b.Dashed}),n.bbU.setData(y),n.bbM.setData(M),n.bbL.setData(k)}l.timeScale().fitContent()}function F(){if(!a.length){P.innerHTML="";return}P.innerHTML=`
      <div class="sa-annot-wrap">
        <span class="sa-section-label">Price Levels</span>
        <div class="sa-annot-pills">
          ${a.map((b,y)=>`
            <span class="sa-annot-pill">
              ${b.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              <button class="sa-annot-x" data-i="${y}">×</button>
            </span>`).join("")}
        </div>
      </div>`,P.querySelectorAll(".sa-annot-x").forEach(b=>{b.addEventListener("click",()=>{const y=+b.dataset.i;try{n.main.removePriceLine(a[y].pl)}catch{}a.splice(y,1),F()})})}async function Y(b){h=b;const{range:y,interval:M}=at[p];$.style.display="flex",f.style.display="none",v.style.display="block",g.innerHTML=`<div class="sa-hdr-loading">Loading ${b}…</div>`,E.innerHTML="";try{await T();const[k,j,W]=await Promise.all([mt(b,y,M),Qt(b),Zt(b)]);d=k.candles,i=k.volumes,u=j,ee(g,k.meta,W),await I(),te(E,W)}catch{g.innerHTML=`<div class="sa-error">Symbol <b>${b}</b> not found or no data available.</div>`,E.innerHTML=""}finally{$.style.display="none"}}async function N(b){if(!h)return;p=b,t.querySelectorAll(".sa-range-btn").forEach((k,j)=>k.classList.toggle("active",j===b));const{range:y,interval:M}=at[b];$.style.display="flex";try{const k=await mt(h,y,M);d=k.candles,i=k.volumes,await I()}finally{$.style.display="none"}}t.querySelectorAll(".sa-range-btn").forEach((b,y)=>b.addEventListener("click",()=>N(y))),x.addEventListener("change",()=>{C.placeholder=`Ticker (e.g. ${et[+x.value].example})`});async function D(){const b=C.value.trim().toUpperCase(),y=et[+x.value];if(!b)return;const M=y.suffix&&!b.endsWith(y.suffix)?`${b}${y.suffix}`:b;await Y(M)}return U.addEventListener("click",D),C.addEventListener("keydown",b=>{b.key==="Enter"&&D()}),t.querySelectorAll("[data-type]").forEach(b=>b.addEventListener("click",async()=>{c=b.dataset.type,t.querySelectorAll("[data-type]").forEach(y=>y.classList.remove("active")),b.classList.add("active"),d.length&&await I()})),t.querySelectorAll("[data-ind]").forEach(b=>b.addEventListener("click",async()=>{const y=b.dataset.ind;r.has(y)?r.delete(y):r.add(y),b.classList.toggle("active",r.has(y)),d.length&&await I()})),R.addEventListener("click",()=>{e=!e,R.classList.toggle("active",e),t.querySelector("#sa-chart-wrap").classList.toggle("sa-annotating",e)}),()=>{m==null||m.disconnect(),l&&(l.remove(),l=null),n={},a=[]}}const At="portv1",ht={symbol:"^GSPC"},ne=[{label:"US",suffix:""},{label:"ASX",suffix:".AX"},{label:"LSE",suffix:".L"},{label:"TSX",suffix:".TO"},{label:"XETRA",suffix:".DE"},{label:"TSE",suffix:".T"},{label:"HKEX",suffix:".HK"}];let L=[],q=63,O=null;function st(){try{localStorage.setItem(At,JSON.stringify(L))}catch{}}function se(){try{return JSON.parse(localStorage.getItem(At)??"[]")}catch{return[]}}const bt=new Map,le=10*60*1e3;async function re(t,s){var l,n,a,e,r;const o=bt.get(t);if(o&&Date.now()-o.ts<le)return o.data;try{const c=`/v8/finance/chart/${encodeURIComponent(t)}?range=1y&interval=1d`,d=await fetch(V(c),{headers:{Accept:"application/json"},signal:s});if(!d.ok)return null;const i=await d.json(),u=(n=(l=i==null?void 0:i.chart)==null?void 0:l.result)==null?void 0:n[0];if(!u)return null;const p=u.timestamp??[],h=((r=(e=(a=u.indicators)==null?void 0:a.quote)==null?void 0:e[0])==null?void 0:r.close)??[],m=u.meta,f=[];for(let g=1;g<p.length;g++)h[g]!=null&&h[g-1]!=null&&h[g-1]!==0&&f.push({date:p[g],ret:(h[g]-h[g-1])/h[g-1]});const v={symbol:t,name:m.longName||m.shortName||t,price:m.regularMarketPrice,retData:f};return bt.set(t,{ts:Date.now(),data:v}),v}catch{return null}}async function oe(t){var s,o,l,n;try{const a=`/v8/finance/chart/${encodeURIComponent(t)}?range=1d&interval=1d`,e=await fetch(V(a),{headers:{Accept:"application/json"}});if(!e.ok)return null;const r=(n=(l=(o=(s=await e.json())==null?void 0:s.chart)==null?void 0:o.result)==null?void 0:l[0])==null?void 0:n.meta;return r?{name:r.longName||r.shortName||t,price:r.regularMarketPrice}:null}catch{return null}}function ie(t){const s=new Date((t+43200)*1e3);return`${s.getUTCFullYear()}-${String(s.getUTCMonth()+1).padStart(2,"0")}-${String(s.getUTCDate()).padStart(2,"0")}`}function ce(t){const s=t.map(a=>a.map(e=>({key:ie(e.date),ret:e.ret}))),o=new Set;s.forEach(a=>a.forEach(e=>o.add(e.key)));const l=[...o].sort(),n=s.map(a=>{const e=new Map(a.map(r=>[r.key,r.ret]));return l.map(r=>e.get(r)??0)});return{dates:l,aligned:n}}function de(t,s){var c;const o=t.length,l=((c=t[0])==null?void 0:c.length)??0;if(l<10||o<1)return null;const n=Math.exp(-Math.LN2/s),a=Array.from({length:o},()=>new Array(o).fill(0));let e=0,r=1;for(let d=l-1;d>=0;d--){for(let i=0;i<o;i++)for(let u=0;u<o;u++)a[i][u]+=r*t[i][d]*t[u][d];e+=r,r*=n}for(let d=0;d<o;d++)for(let i=0;i<o;i++)a[d][i]=a[d][i]/e*252;return a}function ue(t){const s=t.length;return Array.from({length:s},(o,l)=>Array.from({length:s},(n,a)=>{const e=Math.sqrt(t[l][l]*t[a][a]);return e>0?t[l][a]/e:l===a?1:0}))}function me(t,s){t.length;const o=t.map((i,u)=>t.reduce((p,h,m)=>p+s[u][m]*h,0)),l=t.reduce((i,u,p)=>i+u*o[p],0),n=Math.sqrt(Math.max(0,l)),a=t.map((i,u)=>n>0?i*o[u]/n:0),e=a.map(i=>n>0?i/n:0),r=s.map((i,u)=>Math.sqrt(Math.max(0,s[u][u]))),c=t.reduce((i,u,p)=>i+u*r[p],0),d=n>0?c/n:1;return{portVol:n,RC:a,pctRC:e,indivVols:r,divRatio:d}}function pe(t,s){const o=t.length;if(o<5)return null;let l=1,n=1,a=0;const e=[],r=[];for(const v of t){l*=1+v,e.push(l),l>n&&(n=l);const g=l/n-1;r.push(g),-g>a&&(a=-g)}const c=Math.pow(Math.max(l,1e-9),252/o)-1,d=t.reduce((v,g)=>v+g,0)/o,i=Math.sqrt(t.reduce((v,g)=>v+(g-d)**2,0)/(o-1)*252),u=i>0?(c-.04)/i:null,p=a>0?c/a:null;let h=null;if((s==null?void 0:s.length)===o){const v=s.reduce(($,w)=>$+w,0)/o;let g=0,S=0;t.forEach(($,w)=>{g+=($-d)*(s[w]-v),S+=(s[w]-v)**2}),h=S>0?g/S:null}let m=1;const f=(s==null?void 0:s.map(v=>(m*=1+v,m)))??[];return{annRet:c,vol:i,sharpe:u,beta:h,maxDD:a,calmar:p,navSeries:e,ddSeries:r,bmkNav:f}}const A={pct:(t,s=2)=>t==null||isNaN(t)?"—":`${t>=0?"+":""}${(t*100).toFixed(s)}%`,num:(t,s=2)=>t==null||isNaN(t)?"—":t.toFixed(s),price:t=>t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),cls:t=>t==null||isNaN(t)?"":t>=0?"up":"dn"};function he(t){if(t==null||isNaN(t))return"transparent";const s=Math.max(-1,Math.min(1,t)),o=(Math.abs(s)*.65+.08).toFixed(2);return s>=0?`rgba(248,113,113,${o})`:`rgba(52,211,153,${o})`}function be(t){return`<div class="port-metrics-strip">
    ${[["Ann. Return",A.pct(t.annRet),A.cls(t.annRet)],["Ann. Vol",A.pct(t.vol),""],["Sharpe",A.num(t.sharpe),A.cls(t.sharpe)],["Beta (SPX)",A.num(t.beta),""],["Max Drawdown",A.pct(-t.maxDD),"dn"],["Calmar",A.num(t.calmar),A.cls(t.calmar)]].map(([o,l,n])=>`
      <div class="port-metric-card">
        <div class="port-metric-label">${o}</div>
        <div class="port-metric-val ${n}">${l}</div>
      </div>`).join("")}
  </div>`}function ve(t,s,o){const{portVol:l,pctRC:n,indivVols:a,divRatio:e}=me(s,o),r=Math.max(1e-9,...n.map(Math.abs)),c=t.map((d,i)=>`
    <div class="port-risk-row">
      <div class="port-risk-lbl">${d}</div>
      <div class="port-risk-bar-wrap">
        <div class="port-risk-bar" style="width:${(Math.abs(n[i])/r*100).toFixed(1)}%"></div>
      </div>
      <div class="port-risk-pct">${(n[i]*100).toFixed(1)}%</div>
      <div class="port-risk-vol">${(a[i]*100).toFixed(1)}% vol</div>
    </div>`).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Risk Contribution</div>
      <div class="port-risk-meta">
        Portfolio Vol <strong>${(l*100).toFixed(2)}%</strong>
        &nbsp;·&nbsp; Div. Ratio <strong>${e.toFixed(2)}×</strong>
      </div>
      <div class="port-risk-rows">${c}</div>
    </div>`}function fe(t,s,o){const l=s.reduce((a,e,r)=>a+e*s.reduce((c,d,i)=>c+d*o[r][i],0),0);return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Volatility & Contribution Beta</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Ann. Vol</th><th class="num">β → Port</th>
        </tr></thead>
        <tbody>${t.map((a,e)=>{const r=Math.sqrt(Math.max(0,o[e][e])),c=s.reduce((i,u,p)=>i+u*o[e][p],0),d=l>0?c/l:null;return`<tr>
      <td class="mkt-name">${a}</td>
      <td class="num">${(s[e]*100).toFixed(1)}%</td>
      <td class="num">${(r*100).toFixed(1)}%</td>
      <td class="num">${A.num(d)}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function ge(t,s,o){const l=ue(s),n=t.map(e=>`<th class="corr-col-hdr">${e}</th>`).join(""),a=t.map((e,r)=>`<tr><th class="corr-row-hdr">${e}</th>${t.map((c,d)=>{const i=l[r][d],u=r===d;return`<td class="corr-cell${u?" corr-diag":""}"
        style="background:${u?"var(--bg-base)":he(i)}">${u?"—":i.toFixed(2)}</td>`}).join("")}</tr>`).join("");return`
    <div class="mkt-panel">
      <div class="port-corr-hdr">
        <span class="mkt-panel-label" style="border:none;padding:10px 14px 8px">EWMA Correlation Matrix</span>
        <div class="port-hl-ctrl">
          <span class="port-hl-label">Half-life</span>
          <input type="range" id="port-hl-slider" class="port-hl-slider" min="5" max="252" value="${o}" step="1">
          <span id="port-hl-val" class="port-hl-val">${o}d</span>
        </div>
      </div>
      <div class="corr-legend">
        <span class="corr-leg corr-leg-neg">■ Diversifying (negative)</span>
        <span class="corr-leg corr-leg-pos">■ Correlated (positive)</span>
      </div>
      <div class="corr-scroll">
        <table class="corr-table">
          <thead><tr><th></th>${n}</tr></thead>
          <tbody>${a}</tbody>
        </table>
      </div>
    </div>`}function ye(t,s,o,l,n){const a=l.length,e={"1d":1,"1w":5,"1m":21,"3m":63};let r;if(n==="ytd"){const h=String(new Date().getFullYear());r=l.findIndex(m=>m.startsWith(h)),r<0&&(r=0)}else r=Math.max(0,a-(e[n]??1));const c=o.map(h=>h.slice(r).reduce((m,f)=>m*(1+f),1)-1),d=c.reduce((h,m,f)=>h+s[f]*m,0),i=Math.max(1e-9,...c.map(h=>Math.abs(h))),u=["1d","1w","1m","3m","ytd"].map(h=>`<button class="port-period-btn${h===n?" active":""}" data-period="${h}">${h.toUpperCase()}</button>`).join(""),p=t.map((h,m)=>{const f=c[m],v=s[m]*f,g=(Math.abs(f)/i*100).toFixed(1);return`<tr>
      <td class="mkt-name">${h}</td>
      <td class="num">${(s[m]*100).toFixed(1)}%</td>
      <td class="num ${A.cls(f)}">${A.pct(f)}</td>
      <td class="num ${A.cls(v)}">${A.pct(v)}</td>
      <td class="port-attr-bar-cell">
        <span class="port-attr-bar ${f>=0?"up":"dn"}" style="width:${g}%"></span>
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
        <tbody>${p}</tbody>
      </table>
    </div>`}async function Se(t,s,o,l){var p;const n=t.querySelector("#port-chart-wrap");if(!n)return;O&&(O(),O=null);const{createChart:a}=await Lt(async()=>{const{createChart:h}=await import("./lightweight-charts.production-C-4kb1nc.js");return{createChart:h}},[]);n.innerHTML="";const e=document.createElement("div");e.style.height="280px",n.appendChild(e);const r=a(e,{layout:{background:{color:"transparent"},textColor:"#6b7280"},grid:{vertLines:{color:"#22253a"},horzLines:{color:"#22253a"}},rightPriceScale:{borderColor:"#22253a"},timeScale:{borderColor:"#22253a"}}),c=r.addLineSeries({color:"#7c6af7",lineWidth:2,title:"Portfolio"}),d=r.addLineSeries({color:"#4b5563",lineWidth:1,lineStyle:2,title:"S&P 500"});function i(h){if(h==="cumret")c.setData(s.map((m,f)=>({time:m,value:+((o[f]-1)*100).toFixed(3)}))),d.setData(s.map((m,f)=>({time:m,value:+((l[f]-1)*100).toFixed(3)})));else{let m=1;c.setData(s.map((f,v)=>(o[v]>m&&(m=o[v]),{time:f,value:+((o[v]/m-1)*100).toFixed(3)}))),d.setData([])}r.timeScale().fitContent()}i("cumret"),(p=t.querySelector("#port-chart-toggle"))==null||p.querySelectorAll("[data-mode]").forEach(h=>{h.addEventListener("click",()=>{t.querySelectorAll("#port-chart-toggle [data-mode]").forEach(m=>m.classList.toggle("active",m===h)),i(h.dataset.mode)})});const u=new ResizeObserver(()=>r.resize(e.offsetWidth,280));u.observe(e),O=()=>{u.disconnect(),r.remove()}}function ke(t,s,o,l,n,a){t.innerHTML=`
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
  `,t.querySelector("#port-metrics-strip").innerHTML=be(a);function e(d){const i=de(s,d);i&&(t.querySelector("#port-risk-panel").innerHTML=ve(l,n,i),t.querySelector("#port-vol-panel").innerHTML=fe(l,n,i),t.querySelector("#port-corr-panel").innerHTML=ge(l,i,d),r())}function r(){const d=t.querySelector("#port-hl-slider"),i=t.querySelector("#port-hl-val");d&&d.addEventListener("input",()=>{q=+d.value,i&&(i.textContent=`${q}d`),e(q)})}function c(d="1d"){var i;t.querySelector("#port-attr-panel").innerHTML=ye(l,n,s,o,d),(i=t.querySelector("#port-attr-periods"))==null||i.querySelectorAll(".port-period-btn").forEach(u=>{u.addEventListener("click",()=>c(u.dataset.period))})}e(q),c("1d"),Se(t,o,a.navSeries,a.bmkNav)}function $e(t){L=se(),Array.isArray(L)||(L=[]),t.innerHTML=`
    <div class="port-layout">
      <div class="mkt-panel port-holdings-panel">
        <div class="mkt-panel-label">Portfolio Holdings</div>

        <div class="port-add-form">
          <select id="port-market" class="sa-market-sel">
            ${ne.map(p=>`<option value="${p.suffix}">${p.label}</option>`).join("")}
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
  `;let s=L.reduce((p,h)=>Math.max(p,h.id??0),0)+1,o=null;const l=t.querySelector("#port-analytics"),n=t.querySelector("#port-add-btn"),a=t.querySelector("#port-analyze-btn"),e=t.querySelector("#port-add-err"),r=t.querySelector("#port-ticker"),c=t.querySelector("#port-market"),d=t.querySelector("#port-weight-inp"),i=t.querySelector("#port-holdings-body");function u(){const p=L.reduce((m,f)=>m+f.weight,0);i.innerHTML=L.length===0?'<tr><td colspan="5" class="port-empty">No holdings yet — add a ticker above.</td></tr>':L.map(m=>`
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
        </tr>`).join("");const h=t.querySelector("#port-total");h&&(h.textContent=`Total: ${p.toFixed(1)}%`,h.className=`port-total ${p>100.01?"dn":Math.abs(p-100)<.01?"up":""}`),i.querySelectorAll(".port-wt-inp").forEach(m=>{m.addEventListener("change",f=>{const v=L.find(g=>g.id===+f.target.dataset.id);v&&(v.weight=parseFloat(f.target.value)||0,st(),u())})}),i.querySelectorAll(".port-remove").forEach(m=>{m.addEventListener("click",f=>{L=L.filter(v=>v.id!==+f.target.dataset.id),st(),u()})})}return n.addEventListener("click",async()=>{const p=c.value,h=r.value.trim().toUpperCase();if(!h){e.textContent="Enter a ticker";return}const m=h+p;if(L.some(g=>g.symbol===m)){e.textContent="Already added";return}const f=parseFloat(d.value)||0;n.disabled=!0,e.textContent="Looking up…";const v=await oe(m);if(n.disabled=!1,!v){e.textContent=`"${m}" not found`;return}L.push({id:s++,symbol:m,displaySymbol:h,name:v.name,price:v.price,weight:f}),st(),r.value="",d.value="",e.textContent="",u()}),r.addEventListener("keydown",p=>{p.key==="Enter"&&n.click()}),a.addEventListener("click",async()=>{if(L.length<2){l.innerHTML='<div class="port-msg port-err">Add at least 2 holdings to analyze.</div>';return}o==null||o.abort(),o=new AbortController,l.innerHTML=`<div class="port-msg port-loading"><div class="sa-spinner"></div><span>Fetching 1Y data for ${L.length} holdings…</span></div>`,a.disabled=!0;const p=[...new Set([ht.symbol,...L.map(T=>T.symbol)])],h=await Promise.all(p.map(T=>re(T,o.signal)));a.disabled=!1;const m=new Map(p.map((T,I)=>[T,h[I]])),f=L.filter(T=>!m.get(T.symbol));if(f.length){l.innerHTML=`<div class="port-msg port-err">Could not load data for: ${f.map(T=>T.displaySymbol).join(", ")}</div>`;return}const v=m.get(ht.symbol),g=L.map(T=>m.get(T.symbol).retData),S=v?[...g,v.retData]:g,{dates:$,aligned:w}=ce(S),P=w.slice(0,L.length),E=v?w[w.length-1]:null,x=L.map(T=>T.weight/100),C=$.map((T,I)=>x.reduce((F,Y,N)=>F+Y*(P[N][I]??0),0)),U=pe(C,E);if(!U){l.innerHTML='<div class="port-msg port-err">Insufficient data for analysis (need ≥5 aligned trading days).</div>';return}const R=L.map(T=>T.displaySymbol);ke(l,P,$,R,x,U)}),u(),()=>{o==null||o.abort(),O&&(O(),O=null)}}const we=["market","stock","portfolio"],xe={market:"Macro monitor",stock:"Single name",portfolio:"Portfolio lab"},Me={market:"01",stock:"02",portfolio:"03"};let z="market",G=null;const Dt="macro-monitor-theme";function Le(){try{return localStorage.getItem(Dt)==="light"?"light":"dark"}catch{return"dark"}}function vt(t){document.documentElement.dataset.theme=t}function Te(t){const s=Le();vt(s),t.innerHTML=`
    <div class="app-frame">
      <header class="topbar">
        <div class="brand-lockup"><div class="logo">MACRO MONITOR</div><div class="brand-sub">GLOBAL MULTI-ASSET RESEARCH</div></div>
        <div class="topbar-center"><nav class="tabs" id="main-tabs">
          ${we.map(e=>`<button class="tab ${e===z?"active":""}" data-tab="${e}"><span class="tab-num">${Me[e]}</span>${xe[e]}</button>`).join("")}
        </nav></div>
        <div class="topbar-right"><span class="market-status"><i></i> DATA LINKED</span><span class="topbar-date">${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span><button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to light theme" aria-pressed="${s==="light"}"><span class="theme-icon" aria-hidden="true">${s==="light"?"D":"L"}</span><span class="theme-label">${s==="light"?"Dark":"Light"}</span></button></div>
      </header>
      <main class="main-content" id="tab-content"></main>
      <footer class="app-footer"><span>NSM / TERMINAL</span><span>MARKET DATA: YAHOO FINANCE · DELAYED / INDICATIVE</span><span>LOCAL SESSION</span></footer>
    </div>
  `;const o=t.querySelector("#main-tabs"),l=t.querySelector("#tab-content"),n=t.querySelector("#theme-toggle");n.addEventListener("click",()=>{const e=document.documentElement.dataset.theme==="light"?"dark":"light";vt(e),n.setAttribute("aria-pressed",String(e==="light")),n.setAttribute("aria-label",`Switch to ${e==="light"?"dark":"light"} theme`),n.querySelector(".theme-icon").textContent=e==="light"?"D":"L",n.querySelector(".theme-label").textContent=e==="light"?"Dark":"Light";try{localStorage.setItem(Dt,e)}catch{}});function a(e){e!==z&&(z=e,o.querySelectorAll(".tab").forEach(r=>{r.classList.toggle("active",r.dataset.tab===e)}),ft(l,e))}o.addEventListener("click",e=>{const r=e.target.closest(".tab");r&&a(r.dataset.tab)}),ft(l,z)}function ft(t,s){G&&(G(),G=null),t.innerHTML="",s==="market"?Gt(t).then(o=>{G=o??null}):s==="stock"?ae(t).then(o=>{G=o??null}):s==="portfolio"&&(G=$e(t)??null)}Te(document.getElementById("app"));
