import{at as fe}from"./index-eFzJyrav.js";const me=Symbol(),ee=Object.getPrototypeOf,X=new WeakMap,he=e=>e&&(X.has(e)?X.get(e):ee(e)===Object.prototype||ee(e)===Array.prototype),ge=e=>he(e)&&e[me]||null,te=(e,t=!0)=>{X.set(e,t)};var J={VITE_ALCHEMY_ID:"yIH2hAfvU0sA__X8yYa4qhxU3a_tJxQj",VITE_WALLETCONNECT_PROJECT_ID:"ed8055fa4b4886cc16443be453561d53",VITE_SUPABASE_URL:"https://jurofxjocjfgtkcwofmn.supabase.co",VITE_SUPABASE_ANON_KEY:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cm9meGpvY2pmZ3RrY3dvZm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ0MjczNTIsImV4cCI6MjAyMDAwMzM1Mn0.unXmSPFwSoez0wZiWlBTTM1zMJz4vC8h59nSgexal_k",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1};const H=e=>typeof e=="object"&&e!==null,A=new WeakMap,x=new WeakSet,be=(e=Object.is,t=(n,g)=>new Proxy(n,g),s=n=>H(n)&&!x.has(n)&&(Array.isArray(n)||!(Symbol.iterator in n))&&!(n instanceof WeakMap)&&!(n instanceof WeakSet)&&!(n instanceof Error)&&!(n instanceof Number)&&!(n instanceof Date)&&!(n instanceof String)&&!(n instanceof RegExp)&&!(n instanceof ArrayBuffer),r=n=>{switch(n.status){case"fulfilled":return n.value;case"rejected":throw n.reason;default:throw n}},l=new WeakMap,c=(n,g,w=r)=>{const y=l.get(n);if((y==null?void 0:y[0])===g)return y[1];const I=Array.isArray(n)?[]:Object.create(Object.getPrototypeOf(n));return te(I,!0),l.set(n,[g,I]),Reflect.ownKeys(n).forEach(D=>{if(Object.getOwnPropertyDescriptor(I,D))return;const O=Reflect.get(n,D),j={value:O,enumerable:!0,configurable:!0};if(x.has(O))te(O,!1);else if(O instanceof Promise)delete j.value,j.get=()=>w(O);else if(A.has(O)){const[b,K]=A.get(O);j.value=c(b,K(),w)}Object.defineProperty(I,D,j)}),Object.preventExtensions(I)},m=new WeakMap,f=[1,1],W=n=>{if(!H(n))throw new Error("object required");const g=m.get(n);if(g)return g;let w=f[0];const y=new Set,I=(a,i=++f[0])=>{w!==i&&(w=i,y.forEach(o=>o(a,i)))};let D=f[1];const O=(a=++f[1])=>(D!==a&&!y.size&&(D=a,b.forEach(([i])=>{const o=i[1](a);o>w&&(w=o)})),w),j=a=>(i,o)=>{const h=[...i];h[1]=[a,...h[1]],I(h,o)},b=new Map,K=(a,i)=>{if((J?"production":void 0)!=="production"&&b.has(a))throw new Error("prop listener already exists");if(y.size){const o=i[3](j(a));b.set(a,[i,o])}else b.set(a,[i])},G=a=>{var i;const o=b.get(a);o&&(b.delete(a),(i=o[1])==null||i.call(o))},ue=a=>(y.add(a),y.size===1&&b.forEach(([o,h],P)=>{if((J?"production":void 0)!=="production"&&h)throw new Error("remove already exists");const N=o[3](j(P));b.set(P,[o,N])}),()=>{y.delete(a),y.size===0&&b.forEach(([o,h],P)=>{h&&(h(),b.set(P,[o]))})}),Y=Array.isArray(n)?[]:Object.create(Object.getPrototypeOf(n)),V=t(Y,{deleteProperty(a,i){const o=Reflect.get(a,i);G(i);const h=Reflect.deleteProperty(a,i);return h&&I(["delete",[i],o]),h},set(a,i,o,h){const P=Reflect.has(a,i),N=Reflect.get(a,i,h);if(P&&(e(N,o)||m.has(o)&&e(N,m.get(o))))return!0;G(i),H(o)&&(o=ge(o)||o);let $=o;if(o instanceof Promise)o.then(C=>{o.status="fulfilled",o.value=C,I(["resolve",[i],C])}).catch(C=>{o.status="rejected",o.reason=C,I(["reject",[i],C])});else{!A.has(o)&&s(o)&&($=W(o));const C=!x.has($)&&A.get($);C&&K(i,C)}return Reflect.set(a,i,$,h),I(["set",[i],o,N]),!0}});m.set(n,V);const pe=[Y,O,c,ue];return A.set(V,pe),Reflect.ownKeys(n).forEach(a=>{const i=Object.getOwnPropertyDescriptor(n,a);"value"in i&&(V[a]=n[a],delete i.value,delete i.writable),Object.defineProperty(Y,a,i)}),V})=>[W,A,x,e,t,s,r,l,c,m,f],[ye]=be();function M(e={}){return ye(e)}function _(e,t,s){const r=A.get(e);(J?"production":void 0)!=="production"&&!r&&console.warn("Please use proxy object");let l;const c=[],m=r[3];let f=!1;const n=m(g=>{if(c.push(g),s){t(c.splice(0));return}l||(l=Promise.resolve().then(()=>{l=void 0,f&&t(c.splice(0))}))});return f=!0,()=>{f=!1,n()}}function Ie(e,t){const s=A.get(e);(J?"production":void 0)!=="production"&&!s&&console.warn("Please use proxy object");const[r,l,c]=s;return c(r,l(),t)}const d=M({history:["ConnectWallet"],view:"ConnectWallet",data:void 0}),de={state:d,subscribe(e){return _(d,()=>e(d))},push(e,t){e!==d.view&&(d.view=e,t&&(d.data=t),d.history.push(e))},reset(e){d.view=e,d.history=[e]},replace(e){d.history.length>1&&(d.history[d.history.length-1]=e,d.view=e)},goBack(){if(d.history.length>1){d.history.pop();const[e]=d.history.slice(-1);d.view=e}},setData(e){d.data=e}},p={WALLETCONNECT_DEEPLINK_CHOICE:"WALLETCONNECT_DEEPLINK_CHOICE",WCM_VERSION:"WCM_VERSION",RECOMMENDED_WALLET_AMOUNT:9,isMobile(){return typeof window<"u"?!!(window.matchMedia("(pointer:coarse)").matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)):!1},isAndroid(){return p.isMobile()&&navigator.userAgent.toLowerCase().includes("android")},isIos(){const e=navigator.userAgent.toLowerCase();return p.isMobile()&&(e.includes("iphone")||e.includes("ipad"))},isHttpUrl(e){return e.startsWith("http://")||e.startsWith("https://")},isArray(e){return Array.isArray(e)&&e.length>0},formatNativeUrl(e,t,s){if(p.isHttpUrl(e))return this.formatUniversalUrl(e,t,s);let r=e;r.includes("://")||(r=e.replaceAll("/","").replaceAll(":",""),r=`${r}://`),r.endsWith("/")||(r=`${r}/`),this.setWalletConnectDeepLink(r,s);const l=encodeURIComponent(t);return`${r}wc?uri=${l}`},formatUniversalUrl(e,t,s){if(!p.isHttpUrl(e))return this.formatNativeUrl(e,t,s);let r=e;r.endsWith("/")||(r=`${r}/`),this.setWalletConnectDeepLink(r,s);const l=encodeURIComponent(t);return`${r}wc?uri=${l}`},async wait(e){return new Promise(t=>{setTimeout(t,e)})},openHref(e,t){window.open(e,t,"noreferrer noopener")},setWalletConnectDeepLink(e,t){try{localStorage.setItem(p.WALLETCONNECT_DEEPLINK_CHOICE,JSON.stringify({href:e,name:t}))}catch{console.info("Unable to set WalletConnect deep link")}},setWalletConnectAndroidDeepLink(e){try{const[t]=e.split("?");localStorage.setItem(p.WALLETCONNECT_DEEPLINK_CHOICE,JSON.stringify({href:t,name:"Android"}))}catch{console.info("Unable to set WalletConnect android deep link")}},removeWalletConnectDeepLink(){try{localStorage.removeItem(p.WALLETCONNECT_DEEPLINK_CHOICE)}catch{console.info("Unable to remove WalletConnect deep link")}},setModalVersionInStorage(){try{typeof localStorage<"u"&&localStorage.setItem(p.WCM_VERSION,"2.6.2")}catch{console.info("Unable to set Web3Modal version in storage")}},getWalletRouterData(){var e;const t=(e=de.state.data)==null?void 0:e.Wallet;if(!t)throw new Error('Missing "Wallet" view data');return t}},ve=typeof location<"u"&&(location.hostname.includes("localhost")||location.protocol.includes("https")),u=M({enabled:ve,userSessionId:"",events:[],connectedWalletId:void 0}),we={state:u,subscribe(e){return _(u.events,()=>e(Ie(u.events[u.events.length-1])))},initialize(){u.enabled&&typeof(crypto==null?void 0:crypto.randomUUID)<"u"&&(u.userSessionId=crypto.randomUUID())},setConnectedWalletId(e){u.connectedWalletId=e},click(e){if(u.enabled){const t={type:"CLICK",name:e.name,userSessionId:u.userSessionId,timestamp:Date.now(),data:e};u.events.push(t)}},track(e){if(u.enabled){const t={type:"TRACK",name:e.name,userSessionId:u.userSessionId,timestamp:Date.now(),data:e};u.events.push(t)}},view(e){if(u.enabled){const t={type:"VIEW",name:e.name,userSessionId:u.userSessionId,timestamp:Date.now(),data:e};u.events.push(t)}}},E=M({chains:void 0,walletConnectUri:void 0,isAuth:!1,isCustomDesktop:!1,isCustomMobile:!1,isDataLoaded:!1,isUiLoaded:!1}),v={state:E,subscribe(e){return _(E,()=>e(E))},setChains(e){E.chains=e},setWalletConnectUri(e){E.walletConnectUri=e},setIsCustomDesktop(e){E.isCustomDesktop=e},setIsCustomMobile(e){E.isCustomMobile=e},setIsDataLoaded(e){E.isDataLoaded=e},setIsUiLoaded(e){E.isUiLoaded=e},setIsAuth(e){E.isAuth=e}},z=M({projectId:"",mobileWallets:void 0,desktopWallets:void 0,walletImages:void 0,chains:void 0,enableAuthMode:!1,enableExplorer:!0,explorerExcludedWalletIds:void 0,explorerRecommendedWalletIds:void 0,termsOfServiceUrl:void 0,privacyPolicyUrl:void 0}),k={state:z,subscribe(e){return _(z,()=>e(z))},setConfig(e){var t,s;we.initialize(),v.setChains(e.chains),v.setIsAuth(!!e.enableAuthMode),v.setIsCustomMobile(!!((t=e.mobileWallets)!=null&&t.length)),v.setIsCustomDesktop(!!((s=e.desktopWallets)!=null&&s.length)),p.setModalVersionInStorage(),Object.assign(z,e)}};var Ee=Object.defineProperty,se=Object.getOwnPropertySymbols,Le=Object.prototype.hasOwnProperty,Oe=Object.prototype.propertyIsEnumerable,ne=(e,t,s)=>t in e?Ee(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,We=(e,t)=>{for(var s in t||(t={}))Le.call(t,s)&&ne(e,s,t[s]);if(se)for(var s of se(t))Oe.call(t,s)&&ne(e,s,t[s]);return e};const F="https://explorer-api.walletconnect.com",Q="wcm",q="js-2.6.2";async function B(e,t){const s=We({sdkType:Q,sdkVersion:q},t),r=new URL(e,F);return r.searchParams.append("projectId",k.state.projectId),Object.entries(s).forEach(([l,c])=>{c&&r.searchParams.append(l,String(c))}),(await fetch(r)).json()}const S={async getDesktopListings(e){return B("/w3m/v1/getDesktopListings",e)},async getMobileListings(e){return B("/w3m/v1/getMobileListings",e)},async getInjectedListings(e){return B("/w3m/v1/getInjectedListings",e)},async getAllListings(e){return B("/w3m/v1/getAllListings",e)},getWalletImageUrl(e){return`${F}/w3m/v1/getWalletImage/${e}?projectId=${k.state.projectId}&sdkType=${Q}&sdkVersion=${q}`},getAssetImageUrl(e){return`${F}/w3m/v1/getAssetImage/${e}?projectId=${k.state.projectId}&sdkType=${Q}&sdkVersion=${q}`}};var Ce=Object.defineProperty,oe=Object.getOwnPropertySymbols,Ae=Object.prototype.hasOwnProperty,Me=Object.prototype.propertyIsEnumerable,re=(e,t,s)=>t in e?Ce(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,je=(e,t)=>{for(var s in t||(t={}))Ae.call(t,s)&&re(e,s,t[s]);if(oe)for(var s of oe(t))Me.call(t,s)&&re(e,s,t[s]);return e};const ie=p.isMobile(),L=M({wallets:{listings:[],total:0,page:1},search:{listings:[],total:0,page:1},recomendedWallets:[]}),Re={state:L,async getRecomendedWallets(){const{explorerRecommendedWalletIds:e,explorerExcludedWalletIds:t}=k.state;if(e==="NONE"||t==="ALL"&&!e)return L.recomendedWallets;if(p.isArray(e)){const s={recommendedIds:e.join(",")},{listings:r}=await S.getAllListings(s),l=Object.values(r);l.sort((c,m)=>{const f=e.indexOf(c.id),W=e.indexOf(m.id);return f-W}),L.recomendedWallets=l}else{const{chains:s,isAuth:r}=v.state,l=s==null?void 0:s.join(","),c=p.isArray(t),m={page:1,sdks:r?"auth_v1":void 0,entries:p.RECOMMENDED_WALLET_AMOUNT,chains:l,version:2,excludedIds:c?t.join(","):void 0},{listings:f}=ie?await S.getMobileListings(m):await S.getDesktopListings(m);L.recomendedWallets=Object.values(f)}return L.recomendedWallets},async getWallets(e){const t=je({},e),{explorerRecommendedWalletIds:s,explorerExcludedWalletIds:r}=k.state,{recomendedWallets:l}=L;if(r==="ALL")return L.wallets;l.length?t.excludedIds=l.map(w=>w.id).join(","):p.isArray(s)&&(t.excludedIds=s.join(",")),p.isArray(r)&&(t.excludedIds=[t.excludedIds,r].filter(Boolean).join(",")),v.state.isAuth&&(t.sdks="auth_v1");const{page:c,search:m}=e,{listings:f,total:W}=ie?await S.getMobileListings(t):await S.getDesktopListings(t),n=Object.values(f),g=m?"search":"wallets";return L[g]={listings:[...L[g].listings,...n],total:W,page:c??1},{listings:n,total:W}},getWalletImageUrl(e){return S.getWalletImageUrl(e)},getAssetImageUrl(e){return S.getAssetImageUrl(e)},resetSearch(){L.search={listings:[],total:0,page:1}}},T=M({open:!1}),Z={state:T,subscribe(e){return _(T,()=>e(T))},async open(e){return new Promise(t=>{const{isUiLoaded:s,isDataLoaded:r}=v.state;if(p.removeWalletConnectDeepLink(),v.setWalletConnectUri(e==null?void 0:e.uri),v.setChains(e==null?void 0:e.chains),de.reset("ConnectWallet"),s&&r)T.open=!0,t();else{const l=setInterval(()=>{const c=v.state;c.isUiLoaded&&c.isDataLoaded&&(clearInterval(l),T.open=!0,t())},200)}})},close(){T.open=!1}};var Se=Object.defineProperty,ae=Object.getOwnPropertySymbols,Ue=Object.prototype.hasOwnProperty,_e=Object.prototype.propertyIsEnumerable,le=(e,t,s)=>t in e?Se(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,De=(e,t)=>{for(var s in t||(t={}))Ue.call(t,s)&&le(e,s,t[s]);if(ae)for(var s of ae(t))_e.call(t,s)&&le(e,s,t[s]);return e};function Pe(){return typeof matchMedia<"u"&&matchMedia("(prefers-color-scheme: dark)").matches}const R=M({themeMode:Pe()?"dark":"light"}),ce={state:R,subscribe(e){return _(R,()=>e(R))},setThemeConfig(e){const{themeMode:t,themeVariables:s}=e;t&&(R.themeMode=t),s&&(R.themeVariables=De({},s))}},U=M({open:!1,message:"",variant:"success"}),Ve={state:U,subscribe(e){return _(U,()=>e(U))},openToast(e,t){U.open=!0,U.message=e,U.variant=t},closeToast(){U.open=!1}};class Te{constructor(t){this.openModal=Z.open,this.closeModal=Z.close,this.subscribeModal=Z.subscribe,this.setTheme=ce.setThemeConfig,ce.setThemeConfig(t),k.setConfig(t),this.initUi()}async initUi(){if(typeof window<"u"){await fe(()=>import("./index-eTAMcZic.js"),__vite__mapDeps([0,1,2]));const t=document.createElement("wcm-modal");document.body.insertAdjacentElement("beforeend",t),v.setIsUiLoaded(!0)}}}const $e=Object.freeze(Object.defineProperty({__proto__:null,WalletConnectModal:Te},Symbol.toStringTag,{value:"Module"}));export{we as R,de as T,p as a,$e as i,ce as n,Ve as o,v as p,Z as s,Re as t,k as y};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/index-eTAMcZic.js","assets/index-eFzJyrav.js","assets/index-dUqCzfat.css"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}