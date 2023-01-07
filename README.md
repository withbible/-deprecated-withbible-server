<div align="center">

# KBU BibleGraduationExam QuizApp API Server

<a href="https://nodejs.org/ko/download/">
<img src="https://img.shields.io/badge/Node.js-16-339933?logo=Node.js&logoColor=white"/>
</a>

<a href="https://mariadb.com/kb/en/introduction-to-relational-databases/">
<img src="https://img.shields.io/badge/MariaDB-10.5-003545?logo=MariaDB&logoColor=white"/>
</a>

<a href="https://expressjs.com/ko/">
<img src="https://img.shields.io/badge/Express-4-000000?logo=Express"/> 
</a>

<a href="https://avatars.dicebear.com/">
<img src="https://img.shields.io/badge/DiceBear Avatars-19b5fe?logo=data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgc3R5bGU9Imlzb2xhdGlvbjppc29sYXRlIiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cGF0aCBkPSJNOCAxNXYxSDR2MUgzdjNoMTR2LTNoLTF2LTFoLTR2LTFoM3YtMWgxdi0xaDF2LTNoMVY3aC0xVjRoLTFWM2gtMVYySDV2MUg0djFIM3YzSDJ2M2gxdjNoMXYxaDF2MWgzeiIgZmlsbD0iI0ZGREJBQyIvPjxwYXRoIGQ9Ik01IDE1di0xSDR2LTFIM3YtM0gyVjdoMVY0aDFWM2gxVjJoMTB2MWgxdjFoMXYzaDF2M2gtMXYzaC0xdjFoLTF2MUg1eiIgZmlsbD0iI0ZGRiIgZmlsbC1vcGFjaXR5PSIuMSIvPjxwYXRoIGQ9Ik01IDhoM3YxSDVWOHptNyAwaDN2MWgtM1Y4eiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik02IDhoMXYxSDZWOHptNyAwaDF2MWgtMVY4eiIgZmlsbD0iIzY5N2I5NCIvPjxwYXRoIGQ9Ik03IDV2MUg1djFINFY2aDFWNWgyem03IDB2MWgtMnYxaC0xVjZoMVY1aDJ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMzNjJlMmUiLz48cGF0aCBkPSJNOCAxM3YxaDR2LTFoMXYtMWgtMXYxSDh6IiBmaWxsPSIjZDI5OTg1Ii8+PHBhdGggZD0iTTQgOEgzVjdoMVY2aDV2MWgyVjZoNXYxaDF2MWgtMXYyaC01VjhIOXYySDRWOHptMSAwVjdoM3YySDVWOHptNy0xdjJoM1Y3aC0zeiIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYTA0YjVkIi8+PHBhdGggZD0iTTUgN2gzdjJINVY3em03IDBoM3YyaC0zVjd6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjIiLz48cGF0aCBkPSJNMTQgN2gxdjFoLTFWN3pNNyA3aDF2MUg3Vjd6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjIiLz48cGF0aCBkPSJNMyA4VjdoMXYxSDN6bTYtMXYxaDJWN0g5em03IDB2MWgxVjdoLTF6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjIiLz48cGF0aCBkPSJNMyAyMHYtM2gxdi0xaDN2Mmg2di0yaDN2MWgxdjNIM3oiIGZpbGw9IiM1YmMwZGUiLz48cGF0aCBkPSJNNSAxNkg0djFIM3YzaDJ2LTR6bTEgMGgxdjJoNnYtMmgxdjRINnYtNHptOSAwaDF2MWgxdjNoLTJ2LTR6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjIiLz48cGF0aCBkPSJNMiA0djFoMXYxaDJWNGgxVjJINHYxSDN2MUgyem02LTFoMnYxaDJWM2gxVjJIOHYxem02IDFoMXYyaDJWNWgxVjRoLTFWM2gtMVYyaC0ydjJ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiM1MDQ0NDQiLz48L3N2Zz4=&logoColor=white"/>
</a>

