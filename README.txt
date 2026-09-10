দারুন নাজাত আইডিয়াল মাদ্রাসা — Automatic Excel Result Website

এই প্যাকেজটি আগের পছন্দের ওয়েবসাইট ডিজাইন/সিস্টেমের উপর ভিত্তি করে তৈরি।
ব্যক্তিগত ফলাফল, ক্লাসওয়ারী ফলাফল, মোবাইল মেনু এবং Print/PDF ব্যবস্থা রাখা হয়েছে।

AUTOMATIC EXCEL SYSTEM
----------------------
ভবিষ্যতে শুধু excel/ folder-এ Excel ফাইল upload করবেন।
GitHub Actions Excel থেকে data/results.json স্বয়ংক্রিয়ভাবে তৈরি করবে।

Excel ফাইলের নামের নিয়ম:
2026-1st-term.xlsx
2026-2nd-term.xlsx
2026-annual.xlsx
2027-1st-term.xlsx
ইত্যাদি।

Excel-এর ভিতরের format বর্তমান 2nd Term Examination.xlsx-এর মতো রাখবেন।
Class-1, Class-2, Class-3, Class-4, Class-5, Class-6, Narsari এবং Hifz sheet ব্যবহার করা যাবে।
Formula_Test sheet থাকলে সেটি ফলাফলে নেওয়া হবে না।

প্রথমবার GitHub-এ:
1. ZIP খুলে সব ফাইল repository-তে upload করুন।
2. GitHub Pages আগের মতো index.html থেকে চালু রাখুন।
3. Settings > Actions > General-এ Workflow permissions যদি দেখা যায়, "Read and write permissions" নির্বাচন করে Save করুন (সাধারণত workflow-তেই contents: write দেওয়া আছে)।

এরপর:
1. excel/ folder খুলুন।
2. নতুন Excel upload করুন।
3. Commit changes দিন।
4. Actions tab-এ "Update Result Data from Excel" workflow শেষ হওয়া পর্যন্ত অপেক্ষা করুন।
5. কয়েক মুহূর্ত পর website refresh করুন।

একই year + exam-এর Excel আবার upload করলে আগের সেই year + exam-এর data নতুন Excel দিয়ে replace হবে।
নতুন year + exam upload করলে পুরোনো ফলাফল রেখে নতুন ফলাফল যোগ হবে।

গুরুত্বপূর্ণ:
- Excel-এর নামের নিয়ম ঠিক রাখুন।
- Excel-এর sheet/column format বর্তমান template অনুযায়ী রাখুন।
- GitHub Pages public হলে website-এর ফলাফল public থাকবে।
