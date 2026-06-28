
/* =========================
   PastelMemo v0.2
   script.js (Part 1)
   - データ管理
   - フォルダ
   - メモ基盤
========================= */

/* ===== DOM取得 ===== */

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const folderList = document.getElementById("folderList");
const searchInput = document.getElementById("searchInput");

/* ===== 状態管理 ===== */

let state = {
    folders: [],
    currentFolderId: null,
    currentNoteId: null
};

/* ===== 初期化 ===== */

function init(){

    loadData();

    if(state.folders.length === 0){
        createDefaultData();
    }

    renderFolders();

}

init();

/* ===== デフォルトデータ ===== */

function createDefaultData(){

    state.folders = [
        {
            id: crypto.randomUUID(),
            name: "🟥 創作",
            notes: [
                {
                    id: crypto.randomUUID(),
                    title: "魔法設定",
                    content: "ここに魔法の設定を書く",
                    updatedAt: Date.now()
                }
            ]
        },
        {
            id: crypto.randomUUID(),
            name: "🟦 学校",
            notes: [
                {
                    id: crypto.randomUUID(),
                    title: "数学",
                    content: "授業メモ",
                    updatedAt: Date.now()
                }
            ]
        }
    ];

    saveData();

}

/* ===== 保存 ===== */

function saveData(){
    localStorage.setItem("pastelmemo", JSON.stringify(state));
}

/* ===== 読み込み ===== */

function loadData(){

    const data = localStorage.getItem("pastelmemo");

    if(data){
        state = JSON.parse(data);
    }

}

/* ===== フォルダ描画 ===== */

function renderFolders(){

    folderList.innerHTML = "";

    state.folders.forEach(folder => {

        const details = document.createElement("details");
        details.open = true;

        const summary = document.createElement("summary");
        summary.textContent = folder.name;

        summary.onclick = () => {
            toggleFolder(folder.id);
        };

        details.appendChild(summary);

        folder.notes.forEach(note => {

            const div = document.createElement("div");
            div.className = "noteItem";
            div.textContent = "📄 " + note.title;

            div.onclick = () => {
                openNote(folder.id, note.id);
            };

            details.appendChild(div);

        });

        folderList.appendChild(details);

    });

}

/* ===== フォルダ開閉 ===== */

function toggleFolder(folderId){

    const folder = state.folders.find(f => f.id === folderId);

    if(!folder) return;

    // 何もしなくてもdetailsが開閉するので将来拡張用

}

/* ===== メモを開く ===== */

function openNote(folderId, noteId){

    const folder = state.folders.find(f => f.id === folderId);
    if(!folder) return;

    const note = folder.notes.find(n => n.id === noteId);
    if(!note) return;

    state.currentFolderId = folderId;
    state.currentNoteId = noteId;

    titleInput.value = note.title;
    contentInput.value = note.content;

}

/* =========================
   PastelMemo v0.2
   script.js (Part 2)
   - 編集
   - 自動保存
   - 新規メモ
   - 新規フォルダ
========================= */

/* ===== 現在開いてるメモ ===== */

let currentFolder = null;
let currentNote = null;

/* =========================
   新規メモ作成
========================= */

document.getElementById("newNoteBtn").onclick = () => {

    if(state.folders.length === 0) return;

    const folder = state.folders[0]; // とりあえず先頭フォルダ

    const newNote = {
        id: crypto.randomUUID(),
        title: "無題",
        content: "",
        updatedAt: Date.now()
    };

    folder.notes.unshift(newNote);

    saveData();
    renderFolders();

    openNote(folder.id, newNote.id);

};

/* =========================
   フォルダ追加
========================= */

document.getElementById("newFolderBtn").onclick = () => {

    const name = prompt("フォルダ名を入力してね");

    if(!name) return;

    const newFolder = {
        id: crypto.randomUUID(),
        name: "📁 " + name,
        notes: []
    };

    state.folders.push(newFolder);

    saveData();
    renderFolders();

};

/* =========================
   編集 → 自動保存
========================= */

function autoSave(){

    if(!state.currentFolderId || !state.currentNoteId) return;

    const folder = state.folders.find(f => f.id === state.currentFolderId);
    if(!folder) return;

    const note = folder.notes.find(n => n.id === state.currentNoteId);
    if(!note) return;

    note.title = titleInput.value;
    note.content = contentInput.value;
    note.updatedAt = Date.now();

    saveData();
    renderFolders();

}

/* ===== 入力イベント ===== */

titleInput.addEventListener("input", autoSave);
contentInput.addEventListener("input", autoSave);

/* =========================
   検索（超シンプル版）
========================= */

searchInput.addEventListener("input", (e) => {

    const q = e.target.value.toLowerCase();

    const items = document.querySelectorAll(".noteItem");

    items.forEach(el => {

        const text = el.textContent.toLowerCase();

        if(text.includes(q)){
            el.style.display = "block";
        } else {
            el.style.display = "none";
        }

    });

});
