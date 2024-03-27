import{r as i,C as h,u as j,c as x,j as e,H as g}from"./index-Zw_OpJyE.js";const w="_form_vf9e0_1",b="_lineInput_vf9e0_17",o={form:w,lineInput:b},v=()=>{const{setConfigProp:m,config:u}=i.useContext(h),[t,c]=i.useState(),{supabase:r}=j(),{data:{image:n=null}={},error:l,refetch:d}=x({enabled:!!r,queryKey:["pfp"],queryFn:async()=>{if(!r)throw new Error("`supabase` not defined.");const{data:{user:s}}=await r.auth.getUser();if(!s)throw new Error("`user` not set.");const{data:a}=await r.from("userinfo").select("image").eq("user_id",s.id).single();return a}});if(l)throw l;i.useEffect(()=>{c(n)},[n]);const p=async s=>{if(s.preventDefault(),!r)throw new Error("`supabase` not defined.");const{data:{user:a}}=await r.auth.getUser();if(!a)throw new Error("`user` not set.");const{error:f}=await r.from("userinfo").update({image:t}).eq("user_id",a.id).select().single();if(f)throw f;d()};return console.debug({pic:n}),e.jsxs("article",{children:[e.jsx(g,{children:e.jsx("h1",{children:"Configuration"})}),e.jsx("form",{className:o.form,children:e.jsxs("label",{children:[e.jsx("h3",{children:"Emoji Size"}),e.jsx("input",{type:"range",min:"1",max:"7",step:"0.5",value:Number(u.emojiSize.replace(/[^\d.]/g,"")),title:u.emojiSize,onChange:s=>{m("emojiSize",`${s.target.value}rem`)}}),"rem",e.jsx("output",{className:"emoji",children:"😺"})]})}),e.jsxs("form",{className:o.lineInput,onSubmit:p,children:[e.jsxs("label",{className:o.lineInput,children:[e.jsx("h3",{children:"Profile Picture"}),e.jsx("input",{value:t??"",onChange:({target:{value:s}})=>c(s)})]}),e.jsx("button",{disabled:!t||n===t,children:"Save"}),t&&e.jsx("img",{className:"emoji",src:t})]})]})};export{v as Configuration,v as default};