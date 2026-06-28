
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