<a href="https://www.cloudtype.io/">
<img src="https://img.shields.io/badge/cloudtype-FFFFFF?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTQwIiBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMTIwIDE0MCI+CiAgPHBhdGggZmlsbD0iIzJFMkUyRSIgZD0iTTM2IDQyLjM2OSAyMS4zNzUgNTYuODQ3YTEuNDQ0IDEuNDQ0IDAgMCAwIDAgMi4wNTdMNDQuMzUgODEuNjVhMS40OCAxLjQ4IDAgMCAwIDIuMDc3IDBsMTQuNjI1LTE0LjQ3OGExLjQ0NCAxLjQ0NCAwIDAgMCAwLTIuMDU3TDM4LjA3NyA0Mi4zNjlhMS40OCAxLjQ4IDAgMCAwLTIuMDc3IDBaTTc3Ljc1NiAxLjAyOCA2My4xMzEgMTUuNTA3YTEuNDQ0IDEuNDQ0IDAgMCAwIDAgMi4wNTdMODYuMTA3IDQwLjMxYTEuNDggMS40OCAwIDAgMCAyLjA3OCAwbDE0LjYyNC0xNC40NzlhMS40NDMgMS40NDMgMCAwIDAgMC0yLjA1Nkw3OS44MzQgMS4wMjhhMS40OCAxLjQ4IDAgMCAwLTIuMDc4IDBabS00LjE4IDc4LjU0M0w1OC45NTIgOTQuMDVhMS40NDQgMS40NDQgMCAwIDAgMCAyLjA1NmwyMi45NzYgMjIuNzQ3YTEuNDggMS40OCAwIDAgMCAyLjA3NyAwbDE0LjYyNS0xNC40NzlhMS40NDUgMS40NDUgMCAwIDAgMC0yLjA1N0w3NS42NTQgNzkuNTcxYTEuNDggMS40OCAwIDAgMC0yLjA3OCAwWk0uMjgzIDc3LjcyMmExLjMyOCAxLjMyOCAwIDAgMCAuMjE0IDEuODU2bDE5Ljg3MSAxOS42MzYgMjAuODgyIDIwLjY3MyAxOS44MDQgMTkuNjI4YTEuMzYgMS4zNiAwIDAgMCAxLjg2Ny4yMDVsMTUuMDIyLTE0Ljg3OGExLjMxNCAxLjMxNCAwIDAgMC0uMjA3LTEuODQ5TDU3LjkwMiAxMDMuMzVsLTIwLjg4LTIwLjY2Ni0xOS44MjgtMTkuNjQzYTEuMzUzIDEuMzUzIDAgMCAwLTEuODY3LS4yMDVMLjI4MyA3Ny43MjNaTTQyLjA0IDM2LjM5YTEuMzI4IDEuMzI4IDAgMCAwIC4yMDcgMS44NWwxOS44NCAxOS42MzVMODIuOTcgNzguNTQ4bDE5LjgzNCAxOS42NDNhMS4zNyAxLjM3IDAgMCAwIDEuODc1LjIwNWwxNS4wMzUtMTQuODk0YTEuMzIxIDEuMzIxIDAgMCAwLS4yMDYtMS44NDhMOTkuNjY3IDYyLjAxIDc4Ljc5MSA0MS4zNDUgNTguOTUgMjEuNzAyYTEuMzUzIDEuMzUzIDAgMCAwLTEuODY3LS4yMDVMNDIuMDQgMzYuMzlaIi8+Cjwvc3ZnPgo=&logoColor=white"/>
</a>

</div>

- [KBU BibleGraduationExam QuizApp API Server](#kbu-biblegraduationexam-quizapp-api-server)
  - [진행사항](#진행사항)
  - [`src` 폴더 구조](#src-폴더-구조)
  - [ERD](#erd)
  - [API 명세서](#api-명세서)
  - [Setup (dev)](#setup-dev)

## [진행사항](https://github.com/WithBible/withbible-server/wiki)

링크를 확인해주세요.

## `src` 폴더 구조

```bash
# Service 계층 의미: Create, Update, Delete 비즈니스 로직을 처리
# Provider 계층 의미: Read 비즈니스 로직을 처리

+---configs
|       app.js
|       database.js
|       logger.js
|
+---constants
|       enum.js
|
+---History
|       controller.js
|       dao.js
|       provider.js
|       route.js
|       service.js
|
+---LeaderBoard
|       controller.js
|       dao.js
|       provider.js
|       route.js
|
+---middlewares
|       authentication.js
|       cors.js
|       morgan.js
|       session.js
|
+---modules
|       response.js
|
+---Quiz
|       controller.js
|       dao.js
|       provider.js
|       route.js
|       service.js
|
\---User
        controller.js
        dao.js
        provider.js
        route.js
        service.js
```

## [ERD](https://www.erdcloud.com/p/vzY38iExRFRMcLYNv)

링크를 확인해주세요.

## [API 명세서](https://documenter.getpostman.com/view/11900791/2s8YswQrkS)

링크를 확인해주세요.

## Setup (dev)

Download [Node.js](https://nodejs.org/ko/download/).

```bash
# Install dependencies (only the first time)
npm install
# Run the local server at localhost:5000
npm run dev
```
