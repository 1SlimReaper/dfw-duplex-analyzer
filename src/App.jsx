import { useState, useMemo, useRef } from "react";

const COUNTIES = {
  Dallas:   { rate: 0.0210, label: "Dallas (Dallas / Irving / Garland)" },
  Tarrant:  { rate: 0.0220, label: "Tarrant (Fort Worth / Arlington / Mansfield)" },
  Collin:   { rate: 0.0180, label: "Collin (Plano / Frisco / McKinney / Allen)" },
  Denton:   { rate: 0.0200, label: "Denton (Denton / Lewisville / Flower Mound)" },
  Rockwall: { rate: 0.0195, label: "Rockwall (Rockwall / Rowlett / Heath)" },
};
const RENT_BENCHMARKS = {
  Dallas:   { "1BR": [875,  1150], "2BR": [1075, 1400] },
  Tarrant:  { "1BR": [850,  1125], "2BR": [1050, 1375] },
  Collin:   { "1BR": [975,  1275], "2BR": [1225, 1600] },
  Denton:   { "1BR": [900,  1175], "2BR": [1125, 1475] },
  Rockwall: { "1BR": [950,  1225], "2BR": [1175, 1525] },
};
const CITY_RENT_BENCHMARKS = {
  dallas:{"1BR":[975,1300],"2BR":[1200,1600]},irving:{"1BR":[925,1225],"2BR":[1150,1500]},
  garland:{"1BR":[875,1125],"2BR":[1075,1375]},mesquite:{"1BR":[825,1075],"2BR":[1025,1325]},
  "grand prairie":{"1BR":[850,1100],"2BR":[1050,1375]},duncanville:{"1BR":[800,1050],"2BR":[1000,1300]},
  desoto:{"1BR":[825,1075],"2BR":[1025,1325]},lancaster:{"1BR":[775,1025],"2BR":[975,1275]},
  "cedar hill":{"1BR":[800,1050],"2BR":[1000,1300]},richardson:{"1BR":[975,1275],"2BR":[1200,1575]},
  carrollton:{"1BR":[950,1250],"2BR":[1175,1550]},rowlett:{"1BR":[925,1200],"2BR":[1150,1500]},
  seagoville:{"1BR":[750,975],"2BR":[950,1225]},"balch springs":{"1BR":[750,975],"2BR":[950,1225]},
  hutchins:{"1BR":[700,925],"2BR":[900,1175]},"fort worth":{"1BR":[875,1150],"2BR":[1075,1400]},
  arlington:{"1BR":[900,1175],"2BR":[1100,1425]},mansfield:{"1BR":[925,1200],"2BR":[1150,1475]},
  euless:{"1BR":[925,1200],"2BR":[1150,1475]},bedford:{"1BR":[900,1175],"2BR":[1125,1450]},
  hurst:{"1BR":[875,1150],"2BR":[1075,1400]},colleyville:{"1BR":[1025,1325],"2BR":[1275,1650]},
  southlake:{"1BR":[1075,1400],"2BR":[1325,1725]},grapevine:{"1BR":[1000,1300],"2BR":[1250,1625]},
  "north richland hills":{"1BR":[900,1175],"2BR":[1100,1425]},keller:{"1BR":[975,1275],"2BR":[1200,1575]},
  saginaw:{"1BR":[850,1100],"2BR":[1050,1375]},azle:{"1BR":[775,1025],"2BR":[975,1275]},
  "white settlement":{"1BR":[825,1075],"2BR":[1025,1325]},plano:{"1BR":[1025,1325],"2BR":[1275,1650]},
  frisco:{"1BR":[1075,1400],"2BR":[1325,1750]},mckinney:{"1BR":[1000,1300],"2BR":[1250,1625]},
  allen:{"1BR":[975,1275],"2BR":[1225,1575]},wylie:{"1BR":[925,1200],"2BR":[1150,1500]},
  murphy:{"1BR":[975,1275],"2BR":[1225,1575]},sachse:{"1BR":[925,1200],"2BR":[1150,1500]},
  "prosper":{"1BR":[1050,1375],"2BR":[1300,1700]},celina:{"1BR":[975,1275],"2BR":[1225,1600]},
  farmersville:{"1BR":[750,975],"2BR":[950,1225]},denton:{"1BR":[900,1175],"2BR":[1100,1425]},
  lewisville:{"1BR":[975,1250],"2BR":[1200,1550]},"flower mound":{"1BR":[1025,1325],"2BR":[1275,1650]},
  "the colony":{"1BR":[950,1225],"2BR":[1175,1525]},"little elm":{"1BR":[950,1225],"2BR":[1175,1525]},
  corinth:{"1BR":[925,1200],"2BR":[1150,1475]},"highland village":{"1BR":[975,1275],"2BR":[1200,1575]},
  argyle:{"1BR":[975,1275],"2BR":[1200,1575]},aubrey:{"1BR":[875,1150],"2BR":[1075,1400]},
  rockwall:{"1BR":[975,1250],"2BR":[1200,1575]},heath:{"1BR":[1000,1300],"2BR":[1250,1625]},
  fate:{"1BR":[900,1175],"2BR":[1125,1475]},"royse city":{"1BR":[850,1100],"2BR":[1050,1375]},
};
const CITY_TO_COUNTY = {
  dallas:"Dallas",irving:"Dallas",garland:"Dallas",mesquite:"Dallas",
  "grand prairie":"Dallas",duncanville:"Dallas",desoto:"Dallas",
  lancaster:"Dallas","cedar hill":"Dallas",richardson:"Dallas",
  carrollton:"Dallas",rowlett:"Dallas",seagoville:"Dallas",
  "balch springs":"Dallas",hutchins:"Dallas",
  "fort worth":"Tarrant",arlington:"Tarrant",mansfield:"Tarrant",
  euless:"Tarrant",bedford:"Tarrant",hurst:"Tarrant",
  colleyville:"Tarrant",southlake:"Tarrant",grapevine:"Tarrant",
  "north richland hills":"Tarrant",keller:"Tarrant",saginaw:"Tarrant",
  azle:"Tarrant","white settlement":"Tarrant",
  plano:"Collin",frisco:"Collin",mckinney:"Collin",allen:"Collin",
  wylie:"Collin",murphy:"Collin",sachse:"Collin",prosper:"Collin",
  celina:"Collin",farmersville:"Collin",
  denton:"Denton",lewisville:"Denton","flower mound":"Denton",
  "the colony":"Denton","little elm":"Denton",corinth:"Denton",
  "highland village":"Denton",argyle:"Denton",aubrey:"Denton",
  rockwall:"Rockwall",heath:"Rockwall",fate:"Rockwall","royse city":"Rockwall",
};
const GROSS_ANNUAL=110000,GROSS_MONTHLY=GROSS_ANNUAL/12,CASH_RESERVES=120000;
function estimateUnitRent({city,county,size,totalSqft,yearBuilt}){
  const cityKey=(city||"").trim().toLowerCase();
  const cityRange=CITY_RENT_BENCHMARKS[cityKey]?.[size];
  const countyRange=RENT_BENCHMARKS[county]?.[size];
  let low,high,source;
  if(cityRange){[low,high]=cityRange;source="city";}
  else if(countyRange){[low,high]=countyRange;source="county";}
  else{[low,high]=[800,1100];source="fallback";}
  const spread=high-low,perUnit=totalSqft?totalSqft/2:null;
  let factor=0.35;
  if(perUnit){
    if(size==="1BR"){if(perUnit<650)factor=0.10;else if(perUnit<=850)factor=0.35;else factor=0.65;}
    else{if(perUnit<850)factor=0.10;else if(perUnit<=1100)factor=0.35;else factor=0.65;}
  }
  let age=1.0;const yr=parseInt(yearBuilt);
  if(yr&&yr<1975)age=0.94;else if(yr&&yr<1995)age=0.97;
  return{low:Math.round(low*age),base:Math.round((low+spread*factor)*age),high:Math.round(high*age),source,perUnit:perUnit?Math.round(perUnit):null,yearBuilt:yr||null};
}
function estimatePropertyRents(row){
  const sqft=parseFloat(String(row.sqft).replace(/[^0-9.]/g,""))||null;
  const u1=estimateUnitRent({city:row.city,county:row.county,size:row.u1Size,totalSqft:sqft,yearBuilt:row.yearBuilt});
  const u2=estimateUnitRent({city:row.city,county:row.county,size:row.u2Size,totalSqft:sqft,yearBuilt:row.yearBuilt});
  return{u1,u2};
}
function pmt(principal,annualRatePct,years=30){
  const r=annualRatePct/100/12,n=years*12;
  if(!r)return principal/n;
  return(principal*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
}
function runAnalysis(price,county,u1Rent,u2Rent,u1Size,u2Size,downPct,hoaAmt,rate,pmiRate,insRate){
  const down=price*downPct/100,loan=price-down,closing=price*0.025,cashReq=down+closing;
  const pi=pmt(loan,rate),taxes=(price*(COUNTIES[county]?.rate??0.021))/12;
  const ins=(price*insRate/100)/12,mPMI=downPct<20?(loan*pmiRate/100)/12:0;
  const piti=pi+taxes+ins+mPMI+hoaAmt;
  const grossRent=u1Rent+u2Rent,egi=grossRent*0.93;
  const maint=(price*0.01)/12,capex=(price*0.02)/12,opex=maint+capex;
  const noi=egi-opex,stabCF=noi-piti;
  const u2egi=u2Rent*0.93,u2opex=opex/2,ooNet=piti-u2egi+u2opex;
  const bm=RENT_BENCHMARKS[county]??{};
  const u1Fl=bm[u1Size]&&u1Rent>bm[u1Size][1],u2Fl=bm[u2Size]&&u2Rent>bm[u2Size][1],anyFl=u1Fl||u2Fl;
  let verdict,vColor,vBg,vBdr;
  if(stabCF>=-400&&!anyFl){verdict="PASS";vColor="#177a51";vBg="#eaf5f0";vBdr="#a8d9be";}
  else if(stabCF>=-400){verdict="BORDERLINE";vColor="#966100";vBg="#fef4e0";vBdr="#e8c97a";}
  else if(stabCF>=-560){verdict="BORDERLINE";vColor="#966100";vBg="#fef4e0";vBdr="#e8c97a";}
  else{verdict="REJECTED";vColor="#b82c3a";vBg="#fdeaec";vBdr="#e8aab2";}
  const cfGap=stabCF-(-400),rentalOffset=grossRent*0.75,netDTI=Math.max(0,piti-rentalOffset);
  const dtiPctUsed=(netDTI/GROSS_MONTHLY)*100,gry=(grossRent*12)/price*100;
  const ptr=price/(grossRent*12),coc=(stabCF*12)/cashReq*100;
  return{price,down,loan,closing,cashReq,pi,taxes,ins,mPMI,piti,grossRent,u1Rent,u2Rent,egi,maint,capex,opex,noi,stabCF,u2egi,u2opex,ooNet,u1Fl,u2Fl,anyFl,verdict,vColor,vBg,vBdr,cfGap,rentalOffset,netDTI,dtiPctUsed,gry,ptr,coc};
}
function runScenarios(price,county,u1Rent,u2Rent,u1Size,u2Size,downPct,hoaAmt,rate,pmiRate,insRate){
  const cons=runAnalysis(price,county,Math.round(u1Rent*.88),Math.round(u2Rent*.88),u1Size,u2Size,downPct,hoaAmt,rate,pmiRate,insRate);
  const base=runAnalysis(price,county,u1Rent,u2Rent,u1Size,u2Size,downPct,hoaAmt,rate,pmiRate,insRate);
  const opt=runAnalysis(price,county,Math.round(u1Rent*1.1),Math.round(u2Rent*1.1),u1Size,u2Size,downPct,hoaAmt,rate,pmiRate,insRate);
  return{cons,base,opt};
}
function bedsToSizes(n){n=parseInt(n)||4;if(n<=2)return["1BR","1BR"];if(n===3)return["2BR","1BR"];return["2BR","2BR"];}
function f$(n,dec=0){if(n==null||isNaN(n))return"—";const abs=Math.abs(n).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g,",");return(n<0?"-$":"$")+abs;}
function fp(n,dec=2){return isNaN(n)?"—":n.toFixed(dec)+"%";}
const T={pageBg:"#e8edf4",surf:"#f0f3f8",card:"#ffffff",bdr:"#cdd5e0",bdrLt:"#e2e8f0",hdrBg:"#0f1f35",hdrBdr:"#1a3050",accent:"#2c6fa8",accentMd:"#3a80bc",accentLt:"#deeaf6",accentTx:"#1a4f7a",green:"#177a51",greenLt:"#eaf5f0",greenBdr:"#a8d9be",yellow:"#966100",yellowLt:"#fef4e0",yellowBdr:"#e8c97a",red:"#b82c3a",redLt:"#fdeaec",redBdr:"#e8aab2",text:"#0f1f35",textMid:"#3d5570",muted:"#6d86a0",faint:"#9db0c5",mono:"'DM Mono','Fira Code','Courier New',monospace",sans:"'DM Sans','Segoe UI','Helvetica Neue',Arial,sans-serif",shadow:"0 1px 3px rgba(15,31,53,0.08)",shadowMd:"0 4px 14px rgba(15,31,53,0.10)"};
function parseCSVLine(line){const out=[];let cur="",inQ=false;for(const c of line){if(c==='"')inQ=!inQ;else if(c===','&&!inQ){out.push(cur.trim());cur="";}else cur+=c;}out.push(cur.trim());return out;}
function parseRedfin(text){
  const lines=text.replace(/\r/g,"").split("\n").filter(l=>l.trim());
  if(lines.length<2)return{rows:[],unmapped:[]};
  const hdrs=parseCSVLine(lines[0]).map(h=>h.replace(/['"]/g,"").trim().toUpperCase());
  const ix=name=>hdrs.findIndex(h=>h.includes(name));
  const C={price:ix("PRICE"),addr:ix("ADDRESS"),city:ix("CITY"),beds:ix("BEDS"),hoa:ix("HOA"),sqft:ix("SQUARE FEET"),status:ix("STATUS"),dom:ix("DAYS ON MARKET"),url:ix("URL"),propType:ix("PROPERTY TYPE"),yearBuilt:ix("YEAR BUILT")};
  const rows=[],unmapped=new Set();
  for(let i=1;i<lines.length;i++){
    const c=parseCSVLine(lines[i]);
    const price=parseFloat(c[C.price]?.replace(/[^0-9.]/g,""));
    if(!price||price<1000)continue;
    const city=c[C.city]?.trim()||"";
    const county=CITY_TO_COUNTY[city.toLowerCase()]||null;
    if(!county)unmapped.add(city);
    const beds=parseInt(c[C.beds])||4;
    const[u1Size,u2Size]=bedsToSizes(beds);
    rows.push({address:c[C.addr]?.trim()||"Unknown",city,county:county||"Dallas",countyMapped:!!county,price,beds,hoa:parseFloat(c[C.hoa]?.replace(/[^0-9.]/g,""))||0,sqft:c[C.sqft]?.trim()||"—",status:c[C.status]?.trim()||"",dom:c[C.dom]?.trim()||"—",url:c[C.url]?.trim()||"",propType:c[C.propType]?.trim()||"",yearBuilt:c[C.yearBuilt]?.trim()||"—",u1Size,u2Size});
  }
  return{rows,unmapped:[...unmapped]};
}
function MRow({label,value,vc,bold}){return(<div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"5px 0",borderBottom:`1px solid ${T.bdrLt}`}}><span style={{fontSize:11,color:T.muted,lineHeight:1.4}}>{label}</span><span style={{fontFamily:T.mono,fontSize:12,color:vc||T.text,fontWeight:bold?600:400}}>{value}</span></div>);}
function Divider(){return <div style={{borderTop:`1px solid ${T.bdrLt}`,margin:"8px 0"}} />;}
function Card({title,children,style,accent}){return(<div style={{background:T.card,border:`1px solid ${T.bdr}`,borderLeft:accent?`3px solid ${accent}`:undefined,borderRadius:8,padding:"14px 16px",boxShadow:T.shadow,...style}}>{title&&<p style={{fontFamily:T.mono,fontSize:9,letterSpacing:"0.13em",textTransform:"uppercase",color:T.faint,margin:"0 0 10px",fontWeight:500}}>{title}</p>}{children}</div>);}
function Field({label,value,onChange,placeholder}){return(<div style={{marginBottom:10}}><label style={{display:"block",fontSize:11,color:T.textMid,marginBottom:4,fontWeight:500}}>{label}</label><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",boxSizing:"border-box",background:T.surf,border:`1px solid ${T.bdr}`,color:T.text,fontFamily:T.mono,fontSize:13,padding:"7px 9px",borderRadius:5,outline:"none"}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.bdr} /></div>);}
function Sel({label,value,onChange,options}){return(<div style={{marginBottom:10}}><label style={{display:"block",fontSize:11,color:T.textMid,marginBottom:4,fontWeight:500}}>{label}</label><select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",boxSizing:"border-box",background:T.surf,border:`1px solid ${T.bdr}`,color:T.text,fontFamily:T.mono,fontSize:12,padding:"7px 9px",borderRadius:5,outline:"none"}}>{options.map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>);}
function WarnBox({children}){return(<div style={{background:T.yellowLt,border:`1px solid ${T.yellowBdr}`,borderLeft:`3px solid ${T.yellow}`,borderRadius:5,padding:"8px 12px",fontSize:10,color:T.yellow,marginBottom:10,lineHeight:1.6}}>{children}</div>);}
function InfoBox({children}){return(<div style={{background:T.accentLt,border:`1px solid #b8d4ea`,borderLeft:`3px solid ${T.accent}`,borderRadius:5,padding:"8px 12px",fontSize:10,color:T.accentTx,marginBottom:10,lineHeight:1.6}}>{children}</div>);}
function SecLabel({children}){return <p style={{fontFamily:T.mono,fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:T.faint,margin:"0 0 12px",fontWeight:500}}>{children}</p>;}
function DtiBar({pct}){const fill=Math.min(100,Math.max(0,pct)),c=pct>43?T.red:pct>38?T.yellow:T.green;return(<div style={{height:5,background:T.bdrLt,borderRadius:3,margin:"6px 0 12px",position:"relative"}}><div style={{position:"absolute",left:"43%",top:-2,width:1,height:"calc(100% + 4px)",background:T.faint}}/><div style={{height:"100%",width:`${fill}%`,background:c,borderRadius:3}}/></div>);}
function VBadge({verdict,vColor,vBg,vBdr,lg}){return(<span style={{display:"inline-block",background:vBg,border:`1px solid ${vBdr}`,color:vColor,fontFamily:T.mono,fontSize:lg?10:9,fontWeight:700,letterSpacing:"0.07em",padding:lg?"4px 12px":"2px 8px",borderRadius:4,whiteSpace:"nowrap"}}>{verdict}</span>);}
function Badge({label,color,bg,bdr}){return(<span style={{display:"inline-block",background:bg,border:`1px solid ${bdr}`,color,fontFamily:T.mono,fontSize:9,fontWeight:700,letterSpacing:"0.06em",padding:"2px 9px",borderRadius:4}}>{label}</span>);}
function SourcePill({source}){const cfg={city:{label:"city benchmark",color:T.green,bg:T.greenLt,bdr:T.greenBdr},county:{label:"county benchmark",color:T.yellow,bg:T.yellowLt,bdr:T.yellowBdr},fallback:{label:"fallback estimate",color:T.red,bg:T.redLt,bdr:T.redBdr}}[source]||{label:source,color:T.muted,bg:T.surf,bdr:T.bdr};return(<span style={{display:"inline-block",background:cfg.bg,border:`1px solid ${cfg.bdr}`,color:cfg.color,fontFamily:T.mono,fontSize:8,fontWeight:600,letterSpacing:"0.07em",padding:"1px 6px",borderRadius:3,whiteSpace:"nowrap"}}>{cfg.label}</span>);}
function ScenarioBand({price,county,u1Rent,u2Rent,u1Size,u2Size,downPct,hoa,rate,pmiRate,insRate}){
  const pr=parseFloat(price);if(!pr)return null;
  const{cons,base,opt}=runScenarios(pr,county,parseFloat(u1Rent)||0,parseFloat(u2Rent)||0,u1Size,u2Size,parseFloat(downPct)||5,parseFloat(hoa)||0,parseFloat(rate)||6.875,parseFloat(pmiRate)||0.85,parseFloat(insRate)||0.55);
  const rows=[{label:"Conservative (−12%)",r:cons,note:"Market softens / vacancy runs higher"},{label:"Your Estimate",r:base,note:"Entered rents at current market"},{label:"Optimistic (+10%)",r:opt,note:"Strong leasing / above average unit"}];
  return(<div style={{background:T.card,border:`1px solid ${T.bdr}`,borderRadius:8,padding:"14px 16px",boxShadow:T.shadow,gridColumn:"1 / -1"}}><p style={{fontFamily:T.mono,fontSize:9,letterSpacing:"0.13em",textTransform:"uppercase",color:T.faint,margin:"0 0 12px",fontWeight:500}}>Rent Sensitivity — Three Scenarios</p><p style={{fontSize:10,color:T.muted,margin:"0 0 12px",lineHeight:1.65}}>How does this property perform if rents come in above or below your estimate?</p><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>{rows.map(({label,r,note})=>(<div key={label} style={{background:r.vBg,border:`1px solid ${r.vBdr}`,borderLeft:`3px solid ${r.vColor}`,borderRadius:7,padding:"12px 14px"}}><div style={{fontFamily:T.mono,fontSize:9,color:r.vColor,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>{label}</div><div style={{fontFamily:T.mono,fontSize:20,fontWeight:700,color:r.vColor,lineHeight:1}}>{f$(r.stabCF)}<span style={{fontSize:11}}>/mo</span></div><div style={{fontFamily:T.mono,fontSize:9,color:r.vColor,marginTop:4,marginBottom:8}}>{r.verdict}</div><div style={{fontSize:9,color:T.textMid,borderTop:`1px solid ${r.vBdr}`,paddingTop:6,lineHeight:1.55}}><div>U1: {f$(r.u1Rent)} · U2: {f$(r.u2Rent)}</div><div style={{color:T.muted,marginTop:2}}>{note}</div></div></div>))}</div></div>);
}
export default function App(){
  const [tab,setTab]=React.useState("analyze");
  const [savedP1,setSavedP1]=React.useState(null);
  const [rate,setRate]=React.useState("6.875"),[pmiRate,setPmi]=React.useState("0.85"),[insRate,setIns]=React.useState("0.55");
  const [county,setCounty]=React.useState("Dallas"),[price,setPrice]=React.useState("380000"),[downPct,setDown]=React.useState("5");
  const [u1Rent,setU1Rent]=React.useState("1200"),[u2Rent,setU2Rent]=React.useState("1200");
  const [u1Size,setU1Size]=React.useState("2BR"),[u2Size,setU2Size]=React.useState("2BR"),[hoa,setHoa]=React.useState("0");
  const g={rate:parseFloat(rate)||6.875,pmiRate:parseFloat(pmiRate)||0.85,insRate:parseFloat(insRate)||0.55};
  const a=React.useMemo(()=>{
    const pr=parseFloat(price);if(!pr||pr<1000)return null;
    return runAnalysis(pr,county,parseFloat(u1Rent)||0,parseFloat(u2Rent)||0,u1Size,u2Size,parseFloat(downPct)||5,parseFloat(hoa)||0,g.rate,g.pmiRate,g.insRate);
  },[price,county,u1Rent,u2Rent,u1Size,u2Size,downPct,hoa,rate,pmiRate,insRate]);
  function loadFromCSV(row){
    setPrice(String(row.price));setCounty(row.county);setU1Size(row.u1Size);setU2Size(row.u2Size);
    const{u1,u2}=estimatePropertyRents(row);setU1Rent(String(u1.base));setU2Rent(String(u2.base));
    setHoa(String(row.hoa||0));setDown("5");setTab("analyze");
  }
  const ctyRate=COUNTIES[county]?.rate??0.021;
  const countyOpts=Object.entries(COUNTIES).map(([k,v])=>[k,v.label]);
  return(<div style={{background:T.pageBg,minHeight:"100vh",color:T.text,fontFamily:T.sans,fontSize:14}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box}input:focus,select:focus{outline:none}`}</style>
    <div style={{background:T.hdrBg,borderBottom:`1px solid ${T.hdrBdr}`,padding:"13px 28px"}}>
      <div style={{maxWidth:1180,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div><div style={{display:"flex",alignItems:"center",gap:9,marginBottom:3}}><div style={{width:6,height:6,borderRadius:"50%",background:T.accentMd}}/><span style={{fontFamily:T.mono,fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"#6a90b8"}}>DFW Metroplex · Duplex Investment Analyzer</span></div><div style={{fontSize:11,color:"#3d5a78",marginLeft:15}}>Sequential primary-residence strategy · P1 max loss –$400/mo · TX property tax rates applied</div></div>
        <div style={{display:"flex",alignItems:"center",gap:16,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"8px 16px",flexWrap:"wrap"}}>
          {[["30yr Rate",rate,setRate],["PMI %",pmiRate,setPmi],["Ins %",insRate,setIns]].map(([lbl,val,setter])=>(<label key={lbl} style={{display:"flex",alignItems:"center",gap:7,fontSize:11,color:"#6a90b8"}}><span style={{fontFamily:T.mono,fontSize:10}}>{lbl}</span><input value={val} onChange={e=>setter(e.target.value)} style={{width:52,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:"#b8d0e8",fontFamily:T.mono,fontSize:12,padding:"3px 7px",borderRadius:4,outline:"none"}}/></label>))}
          <span style={{fontFamily:T.mono,fontSize:9,color:"#2a4060",borderLeft:`1px solid #1a3050`,paddingLeft:14}}>Vac 7% · Maint 1% · CapEx 2% · Close 2.5%</span>
        </div>
      </div>
    </div>
    <div style={{background:T.card,borderBottom:`1px solid ${T.bdr}`}}><div style={{maxWidth:1180,margin:"0 auto",padding:"0 28px",display:"flex"}}>{[["analyze","Property Analyzer"],["scan","CSV Scanner"],["seq","Sequence Planner"]].map(([key,label])=>(<button key={key} onClick={()=>setTab(key)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:T.sans,borderBottom:tab===key?`2px solid ${T.accent}`:"2px solid transparent",color:tab===key?T.accent:T.muted,fontWeight:tab===key?600:400,fontSize:13,padding:"12px 22px"}}>{label}</button>))}</div></div>
    <div style={{maxWidth:1180,margin:"0 auto"}}>
      {tab==="analyze"&&(
        <div style={{display:"grid",gridTemplateColumns:"295px 1fr",minHeight:"calc(100vh - 105px)"}}>
          <div style={{background:T.surf,borderRight:`1px solid ${T.bdr}`,padding:"20px 16px"}}>
            <SecLabel>Property</SecLabel>
            <Sel label="County" value={county} onChange={setCounty} options={countyOpts}/>
            <Field label="Purchase Price ($)" value={price} onChange={setPrice}/>
            <Field label="Down Payment (%)" value={downPct} onChange={setDown} placeholder="5"/>
            <Field label="HOA / Month ($)" value={hoa} onChange={setHoa} placeholder="0"/>
            <Divider/>
            <SecLabel>Unit Mix & Rents</SecLabel>
            <p style={{fontSize:10,color:T.muted,margin:"0 0 10px",lineHeight:1.65}}>Enter actual in-place rents first. If unavailable, use apartment-comparable rates — not SFH rents.</p>
            <Sel label="Unit 1 size (you live here)" value={u1Size} onChange={setU1Size} options={[["1BR","1 Bedroom"],["2BR","2 Bedrooms"]]}/>
            <Field label="Unit 1 market rent ($/mo)" value={u1Rent} onChange={setU1Rent}/>
            {a?.u1Fl&&<WarnBox>⚠ Exceeds conservative {county} {u1Size} ceiling ({f$(RENT_BENCHMARKS[county]?.[u1Size]?.[1])}/mo).</WarnBox>}
            <Sel label="Unit 2 size (rent immediately)" value={u2Size} onChange={setU2Size} options={[["1BR","1 Bedroom"],["2BR","2 Bedrooms"]]}/>
            <Field label="Unit 2 market rent ($/mo)" value={u2Rent} onChange={setU2Rent}/>
            {a?.u2Fl&&<WarnBox>⚠ Exceeds conservative {county} {u2Size} ceiling ({f$(RENT_BENCHMARKS[county]?.[u2Size]?.[1])}/mo).</WarnBox>}
            <Divider/>
            <SecLabel>{county} County Benchmarks</SecLabel>
            {Object.entries(RENT_BENCHMARKS[county]??{}).map(([sz,[lo,hi]])=>(<div key={sz} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:11,fontFamily:T.mono,borderBottom:`1px solid ${T.bdrLt}`}}><span style={{color:T.muted}}>{sz}</span><span style={{color:T.accent}}>{f$(lo)} – {f$(hi)}/mo</span></div>))}
            <p style={{fontSize:10,color:T.faint,marginTop:8,lineHeight:1.6}}>Conservative ceilings. Underwrite below, not at ceiling.</p>
            <Divider/>
            <SecLabel>TX Tax Note</SecLabel>
            <p style={{fontSize:10,color:T.faint,lineHeight:1.65}}>DFW effective rates 1.8%–2.2% (county+city+ISD). Verify exact rate for specific address — ISDs vary significantly within the same county.</p>
          </div>
          <div style={{padding:"22px 26px"}}>{!a?(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:320,gap:10,color:T.muted}}><div style={{fontSize:32,opacity:0.25}}>⌕</div><div style={{fontFamily:T.mono,fontSize:12}}>Enter a purchase price to run the analysis.</div></div>):(<>
            <div style={{background:a.vBg,border:`1px solid ${a.vBdr}`,borderLeft:`4px solid ${a.vColor}`,borderRadius:10,padding:"16px 20px",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:T.shadow}}>
              <div><div style={{fontSize:10,color:T.muted,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>P1 Stabilized Verdict</div><div style={{fontFamily:T.mono,fontSize:26,fontWeight:700,color:a.vColor}}>{a.verdict}</div>{a.verdict==="PASS"&&<div style={{fontSize:11,color:a.vColor,marginTop:5}}>{f$(a.cfGap)} headroom. Verify rents are realistic.</div>}{a.verdict==="BORDERLINE"&&<div style={{fontSize:11,color:a.vColor,marginTop:5}}>{a.stabCF>=-400?"Passes numerically — verify with actual in-place data.":`${f$(Math.abs(a.cfGap))}/mo over limit — negotiate price or rents.`}</div>}{a.verdict==="REJECTED"&&<div style={{fontSize:11,color:a.vColor,marginTop:5}}>{f$(Math.abs(a.cfGap))}/mo beyond the –$400/mo limit. Do not proceed.</div>}</div>
              <div style={{textAlign:"right"}}><div style={{fontSize:10,color:T.muted,fontWeight:500,marginBottom:4}}>Stabilized Cash Flow</div><div style={{fontFamily:T.mono,fontSize:28,fontWeight:700,color:a.vColor,lineHeight:1}}>{f$(a.stabCF)}<span style={{fontSize:13}}>/mo</span></div><div style={{fontSize:9,color:T.muted,marginTop:4,fontFamily:T.mono}}>limit –$400 · headroom {f$(a.cfGap)}</div></div>
            </div>
            {a.anyFl&&<WarnBox>⚠ RENT WARNING — One or more rents exceed conservative benchmarks for {county} County.</WarnBox>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Card title="Cash to Close"><MRow label="Purchase Price" value={f$(a.price)}/><MRow label={`Down (${downPct}%)`} value={f$(a.down)}/><MRow label="Loan Amount" value={f$(a.loan)}/><MRow label="Est. Closing (2.5%)" value={f$(a.closing)}/><Divider/><MRow label="Total Cash Required" value={f$(a.cashReq)} bold/><MRow label="Your Reserves" value={f$(CASH_RESERVES)}/><MRow label="Post-Close Remaining" value={f$(CASH_RESERVES-a.cashReq)} bold vc={(CASH_RESERVES-a.cashReq)<15000?T.red:(CASH_RESERVES-a.cashReq)<30000?T.yellow:T.green}/></Card>
              <Card title="Monthly PITI + PMI"><MRow label="Principal & Interest" value={f$(a.pi)}/><MRow label={`Property Tax (${fp(ctyRate*100)} — ${county} Co.)`} value={f$(a.taxes)}/><MRow label={`Insurance (${insRate}%)`} value={f$(a.ins)}/><MRow label={`PMI (${parseFloat(downPct)<20?pmiRate+"%":"n/a"})`} value={parseFloat(downPct)<20?f$(a.mPMI):"—"}/><MRow label="HOA / Fees" value={parseFloat(hoa)>0?f$(parseFloat(hoa)):"—"}/><Divider/><MRow label="Total PITI + PMI" value={f$(a.piti)} bold/></Card>
              <Card title="Phase 1 · Owner-Occupied (You Live in Unit 1)"><p style={{fontSize:10,color:T.muted,marginTop:0,marginBottom:8,lineHeight:1.65}}>Unit 2 rented immediately.</p><MRow label="Unit 2 rent (gross)" value={f$(a.u2Rent)}/><MRow label="  – Vacancy (7%)" value={f$(-(a.u2Rent*0.07))}/><MRow label="  – Unit 2 OpEx (½ share)" value={f$(-a.u2opex)}/><MRow label="Net Unit 2 Income" value={f$(a.u2egi-a.u2opex)}/><MRow label="  – PITI + PMI" value={f$(-a.piti)}/><Divider/><MRow label="Net Monthly Housing Cost" value={f$(a.ooNet)} bold vc={a.ooNet<1800?T.green:a.ooNet<2800?T.text:T.yellow}/></Card>
              <Card title="Phase 2 · Stabilized Rental (Both Units)"><p style={{fontSize:10,color:T.muted,marginTop:0,marginBottom:8,lineHeight:1.65}}>After you move to P2. Conservative underwriting.</p><MRow label="Gross Scheduled Rent" value={f$(a.grossRent)}/><MRow label="  – Vacancy (7%)" value={f$(-(a.grossRent*0.07))}/><MRow label="Effective Gross Income" value={f$(a.egi)}/><MRow label="  – Maintenance (1%)" value={f$(-a.maint)}/><MRow label="  – CapEx (2%)" value={f$(-a.capex)}/><MRow label="NOI" value={f$(a.noi)} bold/><MRow label="  – PITI + PMI" value={f$(-a.piti)}/><Divider/><MRow label="Stabilized Cash Flow" value={f$(a.stabCF)} vc={a.vColor} bold/><MRow label="P1 Max Loss Allowed" value="–$400 / mo"/><MRow label="Headroom / (Gap)" value={f$(a.cfGap)} vc={a.cfGap>=0?T.green:a.cfGap>=-160?T.yellow:T.red}/></Card>
              <Card title="DTI Impact on Future Buying Power"><p style={{fontSize:10,color:T.muted,marginTop:0,marginBottom:8,lineHeight:1.65}}>Lenders credit 75% of documented gross rents against PITI.</p><MRow label="Monthly PITI + PMI" value={f$(a.piti)}/><MRow label="Gross Rent × 75%" value={f$(a.rentalOffset)}/><MRow label="Net DTI Burden from P1" value={f$(a.netDTI)} bold/><Divider/><MRow label="Gross Monthly Income" value={f$(GROSS_MONTHLY)}/><MRow label="Max DTI Target (43%)" value={f$(GROSS_MONTHLY*0.43)}/><MRow label="DTI % Used by P1" value={fp(a.dtiPctUsed)} bold vc={a.dtiPctUsed<9?T.green:a.dtiPctUsed<17?T.yellow:T.red}/><MRow label="Remaining DTI @ 43%" value={f$(GROSS_MONTHLY*0.43-a.netDTI)} vc={(GROSS_MONTHLY*0.43-a.netDTI)>2200?T.green:T.yellow}/></Card>
              <Card title="Quick Metrics"><MRow label="Gross Rent Yield" value={fp(a.gry)} vc={a.gry>7?T.green:a.gry>5.5?T.yellow:T.red}/><MRow label="Price-to-Rent Ratio" value={a.ptr.toFixed(1)+"×"} vc={a.ptr<14?T.green:a.ptr<18?T.yellow:T.red}/><MRow label="Annual Gross Rent" value={f$(a.grossRent*12)}/><MRow label="Annual NOI (est.)" value={f$(a.noi*12)}/><MRow label="Cash-on-Cash (stabilized)" value={fp(a.coc)} vc={a.coc>0?T.green:a.coc>-4?T.yellow:T.red}/><MRow label="Closing + Down (total)" value={f$(a.cashReq)}/></Card>
              <ScenarioBand price={price} county={county} u1Rent={u1Rent} u2Rent={u2Rent} u1Size={u1Size} u2Size={u2Size} downPct={downPct} hoa={hoa} rate={rate} pmiRate={pmiRate} insRate={insRate}/>
            </div>
            <div style={{marginTop:18,textAlign:"right",display:"flex",justifyContent:"flex-end",alignItems:"center",gap:12}}>
              {a.verdict==="REJECTED"&&<span style={{fontSize:11,color:T.red,fontStyle:"italic"}}>⚠ REJECTED — saving for reference only.</span>}
              <button onClick={()=>{setSavedP1({...a,county,downPct,pmiRate,insRate});setTab("seq");}} style={{background:a.verdict==="REJECTED"?T.red:T.accent,border:"none",color:"#fff",fontFamily:T.sans,fontWeight:600,fontSize:12,padding:"10px 22px",cursor:"pointer",borderRadius:6}}>Save as P1 → Open Sequence Planner</button>
            </div>
          </>)}</div>
        </div>
      )}
      {tab==="scan"&&<CsvScanner g={g} onLoad={loadFromCSV}/>}
      {tab==="seq"&&<SequencePlanner savedP1={savedP1} gRate={g.rate} gPmi={g.pmiRate} gIns={g.insRate}/>}
    </div>
  </div>);
}
function CsvScanner({g,onLoad}){
  const[results,setResults]=React.useState([]),
    [fileName,setFileName]=React.useState(null),
    [unmapped,setUnmapped]=React.useState([]),
    [dragOver,setDragOver]=React.useState(false),
    [expanded,setExpanded]=React.useState(null);
  const fileRef=React.useRef();
  function process(file){
    if(!file)return;
    setFileName(file.name);
    const reader=new FileReader();
    reader.onload=e=>{
      const{rows,unmapped}=parseRedfin(e.target.result);
      setUnmapped(unmapped);
      const analyzed=rows.map(row=>{
        const{u1,u2}=estimatePropertyRents(row);
        const a=runAnalysis(row.price,row.county,u1.base,u2.base,row.u1Size,row.u2Size,5,row.hoa,g.rate,g.pmiRate,g.insRate);
        const aCons=runAnalysis(row.price,row.county,u1.low,u2.low,row.u1Size,row.u2Size,5,row.hoa,g.rate,g.pmiRate,g.insRate);
        const aHigh=runAnalysis(row.price,row.county,u1.high,u2.high,row.u1Size,row.u2Size,5,row.hoa,g.rate,g.pmiRate,g.insRate);
        return{...row,u1Rent:u1.base,u2Rent:u2.base,rentMeta:{u1,u2},stabCFLow:aCons.stabCF,stabCFHigh:aHigh.stabCF,...a};
      });
      analyzed.sort((a,b)=>b.stabCF-a.stabCF);
      setResults(analyzed);setExpanded(null);
    };
    reader.readAsText(file);
  }
  const cnt={pass:results.filter(r=>r.verdict==="PASS").length,bl:results.filter(r=>r.verdict==="BORDERLINE").length,rej:results.filter(r=>r.verdict==="REJECTED").length};
  if(!results.length)return(<div style={{padding:"32px 28px"}}>
    <div style={{marginBottom:22}}><div style={{fontWeight:700,fontSize:18,color:T.text,marginBottom:6}}>CSV Scanner</div><div style={{fontSize:12,color:T.muted}}>Upload a Redfin saved-search export to batch-analyze DFW properties.</div></div>
    <div onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);process(e.dataTransfer.files[0])}} onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${dragOver?T.accent:T.bdr}`,borderRadius:12,background:dragOver?T.accentLt:T.card,padding:"64px 40px",textAlign:"center",cursor:"pointer"}}>
      <div style={{fontSize:40,marginBottom:14,opacity:0.4}}>⬆</div>
      <div style={{fontWeight:600,fontSize:16,color:T.text,marginBottom:6}}>Drop your Redfin CSV here, or click to browse</div>
      <div style={{fontFamily:T.mono,fontSize:10,color:T.faint}}>.csv files only</div>
      <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>process(e.target.files[0])}/>
    </div>
  </div>);
  return(<div style={{padding:"22px 28px"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10}}>
      <div><div style={{fontWeight:700,fontSize:16,color:T.text}}>{fileName}</div><div style={{fontSize:11,color:T.muted,marginTop:2}}>{results.length} properties · ranked by stabilized cash flow</div></div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <Badge label={`${cnt.pass} PASS`} color={T.green} bg={T.greenLt} bdr={T.greenBdr}/>
        <Badge label={`${cnt.bl} BORDERLINE`} color={T.yellow} bg={T.yellowLt} bdr={T.yellowBdr}/>
        <Badge label={`${cnt.rej} REJECTED`} color={T.red} bg={T.redLt} bdr={T.redBdr}/>
        <button onClick={()=>{setResults([]);setFileName(null);setUnmapped([]);}} style={{background:T.surf,border:`1px solid ${T.bdr}`,color:T.textMid,fontSize:12,fontFamily:T.sans,padding:"5px 14px",borderRadius:5,cursor:"pointer",marginLeft:4}}>↩ New File</button>
      </div>
    </div>
    {unmapped.length>0&&<WarnBox>⚠ Cities not in county map — defaulted to Dallas Co.: <strong>{unmapped.join(", ")}</strong></WarnBox>}
    <InfoBox>Rents estimated using city-level DFW benchmarks, adjusted for sqft and year built. High TX property taxes baked in per county.</InfoBox>
    <div style={{border:`1px solid ${T.bdr}`,borderRadius:10,overflow:"hidden"}}>
      {results.map((r,i)=>{
        const open=expanded===i,src=r.rentMeta?.u1?.source||"county";
        return(<div key={i} style={{borderLeft:`3px solid ${r.vColor}`,borderBottom:i<results.length-1?`1px solid ${T.bdrLt}`:"none"}}>
          <div onClick={()=>setExpanded(open?null:i)} style={{display:"grid",gridTemplateColumns:"36px 1fr 96px 92px 120px 76px 92px",padding:"11px 14px 11px 13px",background:open?T.accentLt:i%2===0?T.card:T.surf,cursor:"pointer",alignItems:"center"}}>
            <div style={{fontFamily:T.mono,fontSize:11,color:T.faint,fontWeight:600}}>{i+1}</div>
            <div><div style={{fontWeight:600,fontSize:13,color:T.text}}>{r.address}</div><div style={{fontSize:10,color:T.muted,marginTop:2,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><span>{r.city} · {r.county} Co.</span><span>· {r.beds}bd · {r.u1Size}/{r.u2Size}</span><span>· {r.dom} DOM</span><SourcePill source={src}/></div></div>
            <div style={{fontFamily:T.mono,fontSize:13,color:T.text,fontWeight:500}}>{f$(r.price)}</div>
            <div><VBadge verdict={r.verdict} vColor={r.vColor} vBg={r.vBg} vBdr={r.vBdr}/></div>
            <div style={{textAlign:"right"}}><div style={{fontFamily:T.mono,fontSize:13,fontWeight:700,color:r.vColor}}>{f$(r.stabCF)}</div><div style={{fontFamily:T.mono,fontSize:9,color:T.muted,marginTop:1}}><span style={{color:r.stabCFLow>=-400?T.green:T.red}}>{f$(r.stabCFLow)}</span><span style={{color:T.faint}}> → </span><span style={{color:r.stabCFHigh>=-400?T.green:T.yellow}}>{f$(r.stabCFHigh)}</span></div></div>
            <div style={{fontFamily:T.mono,fontSize:12,textAlign:"right",color:r.gry>7?T.green:r.gry>5.5?T.yellow:T.red}}>{fp(r.gry)}</div>
            <div style={{fontFamily:T.mono,fontSize:12,color:T.textMid,textAlign:"right"}}>{f$(r.cashReq)}</div>
          </div>
          {open&&(<div style={{background:"#f4f8fd",borderTop:`1px solid #c8d8ea`,padding:"16px 18px"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
              {[{label:`Conservative`,cf:r.stabCFLow,u1r:r.rentMeta?.u1?.low,u2r:r.rentMeta?.u2?.low},{label:`Base estimate`,cf:r.stabCF,u1r:r.rentMeta?.u1?.base,u2r:r.rentMeta?.u2?.base},{label:`Optimistic`,cf:r.stabCFHigh,u1r:r.rentMeta?.u1?.high,u2r:r.rentMeta?.u2?.high}].map(({label,cf,u1r,u2r})=>{
                const vc=cf>=-400?T.green:cf>=-560?T.yellow:T.red;
                return(<div key={label} style={{background:T.card,border:`1px solid ${T.bdr}`,borderLeft:`3px solid ${vc}`,borderRadius:7,padding:"10px 13px",boxShadow:T.shadow}}><div style={{fontFamily:T.mono,fontSize:9,color:T.faint,textTransform:"uppercase",marginBottom:4}}>{label}</div><div style={{fontFamily:T.mono,fontSize:17,fontWeight:700,color:vc}}>{f$(cf)}/mo</div><div style={{fontSize:9,color:T.muted,marginTop:3}}>{f$(u1r)} + {f$(u2r)}</div></div>);
              })}
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <button onClick={()=>onLoad(r)} style={{background:T.accent,border:"none",color:"#fff",fontFamily:T.sans,fontWeight:600,fontSize:12,padding:"9px 20px",borderRadius:6,cursor:"pointer"}}>Open in Analyzer →</button>
              {r.url&&<a href={r.url} target="_blank" rel="noreferrer" style={{color:T.accent,fontSize:12,textDecoration:"none",fontWeight:500,border:`1px solid ${T.bdr}`,padding:"8px 16px",borderRadius:6,background:T.card}}>View on Redfin ↗</a>}
            </div>
          </div>)}
        </div>);
      })}
    </div>
  </div>);
}
function dtiColor(p){return p>43?T.red:p>38?T.yellow:T.green;}
function dtiStatus(p){return p>43?"OVER LIMIT":p>38?"CAUTION":"CLEAR";}
function dtiBg(p){return p>43?T.redLt:p>38?T.yellowLt:T.greenLt;}
function dtiBdr(p){return p>43?T.redBdr:p>38?T.yellowBdr:T.greenBdr;}
function PhaseCard({title,desc,dti,accent,children}){
  return(<div style={{background:T.card,border:`1px solid ${T.bdr}`,borderLeft:`4px solid ${accent||T.accent}`,borderRadius:8,padding:"18px 20px",marginBottom:12,boxShadow:T.shadow}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
      <div><div style={{fontFamily:T.mono,fontSize:9,letterSpacing:"0.13em",textTransform:"uppercase",color:accent||T.accent,marginBottom:4,fontWeight:600}}>{title}</div><div style={{fontSize:11,color:T.muted}}>{desc}</div></div>
      {dti!=null&&(<div style={{textAlign:"right",background:dtiBg(dti),border:`1px solid ${dtiBdr(dti)}`,borderRadius:8,padding:"8px 14px"}}><div style={{fontFamily:T.mono,fontSize:22,fontWeight:700,color:dtiColor(dti)}}>{fp(dti,1)}</div><div style={{fontFamily:T.mono,fontSize:8,color:dtiColor(dti),marginTop:2}}>{dtiStatus(dti)}</div><div style={{fontSize:9,color:T.muted,marginTop:1}}>vs 43% limit</div></div>)}
    </div>
    {dti!=null&&<DtiBar pct={dti}/>}
    {children}
  </div>);
}
function DtiBox({dti,headroom,note}){
  return(<div style={{background:dtiBg(dti),border:`1px solid ${dtiBdr(dti)}`,borderRadius:7,padding:"12px",textAlign:"center"}}><div style={{fontFamily:T.mono,fontSize:20,fontWeight:700,color:dtiColor(dti)}}>{fp(dti,1)}</div><div style={{fontFamily:T.mono,fontSize:8,color:dtiColor(dti),marginTop:2}}>{dtiStatus(dti)}</div><div style={{fontSize:9,color:T.muted,marginTop:5}}>{note||`Headroom: ${headroom}`}</div></div>);
}
function SequencePlanner({savedP1,gRate,gPmi,gIns}){
  const[p2Price,setP2Price]=React.useState("420000"),[p2Rent,setP2Rent]=React.useState("2500"),[p2County,setP2County]=React.useState("Collin");
  const[p3Price,setP3Price]=React.useState("465000"),[p3Rent,setP3Rent]=React.useState("2700"),[p3County,setP3County]=React.useState("Collin");
  const[fPrice,setFPrice]=React.useState("750000"),[fDown,setFDown]=React.useState("10"),[fCounty,setFCounty]=React.useState("Collin");
  const countyOpts=Object.entries(COUNTIES).map(([k,v])=>[k,v.label]);
  function estPiti(price,dp,county){
    const d=price*dp/100,l=price-d;
    return pmt(l,gRate)+(price*(COUNTIES[county]?.rate??0.021))/12+(price*gIns/100)/12+(dp<20?(l*gPmi/100)/12:0);
  }
  const p1=savedP1;
  const p2Piti=estPiti(parseFloat(p2Price)||0,5,p2County),p2Off=(parseFloat(p2Rent)||0)*0.75,p2Net=Math.max(0,p2Piti-p2Off);
  const p3Piti=estPiti(parseFloat(p3Price)||0,5,p3County),p3Off=(parseFloat(p3Rent)||0)*0.75,p3Net=Math.max(0,p3Piti-p3Off);
  const fPiti=estPiti(parseFloat(fPrice)||0,parseFloat(fDown)||10,fCounty);
  const p1Net=p1?.netDTI??0;
  const dtiP2=(p1Net+p2Piti)/GROSS_MONTHLY*100,dtiP3=(p1Net+p2Net+p3Piti)/GROSS_MONTHLY*100,dtiFH=(p1Net+p2Net+p3Net+fPiti)/GROSS_MONTHLY*100;
  return(<div style={{padding:"24px 28px"}}>
    <div style={{fontFamily:T.mono,fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:T.faint,margin:"0 0 16px",fontWeight:600}}>Sequence DTI Planner — P1 → P2 → P3 → $750k+ Personal Home</div>
    {!savedP1&&<WarnBox>No P1 data saved yet. Run a property on the Analyzer tab and click "Save as P1".</WarnBox>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
      {[["Gross Monthly Income",f$(GROSS_MONTHLY),T.text],["Max DTI @ 43%",f$(GROSS_MONTHLY*0.43),T.text],["P1 Net DTI Burden",p1?f$(p1.netDTI):"No P1 saved",p1?(p1.netDTI<400?T.green:T.yellow):T.faint],["P1 Stabilized CF",p1?f$(p1.stabCF):"No P1 saved",p1?p1.vColor:T.faint]].map(([lbl,val,c])=>(<Card key={lbl}><div style={{fontSize:10,color:T.muted,marginBottom:4,fontWeight:500}}>{lbl}</div><div style={{fontFamily:T.mono,fontSize:17,fontWeight:700,color:c}}>{val}</div></Card>))}
    </div>
    <PhaseCard title="Buying P2 — Next Primary Duplex" desc="P1 is now a rental. P2 is your primary residence." dti={dtiP2}>
      <div style={{display:"grid",gridTemplateColumns:"175px 175px 1fr 150px",gap:16,alignItems:"start"}}>
        <div><Field label="P2 Purchase Price ($)" value={p2Price} onChange={setP2Price}/><Sel label="County" value={p2County} onChange={setP2County} options={countyOpts}/><Field label="P2 Gross Rent ($/mo)" value={p2Rent} onChange={setP2Rent}/></div>
        <div><SecLabel>P2 PITI Estimates</SecLabel><MRow label="PITI + PMI" value={f$(p2Piti)}/><MRow label="Gross Rent × 75%" value={f$(p2Off)}/><MRow label="Net DTI (when rental)" value={f$(p2Net)} bold/></div>
        <div><SecLabel>DTI Stack at P2 Purchase</SecLabel>{p1&&<MRow label="P1 net burden" value={f$(p1.netDTI)}/>}<MRow label="P2 full PITI (primary)" value={f$(p2Piti)}/><Divider/><MRow label="Total DTI" value={fp(dtiP2,1)} vc={dtiColor(dtiP2)} bold/></div>
        <DtiBox dti={dtiP2} headroom={f$(GROSS_MONTHLY*0.43-p1Net-p2Piti)}/>
      </div>
    </PhaseCard>
    <PhaseCard title="Buying P3 — Final Primary Duplex" desc="P1 & P2 are both rentals. P3 is your residence." dti={dtiP3}>
      <div style={{display:"grid",gridTemplateColumns:"175px 175px 1fr 150px",gap:16,alignItems:"start"}}>
        <div><Field label="P3 Purchase Price ($)" value={p3Price} onChange={setP3Price}/><Sel label="County" value={p3County} onChange={setP3County} options={countyOpts}/><Field label="P3 Gross Rent ($/mo)" value={p3Rent} onChange={setP3Rent}/></div>
        <div><SecLabel>P3 PITI Estimates</SecLabel><MRow label="PITI + PMI" value={f$(p3Piti)}/><MRow label="Gross Rent × 75%" value={f$(p3Off)}/><MRow label="Net DTI (when rental)" value={f$(p3Net)} bold/></div>
        <div><SecLabel>DTI Stack at P3 Purchase</SecLabel>{p1&&<MRow label="P1 net burden" value={f$(p1.netDTI)}/>}<MRow label="P2 net burden" value={f$(p2Net)}/><MRow label="P3 full PITI (primary)" value={f$(p3Piti)}/><Divider/><MRow label="Total DTI" value={fp(dtiP3,1)} vc={dtiColor(dtiP3)} bold/></div>
        <DtiBox dti={dtiP3} headroom={f$(GROSS_MONTHLY*0.43-p1Net-p2Net-p3Piti)}/>
      </div>
    </PhaseCard>
    <PhaseCard title="Buying Final Home — $750k+ Personal Residence" desc="P1, P2, P3 are all rentals. This is the critical DTI gate." dti={dtiFH} accent={T.yellow}>
      <WarnBox>⚠ TX property taxes are structurally higher — each $100k of property value adds ~$175/mo to PITI in Dallas/Tarrant Co.</WarnBox>
      <div style={{display:"grid",gridTemplateColumns:"175px 175px 1fr 150px",gap:16,alignItems:"start"}}>
        <div><Field label="Final Home Price ($)" value={fPrice} onChange={setFPrice}/><Sel label="County" value={fCounty} onChange={setFCounty} options={countyOpts}/><Field label="Down Payment (%)" value={fDown} onChange={setFDown}/></div>
        <div><SecLabel>Final Home Estimates</SecLabel><MRow label="PITI (no rental offset)" value={f$(fPiti)}/><MRow label="PMI (if <20% down)" value={parseFloat(fDown)<20?"Included":"None"}/></div>
        <div><SecLabel>Full DTI Stack</SecLabel>{p1&&<MRow label="P1 net burden" value={f$(p1.netDTI)}/>}<MRow label="P2 net burden" value={f$(p2Net)}/><MRow label="P3 net burden" value={f$(p3Net)}/><MRow label="Final home PITI (primary)" value={f$(fPiti)}/><Divider/><MRow label="Total DTI" value={fp(dtiFH,1)} vc={dtiColor(dtiFH)} bold/><MRow label="Remaining capacity" value={f$(GROSS_MONTHLY*0.43-p1Net-p2Net-p3Net-fPiti)} vc={(GROSS_MONTHLY*0.43-p1Net-p2Net-p3Net-fPiti)>400?T.green:T.red}/></div>
        <DtiBox dti={dtiFH} headroom={f$(GROSS_MONTHLY*0.43-p1Net-p2Net-p3Net-fPiti)} note="Must clear 43%."/>
      </div>
    </PhaseCard>
  </div>);
}
