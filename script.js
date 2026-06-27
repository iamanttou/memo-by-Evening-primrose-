// ==========================
// PastelMemo
// script.js Part2
// ==========================

// フォルダ一覧
let folders = JSON.parse(localStorage.getItem("folders")) || [
    {
        id: crypto.randomUUID(),
        name: "創作",
        color: "🟥",
        notes: []
    },
    {
        id: crypto.randomUUID(),
        name: "学校",
        color: "🟦",
        notes: []
    }
];

// 保存
function saveFolders() {
    localStorage.setItem("folders", JSON.stringify(folders));
}

// 描画
function renderFolders() {

    const container = document.getElementById("folders");

    container.innerHTML = "";

    folders.forEach(folder => {

        const details = document.createElement("details");
        details.open = true;

        const summary = document.createElement("summary");
        summary.textContent = `${folder.color} ${folder.name}`;

        details.appendChild(summary);

        folder.notes.forEach(note => {

            const div = document.createElement("div");

            div.className = "note";
            div.textContent = "📄 " + note.title;

            details.appendChild(div);

        });

        container.appendChild(details);

    });

}

// 新しいフォルダ
document.getElementById("newFolder").onclick = () => {

    const name = prompt("フォルダ名");

    if(!name) return;

    const color = prompt("色を入力\n🟥 🟧 🟨 🟩 🟦 🟪");

    folders.push({

        id: crypto.randomUUID(),

        name,

        color: color || "⬜",

        notes: []

    });

    saveFolders();

    renderFolders();

};

// 起動
renderFolders();
