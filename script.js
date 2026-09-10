// ফলাফল ডাটা: ২০২৬ সালের দ্বিতীয় সাময়িক পরীক্ষা
const students = [];
let currentPersonalStudent = null;

const yearSelect = document.getElementById("resultYear");
const exam = document.getElementById("exam");
const className = document.getElementById("className");
const form = document.getElementById("resultForm");
const message = document.getElementById("message");
const resultArea = document.getElementById("resultArea");
const personalPanel = document.getElementById("personalPanel");
const classPanel = document.getElementById("classPanel");
const classYear = document.getElementById("classYear");
const classWiseExam = document.getElementById("classWiseExam");
const classWiseName = document.getElementById("classWiseName");
const classWiseResult = document.getElementById("classWiseResult");
const aplusPanel = document.getElementById("aplusPanel");
const aplusResult = document.getElementById("aplusResult");
const aplusMeta = document.getElementById("aplusMeta");
const menu = document.getElementById("mobileMenu");
const overlay = document.getElementById("menuOverlay");

document.getElementById("year").textContent = "২০২৬";

async function loadResultData(){
  try{
    const res=await fetch("data/results.json?ts="+Date.now(),{cache:"no-store"});
    if(!res.ok) throw new Error("Could not load result data");
    const data=await res.json();
    students.length=0;
    students.push(...(Array.isArray(data) ? data : (data.students||[])));
    loadYears();
  }catch(err){
    console.error(err);
    message.textContent="ফলাফল ডাটা লোড করা যায়নি। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।";
    message.className="message error";
  }
}

