### 前言（preface）： 
這是一個以結合 Medium、Notion 各自優點為目標的部落格平台，其中核心技術在於**編輯器的實作(離線同步恢復、及時保存機制等等)**以及嘗試運用 **Deep Learning 的方式實作推薦演算法**，系統開發流程遵循**Scrum的敏捷開發方式**，是一個為期 3 sprints 的**全端個人專案**且有著高度的分層架構 (Layered Architecture) 讓整體的系統更好維護及擴展。

This is a blogging platform aimed at combining the best features of Medium and Notion. Its core technology focuses on the implementation of the editor (offline sync recovery, real-time save mechanism, etc.) and the application of machine learning (ML) for recommendation algorithm development. The system's development process adheres to the Scrum agile development method. It is a full-stack personal project spanning 3 sprints, featuring a highly layered architecture (Layered Architecture) which enhances the overall system's maintainability and scalability.

### Demo video:
Check out here: [Demo Video](https://youtu.be/xTIN2mkI4ts)



### 開發語言、環境與框架（Programming Languages, Environment, and Frameworks）：
**後端 (Back-end)：** *JavaScript、Node.js、Express、MySQL*

**前端(Front-end)：** _HTML、Styled-Component CSS、React.js_

**雲端服務 (Cloud Service)：** _AWS EC2(Linux ubuntu)、AWS RDS、AWS S3_

**容器化工具、技術（Containerization）：** _Docker、Docker Compose_

**快取 (Cache)：** _Redis_


### 其他主要技術：
**即時性實現：** _Socket.io_

**模型建置及訓練：** _Tensorflow.js_

**SSL、反向代理（Request broker）：** _Nginx_

**CI/CD自動化測試與部署：** _Github Action_

**Version Control：** _Git_

**身份驗證：**_JWT_



## 系統架構圖：
![richText](https://raw.githubusercontent.com/Lu-weiting/ImageRepository/master/InkLinkerSys.png)

### 亮點功能介紹（Feature Introduction）：

**_編輯器 (Editor)：_**
* 富文本效果：
    1. 運用 React Quill 實作
    2. 所見即所得的 Markdown 語法支援
    3. 搭配 AWS S3 預簽名的方式實作支援圖片上傳
![richText](https://raw.githubusercontent.com/Lu-weiting/ImageRepository/master/richText.png)
* 及時保存機制：
    1. 透過 **Socket.io , LocalStorage** 的搭配使用來做到讓用戶不會意外中斷後編輯內容遺失的問題
    2. 使用 Dompurify 去防止 **XSS 攻擊**
    3. 後端接到的 Socket 會 **先存到Redis中**，在 socket 關閉連線時才會同步到資料庫，進一步提升編輯器的效能
    4. 觸發儲存以及發送 socket 同步後端的時機點是在**鼠標失去 focus** 的時候而非每個打字瞬間（**減少 Redis 壓力**
    5. 透過在 header 處添加訊息 **可視化即時的儲存狀態(Saved, Saving)** 來讓用戶清楚知道儲存情況
* 離線編輯/自動恢復(同步)機制：
    1. 包含狀態通知(Can't save)同樣透過 LocalStorage 搭配Socket.io 實作，當偵測到再次恢復上線時，離線時編輯的內容不會消失而是會自動同步到後端去
ps: 這邊 demo 看影片最為清楚！
![offline](https://raw.githubusercontent.com/Lu-weiting/ImageRepository/master/offline.png)

**_會員註冊登入 (Signup/in)：_**

* _以中間件的方式實作 JWT 驗證使用者身份(Implementing JWT to verify the user Identity By means of middleware)_
```javascript
authorization: async (req, res, next) => {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || authorizationHeader.trim() === '' || typeof authorizationHeader === 'undefined') {
            return errorMsg.noToken(res);
        }
        try {
            const token = authorizationHeader.split(' ')[1];
            const payload = await tool.decodeToken(token);
            const { userId } = payload;
            req.userData = { userId: userId };
            return next();

        } catch (error) {
            console.error(error);
            return errorMsg.wrongToken(res);
        }
    },
```

**_文章相關(About The Post Feature)：_**
* _按贊功能：_
    1. 運用 lodash.debounce 實作防抖機制
![offline](https://raw.githubusercontent.com/Lu-weiting/ImageRepository/master/pLike.png)
    2. _以 cursor 的概念 **實作Pagination** 前端手刻 Infinite Scroll 來呈現_ 
    ```javascript
    const cusr= result.length < limit ? null : String(result[result.length - 2].id);
    let next_cursor = null;
    if(cusr != null){
    next_cursor = await tool.encryptCursor(cusr);
    next_cursor = encodeURIComponent(next_cursor);
    }
    ```

* _熱門Hashtags/文章_
* _文章標題搜尋功能_

**_推薦系統(Recommendation System)：_**
* _數據處理、準備：_
    1. query 出現有的用戶對每一篇文章的喜好情況（目前只考慮進用戶按讚這個行為
    2. 進行索引 mapping 後將一些不合的格式透過編碼處理轉換為符合 tensorflow 可接受的格式比如 category 就是透過 **one-hot encode** 從文字轉換而來
* _模型定義、訓練：_
    1. 運用 **tensorflow.js** 進行Model的定義(input,output,多少層、神經元等等)
    2. 將前面數據轉換後的結果喂給 Model，並將訓練好的 Model 透過 Docker Volume 持久化起來
* _模型預測用戶的閱讀偏好：_
    1. 將當前用戶ID放入 Model 預測並將結果整理進行排序後在再經過 Repo layer query 將推薦文章列表的詳細內容以 Pagination 方式呈現
    2. 因為 Model 吃到的資料是每位用戶對應每篇文章的對應喜好，所以除了個人喜好的文章種類推薦分數較高外，整體系統的熱門文章分數也會較高
    3. 也有透過Redis快取住推薦結果來提升用戶使用體驗
    ![offline](https://raw.githubusercontent.com/Lu-weiting/ImageRepository/master/Recommand.png)


### 環境部署（environment deploy）：

* _透過 **Nginx** 處理 **SSL** 以及**請求的反向代理** Handling SSL and HTTP/HTTPS request redirection through Nginx_

* _運用**Docker**將各個Service容器化比如Redis,Nginx，MySQL則用雲端的**RDS** Using Docker to containerize an Express application, Redis, Nginx, while utilizing cloud-based RDS for MYSQL_

* _運用 **GitHub Action 實作CI/CD** 完成**自動化測試與部署** 增加系統開發速度與完整性( Implement CI/CD with GitHub Actions for Automated Testing and Deployment to Docker)_

* _Git Version Control_

### 其他學習點：
1. 學習運用更高度的分層架構（Layered Architecture, CQRS）讓整體系統的**擴展性**以及**維護性**提高
2. Cache Aside 快取策略的實作
3. 前端 Redux、以及各種library的使用
4. 如何以適當合理的方式去提升系統的效能（比如編輯器的部分：何時將快取同步進資料庫等等

### 心路歷程（Inner Journey）：
這份 side project 是我第一份最為完整的全端(Full Stack)作品，也是第一份融入 AI技術而不是使用第三方 AI 服務的 Web 作品。回想起開發路程真的超級地獄，因為在只有3個 sprint（3週）的開發時間裡同時要準備學校的一坨期中考，睡6小時都成了最幸福的事，連飯都可以不吃整天除了打 code 上廁所外不出房門:D

但其實這段日子既地獄又開心，因為從來沒這麼全身心地投入開發某個專案的經驗，而且成就感隨著作品的完成度漸增呈現指數成長🥵，透過這份專案我對前端的開發也是多了份熟悉(但還是想以後端發展 不是那麼喜歡前端🥵)

對我自己來說這份專案的完成算是剛走出Web開發新手村，接下來 Waiting 要繼續朝著後端領域前進了！🔥

**THANKS WATCHING**
