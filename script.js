
/* =========================
   PastelMemo v0.5
   script.js
========================= */

/* ===== DOM ===== */

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const folderList = document.getElementById("folderList");
const searchInput = document.getElementById("searchInput");

let state = {
    folders: [],
    currentFolderId: null,
    currentNoteId: null
};

/* =========================
   初期化
========================= */

init();

function init(){
    loadData();
    renderFolders();
}

/* =========================
   保存
========================= */

function saveData(){
    localStorage.setItem("pastelmemo", JSON.stringify(state));
}

function loadData(){
    const data = localStorage.getItem("pastelmemo");
    if(data) state = JSON.parse(data);
}

/* =========================
   フォルダ描画
========================= */

function renderFolders(){

    folderList.innerHTML = "";

    state.folders.forEach(folder => {

        const details = document.createElement("details");
        details.open = true;

        const summary = document.createElement("summary");
        summary.textContent = folder.name;

        details.appendChild(summary);

        folder.notes.forEach(note => {

            const div = document.createElement("div");
            div.className = "noteItem";

            div.innerHTML = `
                📄 ${note.title}
                ${note.image ? "🖼" : ""}
                ${note.canvas ? "✏" : ""}
            `;

            div.onclick = () => openNote(folder.id, note.id);

            details.appendChild(div);

        });

        folderList.appendChild(details);

    });

}

/* =========================
   メモを開く
========================= */

function openNote(folderId, noteId){

    const folder = state.folders.find(f => f.id === folderId);
    const note = folder?.notes.find(n => n.id === noteId);

    if(!note) return;

    state.currentFolderId = folderId;
    state.currentNoteId = noteId;

    titleInput.value = note.title;
    contentInput.value = note.content;

}

/* =========================
   自動保存
========================= */

function autoSave(){

    const folder = state.folders.find(f => f.id === state.currentFolderId);
    const note = folder?.notes.find(n => n.id === state.currentNoteId);

    if(!note) return;

    note.title = titleInput.value;
    note.content = contentInput.value;

    saveData();
    renderFolders();

}

titleInput.addEventListener("input", autoSave);
contentInput.addEventListener("input", autoSave);

/* =========================
   🖼 画像アップロード
========================= */

const imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/*";

imageInput.onchange = () => {

    const file = imageInput.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = () => {

        const folder = state.folders.find(f => f.id === state.currentFolderId);
        const note = folder?.notes.find(n => n.id === state.currentNoteId);

        if(!note) return;

        note.image = reader.result; // base64

        saveData();
        renderFolders();

    };

    reader.readAsDataURL(file);

};

document.getElementById("imageBtn")?.addEventListener("click", () => {
    imageInput.click();
});

/* =========================
   ✏ 手書きキャンバス
========================= */

let canvas, ctx, drawing = false;

function initCanvas(){

    canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 200;
    canvas.style.border = "1px solid #ddd";

    ctx = canvas.getContext("2d");

    canvas.onmousedown = () => drawing = true;
    canvas.onmouseup = () => drawing = false;

    canvas.onmousemove = (e) => {

        if(!drawing) return;

        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(e.offsetX, e.offsetY, 2, 0, Math.PI*2);
        ctx.fill();

    };

}

/* =========================
   手書き保存
========================= */

function saveCanvas(){

    const folder = state.folders.find(f => f.id === state.currentFolderId);
    const note = folder?.notes.find(n => n.id === state.currentNoteId);

    if(!note) return;

    note.canvas = canvas.toDataURL();

    saveData();
    renderFolders();

}

/* =========================
   検索
========================= */

searchInput.addEventListener("input", (e) => {

    const q = e.target.value.toLowerCase();

    document.querySelectorAll(".noteItem").forEach(el => {

        el.style.display = el.textContent.toLowerCase().includes(q)
            ? "block"
            : "none";

    });

});

/* =========================
   新規メモ
========================= */

document.getElementById("newNoteBtn").onclick = () => {

    const folder = state.folders[0];
    if(!folder) return;

    const note = {
        id: crypto.randomUUID(),
        title: "無題",
        content: "",
        image: null,
        canvas: null
    };

    folder.notes.unshift(note);

    saveData();
    renderFolders();

};
