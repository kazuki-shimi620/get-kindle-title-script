(function() {
    let csvData = "タイトル,著者,ASIN\n";
    let allBooks = [];
    let currentPage = 0;  // 最初はページ1からスタート

    // ページネーションのボタンをクリックして次ページに進む
    function clickNextPage() {
        let pageLinks = document.querySelectorAll("#pagination .page-item");
        if (currentPage < pageLinks.length - 1) {  // 最後のページを超えないように確認
            currentPage++;
            let pageLink = pageLinks[currentPage];  // ページリンクをクリック
            pageLink.click();
            setTimeout(processPage, 3000);  // ページが読み込まれるまで待機
        } else {
            // 最後のページに到達したらCSVをダウンロード
            downloadCSV();
        }
    }

    // 各ページから書籍情報を取得する
    function processPage() {
        getPageBooks();
        clickNextPage();  // 次のページに進む
    }

    // 書籍データを収集する
    function getPageBooks() {
        document.querySelectorAll(".digital_entity_title").forEach(el => {
            let title = el.textContent.trim();
            let asin = el.id.replace("content-title-", "");
            let authorRow = el.nextElementSibling;
            let author = (authorRow && authorRow.classList.contains("information_row")) 
                ? authorRow.textContent.trim() 
                : "不明";
            
            allBooks.push(`"${title}","${author}","${asin}"`);
        });
    }

    // CSVとしてダウンロード
    function downloadCSV() {
        csvData += allBooks.join("\n");
        let blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "kindle_books.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("📥 CSV ダウンロード完了!");
    }

    processPage();  // 初回実行
})();
