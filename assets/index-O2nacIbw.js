import{r as s,j as c}from"./index-m5OJZ77t.js";import{a as x,R as y}from"./index-wZjCaIRG.js";import{e as S}from"./utils-i3GMXlaZ.js";import"./useQuery-fgC45wca.js";const j="_output_zgb7v_1",v="_reactions_zgb7v_1",u={output:j,reactions:v},b=()=>{const a=s.useRef(null),[i,l]=s.useState([]),[p,r]=s.useState(!1),[e,m]=s.useState(),f=t=>{const o=S(t.image,{key:`${Date.now()}`,style:{position:"absolute",left:`${e==null?void 0:e.x}%`,top:`${e==null?void 0:e.y}%`,translate:"-50% -50%"}});l(n=>[...n,o])},d=t=>{var o,n;r(!1),m(t),(o=a.current)!=null&&o.open||(n=a.current)==null||n.showModal()};return s.useEffect(()=>{const t=()=>r(!0);return document.addEventListener("keyup",t),()=>{document.removeEventListener("keyup",t)}},[]),c.jsxs("article",{id:u.reactions,children:[c.jsx(x,{onSelect:d,active:p}),c.jsx(y,{ref:a,onSelect:f}),c.jsx("section",{className:u.output,children:i.map(t=>t)})]})};export{b as Reactions,b as default};