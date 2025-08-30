
const form = document.getElementById('downloadForm');
const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');
document.getElementById('year').textContent = new Date().getFullYear();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = document.getElementById('url').value.trim();
  const type = document.querySelector('input[name="type"]:checked').value;
  if (!url) return;
  statusDiv.textContent = "⏳ جاري جلب الرابط...";
  resultDiv.innerHTML = "";
  try {
    const res = await fetch("http://localhost:8000/download", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ url, type })
    });
    const data = await res.json();
    if (data.success) {
      statusDiv.textContent = "✅ جاهز للتحميل";
      resultDiv.innerHTML = `<a href="${data.download_url}" target="_blank">اضغط هنا للتحميل</a>`;
    } else {
      statusDiv.textContent = "❌ فشل التحميل: " + data.error;
    }
  } catch(err) {
    statusDiv.textContent = "⚠️ حدث خطأ في السيرفر.";
  }
});
