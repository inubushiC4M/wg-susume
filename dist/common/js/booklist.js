            // |||||||||||||||||||||||||
            // .js-btnを押したら全件表示
            // |||||||||||||||||||||||||
            //ボタンクリック時の挙動
            $(() => {
                $(`.js-btn`).click(() => {
                    $(`.js-book-list dl`).addClass(`visible`);
                    $(`.more-btn`).css(`display`, `none`);
                });
            });


            // |||||||||||||||||||||||||
            // Ajax json読み込み
            // |||||||||||||||||||||||||
            $(() => {
                const dataFile = "../bookshelf/data/booklist.json";

                $.ajax({
                        url: dataFile,
                        dataType: "json",
                        type: "get",
                        cache: false
                    })
                    // 必ず実行される
                    .always(jrequest => {
                        console.log("Ajax関数が実行された");
                    })

                    // リクエスト成功時に実行
                    .done(jrequest => {
                        console.log("読み込み成功");

                        // コールバック
                        displayData(jrequest);
                    })

                    // Ajaxリクエストが失敗した時発動
                    .fail(jrequest_fail => {
                        console.log("Ajaxリクエストが失敗した");
                        //コールバック
                        $(".js-book-list").append(
                            '<p class="no_data">jsonの読み込みに失敗しました</p>'
                        );
                    });

                // |||||||||||||||||||||||||
                // Ajax コールバック関数
                // |||||||||||||||||||||||||
                function displayData(jrequest) {
                    //返すhtmlの場所
                    const result = $(".js-book-list");

                    //HTML生成
                    $.each(jrequest.book, (itemNum, itemValue) => {
                        result.append(`<dl class="child-${itemNum}"></dl>`);
                        const childContainer = $(`.child-${itemNum}`);

                        childContainer
                            .append(`<dt class="book_ttl">${itemValue.title}</dt>`)
                            .append(`<dd class="author">${itemValue.author}</dd>`)
                            .append(`<dd class="publisher">${itemValue.publisher}</dd>`);

                    });

                }
            });
