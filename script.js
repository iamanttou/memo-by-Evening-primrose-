
/* =========================
   PastelMemo v0.6
   script.js
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
    stats: {
        totalNotes: 0
    }
};

/* =========================
   初期化
========================= */

init();

function init(){
    loadData();
    updateStats();
    renderFolders();
}

/* =========================
   保存 / 読み込み
========================= */

function saveData(){
    localStorage.setItem("pastelmemo", JSON.stringify(state));
    updateStats();
}

function loadData(){
    const data = localStorage.getItem("pastelmemo");
    if(data) state = JSON.parse(data);
}

/* =========================
   統計
========================= */

function updateStats(){

    let count = 0;

    state.folders.forEach(f => {
        count += f.notes.length;
    });

    state.stats.totalNotes = count;

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

            div.innerHTML =
                (note.pinned ? "📌 " : "") +
                (note.favorite ? "⭐ " : "") +
                "📄 " + note.title;

            div.onclick = () => {
                openNote(folder.id, note.id);
                addRecent(note);
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

/* =========================
   最近のメモ
========================= */

function addRecent(note){

    state.recent.unshift({
        id: note.id,
        title: note.title
    });

    state.recent = state.recent.slice(0, 10);

    saveData();

}

/* =========================
   新規メモ（テンプレ対応）
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
   テンプレート（超簡易）
========================= */

function insertTemplate(type){

    let text = "";

    if(type === "todo"){
        text = "- [ ] タスク1\n- [ ] タスク2\n- [ ] タスク3";
    }

    if(type === "diary"){
        text = "📅 今日の出来事\n\n感じたこと：\n";
    }

    contentInput.value += text;

    autoSave();

}

/* =========================
   ショートカット
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
