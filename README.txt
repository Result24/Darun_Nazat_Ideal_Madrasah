দারুন নাজাত আইডিয়াল মাদরাসা — ফলাফল ওয়েবসাইট

এই ZIP-টি GitHub Repository-এর মূল (root) অংশে আপলোড করার জন্য সাজানো হয়েছে।

ফোল্ডার কাঠামো:
- .github/workflows/update-results.yml = Excel থেকে ফলাফল আপডেট করার GitHub Action
- data/ = তৈরি হওয়া ফলাফল ডেটা
- excel/ = ভবিষ্যতে নতুন Excel ফাইল এখানে আপলোড করবেন
- excel-template/ = নমুনা/পুরোনো Excel ফাইল; এটি সরাসরি excel/ এ আপলোড করবেন না, যদি না ফাইলের নাম সঠিকভাবে বছর+পরীক্ষা বোঝায়

ভবিষ্যতে Excel আপলোড:
1. Repository খুলুন
2. excel ফোল্ডারে ঢুকুন
3. Add file → Upload files
4. Excel ফাইল আপলোড করুন
5. ফাইলের নাম এই ধরনের রাখুন:
   2026-2nd-term.xlsx
   2027-annual.xlsx
   2027-1st-term.xlsx
6. Commit changes দিন
7. GitHub Actions নিজে ফলাফল ডেটা তৈরি করবে

গুরুত্বপূর্ণ:
- index.html, script.js, style.css, build_results.py, bijoy2unicode.py এবং .github/workflows ফোল্ডারের কাঠামো পরিবর্তন করবেন না।
- result-qrcode.png ওয়েবসাইটের QR Code।
- নোটিশ বোর্ডের ভেতরেই QR Code রাখা হয়েছে।
- নতুন নোটিশ পরিবর্তন করতে index.html-এর নোটিশ বোর্ড অংশ পরিবর্তন করতে হবে; চাইলে নোটিশের লেখা আমাকে দিলে আমি শুধু ওই অংশ পরিবর্তন করে দিতে পারি।
