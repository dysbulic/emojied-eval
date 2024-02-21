import{r as a,j as e,L as y}from"./index-a8h7Vdce.js";import{u as k}from"./utils-RhknTK99.js";import{H as q}from"./index-N-paeFtZ.js";import{f as p}from"./form.module-BEYuJkRC.js";import{u as N}from"./useQuery-0fXINSu8.js";import"./index-AsRL7gF_.js";const L="_form_1b9hj_1",T="_buttons_1b9hj_36",F="_noneOption_1b9hj_46",R="_split_1b9hj_52",_={form:L,buttons:T,noneOption:F,split:R},S=a.forwardRef(({video:t,onClose:i},s)=>{const{supabase:c}=k(),u=a.useRef(null),l=a.useCallback(()=>{var o,r;(o=u.current)==null||o.reset(),s instanceof Function||(r=s==null?void 0:s.current)==null||r.close(),i==null||i()},[s,i]);a.useEffect(()=>{if(!(s instanceof Function)){const o=l,r=s==null?void 0:s.current;return r==null||r.addEventListener("close",o),()=>r==null?void 0:r.removeEventListener("close",o)}},[l,s]);const h=async o=>{if(!c)throw new Error("Supabase not defined.");const r=o.currentTarget.elements,m={id:t==null?void 0:t.id,url:r.url.value,title:r.title.value,description:r.description.value},n=document.createElement("video");m.duration=await new Promise(V=>{n.addEventListener("loadedmetadata",()=>{var w;V(((w=new Date(n.duration*1e3).toISOString().split("T").at(-1))==null?void 0:w.replace(/\w$/g,""))??null)}),n.src=m.url});const{data:j,error:x}=await c.from("videos").upsert(m).select("id").single()??{};if(x)throw x;await c.from("feedback_groups_videos").upsert({video_id:j.id,group_id:r.group.value}),l()},{isLoading:b,error:f,data:d}=N({queryKey:["VideoForm",{supabase:c}],enabled:!!c,queryFn:async()=>{const{data:o,error:r}=await(c==null?void 0:c.from("feedback_groups").select())??{};if(r)throw r;return o}});if(f)throw f;return e.jsx("dialog",{ref:s,className:_.dialog,children:e.jsxs("form",{onSubmit:h,method:"dialog",className:p.form,ref:u,children:[e.jsxs("label",{children:[e.jsx("h3",{children:"URL"}),e.jsx("input",{id:"url",defaultValue:(t==null?void 0:t.url)??"",required:!0})]}),e.jsxs("label",{children:[e.jsx("h3",{children:"Title"}),e.jsx("input",{id:"title",defaultValue:(t==null?void 0:t.title)??"",required:!0})]}),e.jsxs("label",{children:[e.jsx("h3",{children:"Description"}),e.jsx("textarea",{id:"description",defaultValue:(t==null?void 0:t.description)??""})]}),e.jsxs("label",{children:[e.jsx("h3",{className:_.split,children:"Feedback Group"}),b?e.jsx("p",{children:"Loading…"}):e.jsxs("select",{id:"group",children:[e.jsx("option",{value:"",className:_.noneOption,children:"None"}),d==null?void 0:d.map(o=>e.jsx("option",{value:o.id,children:o.title},o.id))]})]}),e.jsxs("div",{className:p.buttons,children:[e.jsx("button",{type:"button",onClick:l,className:p.cancel,children:"Cancel"}),e.jsx("button",{className:p.submit,children:t?"Update":"Create"})]})]})})}),$=S,C="_header_j4aje_1",O="_olTable_j4aje_6",E={header:C,olTable:O},g=t=>N({queryKey:["Videos",t],enabled:!!t,queryFn:async()=>{const{data:i,error:s}=await(t==null?void 0:t.from("videos").select())??{};if(s)throw s;return i}}),M=()=>{const t=a.useRef(null),{supabase:i,error:s}=k(),{isLoading:c,error:u,data:l,refetch:h}=g(i),[b,f]=a.useState(null),d=async()=>{var n;(n=t.current)==null||n.showModal()},o=a.useCallback(()=>{f(null),h()},[h]),r=n=>{const j=l==null?void 0:l.find(x=>x.id===n);if(!j)throw new Error(`No video found with id: "${n}".`);f(j),d()},m=async n=>{await(i==null?void 0:i.from("videos").delete().eq("id",n)),h()};if(s)throw s;if(u)throw u;return e.jsxs("article",{id:E.outer,children:[e.jsxs(q,{children:[e.jsx("h1",{children:"Videos"}),e.jsx("button",{onClick:d,className:"square",children:"➕"})]}),e.jsx($,{video:b,onClose:o,ref:t}),e.jsx("main",{className:E.olTable,children:c?e.jsx("p",{children:"Loading…"}):e.jsx("ol",{children:l==null?void 0:l.map(n=>e.jsxs("li",{children:[e.jsx("h2",{children:e.jsx(y,{to:`/eval/${n.id}`,children:n.title})}),e.jsx("div",{children:n.description}),e.jsxs("nav",{children:[e.jsx("button",{onClick:()=>r(n.id),children:"🖉"}),e.jsx("button",{onClick:()=>m(n.id),children:"➖"}),e.jsx(y,{to:`/score/${n.id}`,children:"🎼"})]})]},n.id))})})]})};export{M as Videos,M as default};
