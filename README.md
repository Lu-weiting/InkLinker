# InkLinker: Medium-style blog platform 📝

![deploy workflow](https://github.com/Lu-weiting/InkLinker/actions/workflows/CICD.yml/badge.svg)


## Summary： 
這是一個以復刻 Medium 但編輯器更好用為目標的部落格平台，其中核心技術在於**編輯器的實作(離線同步恢復、及時保存機制等等)**以及嘗試運用 **Deep Learning 的方式實作推薦演算法**，系統開發流程遵循**Scrum的敏捷開發方式**，是一個為期 3 sprints 的**全端個人專案**且有著高度的分層架構 (Layered Architecture) 讓整體的系統更好維護及擴展。


## Table of contents
- [InkLinker: Medium-style blog platform 📝](#inklinker-medium-style-blog-platform-️)
  - [Table of contents](#table-of-contents)
  - [Demo \& Screenshots](#demo--screenshots)
  - [Main Features](#main-features)
  - [System Architecture](#system-architecture)
  - [Built with](#built-with)
  - [Getting Started](#getting-started)
  - [Inner Journey](#inner-journey)



## Demo video:

![demo-report-10-fps](./docs/demo.gif)

**Check out here:** [Demo Video](https://youtu.be/xTIN2mkI4ts)


## Main Features

**編輯器 (Editor)：**
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


**_文章相關(About The Post Feature)：_**
* 按贊功能：
    1. 運用 lodash.debounce 實作防抖機制
![offline](https://raw.githubusercontent.com/Lu-weiting/ImageRepository/master/pLike.png)
* 以 cursor 的概念**實作 Pagination** 前端手刻 Infinite Scroll 來呈現

* 熱門 Hashtags / 文章
* 文章標題搜尋功能

**推薦系統(Recommendation System)：**
* 數據處理、準備：
    1. query 出現有的用戶對每一篇文章的喜好情況（目前只考慮進用戶按讚這個行為
    2. 進行索引 mapping 後將一些不合的格式透過編碼處理轉換為符合 tensorflow 可接受的格式比如 category 就是透過 **one-hot encode** 從文字轉換而來
* 模型定義、訓練：
    1. 運用 **tensorflow.js** 進行Model的定義(input,output,多少層、神經元等等)
    2. 將前面數據轉換後的結果喂給 Model，並將訓練好的 Model 透過 Docker Volume 持久化起來
* 模型預測用戶的閱讀偏好：
    1. 將當前用戶ID放入 Model 預測並將結果整理進行排序後在再經過 Repo layer query 將推薦文章列表的詳細內容以 Pagination 方式呈現
    2. 因為 Model 吃到的資料是每位用戶對應每篇文章的對應喜好，所以除了個人喜好的文章種類推薦分數較高外，整體系統的熱門文章分數也會較高
    3. 也有透過 Redis 快取住推薦結果來提升用戶使用體驗
    ![offline](https://raw.githubusercontent.com/Lu-weiting/ImageRepository/master/Recommand.png)



## System Architecture：

![richText](https://raw.githubusercontent.com/Lu-weiting/ImageRepository/master/InkLinkerSys.png)


## Built with

Primary Language: JavaScript

**Frontend service** 
* React.js
* Styled-Component CSS

**Backend service** 
* Node.js
* Express
* MySQL
* Redis
* Socket.io
* Nginx
* Tensorflow.js
* JWT

**Cloud Service** 
* AWS EC2(Linux ubuntu)
* AWS RDS
* AWS S3

**CI/CD** 
* Docker
* Github Action
* Git


## Getting Started

1. **Check Environment Variables**  
   Make sure `.env` file in the folders is correctly set up as per `.env.example`.

2. **Install Dependencies**  
   If dependencies are not installed yet, run the following commands:
    ```shell
    cd backend
    npm install
    cd ../frontend
    npm install
    ```

3. **Start backend and frontend**  
   Run the following command to start:
    ```shell
    docker compsoe up -d --build
    ```




## 心路歷程（Inner Journey）：
這份 side project 是我第一份最為完整的全端(Full Stack)作品，也是第一份融入 AI 技術而不是使用第三方 AI 服務的 Web 作品。回想起開發路程真的超級地獄，因為在只有 3 個 sprint（3週）的開發時間裡同時要準備學校的一坨期中考，睡 6 小時都成了最幸福的事，連飯都可以不吃整天除了打 code 上廁所外不出房門:D

但其實這段日子既地獄又開心，因為從來沒這麼全身心地投入開發某個專案的經驗，而且成就感隨著作品的完成度漸增呈現指數成長🥵，透過這份專案我對前端的開發也是多了份熟悉(但還是想以後端發展 不是那麼喜歡前端🥵)

對我自己來說這份專案的完成算是剛走出 Web 開發新手村，接下來 Waiting 要繼續朝著後端領域前進了！🔥

**THANKS WATCHING**
