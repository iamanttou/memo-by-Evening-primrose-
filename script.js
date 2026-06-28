
/* =========================
   PastelMemo v1.0
   FINAL SCRIPT
========================= */

/* ===== DOM ===== */

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const folderList = document.getElementById("folderList");
const searchInput = document.getElementById("searchInput");

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
    renderFolders();
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
   フォルダ描画（完成版）
========================= */

function renderFolders(){

    folderList.innerHTML = "";

    state.folders.forEach(folder => {

        const details = document.createElement("details");
        details.open = true;

        const summary = document.createElement("summary");
        summary.textContent = folder.name;

        details.appendChild(summary);

        const notes = [...folder.notes];

        // ピン優先 + 更新順
        notes.sort((a,b)=>
            (b.pinned - a.pinned) ||
            (b.updatedAt - a.updatedAt)
        );

        notes.forEach(note => {

            const div = document.createElement("div");
            div.className = "noteItem";

            div.innerHTML =
                (note.pinned ? "📌 " : "") +
                (note.favorite ? "⭐ " : "") +
                "📄 " +
                note.title;

            div.onclick = () => {
                openNote(folder.id, note.id);
                addRecent(note);
            };

            div.oncontextmenu = (e) => {
                e.preventDefault();
                toggleFavorite(note);
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
   自動保存（完成版）
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

document.getElementById("newNoteBtn").onclick = () => {

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

document.getElementById("newFolderBtn").onclick = () => {

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
   ⭐ お気に入り
========================= */

function toggleFavorite(note){

    note.favorite = !note.favorite;

    saveData();
    renderFolders();

}

/* =========================
   📌 ピン
========================= */

function togglePin(note){

    note.pinned = !note.pinned;

    saveData();
    renderFolders();

}

/* =========================
   🗑 ゴミ箱
========================= */

function deleteNote(folderId, noteId){

    const folder = state.folders.find(f => f.id === folderId);
    if(!folder) return;

    const index = folder.notes.findIndex(n => n.id === noteId);

    if(index === -1) return;

    const [removed] = folder.notes.splice(index, 1);

    state.trash.push(removed);

    saveData();
    renderFolders();

}

/* =========================
   🧠 最近のメモ
========================= */

function addRecent(note){

    state.recent.unshift(note);

    state.recent = state.recent.slice(0, 10);

    saveData();

}

/* =========================
   🔍 検索
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

/* =========================
   🧠 キーボードショートカット
========================= */

document.addEventListener("keydown", (e) => {

    if(e.ctrlKey && e.key === "s"){
        e.preventDefault();
        autoSave();
    }

    if(e.ctrlKey && e.key === "n"){
        e.preventDefault();
        document.getElementById("newNoteBtn").click();
    }

});
