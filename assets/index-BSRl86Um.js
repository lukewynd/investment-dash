(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function a(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(e){if(e.ep)return;e.ep=!0;const n=a(e);fetch(e.href,n)}})();const j="https://query1.finance.yahoo.com";function R(t){return`https://api.allorigins.win/raw?url=${encodeURIComponent(j+t)}`}const Y=new Map,P=new Map,x=5*60*1e3;async function _(t){var r;if(!t.length)return new Map;const s=[...t].sort().join(","),a=Y.get(s);if(a&&Date.now()-a.ts<x)return a.data;const o=`/v7/finance/quote?symbols=${encodeURIComponent(t.join(","))}&formatted=false`,e=await fetch(R(o));if(!e.ok)throw new Error(`Quote fetch failed: ${e.status}`);const n=await e.json(),l=((r=n==null?void 0:n.quoteResponse)==null?void 0:r.result)??[],i=new Map(l.map(c=>[c.symbol,c]));return Y.set(s,{ts:Date.now(),data:i}),i}async function G(t){var a,o,e,n,l,i;const s=P.get(t);if(s&&Date.now()-s.ts<x)return s.pct;try{const r=`/v8/finance/chart/${encodeURIComponent(t)}?range=ytd&interval=1d`,c=await fetch(R(r));if(!c.ok)return null;const m=await c.json(),u=((i=(l=(n=(e=(o=(a=m==null?void 0:m.chart)==null?void 0:a.result)==null?void 0:o[0])==null?void 0:e.indicators)==null?void 0:n.quote)==null?void 0:l[0])==null?void 0:i.close)??[],b=u.find(p=>p!=null),h=[...u].reverse().find(p=>p!=null);if(b==null||h==null)return null;const v=(h-b)/b*100;return P.set(t,{ts:Date.now(),pct:v}),v}catch{return null}}async function J(t){const s=new Map,a=6;for(let o=0;o<t.length;o+=a){const e=t.slice(o,o+a),n=await Promise.allSettled(e.map(l=>G(l)));e.forEach((l,i)=>{s.set(l,n[i].status==="fulfilled"?n[i].value:null)})}return s}const D={Americas:[{symbol:"^GSPC",name:"S&P 500"},{symbol:"^IXIC",name:"NASDAQ"},{symbol:"^DJI",name:"Dow Jones"},{symbol:"^RUT",name:"Russell 2000"},{symbol:"^BVSP",name:"Bovespa"},{symbol:"^MXX",name:"IPC Mexico"}],Europe:[{symbol:"^FTSE",name:"FTSE 100"},{symbol:"^GDAXI",name:"DAX"},{symbol:"^FCHI",name:"CAC 40"},{symbol:"^STOXX50E",name:"Euro Stoxx 50"},{symbol:"^SSMI",name:"SMI"},{symbol:"^AEX",name:"AEX"}],"Asia-Pacific":[{symbol:"^N225",name:"Nikkei 225"},{symbol:"^HSI",name:"Hang Seng"},{symbol:"000001.SS",name:"Shanghai"},{symbol:"^AXJO",name:"ASX 200"},{symbol:"^KOSPI",name:"KOSPI"},{symbol:"^STI",name:"Straits Times"}]},E=[{symbol:"^IRX",name:"3-Month",flag:"🇺🇸",country:"US"},{symbol:"^FVX",name:"5-Year",flag:"🇺🇸",country:"US"},{symbol:"^TNX",name:"10-Year",flag:"🇺🇸",country:"US"},{symbol:"^TYX",name:"30-Year",flag:"🇺🇸",country:"US"},{symbol:"GB2YT=RR",name:"2-Year",flag:"🇬🇧",country:"UK"},{symbol:"GB10YT=RR",name:"10-Year",flag:"🇬🇧",country:"UK"},{symbol:"DE2YT=RR",name:"2-Year",flag:"🇩🇪",country:"DE"},{symbol:"DE10YT=RR",name:"10-Year",flag:"🇩🇪",country:"DE"},{symbol:"JP2YT=RR",name:"2-Year",flag:"🇯🇵",country:"JP"},{symbol:"JP10YT=RR",name:"10-Year",flag:"🇯🇵",country:"JP"}],U=[{symbol:"EURUSD=X",name:"EUR / USD"},{symbol:"GBPUSD=X",name:"GBP / USD"},{symbol:"USDJPY=X",name:"USD / JPY"},{symbol:"AUDUSD=X",name:"AUD / USD"},{symbol:"USDCAD=X",name:"USD / CAD"},{symbol:"USDCHF=X",name:"USD / CHF"},{symbol:"USDCNY=X",name:"USD / CNY"},{symbol:"USDINR=X",name:"USD / INR"}],L=[{symbol:"GC=F",name:"Gold",unit:"/oz"},{symbol:"SI=F",name:"Silver",unit:"/oz"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl"},{symbol:"NG=F",name:"Natural Gas",unit:"/MMBtu"},{symbol:"HG=F",name:"Copper",unit:"/lb"},{symbol:"ZW=F",name:"Wheat",unit:"/bu"},{symbol:"ZC=F",name:"Corn",unit:"/bu"}],B=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],C=Object.values(D).flat().map(t=>t.symbol),w=B.map(t=>t.symbol);[...C,...E.map(t=>t.symbol),...U.map(t=>t.symbol),...L.map(t=>t.symbol),...w];function q(t){var o;const s=t==null?void 0:t.regularMarketPrice;return s==null?"—":t.quoteType==="INDEX"&&((o=t.symbol)==null?void 0:o.startsWith("^"))&&s<30?s.toFixed(2)+"%":s.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}function T(t){return t==null?{text:"—",cls:""}:{text:`${t>=0?"+":""}${t.toFixed(2)}%`,cls:t>=0?"up":"dn"}}function X(t){const s=t==null?void 0:t.regularMarketChangePercent;return T(s)}function z(t){const s=t==null?void 0:t.regularMarketChange;if(s==null)return{text:"—",cls:""};const a=Math.round(s*100);return{text:`${a>=0?"+":""}${a}bps`,cls:a>=0?"up":"dn"}}function $(t){return`<td class="num ${t.cls}">${t.text}</td>`}function y(t,s=4){return Array.from({length:t},()=>`<tr>${Array.from({length:s},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function A(t,s,a,o){const e=s.map(({symbol:n,name:l})=>{const i=a.get(n),r=X(i),c=o==null?void 0:o.get(n),m=T(c??null);return`<tr>
      <td class="mkt-name">${l}</td>
      <td class="num">${q(i)}</td>
      ${$(r)}
      <td class="num ${m.cls}">${m.text}</td>
    </tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">${t}</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Index</th><th class="num">Level</th>
          <th class="num">1D</th><th class="num">YTD</th>
        </tr></thead>
        <tbody>${e}</tbody>
      </table>
    </div>`}function K(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Bond Yields</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Tenor</th><th class="num">Yield</th><th class="num">1D Chg</th>
        </tr></thead>
        <tbody>${E.map(({symbol:a,name:o,flag:e,country:n})=>{const l=t.get(a),i=z(l);return`<tr>
      <td class="mkt-name"><span class="mkt-flag">${e}</span>${n} ${o}</td>
      <td class="num">${(l==null?void 0:l.regularMarketPrice)!=null?l.regularMarketPrice.toFixed(2)+"%":"—"}</td>
      ${$(i)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Q(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Rates</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Pair</th><th class="num">Rate</th><th class="num">1D</th>
        </tr></thead>
        <tbody>${U.map(({symbol:a,name:o})=>{const e=t.get(a),n=X(e),l=e==null?void 0:e.regularMarketPrice,i=a==="USDJPY=X"||a==="USDCNY=X"||a==="USDINR=X"?3:4;return`<tr>
      <td class="mkt-name">${o}</td>
      <td class="num">${l!=null?l.toFixed(i):"—"}</td>
      ${$(n)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function W(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Commodities</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Price</th><th class="num">1D</th>
        </tr></thead>
        <tbody>${L.map(({symbol:a,name:o,unit:e})=>{const n=t.get(a),l=X(n),i=n==null?void 0:n.regularMarketPrice;return`<tr>
      <td class="mkt-name">${o}</td>
      <td class="num">${i!=null?"$"+i.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—"}<span class="mkt-unit">${e}</span></td>
      ${$(l)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function F(t,s){const a=B.map(({symbol:l,name:i})=>{const r=t.get(l),c=s==null?void 0:s.get(l),m=(r==null?void 0:r.regularMarketChangePercent)??null;return{name:i,chg1d:m,ytd:c??null}}),o=Math.max(.01,...a.map(l=>Math.abs(l.chg1d??0))),e=Math.max(.01,...a.map(l=>Math.abs(l.ytd??0)));return`
    <div class="mkt-panel mkt-panel-wide">
      <div class="mkt-panel-label">US Equity Sectors</div>
      <table class="mkt-table sec-table">
        <thead><tr>
          <th>Sector</th>
          <th colspan="2" class="num">1-Day</th>
          <th colspan="2" class="num">YTD</th>
        </tr></thead>
        <tbody>${a.map(({name:l,chg1d:i,ytd:r})=>{const c=T(i),m=T(r),u=i!=null?Math.abs(i)/o*100:0,b=r!=null?Math.abs(r)/e*100:0;return`<tr>
      <td class="mkt-name sec-name">${l}</td>
      <td class="sec-bar-cell">
        <span class="sec-bar ${c.cls}" style="width:${u.toFixed(1)}%"></span>
      </td>
      <td class="num ${c.cls}">${c.text}</td>
      <td class="sec-bar-cell">
        <span class="sec-bar ${m.cls}" style="width:${b.toFixed(1)}%"></span>
      </td>
      <td class="num ${m.cls}">${m.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}async function f(t){try{return await _(t)}catch(s){return console.warn("Fetch failed for",t,s),new Map}}function k(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">${t}</div>
      <div class="mkt-section-err">Unable to load — check console for details</div>
    </div>`}async function V(t){t.innerHTML=`
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
            <table class="mkt-table"><tbody>${y(6)}</tbody></table>
          </div>`).join("")}
      </div>
    </section>

    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds"><div class="mkt-panel"><div class="mkt-panel-label">Bond Yields</div><table class="mkt-table"><tbody>${y(10,3)}</tbody></table></div></div>
      <div id="mkt-fx"><div class="mkt-panel"><div class="mkt-panel-label">FX Rates</div><table class="mkt-table"><tbody>${y(8,3)}</tbody></table></div></div>
    </section>

    <section class="mkt-section mkt-two-col">
      <div id="mkt-commodities"><div class="mkt-panel"><div class="mkt-panel-label">Commodities</div><table class="mkt-table"><tbody>${y(8,3)}</tbody></table></div></div>
      <div id="mkt-sectors"><div class="mkt-panel"><div class="mkt-panel-label">US Equity Sectors</div><table class="mkt-table"><tbody>${y(11,5)}</tbody></table></div></div>
    </section>
  `;const s=t.querySelector("#mkt-refresh");async function a(){const e=t.querySelector("#mkt-timestamp");e.textContent="Loading…";const[n,l,i,r,c]=await Promise.all([f(C),f(E.map(d=>d.symbol)),f(U.map(d=>d.symbol)),f(L.map(d=>d.symbol)),f(w)]),m=t.querySelector("#mkt-equities"),u=new Map;m.innerHTML=Object.entries(D).map(([d,M])=>A(d,M,n,u)).join("");const b=t.querySelector("#mkt-bonds"),h=t.querySelector("#mkt-fx"),v=t.querySelector("#mkt-commodities"),p=t.querySelector("#mkt-sectors");b.innerHTML=l.size?K(l):k("Bond Yields"),h.innerHTML=i.size?Q(i):k("FX Rates"),v.innerHTML=r.size?W(r):k("Commodities"),p.innerHTML=c.size?F(c,u):k("US Equity Sectors");const H=[...C,...w];J(H).then(d=>{t.isConnected&&(m.innerHTML=Object.entries(D).map(([M,N])=>A(M,N,n,d)).join(""),c.size&&(p.innerHTML=F(c,d)))});const O=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});e.textContent=`Updated ${O}`}s.addEventListener("click",a),await a();const o=setInterval(a,6e4);return()=>clearInterval(o)}function Z(t){t.innerHTML=`
    <div class="placeholder-view">
      <div class="placeholder-icon">📈</div>
      <div class="placeholder-title">Single Stock Analysis</div>
      <p class="placeholder-body">
        Search for any stock to see price history, key metrics, financials,
        analyst estimates, and more. Coming soon.
      </p>
    </div>
  `}function tt(t){t.innerHTML=`
    <div class="placeholder-view">
      <div class="placeholder-icon">💼</div>
      <div class="placeholder-title">Portfolio Analysis</div>
      <p class="placeholder-body">
        Track your holdings, view allocation breakdowns, monitor performance
        vs benchmarks, and analyse risk. Coming soon.
      </p>
    </div>
  `}const et=["market","stock","portfolio"],st={market:"Markets",stock:"Stock Analysis",portfolio:"Portfolio"};let S="market",g=null;function nt(t){t.innerHTML=`
    <div class="topbar">
      <div class="topbar-left">
        <div class="logo">invest<span>.</span>dash</div>
      </div>
      <div class="topbar-center">
        <div class="tabs" id="main-tabs">
          ${et.map(e=>`
            <button class="tab ${e===S?"active":""}" data-tab="${e}">
              ${st[e]}
            </button>`).join("")}
        </div>
      </div>
      <div class="topbar-right"></div>
    </div>

    <div class="main-content" id="tab-content"></div>
  `;const s=t.querySelector("#main-tabs"),a=t.querySelector("#tab-content");function o(e){e!==S&&(S=e,s.querySelectorAll(".tab").forEach(n=>{n.classList.toggle("active",n.dataset.tab===e)}),I(a,e))}s.addEventListener("click",e=>{const n=e.target.closest(".tab");n&&o(n.dataset.tab)}),I(a,S)}function I(t,s){g&&(g(),g=null),t.innerHTML="",s==="market"?V(t).then(a=>{g=a??null}):s==="stock"?Z(t):s==="portfolio"&&tt(t)}nt(document.getElementById("app"));
