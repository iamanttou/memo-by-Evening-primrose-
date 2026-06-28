
/* =========================
   PastelMemo v1.0
   FINAL SCRIPT
========================= */

/* ===== DOM ===== */

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const folderList = document.getElementById("folderList");
const searchInput = document.getElementById("searchInput");
const newNoteBtn = document.getElementById("newNoteBtn");
const newFolderBtn = document.getElementById("newFolderBtn");

/* ===== 状態 ===== */

let state = {
    folders: [],
    currentFolderId: null,
    currentNoteId: null,
    recent: [],
    trash: []
};

/* =========================
   初期化
========================= */

init();

function init(){
    loadData();

    if(state.folders.length === 0){
        createDefault();
    }

    renderFolders();
}

/* =========================
   デフォルトデータ
========================= */

function createDefault(){

    state.folders = [
        {
            id: crypto.randomUUID(),
            name: "📁 メイン",
            notes: []
        }
    ];

    saveData();
}

/* =========================
   保存 / 読み込み
========================= */

function saveData(){
    localStorage.setItem("pastelmemo", JSON.stringify(state));
}

function loadData(){
    const data = localStorage.getItem("pastelmemo");
    if(data){
        state = JSON.parse(data);
    }
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

            div.textContent =
                (note.pinned ? "📌 " : "") +
                (note.favorite ? "⭐ " : "") +
                note.title;

            div.onclick = () => {
                openNote(folder.id, note.id);
            };

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
    note.updatedAt = Date.now();

    saveData();
    renderFolders();

}

titleInput.addEventListener("input", autoSave);
contentInput.addEventListener("input", autoSave);

/* =========================
   新規メモ
========================= */

newNoteBtn.onclick = () => {

    const folder = state.folders[0];
    if(!folder) return;

    const note = {
        id: crypto.randomUUID(),
        title: "無題",
        content: "",
        pinned: false,
        favorite: false,
        updatedAt: Date.now()
    };

    folder.notes.unshift(note);

    saveData();
    renderFolders();
    openNote(folder.id, note.id);

};

/* =========================
   新規フォルダ
========================= */

newFolderBtn.onclick = () => {

    const name = prompt("フォルダ名");

    if(!name) return;

    state.folders.push({
        id: crypto.randomUUID(),
        name: "📁 " + name,
        notes: []
    });

    saveData();
    renderFolders();

};

/* =========================
   検索
========================= */

searchInput.addEventListener("input", (e) => {

    const q = e.target.value.toLowerCase();

    document.querySelectorAll(".noteItem").forEach(el => {

        el.style.display =
            el.textContent.toLowerCase().includes(q)
            ? "block"
            : "none";

    });

});
