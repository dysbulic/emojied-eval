import{u as c,j as s,L as n}from"./index-D4CTEBZ-.js";import{u as l}from"./utils-8aVrX_ZJ.js";import{L as o,H as j}from"./index-LiItE4P8.js";import"./index-rwhNsM-d.js";const x="_main_sjzx2_1",d="_mainnav_sjzx2_1",i={main:x,mainnav:d},f=()=>{const{supabase:a,error:r}=l(),{isSignedIn:t}=c();let e;return t?r?e=s.jsxs("p",{children:["Supabase Error: ",r]}):a?a.auth.getUser()==null&&(e=s.jsx(o,{className:i.main})):e=s.jsx("p",{children:"Connecting to Supabase…"}):e=s.jsx(o,{}),e?s.jsxs("section",{id:i.home,className:i.main,children:[s.jsx("object",{data:"/banner.svg"}),e]}):s.jsxs("section",{children:[s.jsx(j,{}),s.jsx("main",{children:s.jsx("nav",{children:s.jsxs("ul",{id:i.mainnav,children:[s.jsx("li",{children:s.jsx(n,{to:"/videos",children:"Videos"})}),s.jsx("li",{children:s.jsx(n,{to:"/reactions",children:"Reactions"})}),s.jsx("li",{children:s.jsx(n,{to:"/config",children:"Configure"})}),s.jsx("li",{children:s.jsx(n,{to:"/selector",children:"Reaction Selector"})})]})})})]})};export{f as Home,f as default};
