(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[797],{67055:function(e,t,n){Promise.resolve().then(n.bind(n,35511))},35511:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return j}});var r=n(57437),s=n(2265),c=n(95790),a=n(28170),i=n(16691),o=n.n(i),l=n(24033);function u(e){let{listing:t}=e,n=(0,l.useRouter)(),s=(0,r.jsxs)("span",{children:[t.description.substring(0,100),"...",(0,r.jsx)("br",{}),(0,r.jsxs)("div",{className:"bold small-font",children:["Uploaded: ",t.created_at]})]});return(0,r.jsx)(a.Z,{className:"listing-card",onClick:()=>{n.push("/listing/".concat(t.address))},hoverable:!0,actions:[(0,r.jsxs)("div",{children:["Purchases: ",t.purchases]},"purchases"),(0,r.jsxs)("div",{children:["List Price: ",t.price]},"last sale")],cover:(0,r.jsx)(o(),{alt:t.name,width:260,height:200,src:t.image}),children:(0,r.jsx)(a.Z.Meta,{title:t.name,description:s})})}n(86260);var d=n(40155),h=n(65473),f=n(49385),g=n(23199),x=n(61927),p=n(68970);function j(){let[e,t]=(0,s.useState)(!0),[n,a]=(0,s.useState)(""),[i,o]=(0,s.useState)([]),[l,j]=(0,s.useState)([]),[b,m]=(0,s.useState)(1),[v,w]=(0,s.useState)(10);async function N(){t(!0);try{let e=await (0,g.Y9)(0,100),t=e.map(x.JI);console.log("get listings",t),o(t)}catch(e){console.error("error getting listings",e)}finally{t(!1)}}(0,s.useEffect)(()=>{if((0,x.xb)(n)){j([]);return}let e=new p.Z(i,{keys:["name","description"]}),t=e.search(n);console.log("fuse search",n,t),j(t.map(e=>e.item))},[n,i]),(0,s.useEffect)(()=>{N()},[b,v]);let y=(0,x.xb)(n)?i:l;return(0,r.jsxs)("div",{className:"container",children:[(0,r.jsxs)("div",{className:"centered",children:[(0,r.jsx)("h1",{children:"Search listings"}),(0,r.jsx)("br",{}),(0,r.jsx)(c.Z,{className:"search-input",style:{width:600},placeholder:"Search by listing name or description",onSearch:e=>a(e),enterButton:!0})]}),e&&(0,r.jsx)("div",{children:(0,r.jsx)(f.Z,{size:"large"})}),!e&&(0,r.jsx)("div",{className:"listing-section",children:y.map((e,t)=>(0,r.jsx)(u,{listing:e},t))}),(0,r.jsx)(d.Z,{}),(0,r.jsxs)("div",{className:"centered",children:[!e&&(0,x.xb)(y)&&(0,r.jsx)("div",{children:"No listings found"}),y.length>0&&(0,r.jsxs)("div",{children:[n&&(0,r.jsxs)("p",{className:"bold",children:["Search results for: ",n]}),(0,r.jsxs)("p",{className:"bold",children:["Found listings: ",y.length]})]}),(0,r.jsx)("br",{}),(0,r.jsx)(h.Z,{current:b,total:y.length,pageSize:v,onChange:e=>m(e)}),(0,r.jsx)("br",{})]})]})}},61927:function(e,t,n){"use strict";n.d(t,{$A:function(){return c},JI:function(){return p},RD:function(){return x},W:function(){return l},dX:function(){return g},g$:function(){return i},iN:function(){return d},jY:function(){return h},sN:function(){return u},xG:function(){return o},xb:function(){return f}});var r=n(86260),s=n(73760);let c=e=>e?"".concat(e.substr(0,6),"**"):"",a=e=>(e instanceof Date||(e=e?new Date(e):new Date),"".concat(e.toLocaleDateString()," ").concat(e.toLocaleTimeString())),i=e=>r.O0===e,o=(e,t)=>0===e?"Free":e?"".concat(e," ").concat(t||r.hs.symbol):"",l=(e,t)=>{let n="".concat(r._W,"/").concat(e);return t?"".concat(n,"/").concat(t):n},u=e=>"".concat(window.location.origin,"/listing/").concat(e),d=e=>13===e.length?new Date(e).toLocaleDateString():e.replace(/([A-Z])/g," $1").replace(/^./,function(e){return e.toUpperCase()}).replace(/_/g," "),h=(e,t)=>"".concat(r.hs.explorerUrl).concat(t?"tx/":"address/").concat(e).concat(31415===r.hs.id?"?network=wallaby":""),f=e=>!e||0===e.length,g=e=>(-1!==e.indexOf("404")?e="Dataset not found. Do you have the correct url? Otherwise, try creating a new dataset.":-1!==e.indexOf("network changed")&&(e="Network changed since page loaded, please refresh."),e);function x(e){if(0==e)return"0 Byte";var t=parseInt(Math.floor(Math.log(e)/Math.log(1024)));return Math.round(e/Math.pow(1024,t),2)+" "+["Bytes","KB","MB","GB","TB"][t]}let p=e=>e?{...e,created_by:c(e.created_by),created_at:a(e.created_at),price:o(s.dF(e.price+""),r.hs.symbol),verified:e.verified?"Verified":"Unverified"}:{}}},function(e){e.O(0,[941,26,691,409,44,891,664,170,220,229,773,561,22,971,596,744],function(){return e(e.s=67055)}),_N_E=e.O()}]);