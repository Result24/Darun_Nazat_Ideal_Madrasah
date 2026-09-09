// ফলাফল ডাটা: ২০২৬ সালের দ্বিতীয় সাময়িক পরীক্ষা
const students = [];

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

function showClassWiseResult(){
  const y=classYear.value, ev=classWiseExam.value, c=classWiseName.value;
  classWiseResult.classList.add("hidden");
  if(!y||!ev||!c){return;}

  const list=students.filter(s=>String(s.year||"")===y&&s.exam===ev&&s.className===c);
  if(!list.length){
    classWiseResult.innerHTML='<div class="classwise-empty">দুঃখিত! এই সাল ও শ্রেণির কোনো ফলাফল পাওয়া যায়নি।</div>';
    classWiseResult.classList.remove("hidden");
    return;
  }

  const f=list[0];

  // এই শ্রেণির সব শিক্ষার্থীর subject list থেকে কলাম তৈরি হবে।
  const subjectNames=[];
  list.forEach(s=>(s.subjects||[]).forEach(x=>{
    const name=String(x.name||"").trim();
    if(name && !subjectNames.includes(name)) subjectNames.push(name);
  }));

  const headers=["ক্রম","শিক্ষার্থীর নাম",...subjectNames,"মোট","গড়","গ্রেড","অবস্থান"];

  const rows=list.map((s,i)=>{
    const marks={};
    (s.subjects||[]).forEach(x=>{
      const n=String(x.name||"").trim();
      if(n) marks[n]=x.marks;
    });

    const subjectCells=subjectNames.map(n=>{
      const v=marks[n];
      return `<td>${v==null||v===""||v==="*"?"—":bnNum(v)}</td>`;
    }).join("");

    return `<tr>
      <td>${bnNum(i+1)}</td>
      <td class="student-name">${esc(s.name)}</td>
      ${subjectCells}
      <td>${s.total==null?"—":bnNum(s.total)}</td>
      <td>${s.average==null?"—":bnNum(Number(s.average).toFixed(2))}</td>
      <td>${esc(s.grade||"—")}</td>
      <td>${typeof s.rank==="number"?bnNum(s.rank):esc(s.rank||"—")}</td>
    </tr>`;
  }).join("");

  const headHtml=`
    <div class="classwise-head">
      <img src="logo.jpg" alt="মাদ্রাসার লোগো">
      <div>
        <h2>${esc(f.classBn||f.className)} — শ্রেণিভিত্তিক ফলাফল</h2>
        <p>শিক্ষাবর্ষ: ${bnNum(y)} — ${esc(f.examBn||f.exam)}</p>
      </div>
    </div>`;

  const tableHtml=`
    <div class="table-wrap classwise-print-table-wrap">
      <table class="result-table classwise-table">
        <thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

  classWiseResult.innerHTML=`
    ${headHtml}
    ${tableHtml}
    <div class="print-row">
      <button class="print-btn" onclick="printClassWiseResult()">🖨 ফলাফল প্রিন্ট / PDF</button>
    </div>`;

  classWiseResult.classList.remove("hidden");
  classWiseResult.scrollIntoView({behavior:"smooth",block:"start"});
}

function openPrintWindow(htmlContent,title){
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
@page{size:A4 portrait;margin:8mm}
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
  if(!resultArea || resultArea.classList.contains("hidden")) return;
  openPrintWindow(resultArea.innerHTML,"ব্যক্তিগত ফলাফল");
}

function printClassWiseResult(){
  if(!classWiseResult || classWiseResult.classList.contains("hidden")) return;
  openPrintWindow(classWiseResult.innerHTML,"শ্রেণিভিত্তিক ফলাফল");
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

document.querySelectorAll("[data-view]").forEach(link=>link.addEventListener("click",e=>{
  e.preventDefault();
  const view=link.dataset.view;
  if(view==="personal"){
    personalPanel.classList.remove("hidden");
    classPanel.classList.add("hidden");
  }else{
    personalPanel.classList.add("hidden");
    classPanel.classList.remove("hidden");
  }
  closeMenu();
  resultArea.classList.add("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
}));

function openMenu(){ menu.classList.add("open"); overlay.classList.add("show"); document.body.classList.add("menu-open"); }
function closeMenu(){ menu.classList.remove("open"); overlay.classList.remove("show"); document.body.classList.remove("menu-open"); }
document.getElementById("menuBtn").addEventListener("click",openMenu);
document.getElementById("menuClose").addEventListener("click",closeMenu);
overlay.addEventListener("click",closeMenu);

document.querySelectorAll("#mobileMenu a").forEach(a=>a.addEventListener("click",closeMenu));
loadResultData();
