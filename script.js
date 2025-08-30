// Basic client-side downloader: passes the URL to the browser so the phone downloads it.
// No files are stored on the server.

(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const form = $("#downloadForm");
  const urlInput = $("#url");
  const status = $("#status");
  const yearSpan = document.querySelector(".year");
  if(yearSpan) yearSpan.textContent = new Date().getFullYear();

  function isLikelyURL(v){
    try{
      const u = new URL(v);
      return /^https?:$/.test(u.protocol);
    }catch{ return false; }
  }

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const raw = urlInput.value.trim();
    if(!isLikelyURL(raw)){
      status.className = "status err";
      status.textContent = "⚠️ رجاءً أدخل رابط صحيح يبدأ بـ http أو https";
      urlInput.focus();
      return;
    }

    // Provide quick feedback
    status.className = "status ok";
    status.textContent = "يتم فتح الرابط… إذا لم يبدأ التحميل تلقائيًا، سيفتح الملف في تبويب جديد.";

    // Try to initiate download
    const a = document.createElement("a");
    a.href = raw;
    a.rel = "noopener";
    a.target = "_blank"; // better for mobile—lets the site handle Content-Disposition
    // Some servers honor the download attribute; others ignore it (cross-origin).
    a.setAttribute("download", "");
    document.body.appendChild(a);
    a.click();
    setTimeout(()=> a.remove(), 0);
  });

  // Quality-of-life: paste listener for mobile
  urlInput.addEventListener("paste", ()=> {
    status.textContent = "";
    status.className = "status";
  });
})();