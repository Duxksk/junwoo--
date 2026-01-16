const loading = document.getElementById("loading");
const form = document.getElementById("uploadForm");

form.addEventListener("submit", () => {
  loading.classList.remove("hidden");
});

fetch("/files")
  .then(res => res.json())
  .then(files => {
    const list = document.getElementById("fileList");

    Object.keys(files).forEach(name => {
      const li = document.createElement("li");

      li.innerHTML = `
        🍥 ${files[name].original}
        <input type="password" placeholder="비번">
        <button>받기</button>
      `;

      li.querySelector("button").onclick = () => {
        const pw = li.querySelector("input").value;

        fetch("/download", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `name=${name}&password=${pw}`
        })
        .then(res => res.blob())
        .then(blob => {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = files[name].original;
          a.click();
        });
      };

      list.appendChild(li);
    });
  });
