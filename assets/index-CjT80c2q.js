(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))l(a);new MutationObserver(a=>{for(const e of a)if(e.type==="childList")for(const s of e.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function o(a){const e={};return a.integrity&&(e.integrity=a.integrity),a.referrerPolicy&&(e.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?e.credentials="include":a.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function l(a){if(a.ep)return;a.ep=!0;const e=o(a);fetch(a.href,e)}})();const bt="https://yf-proxy.lukewynd.workers.dev";function z(t){return`${bt}${t}`}function Et(t){const n=encodeURIComponent(t);return`${bt}/v8/finance/chart/${n}?range=1y&interval=1d`}const rt=new Map,Tt=5*60*1e3;async function Ct(t){var o,l,a,e,s,r;const n=rt.get(t);if(n&&Date.now()-n.ts<Tt)return n.data;try{const c=await fetch(Et(t),{headers:{Accept:"application/json"}});if(!c.ok)return null;const d=await c.json(),i=(l=(o=d==null?void 0:d.chart)==null?void 0:o.result)==null?void 0:l[0];if(!i)return null;const u=i.meta,h=((s=(e=(a=i.indicators)==null?void 0:a.quote)==null?void 0:e[0])==null?void 0:s.close)??[],p=F=>{for(let C=F;C>=0;C--)if(h[C]!=null)return{index:C,value:h[C]};return null},m=p(h.length-1),f=m?p(m.index-1):null,v=u.regularMarketPrice??null??(m==null?void 0:m.value)??null,$=(f==null?void 0:f.value)??null,w=v!=null&&$!=null?v-$:null,x=w!=null&&$!==0?w/$*100:null,D=h.length,T=(m==null?void 0:m.index)??-1,A=v,P=F=>{let C=T-F;for(;C>=0&&h[C]==null;)C--;const y=C>=0?h[C]:null;return y!=null&&A!=null&&y!==0?(A-y)/y*100:null},I=new Date().getFullYear(),B=i.timestamp??[];let S=null;for(let F=0;F<B.length;F++)if(new Date(B[F]*1e3).getFullYear()===I&&h[F]!=null){S=h[F];break}const U=S!=null&&S!==0&&A!=null?(A-S)/S*100:null,Y={symbol:t,regularMarketPrice:v,regularMarketChangePercent:x,regularMarketChange:w,previousClose:$,dataTimestamp:((r=i.timestamp)==null?void 0:r[T])??null,source:"Yahoo Finance chart",quoteType:u.instrumentType??"",ytdPct:U,pct1d:x,pct1w:P(5),pct1m:P(21),pct3m:P(63),pctYtd:U};return rt.set(t,{ts:Date.now(),data:Y}),Y}catch{return null}}async function Dt(t){const o=new Map;for(let l=0;l<t.length;l+=8){const a=t.slice(l,l+8),e=await Promise.allSettled(a.map(s=>Ct(s)));a.forEach((s,r)=>{const c=e[r].status==="fulfilled"?e[r].value:null;c&&o.set(s,c)})}return o}const vt=[{symbol:"^GSPC",name:"S&P 500",type:"index"},{symbol:"^VIX",name:"VIX",type:"vix"},{symbol:"^TNX",name:"US 10Y",type:"yield"},{symbol:"DX-Y.NYB",name:"DXY",type:"index"},{symbol:"GC=F",name:"Gold",type:"commodity"},{symbol:"BTC-USD",name:"Bitcoin",type:"crypto"}],ft=[{symbol:"^GSPC",name:"S&P 500",region:"Americas"},{symbol:"^IXIC",name:"NASDAQ Comp.",region:"Americas"},{symbol:"^DJI",name:"Dow Jones",region:"Americas"},{symbol:"^RUT",name:"Russell 2000",region:"Americas"},{symbol:"^BVSP",name:"Bovespa",region:"Americas"},{symbol:"^MXX",name:"IPC Mexico",region:"Americas"},{symbol:"^FTSE",name:"FTSE 100",region:"Europe"},{symbol:"^GDAXI",name:"DAX",region:"Europe"},{symbol:"^FCHI",name:"CAC 40",region:"Europe"},{symbol:"^STOXX50E",name:"Euro Stoxx 50",region:"Europe"},{symbol:"^SSMI",name:"SMI",region:"Europe"},{symbol:"^AEX",name:"AEX",region:"Europe"},{symbol:"^N225",name:"Nikkei 225",region:"Asia-Pacific"},{symbol:"^HSI",name:"Hang Seng",region:"Asia-Pacific"},{symbol:"000001.SS",name:"Shanghai Comp.",region:"Asia-Pacific"},{symbol:"^AXJO",name:"ASX 200",region:"Asia-Pacific"},{symbol:"^KS11",name:"KOSPI",region:"Asia-Pacific"},{symbol:"^STI",name:"Straits Times",region:"Asia-Pacific"}],yt=[{symbol:"^IRX",name:"3-Month"},{symbol:"^FVX",name:"5-Year"},{symbol:"^TNX",name:"10-Year"},{symbol:"^TYX",name:"30-Year"}],gt=[{symbol:"BWX",name:"Global ex-US Treasuries",region:"Global"},{symbol:"IGOV",name:"International Treasuries",region:"Developed"},{symbol:"EMB",name:"Emerging Market Sovereign",region:"Emerging"},{symbol:"EWJ",name:"Japan rates proxy",region:"Japan"}],st=[{code:"USD",name:"US Dollar",symbol:null,invert:!1},{code:"EUR",name:"Euro",symbol:"EURUSD=X",invert:!1},{code:"GBP",name:"Sterling",symbol:"GBPUSD=X",invert:!1},{code:"JPY",name:"Yen",symbol:"USDJPY=X",invert:!0},{code:"AUD",name:"Aus Dollar",symbol:"AUDUSD=X",invert:!1},{code:"CAD",name:"Can Dollar",symbol:"USDCAD=X",invert:!0},{code:"CHF",name:"Swiss Franc",symbol:"USDCHF=X",invert:!0}],Pt=st.filter(t=>t.symbol).map(t=>t.symbol),St=[{symbol:"GC=F",name:"Gold",unit:"/oz",group:"Metals"},{symbol:"SI=F",name:"Silver",unit:"/oz",group:"Metals"},{symbol:"HG=F",name:"Copper",unit:"/lb",group:"Metals"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl",group:"Energy"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl",group:"Energy"},{symbol:"NG=F",name:"Nat. Gas",unit:"/MMBtu",group:"Energy"},{symbol:"ZW=F",name:"Wheat",unit:"/bu",group:"Agri"},{symbol:"ZC=F",name:"Corn",unit:"/bu",group:"Agri"}],kt=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],$t=[{symbol:"BTC-USD",name:"Bitcoin",abbr:"BTC"},{symbol:"ETH-USD",name:"Ethereum",abbr:"ETH"},{symbol:"SOL-USD",name:"Solana",abbr:"SOL"},{symbol:"XRP-USD",name:"XRP",abbr:"XRP"}],Q=[...new Set([...vt.map(t=>t.symbol),...ft.map(t=>t.symbol),...yt.map(t=>t.symbol),...gt.map(t=>t.symbol),...Pt,...St.map(t=>t.symbol),...kt.map(t=>t.symbol),...$t.map(t=>t.symbol)])];function K(t,n=2){return t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:n,maximumFractionDigits:n})}function X(t){if(t==null)return{text:"—",cls:""};const n=t>=0?"+":"",o=t>=0?"up":"dn",l=Math.abs(t)>=3?" strong":"";return{text:`${n}${t.toFixed(2)}%`,cls:o+l}}function Ft(t){if(t==null)return{text:"—",cls:""};const n=Math.round(t*100),o=n>=0?"+":"",l=n>=0?"up":"dn";return{text:`${o}${n}bps`,cls:l}}function H(t){const n=X(t);return`<td class="num pct-cell ${n.cls}">${n.text}</td>`}function W(t,n=7){return Array.from({length:t},()=>`<tr>${Array.from({length:n},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function Ht(t){return vt.map(({symbol:n,name:o,type:l})=>{const a=t.get(n),e=a==null?void 0:a.regularMarketPrice,s=X((a==null?void 0:a.pct1d)??null),r=X((a==null?void 0:a.pctYtd)??null);let c="—";return e!=null&&(l==="yield"?c=e.toFixed(2)+"%":l==="crypto"?c="$"+e.toLocaleString("en-US",{maximumFractionDigits:0}):l==="commodity"?c="$"+K(e):c=K(e)),`
      <div class="mkt-stat-card">
        <div class="mkt-stat-name">${o}</div>
        <div class="mkt-stat-price">${c}</div>
        <div class="mkt-stat-chg ${s.cls}">${s.text}</div>
        <div class="mkt-stat-ytd ${r.cls}">${r.text} YTD</div>
      </div>`}).join("")}function It(t){const n=["Americas","Europe","Asia-Pacific"];let o="";return n.forEach(l=>{const a=ft.filter(e=>e.region===l);o+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,o+=a.map(({symbol:e,name:s})=>{const r=t.get(e),c=r==null?void 0:r.regularMarketPrice,d=c!=null?c.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";return`<tr>
        <td class="mkt-name">${s}</td>
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
    </div>`}function Ut(t){const n=yt.map(({symbol:a,name:e})=>{const s=t.get(a),r=(s==null?void 0:s.regularMarketPrice)??null,c=(s==null?void 0:s.regularMarketChange)??null;return{name:e,yld:r,chg:c}}),o=Math.max(.01,...n.map(a=>a.yld??0));return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">US Treasuries · cash curve</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Tenor</th>
          <th class="num">Yield</th>
          <th></th>
          <th class="num">1D Chg</th>
        </tr></thead>
        <tbody>${n.map(({name:a,yld:e,chg:s})=>{const r=Ft(s),c=e!=null?e.toFixed(2)+"%":"—",d=e!=null?e/o*100:0;return`<tr>
      <td class="mkt-name">${a}</td>
      <td class="num mono">${c}</td>
      <td class="yc-bar-cell"><span class="yc-bar" style="width:${d.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${r.cls}">${r.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Rt(t){return`<div class="mkt-panel">
    <div class="mkt-panel-label">Global Bond Markets · price proxies</div>
    <table class="mkt-table">
      <thead><tr><th>Instrument</th><th class="num">Level</th><th class="num">1D</th><th class="num">1M</th><th class="num">YTD</th></tr></thead>
      <tbody>${gt.map(({symbol:o,name:l,region:a})=>{const e=t.get(o),s=e==null?void 0:e.regularMarketPrice,r=X(e==null?void 0:e.pct1d),c=X(e==null?void 0:e.pct1m),d=X(e==null?void 0:e.pctYtd);return`<tr>
      <td><span class="mkt-name">${l}</span><span class="mkt-unit">${a}</span></td>
      <td class="num mono">${s!=null?K(s):"—"}</td>
      <td class="num pct-cell ${r.cls}">${r.text}</td>
      <td class="num pct-cell ${c.cls}">${c.text}</td>
      <td class="num pct-cell ${d.cls}">${d.text}</td>
    </tr>`}).join("")}</tbody>
    </table>
  </div>`}function Xt(t){const n={USD:1};st.forEach(({code:s,symbol:r,invert:c})=>{var i;if(!r)return;const d=(i=t.get(r))==null?void 0:i.regularMarketPrice;d!=null&&(n[s]=c?1/d:d)});const o=s=>s==null?"—":s>=100?s.toFixed(2):s>=10?s.toFixed(3):s.toFixed(4),l=st.map(s=>s.code),a=l.map(s=>`<th class="num fx-col-hdr">${s}</th>`).join(""),e=l.map(s=>{const r=l.map(c=>{if(s===c)return'<td class="fx-diag">—</td>';const d=n[s],i=n[c],u=d!=null&&i!=null&&i!==0?d/i:null;return`<td class="num fx-cell">${o(u)}</td>`}).join("");return`<tr><th class="fx-row-hdr">${s}</th>${r}</tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Cross Rates <span class="mkt-panel-sub">1 row = X column</span></div>
      <div class="fx-matrix-wrap">
        <table class="fx-matrix">
          <thead><tr><th></th>${a}</tr></thead>
          <tbody>${e}</tbody>
        </table>
      </div>
    </div>`}function Bt(t){const n=["Metals","Energy","Agri"];let o="";return n.forEach(l=>{const a=St.filter(e=>e.group===l);o+=`<tr class="mkt-region-sep"><td colspan="7">${l}</td></tr>`,o+=a.map(({symbol:e,name:s,unit:r})=>{const c=t.get(e),d=c==null?void 0:c.regularMarketPrice,i=d!=null?"$"+K(d):"—";return`<tr>
        <td class="mkt-name">${s}<span class="mkt-unit">${r}</span></td>
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
    </div>`}function Ot(t){const n=kt.map(({symbol:a,name:e})=>{const s=t.get(a);return{name:e,pct1d:(s==null?void 0:s.pct1d)??null,pct1m:(s==null?void 0:s.pct1m)??null,pctYtd:(s==null?void 0:s.pctYtd)??null}});n.sort((a,e)=>(e.pct1d??-999)-(a.pct1d??-999));const o=Math.max(.01,...n.map(a=>Math.abs(a.pct1d??0)));return`
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
        <tbody>${n.map(({name:a,pct1d:e,pct1m:s,pctYtd:r})=>{const c=X(e),d=X(s),i=X(r),u=e!=null?Math.abs(e)/o*100:0;return`<tr>
      <td class="mkt-name sec-name">${a}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${c.cls}" style="width:${u.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${c.cls}">${c.text}</td>
      <td class="num pct-cell ${d.cls}">${d.text}</td>
      <td class="num pct-cell ${i.cls}">${i.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Nt(t){return`
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
        <tbody>${$t.map(({symbol:o,name:l,abbr:a})=>{const e=t.get(o),s=e==null?void 0:e.regularMarketPrice,r=s!=null?"$"+s.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:s>=100?2:4}):"—";return`<tr>
      <td class="mkt-name">${l} <span class="mkt-abbr">${a}</span></td>
      <td class="num mono">${r}</td>
      ${H(e==null?void 0:e.pct1d)}
      ${H(e==null?void 0:e.pct1w)}
      ${H(e==null?void 0:e.pct1m)}
      ${H(e==null?void 0:e.pctYtd)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}async function Yt(t){t.innerHTML=`
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
        <table class="mkt-table"><tbody>${W(18)}</tbody></table>
      </div>
    </section>

    <!-- Bonds + FX -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Treasuries</div>
          <table class="mkt-table"><tbody>${W(4,4)}</tbody></table>
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
        <table class="mkt-table"><tbody>${W(4,5)}</tbody></table>
      </div>
    </section>

    <!-- Commodities + Sectors -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-commodities">
        <div class="mkt-panel">
          <div class="mkt-panel-label">Commodities</div>
          <table class="mkt-table"><tbody>${W(8,6)}</tbody></table>
        </div>
      </div>
      <div id="mkt-sectors">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Equity Sectors</div>
          <table class="mkt-table"><tbody>${W(11,5)}</tbody></table>
        </div>
      </div>
    </section>

    <!-- Crypto -->
    <section class="mkt-section" id="mkt-crypto">
      <div class="mkt-panel">
        <div class="mkt-panel-label">Crypto</div>
        <table class="mkt-table"><tbody>${W(4,6)}</tbody></table>
      </div>
    </section>
  `;const n=t.querySelector("#mkt-refresh");async function o(){const a=t.querySelector("#mkt-timestamp");a.textContent="Loading…";const e=await Dt(Q);if(!t.isConnected)return;t.querySelector("#mkt-stats").innerHTML=Ht(e),t.querySelector("#mkt-equities").innerHTML=It(e),t.querySelector("#mkt-bonds").innerHTML=Ut(e),t.querySelector("#mkt-fx").innerHTML=Xt(e),t.querySelector("#mkt-global-bonds").innerHTML=Rt(e),t.querySelector("#mkt-commodities").innerHTML=Bt(e),t.querySelector("#mkt-sectors").innerHTML=Ot(e),t.querySelector("#mkt-crypto").innerHTML=Nt(e);const s=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"}),r=Q.length-e.size;a.textContent=`Updated ${s} · ${e.size}/${Q.length} instruments${r?` · ${r} unavailable`:""}`}n.addEventListener("click",o),await o();const l=setInterval(o,30*60*1e3);return()=>clearInterval(l)}const Wt="modulepreload",jt=function(t){return"/investment-dash/"+t},ot={},wt=function(n,o,l){let a=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),r=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));a=Promise.allSettled(o.map(c=>{if(c=jt(c),c in ot)return;ot[c]=!0;const d=c.endsWith(".css"),i=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${i}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":Wt,d||(u.as="script"),u.crossOrigin="",u.href=c,r&&u.setAttribute("nonce",r),document.head.appendChild(u),d)return new Promise((h,p)=>{u.addEventListener("load",h),u.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${c}`)))})}))}function e(s){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=s,window.dispatchEvent(r),!r.defaultPrevented)throw s}return a.then(s=>{for(const r of s||[])r.status==="rejected"&&e(r.reason);return n().catch(e)})},Z=[{label:"US (NYSE / NASDAQ)",suffix:"",example:"AAPL"},{label:"Australia (ASX)",suffix:".AX",example:"CBA.AX"},{label:"UK (LSE)",suffix:".L",example:"HSBA.L"},{label:"Canada (TSX)",suffix:".TO",example:"RY.TO"},{label:"Germany (XETRA)",suffix:".DE",example:"SAP.DE"},{label:"Japan (TSE)",suffix:".T",example:"7203.T"},{label:"Hong Kong (HKEX)",suffix:".HK",example:"0700.HK"}],tt=[{label:"1W",range:"5d",interval:"1d"},{label:"1M",range:"1mo",interval:"1d"},{label:"3M",range:"3mo",interval:"1d"},{label:"6M",range:"6mo",interval:"1d"},{label:"1Y",range:"1y",interval:"1d"},{label:"2Y",range:"2y",interval:"1wk"},{label:"5Y",range:"5y",interval:"1wk"},{label:"MAX",range:"max",interval:"1mo"}],_t={ma20:{period:20,color:"#fbbf24",label:"MA 20"},ma50:{period:50,color:"#60a5fa",label:"MA 50"},ma200:{period:200,color:"#f87171",label:"MA 200"}};function xt(t,n){const o=[];for(let l=n-1;l<t.length;l++){const a=t.slice(l-n+1,l+1).reduce((e,s)=>e+s.close,0);o.push({time:t[l].time,value:+(a/n).toFixed(4)})}return o}function qt(t,n=20,o=2){const l=xt(t,n),a=[],e=[];for(let s=0;s<l.length;s++){const r=s+n-1,c=t.slice(r-n+1,r+1).map(u=>u.close),d=l[s].value,i=Math.sqrt(c.reduce((u,h)=>u+(h-d)**2,0)/n);a.push({time:l[s].time,value:+(d+o*i).toFixed(4)}),e.push({time:l[s].time,value:+(d-o*i).toFixed(4)})}return{upper:a,mid:l,lower:e}}const it=new Map,ct=new Map,Mt=5*60*1e3;function Gt(t){const n=new Date(t*1e3);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`}async function dt(t,n,o){var m,f;const l=`${t}:${n}:${o}`,a=it.get(l);if(a&&Date.now()-a.ts<Mt)return a.data;const e=`/v8/finance/chart/${encodeURIComponent(t)}?range=${n}&interval=${o}&includePrePost=false`,s=await fetch(z(e),{headers:{Accept:"application/json"}});if(!s.ok)throw new Error(`HTTP ${s.status}`);const r=await s.json(),c=(f=(m=r==null?void 0:r.chart)==null?void 0:m.result)==null?void 0:f[0];if(!c)throw new Error("Symbol not found");const d=c.timestamp??[],i=c.indicators.quote[0],u=[],h=[];for(let b=0;b<d.length;b++){if(i.open[b]==null||i.close[b]==null)continue;const v=Gt(d[b]);u.push({time:v,open:+i.open[b].toFixed(4),high:+i.high[b].toFixed(4),low:+i.low[b].toFixed(4),close:+i.close[b].toFixed(4)}),h.push({time:v,value:i.volume[b]??0,color:i.close[b]>=i.open[b]?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"})}const p={candles:u,volumes:h,meta:c.meta};return it.set(l,{ts:Date.now(),data:p}),p}async function Vt(t){var s,r;const n=ct.get(t);if(n&&Date.now()-n.ts<Mt)return n.data;const o=["annualTotalRevenue","annualGrossProfit","annualOperatingIncome","annualNetIncome","annualDilutedEPS"],l=Math.floor(Date.now()/1e3),a=l-370*24*60*60,e=`/ws/fundamentals-timeseries/v1/finance/timeseries/${encodeURIComponent(t)}?type=${o.join(",")}&period1=${a}&period2=${l}`;try{const c=await fetch(z(e),{headers:{Accept:"application/json"}});if(!c.ok)return null;const d=((r=(s=await c.json())==null?void 0:s.timeseries)==null?void 0:r.result)??[],i=f=>{var b,v,$,w;return((w=($=(v=(b=d.find(x=>{var D,T,A,P;return((A=(T=(D=x.meta)==null?void 0:D.symbol)==null?void 0:T.includes)==null?void 0:A.call(T,t))&&((P=x[f])==null?void 0:P.length)}))==null?void 0:b[f])==null?void 0:v.at(-1))==null?void 0:$.reportedValue)==null?void 0:w.raw)??null},u=i("annualTotalRevenue"),h=i("annualGrossProfit"),p=i("annualOperatingIncome"),m={financialData:{totalRevenue:{raw:u},grossMargins:{raw:u&&h?h/u:null},operatingMargins:{raw:u&&p?p/u:null}},defaultKeyStatistics:{trailingEps:{raw:i("annualDilutedEPS")}}};return ct.set(t,{ts:Date.now(),data:m}),m}catch{return null}}const R=(t,n={})=>t==null?"—":t.toLocaleString("en-US",n),_=t=>t==null?"—":`${t>=0?"+":""}${(t*100).toFixed(2)}%`,et=t=>t==null?"—":t>=1e12?`$${(t/1e12).toFixed(2)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString()}`;function Kt(t,n){var i,u,h,p,m,f,b,v,$,w,x,D,T,A,P;if(!n){t.innerHTML='<div class="sa-no-data">Fundamental data unavailable.</div>';return}const o=n.price??{},l=n.summaryDetail??{},a=n.defaultKeyStatistics??{},e=n.financialData??{},s=n.assetProfile??{},c=[["Market Cap",et((i=o.marketCap)==null?void 0:i.raw)],["P/E (TTM)",R((u=l.trailingPE)==null?void 0:u.raw,{maximumFractionDigits:1})],["Fwd P/E",R((h=l.forwardPE)==null?void 0:h.raw,{maximumFractionDigits:1})],["EPS (TTM)",((p=a.trailingEps)==null?void 0:p.raw)!=null?`$${a.trailingEps.raw.toFixed(2)}`:"—"],["52W High",R((m=l.fiftyTwoWeekHigh)==null?void 0:m.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["52W Low",R((f=l.fiftyTwoWeekLow)==null?void 0:f.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["Div Yield",_((b=l.dividendYield)==null?void 0:b.raw)],["Beta",R((v=l.beta)==null?void 0:v.raw,{maximumFractionDigits:2})],["Revenue TTM",et(($=e.totalRevenue)==null?void 0:$.raw)],["Gross Margin",_((w=e.grossMargins)==null?void 0:w.raw)],["Op Margin",_((x=e.operatingMargins)==null?void 0:x.raw)],["ROE",_((D=e.returnOnEquity)==null?void 0:D.raw)],["P/B Ratio",R((T=a.priceToBook)==null?void 0:T.raw,{maximumFractionDigits:2})],["Avg Volume",R((A=l.averageVolume)==null?void 0:A.raw)],["Employees",R(s.fullTimeEmployees)],["Free Cash Flow",et((P=e.freeCashflow)==null?void 0:P.raw)]].map(([I,B])=>`
    <div class="sa-fund-card">
      <div class="sa-fund-label">${I}</div>
      <div class="sa-fund-val">${B}</div>
    </div>`).join(""),d=[s.sector,s.industry].filter(Boolean).map(I=>`<span class="sa-badge">${I}</span>`).join("");t.innerHTML=`
    <div class="sa-section-label">Key Metrics</div>
    <div class="sa-fund-grid">${c}</div>
    ${s.longBusinessSummary?`
      <div class="sa-about">
        <div class="sa-section-label">About ${d}</div>
        <p class="sa-about-text">${s.longBusinessSummary}</p>
      </div>`:""}
  `}function zt(t,n,o){var i,u,h;const l=(o==null?void 0:o.price)??{},a=l.longName||l.shortName||(n==null?void 0:n.symbol)||"",e=((i=l.regularMarketPrice)==null?void 0:i.raw)??(n==null?void 0:n.regularMarketPrice)??0,s=(((u=l.regularMarketChangePercent)==null?void 0:u.raw)??0)*100,r=((h=l.regularMarketChange)==null?void 0:h.raw)??0,c=l.exchangeName||(n==null?void 0:n.exchangeName)||"",d=s>=0;t.innerHTML=`
    <div class="sa-hdr-left">
      <div class="sa-hdr-name">${a} <span class="sa-hdr-sym">${(n==null?void 0:n.symbol)??""}</span></div>
      <div class="sa-hdr-exch">${c}</div>
    </div>
    <div class="sa-hdr-right">
      <div class="sa-hdr-price">${e.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div class="sa-hdr-chg ${d?"up":"dn"}">${d?"+":""}${r.toFixed(2)} (${d?"+":""}${s.toFixed(2)}%)</div>
    </div>
  `}let V=null;async function ut(){return V||(V=await wt(()=>import("./lightweight-charts.production-C-4kb1nc.js"),[])),V}async function Jt(t){const n=Z.map((y,g)=>`<option value="${g}">${y.label}</option>`).join(""),o=tt.map((y,g)=>`<button class="sa-range-btn${g===4?" active":""}" data-ri="${g}">${y.label}</button>`).join("");t.innerHTML=`
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
          <div class="sa-ranges">${o}</div>
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
  `;let l=null,a={},e=[],s=!1,r=new Set(["vol"]),c="candle",d=[],i=[],u=4,h=null,p=null;const m=t.querySelector("#sa-ph"),f=t.querySelector("#sa-main"),b=t.querySelector("#sa-hdr"),v=t.querySelector("#sa-chart"),$=t.querySelector("#sa-overlay"),w=t.querySelector("#sa-tt"),x=t.querySelector("#sa-annot-list"),D=t.querySelector("#sa-funds"),T=t.querySelector("#sa-mkt"),A=t.querySelector("#sa-ticker"),P=t.querySelector("#sa-go"),I=t.querySelector("#sa-annot-btn");async function B(){if(l)return;const{createChart:y,CrosshairMode:g}=await ut();l=y(v,{width:v.clientWidth||900,height:480,layout:{background:{color:"#0b0d14"},textColor:"#8892a4",fontSize:11,fontFamily:"'DM Mono', monospace"},grid:{vertLines:{color:"#1a1d26"},horzLines:{color:"#1a1d26"}},crosshair:{mode:g.Normal},rightPriceScale:{borderColor:"#2a2d3e"},timeScale:{borderColor:"#2a2d3e",timeVisible:!0,secondsVisible:!1}}),p=new ResizeObserver(()=>{l&&v.clientWidth&&l.resize(v.clientWidth,480)}),p.observe(v),l.subscribeCrosshairMove(M=>{var lt;if(!M.time||!M.point||!a.main){w.style.display="none";return}const k=M.seriesData.get(a.main);if(!k){w.style.display="none";return}const J="open"in k?`O <b>${k.open}</b>  H <b>${k.high}</b>  L <b>${k.low}</b>  C <b>${k.close}</b>`:`<b>${(lt=k.value)==null?void 0:lt.toFixed(4)}</b>`,nt=M.seriesData.get(a.vol),At=nt?`  Vol <b>${R(nt.value)}</b>`:"";w.innerHTML=`<span class="sa-tt-date">${M.time}</span>  ${J}${At}`,w.style.display="block"}),l.subscribeClick(M=>{if(!s||!M.point||!a.main)return;const k=a.main.coordinateToPrice(M.point.y);if(k==null)return;const{LineStyle:O}=V,J=a.main.createPriceLine({price:k,color:"#7c6af7",lineWidth:1,lineStyle:O.Dashed,axisLabelVisible:!0,title:k.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})});e.push({pl:J,price:k}),U()})}async function S(){const{LineStyle:y}=await ut();Object.values(a).forEach(g=>{try{l.removeSeries(g)}catch{}}),a={},e=[],U(),r.has("vol")&&(a.vol=l.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"vol"}),l.priceScale("vol").applyOptions({scaleMargins:{top:.82,bottom:0}}),a.vol.setData(i)),l.priceScale("right").applyOptions({scaleMargins:{top:.06,bottom:r.has("vol")?.22:.04}}),c==="candle"?(a.main=l.addCandlestickSeries({upColor:"#34d399",downColor:"#f87171",borderVisible:!1,wickUpColor:"#34d399",wickDownColor:"#f87171"}),a.main.setData(d)):(a.main=l.addLineSeries({color:"#7c6af7",lineWidth:2}),a.main.setData(d.map(g=>({time:g.time,value:g.close}))));for(const[g,M]of Object.entries(_t))!r.has(g)||d.length<M.period||(a[g]=l.addLineSeries({color:M.color,lineWidth:1,title:M.label}),a[g].setData(xt(d,M.period)));if(r.has("bb")&&d.length>=20){const{upper:g,mid:M,lower:k}=qt(d);a.bbU=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:y.Dashed}),a.bbM=l.addLineSeries({color:"rgba(124,106,247,0.4)",lineWidth:1}),a.bbL=l.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:y.Dashed}),a.bbU.setData(g),a.bbM.setData(M),a.bbL.setData(k)}l.timeScale().fitContent()}function U(){if(!e.length){x.innerHTML="";return}x.innerHTML=`
      <div class="sa-annot-wrap">
        <span class="sa-section-label">Price Levels</span>
        <div class="sa-annot-pills">
          ${e.map((y,g)=>`
            <span class="sa-annot-pill">
              ${y.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              <button class="sa-annot-x" data-i="${g}">×</button>
            </span>`).join("")}
        </div>
      </div>`,x.querySelectorAll(".sa-annot-x").forEach(y=>{y.addEventListener("click",()=>{const g=+y.dataset.i;try{a.main.removePriceLine(e[g].pl)}catch{}e.splice(g,1),U()})})}async function Y(y){h=y;const{range:g,interval:M}=tt[u];$.style.display="flex",m.style.display="none",f.style.display="block",b.innerHTML=`<div class="sa-hdr-loading">Loading ${y}…</div>`,D.innerHTML="";try{await B();const[k,O]=await Promise.all([dt(y,g,M),Vt(y)]);d=k.candles,i=k.volumes,zt(b,k.meta,O),await S(),Kt(D,O)}catch{b.innerHTML=`<div class="sa-error">Symbol <b>${y}</b> not found or no data available.</div>`,D.innerHTML=""}finally{$.style.display="none"}}async function F(y){if(!h)return;u=y,t.querySelectorAll(".sa-range-btn").forEach((k,O)=>k.classList.toggle("active",O===y));const{range:g,interval:M}=tt[y];$.style.display="flex";try{const k=await dt(h,g,M);d=k.candles,i=k.volumes,await S()}finally{$.style.display="none"}}t.querySelectorAll(".sa-range-btn").forEach((y,g)=>y.addEventListener("click",()=>F(g))),T.addEventListener("change",()=>{A.placeholder=`Ticker (e.g. ${Z[+T.value].example})`});async function C(){const y=A.value.trim().toUpperCase(),g=Z[+T.value];if(!y)return;const M=g.suffix&&!y.endsWith(g.suffix)?`${y}${g.suffix}`:y;await Y(M)}return P.addEventListener("click",C),A.addEventListener("keydown",y=>{y.key==="Enter"&&C()}),t.querySelectorAll("[data-type]").forEach(y=>y.addEventListener("click",async()=>{c=y.dataset.type,t.querySelectorAll("[data-type]").forEach(g=>g.classList.remove("active")),y.classList.add("active"),d.length&&await S()})),t.querySelectorAll("[data-ind]").forEach(y=>y.addEventListener("click",async()=>{const g=y.dataset.ind;r.has(g)?r.delete(g):r.add(g),y.classList.toggle("active",r.has(g)),d.length&&await S()})),I.addEventListener("click",()=>{s=!s,I.classList.toggle("active",s),t.querySelector("#sa-chart-wrap").classList.toggle("sa-annotating",s)}),()=>{p==null||p.disconnect(),l&&(l.remove(),l=null),a={},e=[]}}const Lt="portv1",mt={symbol:"^GSPC"},Qt=[{label:"US",suffix:""},{label:"ASX",suffix:".AX"},{label:"LSE",suffix:".L"},{label:"TSX",suffix:".TO"},{label:"XETRA",suffix:".DE"},{label:"TSE",suffix:".T"},{label:"HKEX",suffix:".HK"}];let L=[],q=63,N=null;function at(){try{localStorage.setItem(Lt,JSON.stringify(L))}catch{}}function Zt(){try{return JSON.parse(localStorage.getItem(Lt)??"[]")}catch{return[]}}const pt=new Map,te=10*60*1e3;async function ee(t,n){var l,a,e,s,r;const o=pt.get(t);if(o&&Date.now()-o.ts<te)return o.data;try{const c=`/v8/finance/chart/${encodeURIComponent(t)}?range=1y&interval=1d`,d=await fetch(z(c),{headers:{Accept:"application/json"},signal:n});if(!d.ok)return null;const i=await d.json(),u=(a=(l=i==null?void 0:i.chart)==null?void 0:l.result)==null?void 0:a[0];if(!u)return null;const h=u.timestamp??[],p=((r=(s=(e=u.indicators)==null?void 0:e.quote)==null?void 0:s[0])==null?void 0:r.close)??[],m=u.meta,f=[];for(let v=1;v<h.length;v++)p[v]!=null&&p[v-1]!=null&&p[v-1]!==0&&f.push({date:h[v],ret:(p[v]-p[v-1])/p[v-1]});const b={symbol:t,name:m.longName||m.shortName||t,price:m.regularMarketPrice,retData:f};return pt.set(t,{ts:Date.now(),data:b}),b}catch{return null}}async function ae(t){var n,o,l,a;try{const e=`/v8/finance/chart/${encodeURIComponent(t)}?range=1d&interval=1d`,s=await fetch(z(e),{headers:{Accept:"application/json"}});if(!s.ok)return null;const r=(a=(l=(o=(n=await s.json())==null?void 0:n.chart)==null?void 0:o.result)==null?void 0:l[0])==null?void 0:a.meta;return r?{name:r.longName||r.shortName||t,price:r.regularMarketPrice}:null}catch{return null}}function se(t){const n=new Date((t+43200)*1e3);return`${n.getUTCFullYear()}-${String(n.getUTCMonth()+1).padStart(2,"0")}-${String(n.getUTCDate()).padStart(2,"0")}`}function ne(t){const n=t.map(e=>e.map(s=>({key:se(s.date),ret:s.ret}))),o=new Set;n.forEach(e=>e.forEach(s=>o.add(s.key)));const l=[...o].sort(),a=n.map(e=>{const s=new Map(e.map(r=>[r.key,r.ret]));return l.map(r=>s.get(r)??0)});return{dates:l,aligned:a}}function le(t,n){var c;const o=t.length,l=((c=t[0])==null?void 0:c.length)??0;if(l<10||o<1)return null;const a=Math.exp(-Math.LN2/n),e=Array.from({length:o},()=>new Array(o).fill(0));let s=0,r=1;for(let d=l-1;d>=0;d--){for(let i=0;i<o;i++)for(let u=0;u<o;u++)e[i][u]+=r*t[i][d]*t[u][d];s+=r,r*=a}for(let d=0;d<o;d++)for(let i=0;i<o;i++)e[d][i]=e[d][i]/s*252;return e}function re(t){const n=t.length;return Array.from({length:n},(o,l)=>Array.from({length:n},(a,e)=>{const s=Math.sqrt(t[l][l]*t[e][e]);return s>0?t[l][e]/s:l===e?1:0}))}function oe(t,n){t.length;const o=t.map((i,u)=>t.reduce((h,p,m)=>h+n[u][m]*p,0)),l=t.reduce((i,u,h)=>i+u*o[h],0),a=Math.sqrt(Math.max(0,l)),e=t.map((i,u)=>a>0?i*o[u]/a:0),s=e.map(i=>a>0?i/a:0),r=n.map((i,u)=>Math.sqrt(Math.max(0,n[u][u]))),c=t.reduce((i,u,h)=>i+u*r[h],0),d=a>0?c/a:1;return{portVol:a,RC:e,pctRC:s,indivVols:r,divRatio:d}}function ie(t,n){const o=t.length;if(o<5)return null;let l=1,a=1,e=0;const s=[],r=[];for(const b of t){l*=1+b,s.push(l),l>a&&(a=l);const v=l/a-1;r.push(v),-v>e&&(e=-v)}const c=Math.pow(Math.max(l,1e-9),252/o)-1,d=t.reduce((b,v)=>b+v,0)/o,i=Math.sqrt(t.reduce((b,v)=>b+(v-d)**2,0)/(o-1)*252),u=i>0?(c-.04)/i:null,h=e>0?c/e:null;let p=null;if((n==null?void 0:n.length)===o){const b=n.reduce((w,x)=>w+x,0)/o;let v=0,$=0;t.forEach((w,x)=>{v+=(w-d)*(n[x]-b),$+=(n[x]-b)**2}),p=$>0?v/$:null}let m=1;const f=(n==null?void 0:n.map(b=>(m*=1+b,m)))??[];return{annRet:c,vol:i,sharpe:u,beta:p,maxDD:e,calmar:h,navSeries:s,ddSeries:r,bmkNav:f}}const E={pct:(t,n=2)=>t==null||isNaN(t)?"—":`${t>=0?"+":""}${(t*100).toFixed(n)}%`,num:(t,n=2)=>t==null||isNaN(t)?"—":t.toFixed(n),price:t=>t==null?"—":t.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),cls:t=>t==null||isNaN(t)?"":t>=0?"up":"dn"};function ce(t){if(t==null||isNaN(t))return"transparent";const n=Math.max(-1,Math.min(1,t)),o=(Math.abs(n)*.65+.08).toFixed(2);return n>=0?`rgba(248,113,113,${o})`:`rgba(52,211,153,${o})`}function de(t){return`<div class="port-metrics-strip">
    ${[["Ann. Return",E.pct(t.annRet),E.cls(t.annRet)],["Ann. Vol",E.pct(t.vol),""],["Sharpe",E.num(t.sharpe),E.cls(t.sharpe)],["Beta (SPX)",E.num(t.beta),""],["Max Drawdown",E.pct(-t.maxDD),"dn"],["Calmar",E.num(t.calmar),E.cls(t.calmar)]].map(([o,l,a])=>`
      <div class="port-metric-card">
        <div class="port-metric-label">${o}</div>
        <div class="port-metric-val ${a}">${l}</div>
      </div>`).join("")}
  </div>`}function ue(t,n,o){const{portVol:l,pctRC:a,indivVols:e,divRatio:s}=oe(n,o),r=Math.max(1e-9,...a.map(Math.abs)),c=t.map((d,i)=>`
    <div class="port-risk-row">
      <div class="port-risk-lbl">${d}</div>
      <div class="port-risk-bar-wrap">
        <div class="port-risk-bar" style="width:${(Math.abs(a[i])/r*100).toFixed(1)}%"></div>
      </div>
      <div class="port-risk-pct">${(a[i]*100).toFixed(1)}%</div>
      <div class="port-risk-vol">${(e[i]*100).toFixed(1)}% vol</div>
    </div>`).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Risk Contribution</div>
      <div class="port-risk-meta">
        Portfolio Vol <strong>${(l*100).toFixed(2)}%</strong>
        &nbsp;·&nbsp; Div. Ratio <strong>${s.toFixed(2)}×</strong>
      </div>
      <div class="port-risk-rows">${c}</div>
    </div>`}function me(t,n,o){const l=n.reduce((e,s,r)=>e+s*n.reduce((c,d,i)=>c+d*o[r][i],0),0);return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Volatility & Contribution Beta</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Ann. Vol</th><th class="num">β → Port</th>
        </tr></thead>
        <tbody>${t.map((e,s)=>{const r=Math.sqrt(Math.max(0,o[s][s])),c=n.reduce((i,u,h)=>i+u*o[s][h],0),d=l>0?c/l:null;return`<tr>
      <td class="mkt-name">${e}</td>
      <td class="num">${(n[s]*100).toFixed(1)}%</td>
      <td class="num">${(r*100).toFixed(1)}%</td>
      <td class="num">${E.num(d)}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function pe(t,n,o){const l=re(n),a=t.map(s=>`<th class="corr-col-hdr">${s}</th>`).join(""),e=t.map((s,r)=>`<tr><th class="corr-row-hdr">${s}</th>${t.map((c,d)=>{const i=l[r][d],u=r===d;return`<td class="corr-cell${u?" corr-diag":""}"
        style="background:${u?"var(--bg-base)":ce(i)}">${u?"—":i.toFixed(2)}</td>`}).join("")}</tr>`).join("");return`
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
          <thead><tr><th></th>${a}</tr></thead>
          <tbody>${e}</tbody>
        </table>
      </div>
    </div>`}function he(t,n,o,l,a){const e=l.length,s={"1d":1,"1w":5,"1m":21,"3m":63};let r;if(a==="ytd"){const p=String(new Date().getFullYear());r=l.findIndex(m=>m.startsWith(p)),r<0&&(r=0)}else r=Math.max(0,e-(s[a]??1));const c=o.map(p=>p.slice(r).reduce((m,f)=>m*(1+f),1)-1),d=c.reduce((p,m,f)=>p+n[f]*m,0),i=Math.max(1e-9,...c.map(p=>Math.abs(p))),u=["1d","1w","1m","3m","ytd"].map(p=>`<button class="port-period-btn${p===a?" active":""}" data-period="${p}">${p.toUpperCase()}</button>`).join(""),h=t.map((p,m)=>{const f=c[m],b=n[m]*f,v=(Math.abs(f)/i*100).toFixed(1);return`<tr>
      <td class="mkt-name">${p}</td>
      <td class="num">${(n[m]*100).toFixed(1)}%</td>
      <td class="num ${E.cls(f)}">${E.pct(f)}</td>
      <td class="num ${E.cls(b)}">${E.pct(b)}</td>
      <td class="port-attr-bar-cell">
        <span class="port-attr-bar ${f>=0?"up":"dn"}" style="width:${v}%"></span>
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
        <tbody>${h}</tbody>
      </table>
    </div>`}async function be(t,n,o,l){var h;const a=t.querySelector("#port-chart-wrap");if(!a)return;N&&(N(),N=null);const{createChart:e}=await wt(async()=>{const{createChart:p}=await import("./lightweight-charts.production-C-4kb1nc.js");return{createChart:p}},[]);a.innerHTML="";const s=document.createElement("div");s.style.height="280px",a.appendChild(s);const r=e(s,{layout:{background:{color:"transparent"},textColor:"#6b7280"},grid:{vertLines:{color:"#22253a"},horzLines:{color:"#22253a"}},rightPriceScale:{borderColor:"#22253a"},timeScale:{borderColor:"#22253a"}}),c=r.addLineSeries({color:"#7c6af7",lineWidth:2,title:"Portfolio"}),d=r.addLineSeries({color:"#4b5563",lineWidth:1,lineStyle:2,title:"S&P 500"});function i(p){if(p==="cumret")c.setData(n.map((m,f)=>({time:m,value:+((o[f]-1)*100).toFixed(3)}))),d.setData(n.map((m,f)=>({time:m,value:+((l[f]-1)*100).toFixed(3)})));else{let m=1;c.setData(n.map((f,b)=>(o[b]>m&&(m=o[b]),{time:f,value:+((o[b]/m-1)*100).toFixed(3)}))),d.setData([])}r.timeScale().fitContent()}i("cumret"),(h=t.querySelector("#port-chart-toggle"))==null||h.querySelectorAll("[data-mode]").forEach(p=>{p.addEventListener("click",()=>{t.querySelectorAll("#port-chart-toggle [data-mode]").forEach(m=>m.classList.toggle("active",m===p)),i(p.dataset.mode)})});const u=new ResizeObserver(()=>r.resize(s.offsetWidth,280));u.observe(s),N=()=>{u.disconnect(),r.remove()}}function ve(t,n,o,l,a,e){t.innerHTML=`
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
  `,t.querySelector("#port-metrics-strip").innerHTML=de(e);function s(d){const i=le(n,d);i&&(t.querySelector("#port-risk-panel").innerHTML=ue(l,a,i),t.querySelector("#port-vol-panel").innerHTML=me(l,a,i),t.querySelector("#port-corr-panel").innerHTML=pe(l,i,d),r())}function r(){const d=t.querySelector("#port-hl-slider"),i=t.querySelector("#port-hl-val");d&&d.addEventListener("input",()=>{q=+d.value,i&&(i.textContent=`${q}d`),s(q)})}function c(d="1d"){var i;t.querySelector("#port-attr-panel").innerHTML=he(l,a,n,o,d),(i=t.querySelector("#port-attr-periods"))==null||i.querySelectorAll(".port-period-btn").forEach(u=>{u.addEventListener("click",()=>c(u.dataset.period))})}s(q),c("1d"),be(t,o,e.navSeries,e.bmkNav)}function fe(t){L=Zt(),Array.isArray(L)||(L=[]),t.innerHTML=`
    <div class="port-layout">
      <div class="mkt-panel port-holdings-panel">
        <div class="mkt-panel-label">Portfolio Holdings</div>

        <div class="port-add-form">
          <select id="port-market" class="sa-market-sel">
            ${Qt.map(h=>`<option value="${h.suffix}">${h.label}</option>`).join("")}
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
  `;let n=L.reduce((h,p)=>Math.max(h,p.id??0),0)+1,o=null;const l=t.querySelector("#port-analytics"),a=t.querySelector("#port-add-btn"),e=t.querySelector("#port-analyze-btn"),s=t.querySelector("#port-add-err"),r=t.querySelector("#port-ticker"),c=t.querySelector("#port-market"),d=t.querySelector("#port-weight-inp"),i=t.querySelector("#port-holdings-body");function u(){const h=L.reduce((m,f)=>m+f.weight,0);i.innerHTML=L.length===0?'<tr><td colspan="5" class="port-empty">No holdings yet — add a ticker above.</td></tr>':L.map(m=>`
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
        </tr>`).join("");const p=t.querySelector("#port-total");p&&(p.textContent=`Total: ${h.toFixed(1)}%`,p.className=`port-total ${h>100.01?"dn":Math.abs(h-100)<.01?"up":""}`),i.querySelectorAll(".port-wt-inp").forEach(m=>{m.addEventListener("change",f=>{const b=L.find(v=>v.id===+f.target.dataset.id);b&&(b.weight=parseFloat(f.target.value)||0,at(),u())})}),i.querySelectorAll(".port-remove").forEach(m=>{m.addEventListener("click",f=>{L=L.filter(b=>b.id!==+f.target.dataset.id),at(),u()})})}return a.addEventListener("click",async()=>{const h=c.value,p=r.value.trim().toUpperCase();if(!p){s.textContent="Enter a ticker";return}const m=p+h;if(L.some(v=>v.symbol===m)){s.textContent="Already added";return}const f=parseFloat(d.value)||0;a.disabled=!0,s.textContent="Looking up…";const b=await ae(m);if(a.disabled=!1,!b){s.textContent=`"${m}" not found`;return}L.push({id:n++,symbol:m,displaySymbol:p,name:b.name,price:b.price,weight:f}),at(),r.value="",d.value="",s.textContent="",u()}),r.addEventListener("keydown",h=>{h.key==="Enter"&&a.click()}),e.addEventListener("click",async()=>{if(L.length<2){l.innerHTML='<div class="port-msg port-err">Add at least 2 holdings to analyze.</div>';return}o==null||o.abort(),o=new AbortController,l.innerHTML=`<div class="port-msg port-loading"><div class="sa-spinner"></div><span>Fetching 1Y data for ${L.length} holdings…</span></div>`,e.disabled=!0;const h=[...new Set([mt.symbol,...L.map(S=>S.symbol)])],p=await Promise.all(h.map(S=>ee(S,o.signal)));e.disabled=!1;const m=new Map(h.map((S,U)=>[S,p[U]])),f=L.filter(S=>!m.get(S.symbol));if(f.length){l.innerHTML=`<div class="port-msg port-err">Could not load data for: ${f.map(S=>S.displaySymbol).join(", ")}</div>`;return}const b=m.get(mt.symbol),v=L.map(S=>m.get(S.symbol).retData),$=b?[...v,b.retData]:v,{dates:w,aligned:x}=ne($),D=x.slice(0,L.length),T=b?x[x.length-1]:null,A=L.map(S=>S.weight/100),P=w.map((S,U)=>A.reduce((Y,F,C)=>Y+F*(D[C][U]??0),0)),I=ie(P,T);if(!I){l.innerHTML='<div class="port-msg port-err">Insufficient data for analysis (need ≥5 aligned trading days).</div>';return}const B=L.map(S=>S.displaySymbol);ve(l,D,w,B,A,I)}),u(),()=>{o==null||o.abort(),N&&(N(),N=null)}}const ye=["market","stock","portfolio"],ge={market:"Macro monitor",stock:"Single name",portfolio:"Portfolio lab"},Se={market:"01",stock:"02",portfolio:"03"};let G="market",j=null;function ke(t){t.innerHTML=`
    <div class="app-frame">
      <header class="topbar">
        <div class="brand-lockup"><div class="logo">MACRO MONITOR</div><div class="brand-sub">GLOBAL MULTI-ASSET RESEARCH</div></div>
        <div class="topbar-center"><nav class="tabs" id="main-tabs">
          ${ye.map(a=>`<button class="tab ${a===G?"active":""}" data-tab="${a}"><span class="tab-num">${Se[a]}</span>${ge[a]}</button>`).join("")}
        </nav></div>
        <div class="topbar-right"><span class="market-status"><i></i> DATA LINKED</span><span class="topbar-date">${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span></div>
      </header>
      <main class="main-content" id="tab-content"></main>
      <footer class="app-footer"><span>NSM / TERMINAL</span><span>MARKET DATA: YAHOO FINANCE · DELAYED / INDICATIVE</span><span>LOCAL SESSION</span></footer>
    </div>
  `;const n=t.querySelector("#main-tabs"),o=t.querySelector("#tab-content");function l(a){a!==G&&(G=a,n.querySelectorAll(".tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===a)}),ht(o,a))}n.addEventListener("click",a=>{const e=a.target.closest(".tab");e&&l(e.dataset.tab)}),ht(o,G)}function ht(t,n){j&&(j(),j=null),t.innerHTML="",n==="market"?Yt(t).then(o=>{j=o??null}):n==="stock"?Jt(t).then(o=>{j=o??null}):n==="portfolio"&&(j=fe(t)??null)}ke(document.getElementById("app"));
