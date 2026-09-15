(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const e of n)if(e.type==="childList")for(const a of e.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&l(a)}).observe(document,{childList:!0,subtree:!0});function r(n){const e={};return n.integrity&&(e.integrity=n.integrity),n.referrerPolicy&&(e.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?e.credentials="include":n.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function l(n){if(n.ep)return;n.ep=!0;const e=r(n);fetch(n.href,e)}})();const ft="https://yf-proxy.lukewynd.workers.dev";function V(t){return`${ft}${t}`}function Dt(t){const s=encodeURIComponent(t);return`${ft}/v8/finance/chart/${s}?range=1y&interval=1d`}const ct=new Map,Ct=5*60*1e3;async function Pt(t){var r,l,n,e,a,o;const s=ct.get(t);if(s&&Date.now()-s.ts<Ct)return s.data;try{const c=await fetch(Dt(t),{headers:{Accept:"application/json"}});if(!c.ok)return null;const d=await c.json(),i=(l=(r=d==null?void 0:d.chart)==null?void 0:r.result)==null?void 0:l[0];if(!i)return null;const u=i.meta,p=((a=(e=(n=i.indicators)==null?void 0:n.quote)==null?void 0:e[0])==null?void 0:a.close)??[],h=D=>{for(let b=D;b>=0;b--)if(p[b]!=null)return{index:b,value:p[b]};return null},m=h(p.length-1),f=m?h(m.index-1):null,g=u.regularMarketPrice??null??(m==null?void 0:m.value)??null,S=(f==null?void 0:f.value)??null,$=g!=null&&S!=null?g-S:null,w=$!=null&&S!==0?$/S*100:null,P=p.length,T=(m==null?void 0:m.index)??-1,x=g,C=D=>{let b=T-D;for(;b>=0&&p[b]==null;)b--;const y=b>=0?p[b]:null;return y!=null&&x!=null&&y!==0?(x-y)/y*100:null},U=D=>{let b=T-D;for(;b>=0&&p[b]==null;)b--;return b>=0?p[b]:null},R=D=>{const b=U(D);return b!=null&&x!=null?x-b:null},A=new Date().getFullYear(),I=i.timestamp??[];let F=null;for(let D=0;D<I.length;D++)if(new Date(I[D]*1e3).getFullYear()===A&&p[D]!=null){F=p[D];break}const Y=F!=null&&F!==0&&x!=null?(x-F)/F*100:null,N={symbol:t,regularMarketPrice:g,regularMarketChangePercent:w,regularMarketChange:$,previousClose:S,dataTimestamp:((o=i.timestamp)==null?void 0:o[T])??null,source:"Yahoo Finance chart",quoteType:u.instrumentType??"",ytdPct:Y,pct1d:w,pct1w:C(5),pct1m:C(21),pct3m:C(63),pctYtd:Y,change1d:$,change1w:R(5),change1m:R(21),change3m:R(63),changeYtd:F!=null&&x!=null?x-F:null};return ct.set(t,{ts:Date.now(),data:N}),N}catch{return null}}async function Ft(t){const r=new Map;for(let l=0;l<t.length;l+=8){const n=t.slice(l,l+8),e=await Promise.allSettled(n.map(a=>Pt(a)));n.forEach((a,o)=>{const c=e[o].status==="fulfilled"?e[o].value:null;c&&r.set(a,c)})}return r}const gt=[{symbol:"^GSPC",name:"S&P 500",type:"index"},{symbol:"^VIX",name:"VIX",type:"vix"},{symbol:"^TNX",name:"US 10Y",type:"yield"},{symbol:"DX-Y.NYB",name:"DXY",type:"index"},{symbol:"GC=F",name:"Gold",type:"commodity"},{symbol:"BTC-USD",name:"Bitcoin",type:"crypto"}],yt=[{symbol:"^GSPC",name:"S&P 500",region:"Americas"},{symbol:"^IXIC",name:"NASDAQ Comp.",region:"Americas"},{symbol:"^DJI",name:"Dow Jones",region:"Americas"},{symbol:"^RUT",name:"Russell 2000",region:"Americas"},{symbol:"^BVSP",name:"Bovespa",region:"Americas"},{symbol:"^MXX",name:"IPC Mexico",region:"Americas"},{symbol:"^FTSE",name:"FTSE 100",region:"Europe"},{symbol:"^GDAXI",name:"DAX",region:"Europe"},{symbol:"^FCHI",name:"CAC 40",region:"Europe"},{symbol:"^STOXX50E",name:"Euro Stoxx 50",region:"Europe"},{symbol:"^SSMI",name:"SMI",region:"Europe"},{symbol:"^AEX",name:"AEX",region:"Europe"},{symbol:"^N225",name:"Nikkei 225",region:"Asia-Pacific"},{symbol:"^HSI",name:"Hang Seng",region:"Asia-Pacific"},{symbol:"000001.SS",name:"Shanghai Comp.",region:"Asia-Pacific"},{symbol:"^AXJO",name:"ASX 200",region:"Asia-Pacific"},{symbol:"^KS11",name:"KOSPI",region:"Asia-Pacific"},{symbol:"^STI",name:"Straits Times",region:"Asia-Pacific"}],St=[{symbol:"^IRX",name:"3-Month"},{symbol:"^FVX",name:"5-Year"},{symbol:"^TNX",name:"10-Year"},{symbol:"^TYX",name:"30-Year"}],kt=[{symbol:"BWX",name:"Global ex-US Treasuries",region:"Global"},{symbol:"IGOV",name:"International Treasuries",region:"Developed"},{symbol:"EMB",name:"Emerging Market Sovereign",region:"Emerging"},{symbol:"EWJ",name:"Japan rates proxy",region:"Japan"}],lt=[{code:"USD",name:"US Dollar",symbol:null,invert:!1},{code:"EUR",name:"Euro",symbol:"EURUSD=X",invert:!1},{code:"GBP",name:"Sterling",symbol:"GBPUSD=X",invert:!1},{code:"JPY",name:"Yen",symbol:"USDJPY=X",invert:!0},{code:"AUD",name:"Aus Dollar",symbol:"AUDUSD=X",invert:!1},{code:"CAD",name:"Can Dollar",symbol:"USDCAD=X",invert:!0},{code:"CHF",name:"Swiss Franc",symbol:"USDCHF=X",invert:!0}],Ht=lt.filter(t=>t.symbol).map(t=>t.symbol),$t=[{symbol:"GC=F",name:"Gold",unit:"/oz",group:"Metals"},{symbol:"SI=F",name:"Silver",unit:"/oz",group:"Metals"},{symbol:"HG=F",name:"Copper",unit:"/lb",group:"Metals"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl",group:"Energy"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl",group:"Energy"},{symbol:"NG=F",name:"Nat. Gas",unit:"/MMBtu",group:"Energy"},{symbol:"ZW=F",name:"Wheat",unit:"/bu",group:"Agri"},{symbol:"ZC=F",name:"Corn",unit:"/bu",group:"Agri"}],wt=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],xt=[{symbol:"BTC-USD",name:"Bitcoin",abbr:"BTC"},{symbol:"ETH-USD",name:"Ethereum",abbr:"ETH"},{symbol:"SOL-USD",name:"Solana",abbr:"SOL"},{symbol:"XRP-USD",name:"XRP",abbr:"XRP"}],tt=[...new Set([...gt.map(t=>t.symbol),...yt.map(t=>t.symbol),...St.map(t=>t.symbol),...kt.map(t=>t.symbol),...Ht,...$t.map(t=>t.symbol),...wt.map(t=>t.symbol),...xt.map(t=>t.symbol)])];function Q(t,s=2){return t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:s,maximumFractionDigits:s})}function X(t){if(t==null)return{text:"—",cls:""};const s=t>=0?"+":"",r=t>=0?"up":"dn",l=Math.abs(t)>=3?" strong":"";return{text:`${s}${t.toFixed(2)}%`,cls:r+l}}function It(t){if(t==null)return{text:"—",cls:""};const s=Math.round(t*100),r=s>=0?"+":"",l=s>=0?"up":"dn";return{text:`${r}${s}bps`,cls:l}}function H(t){const s=X(t);return`<td class="num pct-cell ${s.cls}">${s.text}</td>`}function _(t,s=7){return Array.from({length:t},()=>`<tr>${Array.from({length:s},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function Ut(t){return gt.map(({symbol:s,name:r,type:l})=>{const n=t.get(s),e=n==null?void 0:n.regularMarketPrice,a=X((n==null?void 0:n.pct1d)??null),o=X((n==null?void 0:n.pctYtd)??null);let c="—";return e!=null&&(l==="yield"?c=e.toFixed(2)+"%":l==="crypto"?c="$"+e.toLocaleString("en-US",{maximumFractionDigits:0}):l==="commodity"?c="$"+Q(e):c=Q(e)),`
      <div class="mkt-stat-card">
        <div class="mkt-stat-name">${r}</div>
        <div class="mkt-stat-price">${c}</div>
        <div class="mkt-stat-chg ${a.cls}">${a.text}</div>
        <div class="mkt-stat-ytd ${o.cls}">${o.text} YTD</div>
      </div>`}).join("")}function Rt(t){const s=["Americas","Europe","Asia-Pacific"];let r="";return s.forEach(l=>{const n=yt.filter(e=>e.region===l);r+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,r+=n.map(({symbol:e,name:a})=>{const o=t.get(e),c=o==null?void 0:o.regularMarketPrice,d=c!=null?c.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";return`<tr>
        <td class="mkt-name">${a}</td>
        <td class="num mono">${d}</td>
        ${H(o==null?void 0:o.pct1d)}
        ${H(o==null?void 0:o.pct1w)}
        ${H(o==null?void 0:o.pct1m)}
        ${H(o==null?void 0:o.pct3m)}
        ${H(o==null?void 0:o.pctYtd)}
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
    </div>`}function Bt(t){const s=St.map(({symbol:n,name:e})=>{const a=t.get(n),o=(a==null?void 0:a.regularMarketPrice)??null;return{name:e,yld:o,change1d:(a==null?void 0:a.change1d)??null,change1w:(a==null?void 0:a.change1w)??null,change1m:(a==null?void 0:a.change1m)??null,change3m:(a==null?void 0:a.change3m)??null,changeYtd:(a==null?void 0:a.changeYtd)??null}}),r=Math.max(.01,...s.map(n=>n.yld??0));return`
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
        <tbody>${s.map(({name:n,yld:e,change1d:a,change1w:o,change1m:c,change3m:d,changeYtd:i})=>{const u=[a,o,c,d,i].map(It),p=e!=null?e.toFixed(2)+"%":"—",h=e!=null?e/r*100:0;return`<tr>
      <td class="mkt-name">${n}</td>
      <td class="num mono">${p}</td>
      <td class="yc-bar-cell"><span class="yc-bar" style="width:${h.toFixed(1)}%"></span></td>
      ${u.map(m=>`<td class="num pct-cell ${m.cls}">${m.text}</td>`).join("")}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Xt(t){return`<div class="mkt-panel">
    <div class="mkt-panel-label">Global Bond Markets · price proxies</div>
    <table class="mkt-table">
      <thead><tr><th>Instrument</th><th class="num">Level</th><th class="num">1D</th><th class="num">1M</th><th class="num">YTD</th></tr></thead>
      <tbody>${kt.map(({symbol:r,name:l,region:n})=>{const e=t.get(r),a=e==null?void 0:e.regularMarketPrice,o=X(e==null?void 0:e.pct1d),c=X(e==null?void 0:e.pct1m),d=X(e==null?void 0:e.pctYtd);return`<tr>
      <td><span class="mkt-name">${l}</span><span class="mkt-unit">${n}</span></td>
      <td class="num mono">${a!=null?Q(a):"—"}</td>
      <td class="num pct-cell ${o.cls}">${o.text}</td>
      <td class="num pct-cell ${c.cls}">${c.text}</td>
      <td class="num pct-cell ${d.cls}">${d.text}</td>
    </tr>`}).join("")}</tbody>
    </table>
  </div>`}function Ot(t){const s={USD:1};lt.forEach(({code:a,symbol:o,invert:c})=>{var i;if(!o)return;const d=(i=t.get(o))==null?void 0:i.regularMarketPrice;d!=null&&(s[a]=c?1/d:d)});const r=a=>a==null?"—":a>=100?a.toFixed(2):a>=10?a.toFixed(3):a.toFixed(4),l=lt.map(a=>a.code),n=l.map(a=>`<th class="num fx-col-hdr">${a}</th>`).join(""),e=l.map(a=>{const o=l.map(c=>{if(a===c)return'<td class="fx-diag">—</td>';const d=s[a],i=s[c],u=d!=null&&i!=null&&i!==0?d/i:null;return`<td class="num fx-cell">${r(u)}</td>`}).join("");return`<tr><th class="fx-row-hdr">${a}</th>${o}</tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Cross Rates <span class="mkt-panel-sub">1 row = X column</span></div>
      <div class="fx-matrix-wrap">
        <table class="fx-matrix">
          <thead><tr><th></th>${n}</tr></thead>
          <tbody>${e}</tbody>
        </table>
      </div>
    </div>`}function Yt(t){const s=["Metals","Energy","Agri"];let r="";return s.forEach(l=>{const n=$t.filter(e=>e.group===l);r+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,r+=n.map(({symbol:e,name:a,unit:o})=>{const c=t.get(e),d=c==null?void 0:c.regularMarketPrice,i=d!=null?"$"+Q(d):"—";return`<tr>
        <td class="mkt-name">${a}<span class="mkt-unit">${o}</span></td>
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
        <tbody>${r}</tbody>
      </table>
    </div>`}function Nt(t){const s=wt.map(({symbol:n,name:e})=>{const a=t.get(n);return{name:e,pct1d:(a==null?void 0:a.pct1d)??null,pct1m:(a==null?void 0:a.pct1m)??null,pctYtd:(a==null?void 0:a.pctYtd)??null}});s.sort((n,e)=>(e.pct1d??-999)-(n.pct1d??-999));const r=Math.max(.01,...s.map(n=>Math.abs(n.pct1d??0)));return`
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
        <tbody>${s.map(({name:n,pct1d:e,pct1m:a,pctYtd:o})=>{const c=X(e),d=X(a),i=X(o),u=e!=null?Math.abs(e)/r*100:0;return`<tr>
      <td class="mkt-name sec-name">${n}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${c.cls}" style="width:${u.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${c.cls}">${c.text}</td>
      <td class="num pct-cell ${d.cls}">${d.text}</td>
      <td class="num pct-cell ${i.cls}">${i.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function jt(t){return`
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
        <tbody>${xt.map(({symbol:r,name:l,abbr:n})=>{const e=t.get(r),a=e==null?void 0:e.regularMarketPrice,o=a!=null?"$"+a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:a>=100?2:4}):"—";return`<tr>
      <td class="mkt-name">${l} <span class="mkt-abbr">${n}</span></td>
      <td class="num mono">${o}</td>
      ${H(e==null?void 0:e.pct1d)}
      ${H(e==null?void 0:e.pct1w)}
      ${H(e==null?void 0:e.pct1m)}
      ${H(e==null?void 0:e.pctYtd)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}async function Wt(t){t.innerHTML=`
    <div class="mkt-topbar">
      <div class="mkt-topbar-left">
        <div><div class="eyebrow">01 / MACRO MONITOR</div><h1 class="mkt-title">Global cross-asset pulse</h1><p class="mkt-dek">A compact read on risk appetite, rates, dollar liquidity and the real economy.</p></div>
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
  `;const s=t.querySelector("#mkt-refresh");async function r(){const n=t.querySelector("#mkt-timestamp");n.textContent="Loading…";const e=await Ft(tt);if(!t.isConnected)return;t.querySelector("#mkt-stats").innerHTML=Ut(e),t.querySelector("#mkt-equities").innerHTML=Rt(e),t.querySelector("#mkt-bonds").innerHTML=Bt(e),t.querySelector("#mkt-fx").innerHTML=Ot(e),t.querySelector("#mkt-global-bonds").innerHTML=Xt(e),t.querySelector("#mkt-commodities").innerHTML=Yt(e),t.querySelector("#mkt-sectors").innerHTML=Nt(e),t.querySelector("#mkt-crypto").innerHTML=jt(e);const a=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"}),o=tt.length-e.size;n.textContent=`Updated ${a} · ${e.size}/${tt.length} instruments${o?` · ${o} unavailable`:""}`}s.addEventListener("click",r),await r();const l=setInterval(r,30*60*1e3);return()=>clearInterval(l)}const _t="modulepreload",Gt=function(t){return"/investment-dash/"+t},dt={},Mt=function(s,r,l){let n=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),o=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));n=Promise.allSettled(r.map(c=>{if(c=Gt(c),c in dt)return;dt[c]=!0;const d=c.endsWith(".css"),i=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${i}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":_t,d||(u.as="script"),u.crossOrigin="",u.href=c,o&&u.setAttribute("nonce",o),document.head.appendChild(u),d)return new Promise((p,h)=>{u.addEventListener("load",p),u.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${c}`)))})}))}function e(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return n.then(a=>{for(const o of a||[])o.status==="rejected"&&e(o.reason);return s().catch(e)})},et=[{label:"US (NYSE / NASDAQ)",suffix:"",example:"AAPL"},{label:"Australia (ASX)",suffix:".AX",example:"CBA.AX"},{label:"UK (LSE)",suffix:".L",example:"HSBA.L"},{label:"Canada (TSX)",suffix:".TO",example:"RY.TO"},{label:"Germany (XETRA)",suffix:".DE",example:"SAP.DE"},{label:"Japan (TSE)",suffix:".T",example:"7203.T"},{label:"Hong Kong (HKEX)",suffix:".HK",example:"0700.HK"}],at=[{label:"1W",range:"5d",interval:"1d"},{label:"1M",range:"1mo",interval:"1d"},{label:"3M",range:"3mo",interval:"1d"},{label:"6M",range:"6mo",interval:"1d"},{label:"1Y",range:"1y",interval:"1d"},{label:"2Y",range:"2y",interval:"1wk"},{label:"5Y",range:"5y",interval:"1wk"},{label:"MAX",range:"max",interval:"1mo"}],Vt={ma20:{period:20,color:"#fbbf24",label:"MA 20D"},ma50:{period:50,color:"#60a5fa",label:"MA 50D"},ma200:{period:200,color:"#f87171",label:"MA 200D"}};function Lt(t,s){const r=[];for(let l=s-1;l<t.length;l++){const n=t.slice(l-s+1,l+1).reduce((e,a)=>e+a.close,0);r.push({time:t[l].time,value:+(n/s).toFixed(4)})}return r}function Kt(t,s,r){const l=Lt(t,s);let n=0,e=null;return r.map(a=>{for(;n<l.length&&l[n].time<=a.time;)e=l[n].value,n+=1;return e==null?null:{time:a.time,value:e}}).filter(Boolean)}function qt(t,s=20,r=2){const l=Lt(t,s),n=[],e=[];for(let a=0;a<l.length;a++){const o=a+s-1,c=t.slice(o-s+1,o+1).map(u=>u.close),d=l[a].value,i=Math.sqrt(c.reduce((u,p)=>u+(p-d)**2,0)/s);n.push({time:l[a].time,value:+(d+r*i).toFixed(4)}),e.push({time:l[a].time,value:+(d-r*i).toFixed(4)})}return{upper:n,mid:l,lower:e}}const Z=new Map,ut=new Map,rt=5*60*1e3;function At(t){const s=new Date(t*1e3);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}-${String(s.getDate()).padStart(2,"0")}`}async function mt(t,s,r){var m,f;const l=`${t}:${s}:${r}`,n=Z.get(l);if(n&&Date.now()-n.ts<rt)return n.data;const e=`/v8/finance/chart/${encodeURIComponent(t)}?range=${s}&interval=${r}&includePrePost=false`,a=await fetch(V(e),{headers:{Accept:"application/json"}});if(!a.ok)throw new Error(`HTTP ${a.status}`);const o=await a.json(),c=(f=(m=o==null?void 0:o.chart)==null?void 0:m.result)==null?void 0:f[0];if(!c)throw new Error("Symbol not found");const d=c.timestamp??[],i=c.indicators.quote[0],u=[],p=[];for(let v=0;v<d.length;v++){if(i.open[v]==null||i.close[v]==null)continue;const g=At(d[v]);u.push({time:g,open:+i.open[v].toFixed(4),high:+i.high[v].toFixed(4),low:+i.low[v].toFixed(4),close:+i.close[v].toFixed(4)}),p.push({time:g,value:i.volume[v]??0,color:i.close[v]>=i.open[v]?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"})}const h={candles:u,volumes:p,meta:c.meta};return Z.set(l,{ts:Date.now(),data:h}),h}async function zt(t){var d,i,u,p,h,m;const s=`${t}:indicator-history`,r=Z.get(s);if(r&&Date.now()-r.ts<rt)return r.data;const l=`/v8/finance/chart/${encodeURIComponent(t)}?range=10y&interval=1d&includePrePost=false`,n=await fetch(V(l),{headers:{Accept:"application/json"}});if(!n.ok)throw new Error(`HTTP ${n.status}`);const e=(u=(i=(d=await n.json())==null?void 0:d.chart)==null?void 0:i.result)==null?void 0:u[0];if(!e)throw new Error("Indicator history unavailable");const a=e.timestamp??[],o=((m=(h=(p=e.indicators)==null?void 0:p.quote)==null?void 0:h[0])==null?void 0:m.close)??[],c=a.map((f,v)=>o[v]==null?null:{time:At(f),close:+o[v].toFixed(4)}).filter(Boolean);return Z.set(s,{ts:Date.now(),data:c}),c}async function Jt(t){var a,o;const s=ut.get(t);if(s&&Date.now()-s.ts<rt)return s.data;const r=["annualTotalRevenue","annualGrossProfit","annualOperatingIncome","annualNetIncome","annualDilutedEPS"],l=Math.floor(Date.now()/1e3),n=l-370*24*60*60,e=`/ws/fundamentals-timeseries/v1/finance/timeseries/${encodeURIComponent(t)}?type=${r.join(",")}&period1=${n}&period2=${l}`;try{const c=await fetch(V(e),{headers:{Accept:"application/json"}});if(!c.ok)return null;const d=((o=(a=await c.json())==null?void 0:a.timeseries)==null?void 0:o.result)??[],i=f=>{var v,g,S,$;return(($=(S=(g=(v=d.find(w=>{var P,T,x,C;return((x=(T=(P=w.meta)==null?void 0:P.symbol)==null?void 0:T.includes)==null?void 0:x.call(T,t))&&((C=w[f])==null?void 0:C.length)}))==null?void 0:v[f])==null?void 0:g.at(-1))==null?void 0:S.reportedValue)==null?void 0:$.raw)??null},u=i("annualTotalRevenue"),p=i("annualGrossProfit"),h=i("annualOperatingIncome"),m={financialData:{totalRevenue:{raw:u},grossMargins:{raw:u&&p?p/u:null},operatingMargins:{raw:u&&h?h/u:null}},defaultKeyStatistics:{trailingEps:{raw:i("annualDilutedEPS")}}};return ut.set(t,{ts:Date.now(),data:m}),m}catch{return null}}const B=(t,s={})=>t==null?"—":t.toLocaleString("en-US",s),K=t=>t==null?"—":`${t>=0?"+":""}${(t*100).toFixed(2)}%`,nt=t=>t==null?"—":t>=1e12?`$${(t/1e12).toFixed(2)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString()}`;function Qt(t,s){var i,u,p,h,m,f,v,g,S,$,w,P,T,x,C;if(!s){t.innerHTML='<div class="sa-no-data">Fundamental data unavailable.</div>';return}const r=s.price??{},l=s.summaryDetail??{},n=s.defaultKeyStatistics??{},e=s.financialData??{},a=s.assetProfile??{},c=[["Market Cap",nt((i=r.marketCap)==null?void 0:i.raw)],["P/E (TTM)",B((u=l.trailingPE)==null?void 0:u.raw,{maximumFractionDigits:1})],["Fwd P/E",B((p=l.forwardPE)==null?void 0:p.raw,{maximumFractionDigits:1})],["EPS (TTM)",((h=n.trailingEps)==null?void 0:h.raw)!=null?`$${n.trailingEps.raw.toFixed(2)}`:"—"],["52W High",B((m=l.fiftyTwoWeekHigh)==null?void 0:m.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["52W Low",B((f=l.fiftyTwoWeekLow)==null?void 0:f.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["Div Yield",K((v=l.dividendYield)==null?void 0:v.raw)],["Beta",B((g=l.beta)==null?void 0:g.raw,{maximumFractionDigits:2})],["Revenue TTM",nt((S=e.totalRevenue)==null?void 0:S.raw)],["Gross Margin",K(($=e.grossMargins)==null?void 0:$.raw)],["Op Margin",K((w=e.operatingMargins)==null?void 0:w.raw)],["ROE",K((P=e.returnOnEquity)==null?void 0:P.raw)],["P/B Ratio",B((T=n.priceToBook)==null?void 0:T.raw,{maximumFractionDigits:2})],["Avg Volume",B((x=l.averageVolume)==null?void 0:x.raw)],["Employees",B(a.fullTimeEmployees)],["Free Cash Flow",nt((C=e.freeCashflow)==null?void 0:C.raw)]].map(([U,R])=>`
    <div class="sa-fund-card">
      <div class="sa-fund-label">${U}</div>
      <div class="sa-fund-val">${R}</div>
    </div>`).join(""),d=[a.sector,a.industry].filter(Boolean).map(U=>`<span class="sa-badge">${U}</span>`).join("");t.innerHTML=`
    <div class="sa-section-label">Key Metrics</div>
    <div class="sa-fund-grid">${c}</div>
    ${a.longBusinessSummary?`
      <div class="sa-about">
        <div class="sa-section-label">About ${d}</div>
        <p class="sa-about-text">${a.longBusinessSummary}</p>
      </div>`:""}
  `}function Zt(t,s,r){var i,u,p;const l=(r==null?void 0:r.price)??{},n=l.longName||l.shortName||(s==null?void 0:s.symbol)||"",e=((i=l.regularMarketPrice)==null?void 0:i.raw)??(s==null?void 0:s.regularMarketPrice)??0,a=(((u=l.regularMarketChangePercent)==null?void 0:u.raw)??0)*100,o=((p=l.regularMarketChange)==null?void 0:p.raw)??0,c=l.exchangeName||(s==null?void 0:s.exchangeName)||"",d=a>=0;t.innerHTML=`
    <div class="sa-hdr-left">
      <div class="sa-hdr-name">${n} <span class="sa-hdr-sym">${(s==null?void 0:s.symbol)??""}</span></div>
      <div class="sa-hdr-exch">${c}</div>
    </div>
    <div class="sa-hdr-right">
      <div class="sa-hdr-price">${e.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div class="sa-hdr-chg ${d?"up":"dn"}">${d?"+":""}${o.toFixed(2)} (${d?"+":""}${a.toFixed(2)}%)</div>
    </div>
  `}let J=null;async function pt(){return J||(J=await Mt(()=>import("./lightweight-charts.production-C-4kb1nc.js"),[])),J}async function te(t){const s=et.map((b,y)=>`<option value="${y}">${b.label}</option>`).join(""),r=at.map((b,y)=>`<button class="sa-range-btn${y===4?" active":""}" data-ri="${y}">${b.label}</button>`).join("");t.innerHTML=`
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
          <div class="sa-ranges">${r}</div>
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
  `;let l=null,n={},e=[],a=!1,o=new Set(["vol"]),c="candle",d=[],i=[],u=[],p=4,h=null,m=null;const f=t.querySelector("#sa-ph"),v=t.querySelector("#sa-main"),g=t.querySelector("#sa-hdr"),S=t.querySelector("#sa-chart"),$=t.querySelector("#sa-overlay"),w=t.querySelector("#sa-tt"),P=t.querySelector("#sa-annot-list"),T=t.querySelector("#sa-funds"),x=t.querySelector("#sa-mkt"),C=t.querySelector("#sa-ticker"),U=t.querySelector("#sa-go"),R=t.querySelector("#sa-annot-btn");async function A(){if(l)return;const{createChart:b,CrosshairMode:y}=await pt();l=b(S,{width:S.clientWidth||900,height:480,layout:{background:{color:"#0b0d14"},textColor:"#8892a4",fontSize:11,fontFamily:"'DM Mono', monospace"},grid:{vertLines:{color:"#1a1d26"},horzLines:{color:"#1a1d26"}},crosshair:{mode:y.Normal},rightPriceScale:{borderColor:"#2a2d3e"},timeScale:{borderColor:"#2a2d3e",timeVisible:!0,secondsVisible:!1}}),m=new ResizeObserver(()=>{l&&S.clientWidth&&l.resize(S.clientWidth,480)}),m.observe(S),l.subscribeCrosshairMove(M=>{var it;if(!M.time||!M.point||!n.main){w.style.display="none";return}const k=M.seriesData.get(n.main);if(!k){w.style.display="none";return}const W="open"in k?`O <b>${k.open}</b>  H <b>${k.high}</b>  L <b>${k.low}</b>  C <b>${k.close}</b>`:`<b>${(it=k.value)==null?void 0:it.toFixed(4)}</b>`,ot=M.seriesData.get(n.vol),Et=ot?`  Vol <b>${B(ot.value)}</b>`:"";w.innerHTML=`<span class="sa-tt-date">${M.time}</span>  ${W}${Et}`,w.style.display="block"}),l.subscribeClick(M=>{if(!a||!M.point||!n.main)return;const k=n.main.coordinateToPrice(M.point.y);if(k==null)return;const{LineStyle:j}=J,W=n.main.createPriceLine({price:k,color:"#7c6af7",lineWidth:1,lineStyle:j.Dashed,axisLabelVisible:!0,title:k.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})});e.push({pl:W,price:k}),F()})}async function I(){const{LineStyle:b}=await pt();Object.values(n).forEach(y=>{try{l.removeSeries(y)}catch{}}),n={},e=[],F(),o.has("vol")&&(n.vol=l.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"vol"}),l.priceScale("vol").applyOptions({scaleMargins:{top:.82,bottom:0}}),n.vol.setData(i)),l.priceScale("right").applyOptions({scaleMargins:{top:.06,bottom:o.has("vol")?.22:.04}}),c==="candle"?(n.main=l.addCandlestickSeries({upColor:"#34d399",downColor:"#f87171",borderVisible:!1,wickUpColor:"#34d399",wickDownColor:"#f87171"}),n.main.setData(d)):(n.main=l.addLineSeries({color:"#7c6af7",lineWidth:2}),n.main.setData(d.map(y=>({time:y.time,value:y.close}))));for(const[y,M]of Object.entries(Vt))!o.has(y)||u.length<M.period||(n[y]=l.addLineSeries({color:M.color,lineWidth:1,title:M.label}),n[y].setData(Kt(u,M.period,d)));if(o.has("bb")&&d.length>=20){const{upper:y,mid:M,lower:k}=qt(d);n.bbU=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:b.Dashed}),n.bbM=l.addLineSeries({color:"rgba(124,106,247,0.4)",lineWidth:1}),n.bbL=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:b.Dashed}),n.bbU.setData(y),n.bbM.setData(M),n.bbL.setData(k)}l.timeScale().fitContent()}function F(){if(!e.length){P.innerHTML="";return}P.innerHTML=`
      <div class="sa-annot-wrap">
        <span class="sa-section-label">Price Levels</span>
        <div class="sa-annot-pills">
          ${e.map((b,y)=>`
            <span class="sa-annot-pill">
              ${b.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              <button class="sa-annot-x" data-i="${y}">×</button>
            </span>`).join("")}
        </div>
      </div>`,P.querySelectorAll(".sa-annot-x").forEach(b=>{b.addEventListener("click",()=>{const y=+b.dataset.i;try{n.main.removePriceLine(e[y].pl)}catch{}e.splice(y,1),F()})})}async function Y(b){h=b;const{range:y,interval:M}=at[p];$.style.display="flex",f.style.display="none",v.style.display="block",g.innerHTML=`<div class="sa-hdr-loading">Loading ${b}…</div>`,T.innerHTML="";try{await A();const[k,j,W]=await Promise.all([mt(b,y,M),zt(b),Jt(b)]);d=k.candles,i=k.volumes,u=j,Zt(g,k.meta,W),await I(),Qt(T,W)}catch{g.innerHTML=`<div class="sa-error">Symbol <b>${b}</b> not found or no data available.</div>`,T.innerHTML=""}finally{$.style.display="none"}}async function N(b){if(!h)return;p=b,t.querySelectorAll(".sa-range-btn").forEach((k,j)=>k.classList.toggle("active",j===b));const{range:y,interval:M}=at[b];$.style.display="flex";try{const k=await mt(h,y,M);d=k.candles,i=k.volumes,await I()}finally{$.style.display="none"}}t.querySelectorAll(".sa-range-btn").forEach((b,y)=>b.addEventListener("click",()=>N(y))),x.addEventListener("change",()=>{C.placeholder=`Ticker (e.g. ${et[+x.value].example})`});async function D(){const b=C.value.trim().toUpperCase(),y=et[+x.value];if(!b)return;const M=y.suffix&&!b.endsWith(y.suffix)?`${b}${y.suffix}`:b;await Y(M)}return U.addEventListener("click",D),C.addEventListener("keydown",b=>{b.key==="Enter"&&D()}),t.querySelectorAll("[data-type]").forEach(b=>b.addEventListener("click",async()=>{c=b.dataset.type,t.querySelectorAll("[data-type]").forEach(y=>y.classList.remove("active")),b.classList.add("active"),d.length&&await I()})),t.querySelectorAll("[data-ind]").forEach(b=>b.addEventListener("click",async()=>{const y=b.dataset.ind;o.has(y)?o.delete(y):o.add(y),b.classList.toggle("active",o.has(y)),d.length&&await I()})),R.addEventListener("click",()=>{a=!a,R.classList.toggle("active",a),t.querySelector("#sa-chart-wrap").classList.toggle("sa-annotating",a)}),()=>{m==null||m.disconnect(),l&&(l.remove(),l=null),n={},e=[]}}const Tt="portv1",ht={symbol:"^GSPC"},ee=[{label:"US",suffix:""},{label:"ASX",suffix:".AX"},{label:"LSE",suffix:".L"},{label:"TSX",suffix:".TO"},{label:"XETRA",suffix:".DE"},{label:"TSE",suffix:".T"},{label:"HKEX",suffix:".HK"}];let L=[],q=63,O=null;function st(){try{localStorage.setItem(Tt,JSON.stringify(L))}catch{}}function ae(){try{return JSON.parse(localStorage.getItem(Tt)??"[]")}catch{return[]}}const bt=new Map,ne=10*60*1e3;async function se(t,s){var l,n,e,a,o;const r=bt.get(t);if(r&&Date.now()-r.ts<ne)return r.data;try{const c=`/v8/finance/chart/${encodeURIComponent(t)}?range=1y&interval=1d`,d=await fetch(V(c),{headers:{Accept:"application/json"},signal:s});if(!d.ok)return null;const i=await d.json(),u=(n=(l=i==null?void 0:i.chart)==null?void 0:l.result)==null?void 0:n[0];if(!u)return null;const p=u.timestamp??[],h=((o=(a=(e=u.indicators)==null?void 0:e.quote)==null?void 0:a[0])==null?void 0:o.close)??[],m=u.meta,f=[];for(let g=1;g<p.length;g++)h[g]!=null&&h[g-1]!=null&&h[g-1]!==0&&f.push({date:p[g],ret:(h[g]-h[g-1])/h[g-1]});const v={symbol:t,name:m.longName||m.shortName||t,price:m.regularMarketPrice,retData:f};return bt.set(t,{ts:Date.now(),data:v}),v}catch{return null}}async function le(t){var s,r,l,n;try{const e=`/v8/finance/chart/${encodeURIComponent(t)}?range=1d&interval=1d`,a=await fetch(V(e),{headers:{Accept:"application/json"}});if(!a.ok)return null;const o=(n=(l=(r=(s=await a.json())==null?void 0:s.chart)==null?void 0:r.result)==null?void 0:l[0])==null?void 0:n.meta;return o?{name:o.longName||o.shortName||t,price:o.regularMarketPrice}:null}catch{return null}}function re(t){const s=new Date((t+43200)*1e3);return`${s.getUTCFullYear()}-${String(s.getUTCMonth()+1).padStart(2,"0")}-${String(s.getUTCDate()).padStart(2,"0")}`}function oe(t){const s=t.map(e=>e.map(a=>({key:re(a.date),ret:a.ret}))),r=new Set;s.forEach(e=>e.forEach(a=>r.add(a.key)));const l=[...r].sort(),n=s.map(e=>{const a=new Map(e.map(o=>[o.key,o.ret]));return l.map(o=>a.get(o)??0)});return{dates:l,aligned:n}}function ie(t,s){var c;const r=t.length,l=((c=t[0])==null?void 0:c.length)??0;if(l<10||r<1)return null;const n=Math.exp(-Math.LN2/s),e=Array.from({length:r},()=>new Array(r).fill(0));let a=0,o=1;for(let d=l-1;d>=0;d--){for(let i=0;i<r;i++)for(let u=0;u<r;u++)e[i][u]+=o*t[i][d]*t[u][d];a+=o,o*=n}for(let d=0;d<r;d++)for(let i=0;i<r;i++)e[d][i]=e[d][i]/a*252;return e}function ce(t){const s=t.length;return Array.from({length:s},(r,l)=>Array.from({length:s},(n,e)=>{const a=Math.sqrt(t[l][l]*t[e][e]);return a>0?t[l][e]/a:l===e?1:0}))}function de(t,s){t.length;const r=t.map((i,u)=>t.reduce((p,h,m)=>p+s[u][m]*h,0)),l=t.reduce((i,u,p)=>i+u*r[p],0),n=Math.sqrt(Math.max(0,l)),e=t.map((i,u)=>n>0?i*r[u]/n:0),a=e.map(i=>n>0?i/n:0),o=s.map((i,u)=>Math.sqrt(Math.max(0,s[u][u]))),c=t.reduce((i,u,p)=>i+u*o[p],0),d=n>0?c/n:1;return{portVol:n,RC:e,pctRC:a,indivVols:o,divRatio:d}}function ue(t,s){const r=t.length;if(r<5)return null;let l=1,n=1,e=0;const a=[],o=[];for(const v of t){l*=1+v,a.push(l),l>n&&(n=l);const g=l/n-1;o.push(g),-g>e&&(e=-g)}const c=Math.pow(Math.max(l,1e-9),252/r)-1,d=t.reduce((v,g)=>v+g,0)/r,i=Math.sqrt(t.reduce((v,g)=>v+(g-d)**2,0)/(r-1)*252),u=i>0?(c-.04)/i:null,p=e>0?c/e:null;let h=null;if((s==null?void 0:s.length)===r){const v=s.reduce(($,w)=>$+w,0)/r;let g=0,S=0;t.forEach(($,w)=>{g+=($-d)*(s[w]-v),S+=(s[w]-v)**2}),h=S>0?g/S:null}let m=1;const f=(s==null?void 0:s.map(v=>(m*=1+v,m)))??[];return{annRet:c,vol:i,sharpe:u,beta:h,maxDD:e,calmar:p,navSeries:a,ddSeries:o,bmkNav:f}}const E={pct:(t,s=2)=>t==null||isNaN(t)?"—":`${t>=0?"+":""}${(t*100).toFixed(s)}%`,num:(t,s=2)=>t==null||isNaN(t)?"—":t.toFixed(s),price:t=>t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),cls:t=>t==null||isNaN(t)?"":t>=0?"up":"dn"};function me(t){if(t==null||isNaN(t))return"transparent";const s=Math.max(-1,Math.min(1,t)),r=(Math.abs(s)*.65+.08).toFixed(2);return s>=0?`rgba(248,113,113,${r})`:`rgba(52,211,153,${r})`}function pe(t){return`<div class="port-metrics-strip">
    ${[["Ann. Return",E.pct(t.annRet),E.cls(t.annRet)],["Ann. Vol",E.pct(t.vol),""],["Sharpe",E.num(t.sharpe),E.cls(t.sharpe)],["Beta (SPX)",E.num(t.beta),""],["Max Drawdown",E.pct(-t.maxDD),"dn"],["Calmar",E.num(t.calmar),E.cls(t.calmar)]].map(([r,l,n])=>`
      <div class="port-metric-card">
        <div class="port-metric-label">${r}</div>
        <div class="port-metric-val ${n}">${l}</div>
      </div>`).join("")}
  </div>`}function he(t,s,r){const{portVol:l,pctRC:n,indivVols:e,divRatio:a}=de(s,r),o=Math.max(1e-9,...n.map(Math.abs)),c=t.map((d,i)=>`
    <div class="port-risk-row">
      <div class="port-risk-lbl">${d}</div>
      <div class="port-risk-bar-wrap">
        <div class="port-risk-bar" style="width:${(Math.abs(n[i])/o*100).toFixed(1)}%"></div>
      </div>
      <div class="port-risk-pct">${(n[i]*100).toFixed(1)}%</div>
      <div class="port-risk-vol">${(e[i]*100).toFixed(1)}% vol</div>
    </div>`).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Risk Contribution</div>
      <div class="port-risk-meta">
        Portfolio Vol <strong>${(l*100).toFixed(2)}%</strong>
        &nbsp;·&nbsp; Div. Ratio <strong>${a.toFixed(2)}×</strong>
      </div>
      <div class="port-risk-rows">${c}</div>
    </div>`}function be(t,s,r){const l=s.reduce((e,a,o)=>e+a*s.reduce((c,d,i)=>c+d*r[o][i],0),0);return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Volatility & Contribution Beta</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Ann. Vol</th><th class="num">β → Port</th>
        </tr></thead>
        <tbody>${t.map((e,a)=>{const o=Math.sqrt(Math.max(0,r[a][a])),c=s.reduce((i,u,p)=>i+u*r[a][p],0),d=l>0?c/l:null;return`<tr>
      <td class="mkt-name">${e}</td>
      <td class="num">${(s[a]*100).toFixed(1)}%</td>
      <td class="num">${(o*100).toFixed(1)}%</td>
      <td class="num">${E.num(d)}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function ve(t,s,r){const l=ce(s),n=t.map(a=>`<th class="corr-col-hdr">${a}</th>`).join(""),e=t.map((a,o)=>`<tr><th class="corr-row-hdr">${a}</th>${t.map((c,d)=>{const i=l[o][d],u=o===d;return`<td class="corr-cell${u?" corr-diag":""}"
        style="background:${u?"var(--bg-base)":me(i)}">${u?"—":i.toFixed(2)}</td>`}).join("")}</tr>`).join("");return`
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
          <thead><tr><th></th>${n}</tr></thead>
          <tbody>${e}</tbody>
        </table>
      </div>
    </div>`}function fe(t,s,r,l,n){const e=l.length,a={"1d":1,"1w":5,"1m":21,"3m":63};let o;if(n==="ytd"){const h=String(new Date().getFullYear());o=l.findIndex(m=>m.startsWith(h)),o<0&&(o=0)}else o=Math.max(0,e-(a[n]??1));const c=r.map(h=>h.slice(o).reduce((m,f)=>m*(1+f),1)-1),d=c.reduce((h,m,f)=>h+s[f]*m,0),i=Math.max(1e-9,...c.map(h=>Math.abs(h))),u=["1d","1w","1m","3m","ytd"].map(h=>`<button class="port-period-btn${h===n?" active":""}" data-period="${h}">${h.toUpperCase()}</button>`).join(""),p=t.map((h,m)=>{const f=c[m],v=s[m]*f,g=(Math.abs(f)/i*100).toFixed(1);return`<tr>
      <td class="mkt-name">${h}</td>
      <td class="num">${(s[m]*100).toFixed(1)}%</td>
      <td class="num ${E.cls(f)}">${E.pct(f)}</td>
      <td class="num ${E.cls(v)}">${E.pct(v)}</td>
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
        Portfolio return: <strong class="${E.cls(d)}">${E.pct(d)}</strong>
      </div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Return</th><th class="num">Contribution</th><th></th>
        </tr></thead>
        <tbody>${p}</tbody>
      </table>
    </div>`}async function ge(t,s,r,l){var p;const n=t.querySelector("#port-chart-wrap");if(!n)return;O&&(O(),O=null);const{createChart:e}=await Mt(async()=>{const{createChart:h}=await import("./lightweight-charts.production-C-4kb1nc.js");return{createChart:h}},[]);n.innerHTML="";const a=document.createElement("div");a.style.height="280px",n.appendChild(a);const o=e(a,{layout:{background:{color:"transparent"},textColor:"#6b7280"},grid:{vertLines:{color:"#22253a"},horzLines:{color:"#22253a"}},rightPriceScale:{borderColor:"#22253a"},timeScale:{borderColor:"#22253a"}}),c=o.addLineSeries({color:"#7c6af7",lineWidth:2,title:"Portfolio"}),d=o.addLineSeries({color:"#4b5563",lineWidth:1,lineStyle:2,title:"S&P 500"});function i(h){if(h==="cumret")c.setData(s.map((m,f)=>({time:m,value:+((r[f]-1)*100).toFixed(3)}))),d.setData(s.map((m,f)=>({time:m,value:+((l[f]-1)*100).toFixed(3)})));else{let m=1;c.setData(s.map((f,v)=>(r[v]>m&&(m=r[v]),{time:f,value:+((r[v]/m-1)*100).toFixed(3)}))),d.setData([])}o.timeScale().fitContent()}i("cumret"),(p=t.querySelector("#port-chart-toggle"))==null||p.querySelectorAll("[data-mode]").forEach(h=>{h.addEventListener("click",()=>{t.querySelectorAll("#port-chart-toggle [data-mode]").forEach(m=>m.classList.toggle("active",m===h)),i(h.dataset.mode)})});const u=new ResizeObserver(()=>o.resize(a.offsetWidth,280));u.observe(a),O=()=>{u.disconnect(),o.remove()}}function ye(t,s,r,l,n,e){t.innerHTML=`
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
  `,t.querySelector("#port-metrics-strip").innerHTML=pe(e);function a(d){const i=ie(s,d);i&&(t.querySelector("#port-risk-panel").innerHTML=he(l,n,i),t.querySelector("#port-vol-panel").innerHTML=be(l,n,i),t.querySelector("#port-corr-panel").innerHTML=ve(l,i,d),o())}function o(){const d=t.querySelector("#port-hl-slider"),i=t.querySelector("#port-hl-val");d&&d.addEventListener("input",()=>{q=+d.value,i&&(i.textContent=`${q}d`),a(q)})}function c(d="1d"){var i;t.querySelector("#port-attr-panel").innerHTML=fe(l,n,s,r,d),(i=t.querySelector("#port-attr-periods"))==null||i.querySelectorAll(".port-period-btn").forEach(u=>{u.addEventListener("click",()=>c(u.dataset.period))})}a(q),c("1d"),ge(t,r,e.navSeries,e.bmkNav)}function Se(t){L=ae(),Array.isArray(L)||(L=[]),t.innerHTML=`
    <div class="port-layout">
      <div class="mkt-panel port-holdings-panel">
        <div class="mkt-panel-label">Portfolio Holdings</div>

        <div class="port-add-form">
          <select id="port-market" class="sa-market-sel">
            ${ee.map(p=>`<option value="${p.suffix}">${p.label}</option>`).join("")}
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
  `;let s=L.reduce((p,h)=>Math.max(p,h.id??0),0)+1,r=null;const l=t.querySelector("#port-analytics"),n=t.querySelector("#port-add-btn"),e=t.querySelector("#port-analyze-btn"),a=t.querySelector("#port-add-err"),o=t.querySelector("#port-ticker"),c=t.querySelector("#port-market"),d=t.querySelector("#port-weight-inp"),i=t.querySelector("#port-holdings-body");function u(){const p=L.reduce((m,f)=>m+f.weight,0);i.innerHTML=L.length===0?'<tr><td colspan="5" class="port-empty">No holdings yet — add a ticker above.</td></tr>':L.map(m=>`
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
          <td class="num">${E.price(m.price)}</td>
          <td><button class="port-remove" data-id="${m.id}" title="Remove">×</button></td>
        </tr>`).join("");const h=t.querySelector("#port-total");h&&(h.textContent=`Total: ${p.toFixed(1)}%`,h.className=`port-total ${p>100.01?"dn":Math.abs(p-100)<.01?"up":""}`),i.querySelectorAll(".port-wt-inp").forEach(m=>{m.addEventListener("change",f=>{const v=L.find(g=>g.id===+f.target.dataset.id);v&&(v.weight=parseFloat(f.target.value)||0,st(),u())})}),i.querySelectorAll(".port-remove").forEach(m=>{m.addEventListener("click",f=>{L=L.filter(v=>v.id!==+f.target.dataset.id),st(),u()})})}return n.addEventListener("click",async()=>{const p=c.value,h=o.value.trim().toUpperCase();if(!h){a.textContent="Enter a ticker";return}const m=h+p;if(L.some(g=>g.symbol===m)){a.textContent="Already added";return}const f=parseFloat(d.value)||0;n.disabled=!0,a.textContent="Looking up…";const v=await le(m);if(n.disabled=!1,!v){a.textContent=`"${m}" not found`;return}L.push({id:s++,symbol:m,displaySymbol:h,name:v.name,price:v.price,weight:f}),st(),o.value="",d.value="",a.textContent="",u()}),o.addEventListener("keydown",p=>{p.key==="Enter"&&n.click()}),e.addEventListener("click",async()=>{if(L.length<2){l.innerHTML='<div class="port-msg port-err">Add at least 2 holdings to analyze.</div>';return}r==null||r.abort(),r=new AbortController,l.innerHTML=`<div class="port-msg port-loading"><div class="sa-spinner"></div><span>Fetching 1Y data for ${L.length} holdings…</span></div>`,e.disabled=!0;const p=[...new Set([ht.symbol,...L.map(A=>A.symbol)])],h=await Promise.all(p.map(A=>se(A,r.signal)));e.disabled=!1;const m=new Map(p.map((A,I)=>[A,h[I]])),f=L.filter(A=>!m.get(A.symbol));if(f.length){l.innerHTML=`<div class="port-msg port-err">Could not load data for: ${f.map(A=>A.displaySymbol).join(", ")}</div>`;return}const v=m.get(ht.symbol),g=L.map(A=>m.get(A.symbol).retData),S=v?[...g,v.retData]:g,{dates:$,aligned:w}=oe(S),P=w.slice(0,L.length),T=v?w[w.length-1]:null,x=L.map(A=>A.weight/100),C=$.map((A,I)=>x.reduce((F,Y,N)=>F+Y*(P[N][I]??0),0)),U=ue(C,T);if(!U){l.innerHTML='<div class="port-msg port-err">Insufficient data for analysis (need ≥5 aligned trading days).</div>';return}const R=L.map(A=>A.displaySymbol);ye(l,P,$,R,x,U)}),u(),()=>{r==null||r.abort(),O&&(O(),O=null)}}const ke=["market","stock","portfolio"],$e={market:"Macro monitor",stock:"Single name",portfolio:"Portfolio lab"},we={market:"01",stock:"02",portfolio:"03"};let z="market",G=null;function xe(t){t.innerHTML=`
    <div class="app-frame">
      <header class="topbar">
        <div class="brand-lockup"><div class="logo">MACRO MONITOR</div><div class="brand-sub">GLOBAL MULTI-ASSET RESEARCH</div></div>
        <div class="topbar-center"><nav class="tabs" id="main-tabs">
          ${ke.map(n=>`<button class="tab ${n===z?"active":""}" data-tab="${n}"><span class="tab-num">${we[n]}</span>${$e[n]}</button>`).join("")}
        </nav></div>
        <div class="topbar-right"><span class="market-status"><i></i> DATA LINKED</span><span class="topbar-date">${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span></div>
      </header>
      <main class="main-content" id="tab-content"></main>
      <footer class="app-footer"><span>NSM / TERMINAL</span><span>MARKET DATA: YAHOO FINANCE · DELAYED / INDICATIVE</span><span>LOCAL SESSION</span></footer>
    </div>
  `;const s=t.querySelector("#main-tabs"),r=t.querySelector("#tab-content");function l(n){n!==z&&(z=n,s.querySelectorAll(".tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===n)}),vt(r,n))}s.addEventListener("click",n=>{const e=n.target.closest(".tab");e&&l(e.dataset.tab)}),vt(r,z)}function vt(t,s){G&&(G(),G=null),t.innerHTML="",s==="market"?Wt(t).then(r=>{G=r??null}):s==="stock"?te(t).then(r=>{G=r??null}):s==="portfolio"&&(G=Se(t)??null)}xe(document.getElementById("app"));
