(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const l of e)if(l.type==="childList")for(const s of l.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function o(e){const l={};return e.integrity&&(l.integrity=e.integrity),e.referrerPolicy&&(l.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?l.credentials="include":e.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function n(e){if(e.ep)return;e.ep=!0;const l=o(e);fetch(e.href,l)}})();const ot="https://yf-proxy.lukewynd.workers.dev";function rt(t){return`${ot}${t}`}function vt(t){const a=encodeURIComponent(t);return`${ot}/v8/finance/chart/${a}?range=ytd&interval=1d`}const tt=new Map,ht=5*60*1e3;async function ft(t){var o,n,e,l,s;const a=tt.get(t);if(a&&Date.now()-a.ts<ht)return a.data;try{const i=await fetch(vt(t),{headers:{Accept:"application/json"}});if(!i.ok)return null;const r=await i.json(),m=(n=(o=r==null?void 0:r.chart)==null?void 0:o.result)==null?void 0:n[0];if(!m)return null;const u=m.meta,b=((s=(l=(e=m.indicators)==null?void 0:e.quote)==null?void 0:l[0])==null?void 0:s.close)??[],h=b.find(w=>w!=null),v=[...b].reverse().find(w=>w!=null),k=h!=null&&v!=null&&h!==0?(v-h)/h*100:null,g=u.regularMarketPrice??null,p=u.chartPreviousClose??null,S=g!=null&&p!=null&&p!==0?(g-p)/p*100:null,L=g!=null&&p!=null?g-p:null,$={symbol:t,regularMarketPrice:g,regularMarketChangePercent:S,regularMarketChange:L,chartPreviousClose:p,quoteType:u.instrumentType??"",ytdPct:k};return tt.set(t,{ts:Date.now(),data:$}),$}catch{return null}}async function yt(t){const o=new Map;for(let n=0;n<t.length;n+=8){const e=t.slice(n,n+8),l=await Promise.allSettled(e.map(s=>ft(s)));e.forEach((s,i)=>{const r=l[i].status==="fulfilled"?l[i].value:null;r&&o.set(s,r)})}return o}const ct={Americas:[{symbol:"^GSPC",name:"S&P 500"},{symbol:"^IXIC",name:"NASDAQ"},{symbol:"^DJI",name:"Dow Jones"},{symbol:"^RUT",name:"Russell 2000"},{symbol:"^BVSP",name:"Bovespa"},{symbol:"^MXX",name:"IPC Mexico"}],Europe:[{symbol:"^FTSE",name:"FTSE 100"},{symbol:"^GDAXI",name:"DAX"},{symbol:"^FCHI",name:"CAC 40"},{symbol:"^STOXX50E",name:"Euro Stoxx 50"},{symbol:"^SSMI",name:"SMI"},{symbol:"^AEX",name:"AEX"}],"Asia-Pacific":[{symbol:"^N225",name:"Nikkei 225"},{symbol:"^HSI",name:"Hang Seng"},{symbol:"000001.SS",name:"Shanghai"},{symbol:"^AXJO",name:"ASX 200"},{symbol:"^KS11",name:"KOSPI"},{symbol:"^STI",name:"Straits Times"}]},_=[{symbol:"^IRX",name:"3-Month",country:"US",flag:"🇺🇸"},{symbol:"^FVX",name:"5-Year",country:"US",flag:"🇺🇸"},{symbol:"^TNX",name:"10-Year",country:"US",flag:"🇺🇸"},{symbol:"^TYX",name:"30-Year",country:"US",flag:"🇺🇸"}],K=[{symbol:"EURUSD=X",name:"EUR / USD"},{symbol:"GBPUSD=X",name:"GBP / USD"},{symbol:"USDJPY=X",name:"USD / JPY"},{symbol:"AUDUSD=X",name:"AUD / USD"},{symbol:"USDCAD=X",name:"USD / CAD"},{symbol:"USDCHF=X",name:"USD / CHF"},{symbol:"USDCNY=X",name:"USD / CNY"},{symbol:"USDINR=X",name:"USD / INR"}],G=[{symbol:"GC=F",name:"Gold",unit:"/oz"},{symbol:"SI=F",name:"Silver",unit:"/oz"},{symbol:"CL=F",name:"WTI Crude",unit:"/bbl"},{symbol:"BZ=F",name:"Brent Crude",unit:"/bbl"},{symbol:"NG=F",name:"Natural Gas",unit:"/MMBtu"},{symbol:"HG=F",name:"Copper",unit:"/lb"},{symbol:"ZW=F",name:"Wheat",unit:"/bu"},{symbol:"ZC=F",name:"Corn",unit:"/bu"}],V=[{symbol:"XLK",name:"Technology"},{symbol:"XLC",name:"Communication"},{symbol:"XLY",name:"Cons. Discretionary"},{symbol:"XLF",name:"Financials"},{symbol:"XLI",name:"Industrials"},{symbol:"XLV",name:"Healthcare"},{symbol:"XLE",name:"Energy"},{symbol:"XLB",name:"Materials"},{symbol:"XLRE",name:"Real Estate"},{symbol:"XLU",name:"Utilities"},{symbol:"XLP",name:"Cons. Staples"}],gt=Object.values(ct).flat().map(t=>t.symbol),St=V.map(t=>t.symbol),kt=[...gt,..._.map(t=>t.symbol),...K.map(t=>t.symbol),...G.map(t=>t.symbol),...St];function $t(t){var n;const a=t==null?void 0:t.regularMarketPrice;return a==null?"—":((n=t.symbol)==null?void 0:n.startsWith("^"))&&a<30?a.toFixed(2)+"%":a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}function I(t){return t==null?{text:"—",cls:""}:{text:`${t>=0?"+":""}${t.toFixed(2)}%`,cls:t>=0?"up":"dn"}}function J(t){return I((t==null?void 0:t.regularMarketChangePercent)??null)}function wt(t){const a=t==null?void 0:t.regularMarketChange;if(a==null)return{text:"—",cls:""};const o=Math.round(a*100);return{text:`${o>=0?"+":""}${o}bps`,cls:o>=0?"up":"dn"}}function O(t){return`<td class="num ${t.cls}">${t.text}</td>`}function x(t,a=4){return Array.from({length:t},()=>`<tr>${Array.from({length:a},()=>'<td><span class="skel"></span></td>').join("")}</tr>`).join("")}function Lt(t,a,o){const n=a.map(({symbol:e,name:l})=>{const s=o.get(e),i=J(s),r=I((s==null?void 0:s.ytdPct)??null);return`<tr>
      <td class="mkt-name">${l}</td>
      <td class="num">${$t(s)}</td>
      ${O(i)}
      <td class="num ${r.cls}">${r.text}</td>
    </tr>`}).join("");return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">${t}</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Index</th><th class="num">Level</th>
          <th class="num">1D</th><th class="num">YTD</th>
        </tr></thead>
        <tbody>${n}</tbody>
      </table>
    </div>`}function Mt(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Bond Yields</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Tenor</th><th class="num">Yield</th><th class="num">1D Chg</th>
        </tr></thead>
        <tbody>${_.map(({symbol:o,name:n,flag:e,country:l})=>{const s=t.get(o),i=wt(s),r=(s==null?void 0:s.regularMarketPrice)!=null?s.regularMarketPrice.toFixed(2)+"%":"—";return`<tr>
      <td class="mkt-name"><span class="mkt-flag">${e}</span>${l} ${n}</td>
      <td class="num">${r}</td>
      ${O(i)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Et(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Rates</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Pair</th><th class="num">Rate</th><th class="num">1D</th>
        </tr></thead>
        <tbody>${K.map(({symbol:o,name:n})=>{const e=t.get(o),l=J(e),s=e==null?void 0:e.regularMarketPrice,i=["USDJPY=X","USDCNY=X","USDINR=X"].includes(o)?3:4;return`<tr>
      <td class="mkt-name">${n}</td>
      <td class="num">${s!=null?s.toFixed(i):"—"}</td>
      ${O(l)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Ct(t){return`
    <div class="mkt-panel">
      <div class="mkt-panel-label">Commodities</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Price</th><th class="num">1D</th>
        </tr></thead>
        <tbody>${G.map(({symbol:o,name:n,unit:e})=>{const l=t.get(o),s=J(l),i=l==null?void 0:l.regularMarketPrice;return`<tr>
      <td class="mkt-name">${n}</td>
      <td class="num">${i!=null?"$"+i.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—"}<span class="mkt-unit">${e}</span></td>
      ${O(s)}
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}function Dt(t){const a=V.map(({symbol:l,name:s})=>{const i=t.get(l);return{name:s,chg1d:(i==null?void 0:i.regularMarketChangePercent)??null,ytd:(i==null?void 0:i.ytdPct)??null}}),o=Math.max(.01,...a.map(l=>Math.abs(l.chg1d??0))),n=Math.max(.01,...a.map(l=>Math.abs(l.ytd??0)));return`
    <div class="mkt-panel mkt-panel-wide">
      <div class="mkt-panel-label">US Equity Sectors</div>
      <table class="mkt-table sec-table">
        <thead><tr>
          <th>Sector</th>
          <th colspan="2" class="num">1-Day</th>
          <th colspan="2" class="num">YTD</th>
        </tr></thead>
        <tbody>${a.map(({name:l,chg1d:s,ytd:i})=>{const r=I(s),m=I(i),u=s!=null?Math.abs(s)/o*100:0,b=i!=null?Math.abs(i)/n*100:0;return`<tr>
      <td class="mkt-name sec-name">${l}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${r.cls}" style="width:${u.toFixed(1)}%"></span></td>
      <td class="num ${r.cls}">${r.text}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${m.cls}" style="width:${b.toFixed(1)}%"></span></td>
      <td class="num ${m.cls}">${m.text}</td>
    </tr>`}).join("")}</tbody>
      </table>
    </div>`}async function Tt(t){t.innerHTML=`
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
        ${["Americas","Europe","Asia-Pacific"].map(l=>`
          <div class="mkt-panel">
            <div class="mkt-panel-label">${l}</div>
            <table class="mkt-table"><tbody>${x(6)}</tbody></table>
          </div>`).join("")}
      </div>
    </section>

    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds"><div class="mkt-panel"><div class="mkt-panel-label">Bond Yields</div><table class="mkt-table"><tbody>${x(4,3)}</tbody></table></div></div>
      <div id="mkt-fx"><div class="mkt-panel"><div class="mkt-panel-label">FX Rates</div><table class="mkt-table"><tbody>${x(8,3)}</tbody></table></div></div>
    </section>

    <section class="mkt-section mkt-two-col">
      <div id="mkt-commodities"><div class="mkt-panel"><div class="mkt-panel-label">Commodities</div><table class="mkt-table"><tbody>${x(8,3)}</tbody></table></div></div>
      <div id="mkt-sectors"><div class="mkt-panel"><div class="mkt-panel-label">US Equity Sectors</div><table class="mkt-table"><tbody>${x(11,5)}</tbody></table></div></div>
    </section>
  `;function a(l){return`<div class="mkt-panel"><div class="mkt-panel-label">${l}</div><div class="mkt-section-err">Unable to load — check console for details</div></div>`}const o=t.querySelector("#mkt-refresh");async function n(){const l=t.querySelector("#mkt-timestamp");l.textContent="Loading…";const s=await yt(kt);if(!t.isConnected)return;const i=t.querySelector("#mkt-equities"),r=t.querySelector("#mkt-bonds"),m=t.querySelector("#mkt-fx"),u=t.querySelector("#mkt-commodities"),b=t.querySelector("#mkt-sectors");i.innerHTML=Object.entries(ct).map(([v,k])=>Lt(v,k,s)).join(""),r.innerHTML=_.some(v=>s.has(v.symbol))?Mt(s):a("Bond Yields"),m.innerHTML=K.some(v=>s.has(v.symbol))?Et(s):a("FX Rates"),u.innerHTML=G.some(v=>s.has(v.symbol))?Ct(s):a("Commodities"),b.innerHTML=V.some(v=>s.has(v.symbol))?Dt(s):a("US Equity Sectors");const h=new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});l.textContent=`Updated ${h}`}o.addEventListener("click",n),await n();const e=setInterval(n,30*60*1e3);return()=>clearInterval(e)}const At="modulepreload",xt=function(t){return"/investment-dash/"+t},et={},Pt=function(a,o,n){let e=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),i=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));e=Promise.allSettled(o.map(r=>{if(r=xt(r),r in et)return;et[r]=!0;const m=r.endsWith(".css"),u=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${u}`))return;const b=document.createElement("link");if(b.rel=m?"stylesheet":At,m||(b.as="script"),b.crossOrigin="",b.href=r,i&&b.setAttribute("nonce",i),document.head.appendChild(b),m)return new Promise((h,v)=>{b.addEventListener("load",h),b.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${r}`)))})}))}function l(s){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=s,window.dispatchEvent(i),!i.defaultPrevented)throw s}return e.then(s=>{for(const i of s||[])i.status==="rejected"&&l(i.reason);return a().catch(l)})},N=[{label:"US (NYSE / NASDAQ)",suffix:"",example:"AAPL"},{label:"Australia (ASX)",suffix:".AX",example:"CBA.AX"},{label:"UK (LSE)",suffix:".L",example:"HSBA.L"},{label:"Canada (TSX)",suffix:".TO",example:"RY.TO"},{label:"Germany (XETRA)",suffix:".DE",example:"SAP.DE"},{label:"Japan (TSE)",suffix:".T",example:"7203.T"},{label:"Hong Kong (HKEX)",suffix:".HK",example:"0700.HK"}],W=[{label:"1W",range:"5d",interval:"1d"},{label:"1M",range:"1mo",interval:"1d"},{label:"3M",range:"3mo",interval:"1d"},{label:"6M",range:"6mo",interval:"1d"},{label:"1Y",range:"1y",interval:"1d"},{label:"2Y",range:"2y",interval:"1wk"},{label:"5Y",range:"5y",interval:"1wk"},{label:"MAX",range:"max",interval:"1mo"}],Ft={ma20:{period:20,color:"#fbbf24",label:"MA 20"},ma50:{period:50,color:"#60a5fa",label:"MA 50"},ma200:{period:200,color:"#f87171",label:"MA 200"}};function dt(t,a){const o=[];for(let n=a-1;n<t.length;n++){const e=t.slice(n-a+1,n+1).reduce((l,s)=>l+s.close,0);o.push({time:t[n].time,value:+(e/a).toFixed(4)})}return o}function Ut(t,a=20,o=2){const n=dt(t,a),e=[],l=[];for(let s=0;s<n.length;s++){const i=s+a-1,r=t.slice(i-a+1,i+1).map(b=>b.close),m=n[s].value,u=Math.sqrt(r.reduce((b,h)=>b+(h-m)**2,0)/a);e.push({time:n[s].time,value:+(m+o*u).toFixed(4)}),l.push({time:n[s].time,value:+(m-o*u).toFixed(4)})}return{upper:e,mid:n,lower:l}}const at=new Map,st=new Map,mt=5*60*1e3;function Xt(t){const a=new Date(t*1e3);return`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}-${String(a.getDate()).padStart(2,"0")}`}async function nt(t,a,o){var k,g;const n=`${t}:${a}:${o}`,e=at.get(n);if(e&&Date.now()-e.ts<mt)return e.data;const l=`/v8/finance/chart/${encodeURIComponent(t)}?range=${a}&interval=${o}&includePrePost=false`,s=await fetch(rt(l),{headers:{Accept:"application/json"}});if(!s.ok)throw new Error(`HTTP ${s.status}`);const i=await s.json(),r=(g=(k=i==null?void 0:i.chart)==null?void 0:k.result)==null?void 0:g[0];if(!r)throw new Error("Symbol not found");const m=r.timestamp??[],u=r.indicators.quote[0],b=[],h=[];for(let p=0;p<m.length;p++){if(u.open[p]==null||u.close[p]==null)continue;const S=Xt(m[p]);b.push({time:S,open:+u.open[p].toFixed(4),high:+u.high[p].toFixed(4),low:+u.low[p].toFixed(4),close:+u.close[p].toFixed(4)}),h.push({time:S,value:u.volume[p]??0,color:u.close[p]>=u.open[p]?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"})}const v={candles:b,volumes:h,meta:r.meta};return at.set(n,{ts:Date.now(),data:v}),v}async function Ht(t){var i,r;const a=st.get(t);if(a&&Date.now()-a.ts<mt)return a.data;const n=`/v10/finance/quoteSummary/${encodeURIComponent(t)}?modules=price,summaryDetail,defaultKeyStatistics,financialData,assetProfile`,e=await fetch(rt(n),{headers:{Accept:"application/json"}});if(!e.ok)return null;const l=await e.json(),s=((r=(i=l==null?void 0:l.quoteSummary)==null?void 0:i.result)==null?void 0:r[0])??null;return s&&st.set(t,{ts:Date.now(),data:s}),s}const M=(t,a={})=>t==null?"—":t.toLocaleString("en-US",a),X=t=>t==null?"—":`${t>=0?"+":""}${(t*100).toFixed(2)}%`,j=t=>t==null?"—":t>=1e12?`$${(t/1e12).toFixed(2)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString()}`;function Bt(t,a){var u,b,h,v,k,g,p,S,L,$,w,C,D,T,F;if(!a){t.innerHTML='<div class="sa-no-data">Fundamental data unavailable.</div>';return}const o=a.price??{},n=a.summaryDetail??{},e=a.defaultKeyStatistics??{},l=a.financialData??{},s=a.assetProfile??{},r=[["Market Cap",j((u=o.marketCap)==null?void 0:u.raw)],["P/E (TTM)",M((b=n.trailingPE)==null?void 0:b.raw,{maximumFractionDigits:1})],["Fwd P/E",M((h=n.forwardPE)==null?void 0:h.raw,{maximumFractionDigits:1})],["EPS (TTM)",((v=e.trailingEps)==null?void 0:v.raw)!=null?`$${e.trailingEps.raw.toFixed(2)}`:"—"],["52W High",M((k=n.fiftyTwoWeekHigh)==null?void 0:k.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["52W Low",M((g=n.fiftyTwoWeekLow)==null?void 0:g.raw,{minimumFractionDigits:2,maximumFractionDigits:2})],["Div Yield",X((p=n.dividendYield)==null?void 0:p.raw)],["Beta",M((S=n.beta)==null?void 0:S.raw,{maximumFractionDigits:2})],["Revenue TTM",j((L=l.totalRevenue)==null?void 0:L.raw)],["Gross Margin",X(($=l.grossMargins)==null?void 0:$.raw)],["Op Margin",X((w=l.operatingMargins)==null?void 0:w.raw)],["ROE",X((C=l.returnOnEquity)==null?void 0:C.raw)],["P/B Ratio",M((D=e.priceToBook)==null?void 0:D.raw,{maximumFractionDigits:2})],["Avg Volume",M((T=n.averageVolume)==null?void 0:T.raw)],["Employees",M(s.fullTimeEmployees)],["Free Cash Flow",j((F=l.freeCashflow)==null?void 0:F.raw)]].map(([A,R])=>`
    <div class="sa-fund-card">
      <div class="sa-fund-label">${A}</div>
      <div class="sa-fund-val">${R}</div>
    </div>`).join(""),m=[s.sector,s.industry].filter(Boolean).map(A=>`<span class="sa-badge">${A}</span>`).join("");t.innerHTML=`
    <div class="sa-section-label">Key Metrics</div>
    <div class="sa-fund-grid">${r}</div>
    ${s.longBusinessSummary?`
      <div class="sa-about">
        <div class="sa-section-label">About ${m}</div>
        <p class="sa-about-text">${s.longBusinessSummary}</p>
      </div>`:""}
  `}function It(t,a,o){var u,b,h;const n=(o==null?void 0:o.price)??{},e=n.longName||n.shortName||(a==null?void 0:a.symbol)||"",l=((u=n.regularMarketPrice)==null?void 0:u.raw)??(a==null?void 0:a.regularMarketPrice)??0,s=(((b=n.regularMarketChangePercent)==null?void 0:b.raw)??0)*100,i=((h=n.regularMarketChange)==null?void 0:h.raw)??0,r=n.exchangeName||(a==null?void 0:a.exchangeName)||"",m=s>=0;t.innerHTML=`
    <div class="sa-hdr-left">
      <div class="sa-hdr-name">${e} <span class="sa-hdr-sym">${(a==null?void 0:a.symbol)??""}</span></div>
      <div class="sa-hdr-exch">${r}</div>
    </div>
    <div class="sa-hdr-right">
      <div class="sa-hdr-price">${l.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div class="sa-hdr-chg ${m?"up":"dn"}">${m?"+":""}${i.toFixed(2)} (${m?"+":""}${s.toFixed(2)}%)</div>
    </div>
  `}let B=null;async function lt(){return B||(B=await Pt(()=>import("./lightweight-charts.production-C-4kb1nc.js"),[])),B}async function Ot(t){const a=N.map((c,d)=>`<option value="${d}">${c.label}</option>`).join(""),o=W.map((c,d)=>`<button class="sa-range-btn${d===4?" active":""}" data-ri="${d}">${c.label}</button>`).join("");t.innerHTML=`
    <div class="sa-layout">
      <div class="sa-search-bar">
        <select class="sa-market-sel" id="sa-mkt">${a}</select>
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
  `;let n=null,e={},l=[],s=!1,i=new Set(["vol"]),r="candle",m=[],u=[],b=4,h=null,v=null;const k=t.querySelector("#sa-ph"),g=t.querySelector("#sa-main"),p=t.querySelector("#sa-hdr"),S=t.querySelector("#sa-chart"),L=t.querySelector("#sa-overlay"),$=t.querySelector("#sa-tt"),w=t.querySelector("#sa-annot-list"),C=t.querySelector("#sa-funds"),D=t.querySelector("#sa-mkt"),T=t.querySelector("#sa-ticker"),F=t.querySelector("#sa-go"),A=t.querySelector("#sa-annot-btn");async function R(){if(n)return;const{createChart:c,CrosshairMode:d}=await lt();n=c(S,{width:S.clientWidth||900,height:480,layout:{background:{color:"#0b0d14"},textColor:"#8892a4",fontSize:11,fontFamily:"'DM Mono', monospace"},grid:{vertLines:{color:"#1a1d26"},horzLines:{color:"#1a1d26"}},crosshair:{mode:d.Normal},rightPriceScale:{borderColor:"#2a2d3e"},timeScale:{borderColor:"#2a2d3e",timeVisible:!0,secondsVisible:!1}}),v=new ResizeObserver(()=>{n&&S.clientWidth&&n.resize(S.clientWidth,480)}),v.observe(S),n.subscribeCrosshairMove(y=>{var Z;if(!y.time||!y.point||!e.main){$.style.display="none";return}const f=y.seriesData.get(e.main);if(!f){$.style.display="none";return}const q="open"in f?`O <b>${f.open}</b>  H <b>${f.high}</b>  L <b>${f.low}</b>  C <b>${f.close}</b>`:`<b>${(Z=f.value)==null?void 0:Z.toFixed(4)}</b>`,Q=y.seriesData.get(e.vol),pt=Q?`  Vol <b>${M(Q.value)}</b>`:"";$.innerHTML=`<span class="sa-tt-date">${y.time}</span>  ${q}${pt}`,$.style.display="block"}),n.subscribeClick(y=>{if(!s||!y.point||!e.main)return;const f=e.main.coordinateToPrice(y.point.y);if(f==null)return;const{LineStyle:E}=B,q=e.main.createPriceLine({price:f,color:"#7c6af7",lineWidth:1,lineStyle:E.Dashed,axisLabelVisible:!0,title:f.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})});l.push({pl:q,price:f}),Y()})}async function U(){const{LineStyle:c}=await lt();Object.values(e).forEach(d=>{try{n.removeSeries(d)}catch{}}),e={},l=[],Y(),i.has("vol")&&(e.vol=n.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"vol"}),n.priceScale("vol").applyOptions({scaleMargins:{top:.82,bottom:0}}),e.vol.setData(u)),n.priceScale("right").applyOptions({scaleMargins:{top:.06,bottom:i.has("vol")?.22:.04}}),r==="candle"?(e.main=n.addCandlestickSeries({upColor:"#34d399",downColor:"#f87171",borderVisible:!1,wickUpColor:"#34d399",wickDownColor:"#f87171"}),e.main.setData(m)):(e.main=n.addLineSeries({color:"#7c6af7",lineWidth:2}),e.main.setData(m.map(d=>({time:d.time,value:d.close}))));for(const[d,y]of Object.entries(Ft))!i.has(d)||m.length<y.period||(e[d]=n.addLineSeries({color:y.color,lineWidth:1,title:y.label}),e[d].setData(dt(m,y.period)));if(i.has("bb")&&m.length>=20){const{upper:d,mid:y,lower:f}=Ut(m);e.bbU=n.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:c.Dashed}),e.bbM=n.addLineSeries({color:"rgba(124,106,247,0.4)",lineWidth:1}),e.bbL=n.addLineSeries({color:"rgba(124,106,247,0.8)",lineWidth:1,lineStyle:c.Dashed}),e.bbU.setData(d),e.bbM.setData(y),e.bbL.setData(f)}n.timeScale().fitContent()}function Y(){if(!l.length){w.innerHTML="";return}w.innerHTML=`
      <div class="sa-annot-wrap">
        <span class="sa-section-label">Price Levels</span>
        <div class="sa-annot-pills">
          ${l.map((c,d)=>`
            <span class="sa-annot-pill">
              ${c.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              <button class="sa-annot-x" data-i="${d}">×</button>
            </span>`).join("")}
        </div>
      </div>`,w.querySelectorAll(".sa-annot-x").forEach(c=>{c.addEventListener("click",()=>{const d=+c.dataset.i;try{e.main.removePriceLine(l[d].pl)}catch{}l.splice(d,1),Y()})})}async function ut(c){h=c;const{range:d,interval:y}=W[b];L.style.display="flex",k.style.display="none",g.style.display="block",p.innerHTML=`<div class="sa-hdr-loading">Loading ${c}…</div>`,C.innerHTML="";try{await R();const[f,E]=await Promise.all([nt(c,d,y),Ht(c)]);m=f.candles,u=f.volumes,It(p,f.meta,E),await U(),Bt(C,E)}catch{p.innerHTML=`<div class="sa-error">Symbol <b>${c}</b> not found or no data available.</div>`,C.innerHTML=""}finally{L.style.display="none"}}async function bt(c){if(!h)return;b=c,t.querySelectorAll(".sa-range-btn").forEach((f,E)=>f.classList.toggle("active",E===c));const{range:d,interval:y}=W[c];L.style.display="flex";try{const f=await nt(h,d,y);m=f.candles,u=f.volumes,await U()}finally{L.style.display="none"}}t.querySelectorAll(".sa-range-btn").forEach((c,d)=>c.addEventListener("click",()=>bt(d))),D.addEventListener("change",()=>{T.placeholder=`Ticker (e.g. ${N[+D.value].example})`});async function z(){const c=T.value.trim().toUpperCase(),d=N[+D.value];if(!c)return;const y=d.suffix&&!c.endsWith(d.suffix)?`${c}${d.suffix}`:c;await ut(y)}return F.addEventListener("click",z),T.addEventListener("keydown",c=>{c.key==="Enter"&&z()}),t.querySelectorAll("[data-type]").forEach(c=>c.addEventListener("click",async()=>{r=c.dataset.type,t.querySelectorAll("[data-type]").forEach(d=>d.classList.remove("active")),c.classList.add("active"),m.length&&await U()})),t.querySelectorAll("[data-ind]").forEach(c=>c.addEventListener("click",async()=>{const d=c.dataset.ind;i.has(d)?i.delete(d):i.add(d),c.classList.toggle("active",i.has(d)),m.length&&await U()})),A.addEventListener("click",()=>{s=!s,A.classList.toggle("active",s),t.querySelector("#sa-chart-wrap").classList.toggle("sa-annotating",s)}),()=>{v==null||v.disconnect(),n&&(n.remove(),n=null),e={},l=[]}}function Rt(t){t.innerHTML=`
    <div class="placeholder-view">
      <div class="placeholder-icon">💼</div>
      <div class="placeholder-title">Portfolio Analysis</div>
      <p class="placeholder-body">
        Track your holdings, view allocation breakdowns, monitor performance
        vs benchmarks, and analyse risk. Coming soon.
      </p>
    </div>
  `}const Yt=["market","stock","portfolio"],qt={market:"Markets",stock:"Stock Analysis",portfolio:"Portfolio"};let H="market",P=null;function Nt(t){t.innerHTML=`
    <div class="topbar">
      <div class="topbar-left">
        <div class="logo">invest<span>.</span>dash</div>
      </div>
      <div class="topbar-center">
        <div class="tabs" id="main-tabs">
          ${Yt.map(e=>`
            <button class="tab ${e===H?"active":""}" data-tab="${e}">
              ${qt[e]}
            </button>`).join("")}
        </div>
      </div>
      <div class="topbar-right"></div>
    </div>

    <div class="main-content" id="tab-content"></div>
  `;const a=t.querySelector("#main-tabs"),o=t.querySelector("#tab-content");function n(e){e!==H&&(H=e,a.querySelectorAll(".tab").forEach(l=>{l.classList.toggle("active",l.dataset.tab===e)}),it(o,e))}a.addEventListener("click",e=>{const l=e.target.closest(".tab");l&&n(l.dataset.tab)}),it(o,H)}function it(t,a){P&&(P(),P=null),t.innerHTML="",a==="market"?Tt(t).then(o=>{P=o??null}):a==="stock"?Ot(t).then(o=>{P=o??null}):a==="portfolio"&&Rt(t)}Nt(document.getElementById("app"));
