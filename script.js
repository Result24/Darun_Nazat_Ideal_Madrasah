let DATA=null;
const $=id=>document.getElementById(id);
const classMap={"Class-1":"Class-1","Class-2":"Class-2","Class-3":"Class-3","Class-4":"Class-4","Class-5":"Class-5","Class-6":"Class-6","Narsari":"নার্সারি","Hifz":"হিফজ"};
const bnDigits=s=>String(s??"").replace(/\d/g,d=>"০১২৩৪৫৬৭৮৯"[d]);
const enDigits=s=>String(s??"").replace(/[০-৯]/g,d=>"০১২৩৪৫৬৭৮৯".indexOf(d));
function fillClasses(){
  for(const id of ["classSelect","classSelect2"]){
    $(id).innerHTML='<option value="">শ্রেণি নির্বাচন করুন</option>';
    Object.keys(DATA.classes).forEach(k=>{let o=document.createElement("option");o.value=k;o.textContent=classMap[k]||k;$(id).appendChild(o)})
  }
}
function setView(v){
  $("personalView").classList.toggle("hidden",v!=="personal");
  $("classView").classList.toggle("hidden",v!=="classwise");
  $("menu").classList.remove("show");
  $("pageTitle").textContent=v==="personal"?"ব্যক্তিগত ফলাফল":"ক্লাস ওয়ারী ফলাফল";
  $("pageHint").textContent=v==="personal"?"সাল, পরীক্ষা, শ্রেণি ও রোল নম্বর দিয়ে ফলাফল খুঁজুন।":"সাল, পরীক্ষা ও শ্রেণি নির্বাচন করে পুরো ক্লাসের ফলাফল দেখুন।";
  $("result").innerHTML="";
}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function renderStudent(cls,st){
  const subs=DATA.classes[cls].subjects;
  let rows=subs.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(st.marks[x.key]??"—")}</td></tr>`).join("");
  $("result").innerHTML=`<div class="result-card"><div class="student-head"><div><h2>${esc(st.name)}</h2><div class="muted">${esc(classMap[cls]||cls)} · রোল ${bnDigits(st.roll)}</div></div><div class="rank">${esc(st.rank||"")}</div></div>
  <div class="stats"><div class="stat">মোট নম্বর<b>${esc(st.total??"—")}</b></div><div class="stat">গড়<b>${esc(st.average??"—")}</b></div><div class="stat">পয়েন্ট<b>${esc(st.point??"—")}</b></div><div class="stat">গ্রেড<b>${esc(st.grade??"—")}</b></div></div>
  <div class="table-wrap"><table><thead><tr><th>বিষয়</th><th>নম্বর</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function searchPersonal(){
  const cls=$("classSelect").value, roll=enDigits($("roll").value).trim();
  if(!cls||!roll){$("result").innerHTML='<div class="message">দয়া করে শ্রেণি ও রোল নম্বর নির্বাচন/লিখুন।</div>';return}
  const st=DATA.classes[cls].students.find(x=>String(x.roll)==roll);
  st?renderStudent(cls,st):$("result").innerHTML='<div class="message">এই রোল নম্বরের কোনো ফলাফল পাওয়া যায়নি।</div>';
}
function searchClass(){
  const cls=$("classSelect2").value;
  if(!cls){$("result").innerHTML='<div class="message">দয়া করে শ্রেণি নির্বাচন করুন।</div>';return}
  const arr=[...DATA.classes[cls].students].sort((a,b)=>{
    const ta=Number(a.total); const tb=Number(b.total);
    if(Number.isFinite(ta) && Number.isFinite(tb)) return tb-ta;
    if(Number.isFinite(ta)) return -1;
    if(Number.isFinite(tb)) return 1;
    return Number(a.roll||999)-Number(b.roll||999);
  });
  let rows=arr.map((s,i)=>`<tr><td>${bnDigits(i+1)}</td><td>${bnDigits(s.roll)}</td><td style="text-align:left">${esc(s.name)}</td><td>${esc(s.total??"—")}</td><td>${esc(s.average??"—")}</td><td>${esc(s.point??"—")}</td><td>${esc(s.grade??"—")}</td><td>${esc(s.rank??"—")}</td></tr>`).join("");
  $("result").innerHTML=`<div class="result-card"><div class="student-head"><div><h2>${esc(classMap[cls]||cls)} — ফলাফল</h2><div class="muted">${esc(DATA.year)} · ${esc(DATA.exam)}</div></div></div><div class="table-wrap"><table><thead><tr><th>ক্রম</th><th>রোল</th><th>শিক্ষার্থীর নাম</th><th>মোট</th><th>গড়</th><th>পয়েন্ট</th><th>গ্রেড</th><th>অবস্থান</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
$("menuBtn").onclick=()=> $("menu").classList.toggle("show");
document.querySelectorAll(".menu button").forEach(b=>b.onclick=()=>setView(b.dataset.view));
$("searchBtn").onclick=searchPersonal;
$("classSearchBtn").onclick=searchClass;
fetch("data.json").then(r=>r.json()).then(d=>{DATA=d;$("schoolName").textContent=d.school.replace(" আইডিয়াল মাদ্রাসা","");$("footerSchool").textContent=d.school;fillClasses()}).catch(()=>{$("result").innerHTML='<div class="message">ডেটা লোড করা যাচ্ছে না। data.json ফাইলটি একই ফোল্ডারে রাখুন।</div>'});
