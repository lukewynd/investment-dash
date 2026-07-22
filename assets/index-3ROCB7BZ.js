(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const e of s)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function l(s){const e={};return s.integrity&&(e.integrity=s.integrity),s.referrerPolicy&&(e.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?e.credentials="include":s.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function o(s){if(s.ep)return;s.ep=!0;const e=l(s);fetch(s.href,e)}})();const F="https://yf-proxy.lukewynd.workers.dev";function I(t){const a=encodeURIComponent(t);return`${F}/v8/finance/chart/${a}?range=ytd&interval=1d`}const E=new Map,x=5*60*1e3;async function B(t){var l,o,s,e,n;const a=E.get(t);if(a&&Date.now()-a.ts<x)return a.data;try{const i=await fetch(I(t),{headers:{Accept:"application/json"}});if(!i.ok)return null;const r=await i.json(),m=(o=(l=r==null?void 0:r.chart)==null?void 0:l.result)==null?void 0:o[0];if(!m)return null;const d=m.meta,b=((n=(e=(s=m.indicators)==null?void 0:s.quote)==null?void 0:e[0])==null?void 0:n.close)??[],y=b.find(C=>C!=null),c=[...b].reverse().find(C=>C!=null),g=y!=null&&c!=null&&y!==0?(c-y)/y*100:null,p=d.regularMarketPrice??null,u=d.chartPreviousClose??null,A=p!=null&&u!=null&&u!==0?(p-u)/u*100:null,w=p!=null&&u!=null?p-u:null,U={symbol:t,regularMarketPrice:p,regularMarketChangePercent:A,regularMarketChange:w,chartPreviousClose:u,quoteType:d.instrumentType??"",ytdPct:g};return E.set(t,{ts:Date.now(),data:U}),U}catch{return null}}async function Y(t){const l=new Map;for(let o=0;o<t.length;o+=8){const s=t.slice(o,o+8),e=await Promise.allSettled(s.map(n=>B(n)));s.forEach((n,i)=>{const r=e[i].status==="fulfilled"?e[i].value:null;r&&l.set(n,r)})}return l}const P={Americas:[{symbol:"^GSPC",name:"S&P 500"},{symbol:"^IXIC",name:"NASDAQ"},{symbol:"^DJI",name:"Dow Jones"},{symbol:"^RUT",name:"Russell 2000"},{symbol:"^BVSP",name:"Bovespa"},{symbol:"^MXX",name:"IPC Mexico"}],Europe:[{symbol:"^FTSE",name:"FTSE 100"},{symbol:"^GDAXI",name:"DAX"},{symbol:"^FCHI",name:"CAC 40"},{symbol:"^STOXX50E",name:"Euro Stoxx 50"},{symbol:"^SSMI",name:"SMI"},{symbol:"^AEX",name:"AEX"}],"Asia-Pacific":[{symbol:"^N225",name:"Nikkei 225"},{symbol:"^HSI",name:"Hang Seng"},{symbol:"000001.SS",name:"Shanghai"},{symbol:"^AXJO",name:"ASX 200"},{symbol:"^KS11",name:"KOSPI"},{symbol:"^STI",name:"Straits Times"}]},$=[{symbol:"^IRX",name:"3-Month",country:"US",flag:"🇺🇸"},{symbol:"^FVX",name:"5-Year",country:"US",flag:"🇺🇸"},{symbol:"^TNX",name:"10-Year",country:"US",flag:"🇺🇸"},{symbol:"^TYX",name:"30-Year",country:"US",flag:"🇺🇸"}],M=[{symbol:"EURUSD=X",name:"EUR / USD"},{symbol:"GBPUSD=X",name:"GBP / USD"},{symbol:"USDJPY=X",name:"USD / JPY"},{symbol:"AUDUSD=X",name:"AUD / USD"},{symbol:"USDCAD=X",name:"USD / CAD"},{symbol:"USDCHF=X",name:"USD / CHF"},{symbol:"USDCNY=X",name:"USD / CNY"},{symbol:"USDINR=X",name:"USD / INR"}],L=[{symbol:"GC=F",name:"Gold",unit:"/oz"},{symbol:"SI=F",name:"Silver",unit:"/oz"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl"},{symbol:"NG=F",name:"Natural Gas",unit:"/MMBtu"},{symbol:"HG=F",name:"Copper",unit:"/lb"},{symbol:"ZW=F",name:"Wheat",unit:"/bu"},{symbol:"ZC=F",name:"Corn",unit:"/bu"}],T=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],H=Object.values(P).flat().map(t=>t.symbol),O=T.map(t=>t.symbol),R=[...H,...$.map(t=>t.symbol),...M.map(t=>t.symbol),...L.map(t=>t.symbol),...O];function N(t){var o;const a=t==null?void 0:t.regularMarketPrice;return a==null?"—":((o=t.symbol)==null?void 0:o.startsWith("^"))&&a<30?a.toFixed(2)+"%":a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}function k(t){return t==null?{text:"—",cls:""}:{text:`${t>=0?"+":""}${t.toFixed(2)}%`,cls:t>=0?"up":"dn"}}function D(t){return k((t==null?void 0:t.regularMarketChangePercent)??null)}function j(t){const a=t==null?void 0:t.regularMarketChange;if(a==null)return{text:"—",cls:""};const l=Math.round(a*100);return{text:`${l>=0?"+":""}${l}bps`,cls:l>=0?"up":"dn"}}function S(t){return`<td class="num ${t.cls}">${t.text}</td>`}function h(t,a=4){return Array.from({length:t},()=>`<tr>${Array.from({length:a},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function _(t,a,l){const o=a.map(({symbol:s,name:e})=>{const n=l.get(s),i=D(n),r=k((n==null?void 0:n.ytdPct)??null);return`<tr>
      <td class="mkt-name">${e}</td>
      <td class="num">${N(n)}</td>
      ${S(i)}
      <td class="num ${r.cls}">${r.text}</td>
    </tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">${t}</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Index</th><th class="num">Level</th>
          <th class="num">1D</th><th class="num">YTD</th>
        </tr></thead>
        <tbody>${o}</tbody>
      </table>
    </div>`}function G(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Bond Yields</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Tenor</th><th class="num">Yield</th><th class="num">1D Chg</th>
        </tr></thead>
        <tbody>${$.map(({symbol:l,name:o,flag:s,country:e})=>{const n=t.get(l),i=j(n),r=(n==null?void 0:n.regularMarketPrice)!=null?n.regularMarketPrice.toFixed(2)+"%":"—";return`<tr>
      <td class="mkt-name"><span class="mkt-flag">${s}</span>${e} ${o}</td>
      <td class="num">${r}</td>
      ${S(i)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function K(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Rates</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Pair</th><th class="num">Rate</th><th class="num">1D</th>
        </tr></thead>
        <tbody>${M.map(({symbol:l,name:o})=>{const s=t.get(l),e=D(s),n=s==null?void 0:s.regularMarketPrice,i=["USDJPY=X","USDCNY=X","USDINR=X"].includes(l)?3:4;return`<tr>
      <td class="mkt-name">${o}</td>
      <td class="num">${n!=null?n.toFixed(i):"—"}</td>
      ${S(e)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function W(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Commodities</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Price</th><th class="num">1D</th>
        </tr></thead>
        <tbody>${L.map(({symbol:l,name:o,unit:s})=>{const e=t.get(l),n=D(e),i=e==null?void 0:e.regularMarketPrice;return`<tr>
      <td class="mkt-name">${o}</td>
      <td class="num">${i!=null?"$"+i.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—"}<span class="mkt-unit">${s}</span></td>
      ${S(n)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function J(t){const a=T.map(({symbol:e,name:n})=>{const i=t.get(e);return{name:n,chg1d:(i==null?void 0:i.regularMarketChangePercent)??null,ytd:(i==null?void 0:i.ytdPct)??null}}),l=Math.max(.01,...a.map(e=>Math.abs(e.chg1d??0))),o=Math.max(.01,...a.map(e=>Math.abs(e.ytd??0)));return`
    <div class="mkt-panel mkt-panel-wide">
      <div class="mkt-panel-label">US Equity Sectors</div>
      <table class="mkt-table sec-table">
        <thead><tr>
          <th>Sector</th>
          <th colspan="2" class="num">1-Day</th>
          <th colspan="2" class="num">YTD</th>
        </tr></thead>
        <tbody>${a.map(({name:e,chg1d:n,ytd:i})=>{const r=k(n),m=k(i),d=n!=null?Math.abs(n)/l*100:0,b=i!=null?Math.abs(i)/o*100:0;return`<tr>
      <td class="mkt-name sec-name">${e}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${r.cls}" style="width:${d.toFixed(1)}%"></span></td>
      <td class="num ${r.cls}">${r.text}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${m.cls}" style="width:${b.toFixed(1)}%"></span></td>
      <td class="num ${m.cls}">${m.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}async function q(t){t.innerHTML=`
    <div class="mkt-topbar">
      <h2 class="mkt-title">Market Overview</h2>
      <div class="mkt-topbar-right">
        <span class="mkt-timestamp" id="mkt-timestamp">Loading…</span>
        <button class="ghost-btn mkt-refresh-btn" id="mkt-refresh">↺ Refresh</button>
      </div>
    </div>

    <section class="mkt-section">
      <div class="mkt-section-title">Equity Markets</div>
      <div class="mkt-equities-grid" id="mkt-equities">
        ${["Americas","Europe","Asia-Pacific"].map(e=>`
          <div class="mkt-panel">
            <div class="mkt-panel-label">${e}</div>
            <table class="mkt-table"><tbody>${h(6)}</tbody></table>
          </div>`).join("")}
      </div>
    </section>

    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds"><div class="mkt-panel"><div class="mkt-panel-label">Bond Yields</div><table class="mkt-table"><tbody>${h(4,3)}</tbody></table></div></div>
      <div id="mkt-fx"><div class="mkt-panel"><div class="mkt-panel-label">FX Rates</div><table class="mkt-table"><tbody>${h(8,3)}</tbody></table></div></div>
    </section>

    <section class="mkt-section mkt-two-col">
      <div id="mkt-commodities"><div class="mkt-panel"><div class="mkt-panel-label">Commodities</div><table class="mkt-table"><tbody>${h(8,3)}</tbody></table></div></div>
      <div id="mkt-sectors"><div class="mkt-panel"><div class="mkt-panel-label">US Equity Sectors</div><table class="mkt-table"><tbody>${h(11,5)}</tbody></table></div></div>
    </section>
  `;function a(e){return`<div class="mkt-panel"><div class="mkt-panel-label">${e}</div><div class="mkt-section-err">Unable to load — check console for details</div></div>`}const l=t.querySelector("#mkt-refresh");async function o(){const e=t.querySelector("#mkt-timestamp");e.textContent="Loading…";const n=await Y(R);if(!t.isConnected)return;const i=t.querySelector("#mkt-equities"),r=t.querySelector("#mkt-bonds"),m=t.querySelector("#mkt-fx"),d=t.querySelector("#mkt-commodities"),b=t.querySelector("#mkt-sectors");i.innerHTML=Object.entries(P).map(([c,g])=>_(c,g,n)).join(""),r.innerHTML=$.some(c=>n.has(c.symbol))?G(n):a("Bond Yields"),m.innerHTML=M.some(c=>n.has(c.symbol))?K(n):a("FX Rates"),d.innerHTML=L.some(c=>n.has(c.symbol))?W(n):a("Commodities"),b.innerHTML=T.some(c=>n.has(c.symbol))?J(n):a("US Equity Sectors");const y=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});e.textContent=`Updated ${y}`}l.addEventListener("click",o),await o();const s=setInterval(o,30*60*1e3);return()=>clearInterval(s)}function Q(t){t.innerHTML=`
    <div class="placeholder-view">
      <div class="placeholder-icon">📈</div>
      <div class="placeholder-title">Single Stock Analysis</div>
      <p class="placeholder-body">
        Search for any stock to see price history, key metrics, financials,
        analyst estimates, and more. Coming soon.
      </p>
    </div>
  `}function V(t){t.innerHTML=`
    <div class="placeholder-view">
      <div class="placeholder-icon">💼</div>
      <div class="placeholder-title">Portfolio Analysis</div>
      <p class="placeholder-body">
        Track your holdings, view allocation breakdowns, monitor performance
        vs benchmarks, and analyse risk. Coming soon.
      </p>
    </div>
  `}const Z=["market","stock","portfolio"],z={market:"Markets",stock:"Stock Analysis",portfolio:"Portfolio"};let v="market",f=null;function tt(t){t.innerHTML=`
    <div class="topbar">
      <div class="topbar-left">
        <div class="logo">invest<span>.</span>dash</div>
      </div>
      <div class="topbar-center">
        <div class="tabs" id="main-tabs">
          ${Z.map(s=>`
            <button class="tab ${s===v?"active":""}" data-tab="${s}">
              ${z[s]}
            </button>`).join("")}
        </div>
      </div>
      <div class="topbar-right"></div>
    </div>

    <div class="main-content" id="tab-content"></div>
  `;const a=t.querySelector("#main-tabs"),l=t.querySelector("#tab-content");function o(s){s!==v&&(v=s,a.querySelectorAll(".tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===s)}),X(l,s))}a.addEventListener("click",s=>{const e=s.target.closest(".tab");e&&o(e.dataset.tab)}),X(l,v)}function X(t,a){f&&(f(),f=null),t.innerHTML="",a==="market"?q(t).then(l=>{f=l??null}):a==="stock"?Q(t):a==="portfolio"&&V(t)}tt(document.getElementById("app"));
