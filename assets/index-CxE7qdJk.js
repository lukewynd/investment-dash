(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();const k="https://query1.finance.yahoo.com",D=new Map,T=new Map,L=5*60*1e3;let b=null;async function F(){if(b)return b;try{const t=await fetch(`${k}/v1/test/getcrumb`,{credentials:"include"});t.ok&&(b=await t.text())}catch{}return b}async function I(t){var i;const e=[...t].sort().join(","),a=D.get(e);if(a&&Date.now()-a.ts<L)return a.data;const o=await F(),s=`symbols=${encodeURIComponent(t.join(","))}${o?`&crumb=${encodeURIComponent(o)}`:""}`,n=`${k}/v7/finance/quote?${s}`,r=await(await fetch(n,{credentials:"include"})).json(),c=((i=r==null?void 0:r.quoteResponse)==null?void 0:i.result)??[],m=new Map(c.map(d=>[d.symbol,d]));return D.set(e,{ts:Date.now(),data:m}),m}async function R(t){var a,o,s,n,l,r;const e=T.get(t);if(e&&Date.now()-e.ts<L)return e.pct;try{const c=`${k}/v8/finance/chart/${encodeURIComponent(t)}?range=ytd&interval=1d`,i=await(await fetch(c,{credentials:"include"})).json(),d=((r=(l=(n=(s=(o=(a=i==null?void 0:i.chart)==null?void 0:a.result)==null?void 0:o[0])==null?void 0:s.indicators)==null?void 0:n.quote)==null?void 0:l[0])==null?void 0:r.close)??[],u=d.find(v=>v!=null),g=[...d].reverse().find(v=>v!=null);if(u==null||g==null)return null;const $=(g-u)/u*100;return T.set(t,{ts:Date.now(),pct:$}),$}catch{return null}}async function x(t){const e=new Map,a=6;for(let o=0;o<t.length;o+=a){const s=t.slice(o,o+a),n=await Promise.allSettled(s.map(l=>R(l)));s.forEach((l,r)=>{const c=n[r];e.set(l,c.status==="fulfilled"?c.value:null)})}return e}const w={Americas:[{symbol:"^GSPC",name:"S&P 500"},{symbol:"^IXIC",name:"NASDAQ"},{symbol:"^DJI",name:"Dow Jones"},{symbol:"^RUT",name:"Russell 2000"},{symbol:"^BVSP",name:"Bovespa"},{symbol:"^MXX",name:"IPC Mexico"}],Europe:[{symbol:"^FTSE",name:"FTSE 100"},{symbol:"^GDAXI",name:"DAX"},{symbol:"^FCHI",name:"CAC 40"},{symbol:"^STOXX50E",name:"Euro Stoxx 50"},{symbol:"^SSMI",name:"SMI"},{symbol:"^AEX",name:"AEX"}],"Asia-Pacific":[{symbol:"^N225",name:"Nikkei 225"},{symbol:"^HSI",name:"Hang Seng"},{symbol:"000001.SS",name:"Shanghai"},{symbol:"^AXJO",name:"ASX 200"},{symbol:"^KOSPI",name:"KOSPI"},{symbol:"^STI",name:"Straits Times"}]},U=[{symbol:"^IRX",name:"3-Month",flag:"🇺🇸",country:"US"},{symbol:"^FVX",name:"5-Year",flag:"🇺🇸",country:"US"},{symbol:"^TNX",name:"10-Year",flag:"🇺🇸",country:"US"},{symbol:"^TYX",name:"30-Year",flag:"🇺🇸",country:"US"},{symbol:"GB2YT=RR",name:"2-Year",flag:"🇬🇧",country:"UK"},{symbol:"GB10YT=RR",name:"10-Year",flag:"🇬🇧",country:"UK"},{symbol:"DE2YT=RR",name:"2-Year",flag:"🇩🇪",country:"DE"},{symbol:"DE10YT=RR",name:"10-Year",flag:"🇩🇪",country:"DE"},{symbol:"JP2YT=RR",name:"2-Year",flag:"🇯🇵",country:"JP"},{symbol:"JP10YT=RR",name:"10-Year",flag:"🇯🇵",country:"JP"}],E=[{symbol:"EURUSD=X",name:"EUR / USD"},{symbol:"GBPUSD=X",name:"GBP / USD"},{symbol:"USDJPY=X",name:"USD / JPY"},{symbol:"AUDUSD=X",name:"AUD / USD"},{symbol:"USDCAD=X",name:"USD / CAD"},{symbol:"USDCHF=X",name:"USD / CHF"},{symbol:"USDCNY=X",name:"USD / CNY"},{symbol:"USDINR=X",name:"USD / INR"}],X=[{symbol:"GC=F",name:"Gold",unit:"/oz"},{symbol:"SI=F",name:"Silver",unit:"/oz"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl"},{symbol:"NG=F",name:"Natural Gas",unit:"/MMBtu"},{symbol:"HG=F",name:"Copper",unit:"/lb"},{symbol:"ZW=F",name:"Wheat",unit:"/bu"},{symbol:"ZC=F",name:"Corn",unit:"/bu"}],Y=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],A=Object.values(w).flat().map(t=>t.symbol),P=Y.map(t=>t.symbol),B=[...A,...U.map(t=>t.symbol),...E.map(t=>t.symbol),...X.map(t=>t.symbol),...P];function O(t){var o;const e=t==null?void 0:t.regularMarketPrice;return e==null?"—":t.quoteType==="INDEX"&&((o=t.symbol)==null?void 0:o.startsWith("^"))&&e<30?e.toFixed(2)+"%":e.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}function h(t){return t==null?{text:"—",cls:""}:{text:`${t>=0?"+":""}${t.toFixed(2)}%`,cls:t>=0?"up":"dn"}}function S(t){const e=t==null?void 0:t.regularMarketChangePercent;return h(e)}function H(t){const e=t==null?void 0:t.regularMarketChange;if(e==null)return{text:"—",cls:""};const a=Math.round(e*100);return{text:`${a>=0?"+":""}${a}bps`,cls:a>=0?"up":"dn"}}function f(t){return`<td class="num ${t.cls}">${t.text}</td>`}function N(t,e=4){return Array.from({length:t},()=>`<tr>${Array.from({length:e},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function j(t,e,a,o){const s=e.map(({symbol:n,name:l})=>{const r=a.get(n),c=S(r),m=o==null?void 0:o.get(n),i=h(m??null);return`<tr>
      <td class="mkt-name">${l}</td>
      <td class="num">${O(r)}</td>
      ${f(c)}
      <td class="num ${i.cls}">${i.text}</td>
    </tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">${t}</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Index</th><th class="num">Level</th>
          <th class="num">1D</th><th class="num">YTD</th>
        </tr></thead>
        <tbody>${s}</tbody>
      </table>
    </div>`}function _(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Bond Yields</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Tenor</th><th class="num">Yield</th><th class="num">1D Chg</th>
        </tr></thead>
        <tbody>${U.map(({symbol:a,name:o,flag:s,country:n})=>{const l=t.get(a),r=H(l);return`<tr>
      <td class="mkt-name"><span class="mkt-flag">${s}</span>${n} ${o}</td>
      <td class="num">${(l==null?void 0:l.regularMarketPrice)!=null?l.regularMarketPrice.toFixed(2)+"%":"—"}</td>
      ${f(r)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function G(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Rates</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Pair</th><th class="num">Rate</th><th class="num">1D</th>
        </tr></thead>
        <tbody>${E.map(({symbol:a,name:o})=>{const s=t.get(a),n=S(s),l=s==null?void 0:s.regularMarketPrice,r=a==="USDJPY=X"||a==="USDCNY=X"||a==="USDINR=X"?3:4;return`<tr>
      <td class="mkt-name">${o}</td>
      <td class="num">${l!=null?l.toFixed(r):"—"}</td>
      ${f(n)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function J(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Commodities</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Price</th><th class="num">1D</th>
        </tr></thead>
        <tbody>${X.map(({symbol:a,name:o,unit:s})=>{const n=t.get(a),l=S(n),r=n==null?void 0:n.regularMarketPrice;return`<tr>
      <td class="mkt-name">${o}</td>
      <td class="num">${r!=null?"$"+r.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—"}<span class="mkt-unit">${s}</span></td>
      ${f(l)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function K(t,e){const a=Y.map(({symbol:l,name:r})=>{const c=t.get(l),m=e==null?void 0:e.get(l),i=(c==null?void 0:c.regularMarketChangePercent)??null;return{name:r,chg1d:i,ytd:m??null}}),o=Math.max(.01,...a.map(l=>Math.abs(l.chg1d??0))),s=Math.max(.01,...a.map(l=>Math.abs(l.ytd??0)));return`
    <div class="mkt-panel mkt-panel-wide">
      <div class="mkt-panel-label">US Equity Sectors</div>
      <table class="mkt-table sec-table">
        <thead><tr>
          <th>Sector</th>
          <th colspan="2" class="num">1-Day</th>
          <th colspan="2" class="num">YTD</th>
        </tr></thead>
        <tbody>${a.map(({name:l,chg1d:r,ytd:c})=>{const m=h(r),i=h(c),d=r!=null?Math.abs(r)/o*100:0,u=c!=null?Math.abs(c)/s*100:0;return`<tr>
      <td class="mkt-name sec-name">${l}</td>
      <td class="sec-bar-cell">
        <span class="sec-bar ${m.cls}" style="width:${d.toFixed(1)}%"></span>
      </td>
      <td class="num ${m.cls}">${m.text}</td>
      <td class="sec-bar-cell">
        <span class="sec-bar ${i.cls}" style="width:${u.toFixed(1)}%"></span>
      </td>
      <td class="num ${i.cls}">${i.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function C(t,e,a){const o=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});t.querySelector("#mkt-timestamp").textContent=`Updated ${o}`;const s=t.querySelector("#mkt-equities");s.innerHTML=Object.entries(w).map(([n,l])=>j(n,l,e,a)).join(""),t.querySelector("#mkt-bonds").innerHTML=_(e),t.querySelector("#mkt-fx").innerHTML=G(e),t.querySelector("#mkt-commodities").innerHTML=J(e),t.querySelector("#mkt-sectors").innerHTML=K(e,a)}async function q(t){t.innerHTML=`
    <div class="mkt-topbar">
      <h2 class="mkt-title">Market Overview</h2>
      <div class="mkt-topbar-right">
        <span class="mkt-timestamp" id="mkt-timestamp">Loading…</span>
        <button class="ghost-btn mkt-refresh-btn" id="mkt-refresh">↺ Refresh</button>
      </div>
    </div>

    <div class="mkt-error" id="mkt-error" style="display:none">
      Unable to load market data. Yahoo Finance may be temporarily unavailable.
      <button class="ghost-btn" id="mkt-retry" style="margin-left:12px">Retry</button>
    </div>

    <section class="mkt-section">
      <div class="mkt-section-title">Equity Markets</div>
      <div class="mkt-equities-grid" id="mkt-equities">
        ${["Americas","Europe","Asia-Pacific"].map(n=>`
          <div class="mkt-panel">
            <div class="mkt-panel-label">${n}</div>
            <table class="mkt-table"><tbody>${N(6)}</tbody></table>
          </div>`).join("")}
      </div>
    </section>

    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds"></div>
      <div id="mkt-fx"></div>
    </section>

    <section class="mkt-section mkt-two-col">
      <div id="mkt-commodities"></div>
      <div id="mkt-sectors"></div>
    </section>
  `;const e=t.querySelector("#mkt-error"),a=t.querySelector("#mkt-refresh");async function o(){e.style.display="none";try{const n=await I(B);C(t,n,new Map);const r=[...A,...P],c=await x(r);C(t,n,c)}catch(n){console.error("Market data load failed:",n),e.style.display="",t.querySelector("#mkt-timestamp").textContent="Failed to load"}}a.addEventListener("click",o),t.querySelector("#mkt-error").addEventListener("click",n=>{n.target.id==="mkt-retry"&&o()}),await o();const s=setInterval(o,6e4);return()=>clearInterval(s)}function W(t){t.innerHTML=`
    <div class="placeholder-view">
      <div class="placeholder-icon">📈</div>
      <div class="placeholder-title">Single Stock Analysis</div>
      <p class="placeholder-body">
        Search for any stock to see price history, key metrics, financials,
        analyst estimates, and more. Coming soon.
      </p>
    </div>
  `}function Q(t){t.innerHTML=`
    <div class="placeholder-view">
      <div class="placeholder-icon">💼</div>
      <div class="placeholder-title">Portfolio Analysis</div>
      <p class="placeholder-body">
        Track your holdings, view allocation breakdowns, monitor performance
        vs benchmarks, and analyse risk. Coming soon.
      </p>
    </div>
  `}const V=["market","stock","portfolio"],Z={market:"Markets",stock:"Stock Analysis",portfolio:"Portfolio"};let y="market",p=null;function z(t){t.innerHTML=`
    <div class="topbar">
      <div class="topbar-left">
        <div class="logo">invest<span>.</span>dash</div>
      </div>
      <div class="topbar-center">
        <div class="tabs" id="main-tabs">
          ${V.map(s=>`
            <button class="tab ${s===y?"active":""}" data-tab="${s}">
              ${Z[s]}
            </button>`).join("")}
        </div>
      </div>
      <div class="topbar-right"></div>
    </div>

    <div class="main-content" id="tab-content"></div>
  `;const e=t.querySelector("#main-tabs"),a=t.querySelector("#tab-content");function o(s){s!==y&&(y=s,e.querySelectorAll(".tab").forEach(n=>{n.classList.toggle("active",n.dataset.tab===s)}),M(a,s))}e.addEventListener("click",s=>{const n=s.target.closest(".tab");n&&o(n.dataset.tab)}),M(a,y)}function M(t,e){p&&(p(),p=null),t.innerHTML="",e==="market"?q(t).then(a=>{p=a??null}):e==="stock"?W(t):e==="portfolio"&&Q(t)}z(document.getElementById("app"));
