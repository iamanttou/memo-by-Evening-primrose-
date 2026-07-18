/*==========================
  Pastel Memo
  script.js
==========================*/

// --------------------
// データ
// --------------------

let memos = JSON.parse(localStorage.getItem("pastelMemo")) || [];

let currentMemoId = null;
let currentTag = null;

// --------------------
// 要素取得
// --------------------

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

const memoList = document.getElementById("memoList");
const tagList = document.getElementById("tagList");

const createdAt = document.getElementById("createdAt");
const updatedAt = document.getElementById("updatedAt");

const newBtn = document.getElementById("newBtn");
const deleteBtn = document.getElementById("deleteBtn");

const memoTemplate = document.getElementById("memoTemplate");

// --------------------
// 保存
// --------------------

function saveData(){
    localStorage.setItem(
        "pastelMemo",
        JSON.stringify(memos)
    );
}

// --------------------
// 日付
// --------------------

function formatDate(date){

    const d = new Date(date);

    return d.toLocaleString("ja-JP");

}

// --------------------
// タグ抽出
// --------------------

function extractTags(text){

    const result = text.match(/#([^\s#]+)/g);

    if(!result) return [];

    return [...new Set(
        result.map(tag => tag.replace("#",""))
    )];

}

// --------------------
// 新規メモ
// --------------------

function createMemo(){

    const now = new Date().toISOString();

    const memo = {

        id: Date.now().toString(),

        title: "無題",

        content: "",

        tags: [],

        createdAt: now,

        updatedAt: now

    };

    memos.unshift(memo);

    currentMemoId = memo.id;

    saveData();

    renderMemoList();
    renderTags();
    loadMemo(memo.id);

}

// --------------------
// メモ取得
// --------------------

function getCurrentMemo(){

    return memos.find(
        memo => memo.id === currentMemoId
    );

}

// --------------------
// メモ読み込み
// --------------------

function loadMemo(id){

    const memo = memos.find(
        m => m.id === id
    );

    if(!memo) return;

    currentMemoId = id;

    titleInput.value = memo.title;

    contentInput.value = memo.content;

    createdAt.textContent =
        "作成日：" + formatDate(memo.createdAt);

    updatedAt.textContent =
        "更新日：" + formatDate(memo.updatedAt);

    document
        .querySelectorAll(".memo-card")
        .forEach(card=>{

            card.classList.remove("active");

            if(card.dataset.id===id){

                card.classList.add("active");

            }

        });

}

// --------------------
// 初期メモ
// --------------------

if(memos.length===0){

    createMemo();

}else{

    loadMemo(memos[0].id);

}
// --------------------
// メモ更新
// --------------------

function updateCurrentMemo(){

    const memo = getCurrentMemo();

    if(!memo) return;

    memo.title =
        titleInput.value.trim() || "無題";

    memo.content =
        contentInput.value;

    memo.tags =
        extractTags(memo.content);

    memo.updatedAt =
        new Date().toISOString();

    saveData();

    renderMemoList();

    renderTags();

    updatedAt.textContent =
        "更新日：" + formatDate(memo.updatedAt);

}

// --------------------
// メモ一覧
// --------------------

function renderMemoList(){

    memoList.innerHTML = "";

    let list = memos;

    if(currentTag){

        list = memos.filter(memo =>
            memo.tags.includes(currentTag)
        );

    }

    list.forEach(memo=>{

        const card =
            memoTemplate.content
            .cloneNode(true);

        const root =
            card.querySelector(".memo-card");

        root.dataset.id = memo.id;

        if(memo.id===currentMemoId){

            root.classList.add("active");

        }

        card.querySelector(".memo-title").textContent =
            memo.title;

        card.querySelector(".memo-preview").textContent =
            memo.content.substring(0,120);

        const tagArea =
            card.querySelector(".memo-tags");

        memo.tags.forEach(tag=>{

            const span =
                document.createElement("span");

            span.textContent = "#" + tag;

            tagArea.appendChild(span);

        });

        card.querySelector(".memo-date").textContent =
            formatDate(memo.updatedAt);

        root.addEventListener("click",()=>{

            loadMemo(memo.id);

        });

        memoList.appendChild(card);

    });

}

// --------------------
// タグ一覧
// --------------------

function renderTags(){

    tagList.innerHTML = "";

    const tags = [];

    memos.forEach(memo=>{

        memo.tags.forEach(tag=>{

            if(!tags.includes(tag)){

                tags.push(tag);

            }

        });

    });

    // すべて表示

    const all =
        document.createElement("div");

    all.className = "tag";

    all.textContent = "すべて";

    all.onclick = ()=>{

        currentTag = null;

        renderMemoList();

    };

    tagList.appendChild(all);

    tags.sort();

    tags.forEach(tag=>{

        const div =
            document.createElement("div");

        div.className = "tag";

        div.textContent = "#" + tag;

        div.onclick = ()=>{

            currentTag = tag;

            renderMemoList();

        };

        tagList.appendChild(div);

    });

}

// --------------------
// 削除
// --------------------

function deleteMemo(){

    if(!currentMemoId) return;

    if(!confirm("このメモを削除しますか？")){

        return;

    }

    memos = memos.filter(
        memo=>memo.id!==currentMemoId
    );

    if(memos.length===0){

        createMemo();

        return;

    }

    saveData();

    renderMemoList();

    renderTags();

    loadMemo(memos[0].id);

}

// --------------------
// イベント
// --------------------

titleInput.addEventListener("input",updateCurrentMemo);

contentInput.addEventListener("input",updateCurrentMemo);

newBtn.addEventListener("click",createMemo);

deleteBtn.addEventListener("click",deleteMemo);

// --------------------
// 初期表示
// --------------------

renderMemoList();

renderTags();