const bnDigits = "০১২৩৪৫৬৭৮৯";
function bnNum(v){ return String(v ?? "").replace(/\d/g, d => bnDigits[d]); }
function unique(list){ return [...new Set(list)]; }
function fillSelect(select, values, placeholder){
  select.innerHTML = `<option value="">${placeholder}</option>`;
  values.forEach(v => {
    const opt=document.createElement("option");
    opt.value=v.value ?? v; opt.textContent=v.label ?? v;
    select.appendChild(opt);
  });
}
function esc(v){
  return String(v ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

const examOptions = [
  {value:"First Term Exam", label:"প্রথম সাময়িক পরীক্ষা"},
  {value:"Second Term Exam", label:"দ্বিতীয় সাময়িক পরীক্ষা"},
  {value:"Annual Exam", label:"বার্ষিক পরীক্ষা"}
];

function getYears(){
  return unique(students.map(s => String(s.year || "2026"))).sort((a,b)=>Number(b)-Number(a));
}
function getClasses(year){
  return unique(students.filter(s=>String(s.year||"")===String(year)).map(s=>s.className)).map(c=>{
    const f=students.find(s=>String(s.year||"")===String(year)&&s.className===c);
    return {value:c,label:f?.classBn || c};
  });
}
function loadYears(){
  const years=getYears().map(y=>({value:y,label:bnNum(y)}));
  fillSelect(yearSelect,years,"-- সাল নির্বাচন করুন --");
  fillSelect(classYear,years,"-- সাল নির্বাচন করুন --");
  resetPersonal(false);
  resetClassWise(false);
}
function loadPersonalClasses(){
  const y=yearSelect.value;
  if(!y){
    fillSelect(className,[],"-- আগে সাল নির্বাচন করুন --");
    className.disabled=true;
    return;
  }
  fillSelect(className,getClasses(y),"-- শ্রেণি নির্বাচন করুন --");
  className.disabled=getClasses(y).length===0;
}
function resetPersonal(clearYear=true){
  if(clearYear) yearSelect.value="";
  fillSelect(exam,examOptions,"-- পরীক্ষা নির্বাচন করুন --");
  fillSelect(className,[],"-- আগে সাল নির্বাচন করুন --");
  className.disabled=true;
  document.getElementById("classHelp").textContent="প্রথমে সাল নির্বাচন করুন";
  document.getElementById("roll").value="";
}
function resetClassWise(clearYear=true){
  if(clearYear) classYear.value="";
  fillSelect(classWiseExam,examOptions,"-- পরীক্ষা নির্বাচন করুন --");
  classWiseExam.value="";
  fillSelect(classWiseName,[],"-- আগে সাল নির্বাচন করুন --");
  classWiseName.disabled=true;
  classWiseResult.classList.add("hidden");
}

yearSelect.addEventListener("change",loadPersonalClasses);
classYear.addEventListener("change",()=>{
  const y=classYear.value;
  fillSelect(classWiseExam,examOptions,"-- পরীক্ষা নির্বাচন করুন --");
  const classes=y?getClasses(y):[];
  fillSelect(classWiseName,classes,y?"-- শ্রেণি নির্বাচন করুন --":"-- আগে সাল নির্বাচন করুন --");
  classWiseName.disabled=classes.length===0;
  classWiseResult.classList.add("hidden");
});

classWiseExam.addEventListener("change",()=>{
  classWiseResult.classList.add("hidden");
});

classWiseName.addEventListener("change",()=>{
  classWiseResult.classList.add("hidden");
});

function showPersonalResult(s){
  currentPersonalStudent = s;
  const rows=(s.subjects||[]).map((x,i)=>`<tr><td>${bnNum(i+1)}</td><td>${esc(x.name)}</td><td>${x.marks==='*'?'—':bnNum(x.marks)}</td></tr>`).join("");
  const pos=typeof s.rank === "number" ? bnNum(s.rank) : esc(s.rank || "—");
  const absent=s.grade==='অনুপস্থিত' || !(s.subjects||[]).some(x=>typeof x.marks==='number');
  const status=absent ? '<span class="fail">অনুপস্থিত / অসম্পূর্ণ</span>' : (s.grade==='F' ? '<span class="fail">ফেল</span>' : '<span class="pass">উত্তীর্ণ</span>');
  const total=s.total==null?'—':bnNum(s.total);
  const avg=s.average==null?'—':bnNum(Number(s.average).toFixed(2));
  const point=s.point==null?'—':bnNum(Number(s.point).toFixed(2));
  resultArea.innerHTML=`
    <div class="result-head"><img src="logo.jpg" alt="মাদ্রাসার লোগো"><div><h2>দারুন নাজাত আইডিয়াল মাদরাসা</h2><p>শিক্ষাবর্ষ: ${bnNum(s.year || "2026")} — ${esc(s.examBn || s.exam)} — ${esc(s.classBn || s.className)}</p></div></div>
    <div class="student-info">
      <div class="info-box"><small>পরীক্ষার্থীর নাম</small><strong>${esc(s.name)}</strong></div>
      <div class="info-box"><small>শ্রেণি</small><strong>${esc(s.classBn || s.className)}</strong></div>
      <div class="info-box"><small>রোল নম্বর</small><strong>${bnNum(s.roll)}</strong></div>
    </div>
    <div class="table-wrap"><table class="result-table">
      <thead><tr><th>ক্রম</th><th>বিষয়</th><th>নম্বর</th></tr></thead><tbody>${rows}</tbody>
    </table></div>
    <div class="summary">
      <div class="summary-box"><span>সর্বমোট নম্বর</span><strong>${total}</strong></div>
      <div class="summary-box"><span>গড়</span><strong>${avg}</strong></div>
      <div class="summary-box"><span>পয়েন্ট</span><strong>${point}</strong></div>
      <div class="summary-box"><span>অবস্থান</span><strong>${pos}</strong></div>
    </div>
    <div class="result-status">গ্রেড: <b>${esc(s.grade||'—')}</b> &nbsp; | &nbsp; ফলাফল: ${status}</div>
    <div class="print-row"><button class="print-btn" onclick="printResultArea()">🖨 ফলাফল প্রিন্ট / PDF</button></div>`;
  resultArea.classList.remove("hidden");
  resultArea.scrollIntoView({behavior:"smooth",block:"start"});
}

form.addEventListener("submit",e=>{
  e.preventDefault();
  resultArea.classList.add("hidden"); message.className="message hidden";
  const y=yearSelect.value, ev=exam.value, cv=className.value, roll=document.getElementById("roll").value.trim();
  if(!y||!ev||!cv||!roll){message.textContent="অনুগ্রহ করে সাল, পরীক্ষা, শ্রেণি ও রোল নম্বর পূরণ করুন।";message.className="message error";return;}
  const s=students.find(x=>String(x.year||"")===y&&x.exam===ev&&x.className===cv&&String(x.roll)===roll);
  if(!s){message.textContent="দুঃখিত! এই তথ্য অনুযায়ী কোনো ফলাফল পাওয়া যায়নি।";message.className="message error";return;}
  message.textContent="ফলাফল পাওয়া গেছে।";message.className="message success";showPersonalResult(s);
});

form.addEventListener("reset",()=>setTimeout(()=>{
  resetPersonal(true); message.className="message hidden"; resultArea.classList.add("hidden");
},0));

let currentListMode = "aplus";

function isRealStudent(s){
  return /^\d+$/.test(String(s?.roll ?? "").trim()) && String(s?.name ?? "").trim() !== "";
}
function rankNumber(s){
  if(!s || !isRealStudent(s)) return Infinity;
  if(typeof s.rank === "number" && Number.isFinite(s.rank)) return s.rank;
  const raw=String(s.rank||"").trim().replace(/[০-৯]/g,d=>"0123456789"["০১২৩৪৫৬৭৮৯".indexOf(d)]);
  const m=raw.match(/\d+/);
  return m ? Number(m[0]) : Infinity;
}
function validStudents(list){ return list.filter(isRealStudent); }

function showAPlusList(mode=currentListMode){
  currentListMode = mode;
  document.querySelectorAll(".list-option").forEach(btn=>{
    btn.classList.toggle("active", btn.dataset.list===mode);
  });

  const real=validStudents(students);
  let list;
  if(mode === "merit"){
    // প্রতিটি শ্রেণির ১ম–৩য় স্থানধারী শিক্ষার্থীদের মেধা তালিকা। টাই থাকলে সবাই থাকবে।
    list=real.filter(s=>rankNumber(s)<=3).slice().sort((a,b)=>{
      const ca=String(a.className||""), cb=String(b.className||"");
      if(ca!==cb) return ca.localeCompare(cb,undefined,{numeric:true});
      const ra=rankNumber(a), rb=rankNumber(b);
      if(ra!==rb) return ra-rb;
      return (Number(b.total)||0)-(Number(a.total)||0);
    });
  }else{
    list=real.filter(s=>String(s.grade||"").trim().toUpperCase()==="A+")
      .slice().sort((a,b)=>{
        const ya=Number(a.year)||0, yb=Number(b.year)||0;
        if(yb!==ya) return yb-ya;
        const ca=String(a.classBn||a.className||""), cb=String(b.classBn||b.className||"");
        if(ca!==cb) return ca.localeCompare(cb);
        const ra=rankNumber(a), rb=rankNumber(b);
        if(ra!==rb) return ra-rb;
        return (Number(b.total)||0)-(Number(a.total)||0);
      });
  }

  if(!list.length){
    aplusMeta.textContent="";
    aplusResult.innerHTML='<div class="classwise-empty">এই তালিকায় কোনো তথ্য পাওয়া যায়নি।</div>';
    aplusPanel.classList.remove("hidden");
    return;
  }

  const title = mode === "merit" ? "মেধা তালিকা" : "A+ প্রাপ্তদের তালিকা";
  aplusMeta.innerHTML=`<span>${title}: <b>${bnNum(list.length)}</b> জন</span><span>শিক্ষাবর্ষ: <b>২০২৬</b></span><span>পরীক্ষা: <b>দ্বিতীয় সাময়িক পরীক্ষা</b></span>`;

  const rows=list.map((s,i)=>{
    const pos=rankNumber(s);
    return `<tr>
      <td>${bnNum(i+1)}</td>
      <td>${bnNum(s.roll)}</td>
      <td class="aplus-student-name">${esc(s.name||"—")}</td>
      <td>${esc(s.classBn||s.className||"—")}</td>
      <td>${s.total==null?"—":bnNum(s.total)}</td>
      <td>${s.average==null?"—":bnNum(Number(s.average).toFixed(2))}</td>
      <td>${s.point==null?"—":bnNum(Number(s.point).toFixed(2))}</td>
      <td><strong class="aplus-grade">${esc(s.grade||"—")}</strong></td>
      <td>${pos===Infinity?"—":bnNum(pos)}</td>
    </tr>`;
  }).join("");

  aplusResult.innerHTML=`<table class="aplus-table">
    <thead><tr><th>ক্রম</th><th>রোল</th><th>পরীক্ষার্থীর নাম</th><th>শ্রেণী</th><th>মোট</th><th>গড়</th><th>পয়েন্ট</th><th>গ্রেড</th><th>অবস্থান</th></tr></thead>
    <tbody>${rows}</tbody></table>`;
  aplusPanel.classList.remove("hidden");
  aplusPanel.scrollIntoView({behavior:"smooth",block:"start"});
}

function showClassWiseResult(){
  const y=classYear.value, ev=classWiseExam.value, c=classWiseName.value;
  classWiseResult.classList.add("hidden");
  if(!y||!ev||!c){return;}

  // শুধুমাত্র আসল শিক্ষার্থী রেকর্ড নেওয়া হবে; grading guide/ফাঁকা সারি বাদ যাবে।
  const list=validStudents(students.filter(s=>String(s.year||"")===y&&s.exam===ev&&s.className===c));
  if(!list.length){
    classWiseResult.innerHTML='<div class="classwise-empty">দুঃখিত! এই সাল ও শ্রেণির কোনো ফলাফল পাওয়া যায়নি।</div>';
    classWiseResult.classList.remove("hidden"); return;
  }
  const f=list[0];
  const subjectNames=[];
  list.forEach(s=>(s.subjects||[]).forEach(x=>{
    const name=String(x.name||"").trim();
    if(name&&!subjectNames.includes(name)) subjectNames.push(name);
  }));
  const headers=["ক্রম","শিক্ষার্থীর নাম",...subjectNames,"মোট","গড়","গ্রেড","অবস্থান"];
  const rows=list.map((s,i)=>{
    const marks={}; (s.subjects||[]).forEach(x=>{const n=String(x.name||"").trim();if(n)marks[n]=x.marks;});
    const cells=subjectNames.map(n=>{const v=marks[n];return `<td>${v==null||v===""||v==="*"?"—":bnNum(v)}</td>`}).join("");
    const pos=rankNumber(s);
    return `<tr><td>${bnNum(i+1)}</td><td class="student-name">${esc(s.name)}</td>${cells}<td>${s.total==null?"—":bnNum(s.total)}</td><td>${s.average==null?"—":bnNum(Number(s.average).toFixed(2))}</td><td>${esc(s.grade||"—")}</td><td>${pos===Infinity?"—":bnNum(pos)}</td></tr>`;
  }).join("");

  const mobileCards=list.map((s,i)=>{
    const rows=(s.subjects||[]).map(x=>`<div class="mobile-subject"><span>${esc(x.name||"—")}</span><b>${x.marks==null||x.marks===""||x.marks==="*"?"—":bnNum(x.marks)}</b></div>`).join("");
    const pos=rankNumber(s);
    return `<article class="student-mobile-card"><div class="mobile-student-head"><strong>${bnNum(i+1)}. ${esc(s.name)}</strong><span>রোল: ${bnNum(s.roll)}</span></div><div class="mobile-subjects">${rows}</div><div class="mobile-summary"><span>মোট <b>${s.total==null?"—":bnNum(s.total)}</b></span><span>গড় <b>${s.average==null?"—":bnNum(Number(s.average).toFixed(2))}</b></span><span>গ্রেড <b>${esc(s.grade||"—")}</b></span><span>অবস্থান <b>${pos===Infinity?"—":bnNum(pos)}</b></span></div></article>`;
  }).join("");

  const headHtml=`<div class="classwise-head"><img src="logo.jpg" alt="মাদ্রাসার লোগো"><div><h2>${esc(f.classBn||f.className)} — শ্রেণিভিত্তিক ফলাফল</h2><p>শিক্ষাবর্ষ: ${bnNum(y)} — ${esc(f.examBn||f.exam)}</p></div></div>`;
  const tableHtml=`<div class="table-wrap classwise-print-table-wrap"><table class="result-table classwise-table"><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>`;
  classWiseResult.innerHTML=`${headHtml}<div class="classwise-desktop">${tableHtml}</div><div class="classwise-mobile">${mobileCards}</div><div class="print-row"><button class="print-btn" onclick="printClassWiseResult()">🖨 ফলাফল প্রিন্ট / PDF</button></div>`;
  classWiseResult.classList.remove("hidden");
  classWiseResult.scrollIntoView({behavior:"smooth",block:"start"});
}

function buildPersonalPrintSheet(s){
  const rows=(s.subjects||[]).map(x=>{
    const marks=x.marks==='*' ? '—' : bnNum(x.marks);
    return `<tr><td class="subject-name">${esc(x.name||'—')}</td><td>${marks}</td></tr>`;
  }).join("");
  const pos=typeof s.rank === "number" ? bnNum(s.rank) : esc(s.rank || "—");
  const absent=s.grade==='অনুপস্থিত' || !(s.subjects||[]).some(x=>typeof x.marks==='number');
  const status=absent ? 'অনুপস্থিত / অসম্পূর্ণ' : (s.grade==='F' ? 'ফেল' : 'উত্তীর্ণ');
  const grade=esc(s.grade||'—');
  const total=s.total==null?'—':bnNum(s.total);
  const avg=s.average==null?'—':bnNum(Number(s.average).toFixed(2));
  const point=s.point==null?'—':bnNum(Number(s.point).toFixed(2));
  return `
  <div class="print-sheet personal-print-sheet">
    <div class="print-decor top"></div>
    <div class="print-header">
      <div class="print-logo-wrap"><img src="logo.jpg" alt="মাদ্রাসার লোগো"></div>
      <div class="print-title">
        <h1>দারুন নাজাত আইডিয়াল মাদরাসা</h1>
        <h2>পরীক্ষার ফলাফল</h2>
        <p>আবুতোরাব, মিরসরাই, চট্টগ্রাম</p>
        <p>শিক্ষাবর্ষ: ${bnNum(s.year||'2026')} — ${esc(s.examBn||s.exam||'')}</p>
      </div>
      <div class="print-seal">RESULT</div>
    </div>
    <div class="print-student-title">শিক্ষার্থীর ফলাফল বিবরণী</div>
    <div class="print-meta-row">
      <div><span>পরীক্ষার্থীর নাম</span><strong>${esc(s.name||'—')}</strong></div>
      <div><span>শ্রেণি</span><strong>${esc(s.classBn||s.className||'—')}</strong></div>
      <div><span>রোল নম্বর</span><strong>${bnNum(s.roll)}</strong></div>
      <div><span>অবস্থান</span><strong>${pos}</strong></div>
    </div>
    <div class="print-body-grid">
      <div class="print-subject-area">
        <div class="print-section-label">বিষয়ভিত্তিক ফলাফল</div>
        <table class="result-table print-result-table">
          <thead><tr><th>বিষয়</th><th>নম্বর</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="grade-chart">
        <div class="grade-chart-title">ফলাফলের সারাংশ</div>
        <div class="grade-highlight"><span>গ্রেড</span><b>${grade}</b></div>
        <div class="mini-stat"><span>মোট</span><strong>${total}</strong></div>
        <div class="mini-stat"><span>গড়</span><strong>${avg}</strong></div>
        <div class="mini-stat"><span>পয়েন্ট</span><strong>${point}</strong></div>
      </div>
    </div>
    <div class="print-status ${s.grade==='F'||absent?'bad':'good'}">ফলাফল: <b>${status}</b></div>
    <div class="print-footer-note">দারুন নাজাত আইডিয়াল মাদরাসা — ফলাফল প্রকাশনা</div>
    <div class="print-signatures"><span>শ্রেণি শিক্ষক</span><span>পরীক্ষা নিয়ন্ত্রক</span><span>অধ্যক্ষ</span></div>
    <div class="print-decor bottom"></div>
  </div>`;
}

function openPrintWindow(htmlContent,title,orientation="portrait"){
  const win=window.open("", "_blank");
  if(!win){
    // Popup blocked হলে স্বাভাবিক print fallback।
    window.print();
    return;
  }

  const links=Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map(l=>`<link rel="stylesheet" href="${l.href}">`).join("");

  win.document.open();
  win.document.write(`<!doctype html>
<html lang="bn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
${links}
<style>
@page{size:A4 ${orientation};margin:8mm}
@page classwisePage{size:A4 landscape;margin:7mm}
html,body{background:#fff!important;color:#111!important;margin:0!important;padding:0!important}
body{font-family:'Noto Sans Bengali',Arial,sans-serif!important}
.result-head,.classwise-head{break-inside:avoid}
.table-wrap{overflow:visible!important}
.result-table{width:100%!important;border-collapse:collapse!important}
.result-table th,.result-table td{border:1px solid #222!important}
.print-row{display:none!important}
@media print{
  .result-card,.info-card,.contact-card,footer,.top-header,.print-row{display:none!important}
}
</style>
</head>
<body>
${htmlContent}
<script>
(function(){
  function doPrint(){
    try{window.focus();window.print();}catch(e){}
  }
  if(document.readyState==="complete"){setTimeout(doPrint,500);}
  else{window.addEventListener("load",function(){setTimeout(doPrint,500);});}
})();
<\/script>
</body>
</html>`);
  win.document.close();
}

function printResultArea(){
  if(!resultArea || resultArea.classList.contains("hidden") || !currentPersonalStudent) return;
  openPrintWindow(buildPersonalPrintSheet(currentPersonalStudent),"ব্যক্তিগত ফলাফল");
}

function printClassWiseResult(){
  if(!classWiseResult || classWiseResult.classList.contains("hidden")) return;
  openPrintWindow(classWiseResult.innerHTML,"শ্রেণিভিত্তিক ফলাফল","landscape");
}

function printAPlusResult(){
  if(!aplusPanel || aplusPanel.classList.contains("hidden")) return;
  openPrintWindow(aplusPanel.innerHTML,"বৃত্তিপ্রাপ্ত বা A+ প্রাপ্ত পরীক্ষার্থীদের তালিকা","landscape");
}

document.getElementById("classWiseForm").addEventListener("submit",e=>{
  e.preventDefault();
  const y=classYear.value, ev=classWiseExam.value, c=classWiseName.value;
  if(!y||!ev||!c){
    classWiseResult.innerHTML='<div class="classwise-empty">অনুগ্রহ করে সাল, পরীক্ষা ও শ্রেণি নির্বাচন করুন।</div>';
    classWiseResult.classList.remove("hidden");
    return;
  }
  showClassWiseResult();
});

document.querySelectorAll(".list-option").forEach(btn=>btn.addEventListener("click",()=>showAPlusList(btn.dataset.list)));

document.querySelectorAll("[data-view]").forEach(link=>link.addEventListener("click",e=>{
  e.preventDefault();
  const view=link.dataset.view;

  personalPanel.classList.add("hidden");
  classPanel.classList.add("hidden");
  aplusPanel.classList.add("hidden");
  resultArea.classList.add("hidden");

  if(view==="personal"){
    personalPanel.classList.remove("hidden");
  }else if(view==="classwise"){
    classPanel.classList.remove("hidden");
  }else if(view==="aplus"){
    showAPlusList();
  }

  closeMenu();
  window.scrollTo({top:0,behavior:"smooth"});
}));

function openMenu(){ menu.classList.add("open"); overlay.classList.add("show"); document.body.classList.add("menu-open"); }
function closeMenu(){ menu.classList.remove("open"); overlay.classList.remove("show"); document.body.classList.remove("menu-open"); }
document.getElementById("menuBtn").addEventListener("click",openMenu);
document.getElementById("menuClose").addEventListener("click",closeMenu);
overlay.addEventListener("click",closeMenu);

document.querySelectorAll("#mobileMenu a").forEach(a=>a.addEventListener("click",closeMenu));
loadResultData();
