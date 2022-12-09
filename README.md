<div align="center">

# KBU BibleGraduationExam QuizApp API Server

<a href="https://nodejs.org/ko/download/">
<img src="https://img.shields.io/badge/Node.js-14.0-339933?logo=Node.js&logoColor=white"/>
</a>

<a href="https://www.mysql.com/">
<img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=MySQL&logoColor=white"/>
</a>

<a href="https://expressjs.com/ko/">
<img src="https://img.shields.io/badge/Express-000000?logo=Express"/> 
</a>

<a href="https://avatars.dicebear.com/">
<img src="https://img.shields.io/badge/DiceBear Avatars-19b5fe?logo=data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgc3R5bGU9Imlzb2xhdGlvbjppc29sYXRlIiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cGF0aCBkPSJNOCAxNXYxSDR2MUgzdjNoMTR2LTNoLTF2LTFoLTR2LTFoM3YtMWgxdi0xaDF2LTNoMVY3aC0xVjRoLTFWM2gtMVYySDV2MUg0djFIM3YzSDJ2M2gxdjNoMXYxaDF2MWgzeiIgZmlsbD0iI0ZGREJBQyIvPjxwYXRoIGQ9Ik01IDE1di0xSDR2LTFIM3YtM0gyVjdoMVY0aDFWM2gxVjJoMTB2MWgxdjFoMXYzaDF2M2gtMXYzaC0xdjFoLTF2MUg1eiIgZmlsbD0iI0ZGRiIgZmlsbC1vcGFjaXR5PSIuMSIvPjxwYXRoIGQ9Ik01IDhoM3YxSDVWOHptNyAwaDN2MWgtM1Y4eiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik02IDhoMXYxSDZWOHptNyAwaDF2MWgtMVY4eiIgZmlsbD0iIzY5N2I5NCIvPjxwYXRoIGQ9Ik03IDV2MUg1djFINFY2aDFWNWgyem03IDB2MWgtMnYxaC0xVjZoMVY1aDJ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMzNjJlMmUiLz48cGF0aCBkPSJNOCAxM3YxaDR2LTFoMXYtMWgtMXYxSDh6IiBmaWxsPSIjZDI5OTg1Ii8+PHBhdGggZD0iTTQgOEgzVjdoMVY2aDV2MWgyVjZoNXYxaDF2MWgtMXYyaC01VjhIOXYySDRWOHptMSAwVjdoM3YySDVWOHptNy0xdjJoM1Y3aC0zeiIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYTA0YjVkIi8+PHBhdGggZD0iTTUgN2gzdjJINVY3em03IDBoM3YyaC0zVjd6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjIiLz48cGF0aCBkPSJNMTQgN2gxdjFoLTFWN3pNNyA3aDF2MUg3Vjd6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjIiLz48cGF0aCBkPSJNMyA4VjdoMXYxSDN6bTYtMXYxaDJWN0g5em03IDB2MWgxVjdoLTF6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjIiLz48cGF0aCBkPSJNMyAyMHYtM2gxdi0xaDN2Mmg2di0yaDN2MWgxdjNIM3oiIGZpbGw9IiM1YmMwZGUiLz48cGF0aCBkPSJNNSAxNkg0djFIM3YzaDJ2LTR6bTEgMGgxdjJoNnYtMmgxdjRINnYtNHptOSAwaDF2MWgxdjNoLTJ2LTR6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjIiLz48cGF0aCBkPSJNMiA0djFoMXYxaDJWNGgxVjJINHYxSDN2MUgyem02LTFoMnYxaDJWM2gxVjJIOHYxem02IDFoMXYyaDJWNWgxVjRoLTFWM2gtMVYyaC0ydjJ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiM1MDQ0NDQiLz48L3N2Zz4=&logoColor=white"/>
</a>

<a href="https://www.deta.sh/">
<img src="https://img.shields.io/badge/Deta-F478B3?logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzQwLjE2IiBoZWlnaHQ9IjM0MC4xNiIgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjE3MC4wOCIgY3k9IjE3MC4wOCIgcj0iMTQxLjczIiBmaWxsPSIjZWYzOWE4IiB2ZWN0b3ItZWZmZWN0PSJub24tc2NhbGluZy1zdHJva2UiLz4KPGNpcmNsZSBjeD0iMTcwLjA4IiBjeT0iMTcwLjA4IiByPSIxMTMuMzkiIGZpbGw9IiNiZDM5OWMiIHZlY3Rvci1lZmZlY3Q9Im5vbi1zY2FsaW5nLXN0cm9rZSIvPgo8Y2lyY2xlIGN4PSIxNzAuMDgiIGN5PSIxNzAuMDgiIHI9Ijg1LjAzOSIgZmlsbD0iIzkzMzg4ZSIgdmVjdG9yLWVmZmVjdD0ibm9uLXNjYWxpbmctc3Ryb2tlIi8+CjxjaXJjbGUgY3g9IjE3MC4wOCIgY3k9IjE3MC4wOCIgcj0iNTYuNjkzIiBmaWxsPSIjNTYzMzc5IiB2ZWN0b3ItZWZmZWN0PSJub24tc2NhbGluZy1zdHJva2UiLz4KPC9zdmc+Cg==&logoColor=white"/>
</a>

</div>

- [KBU BibleGraduationExam QuizApp API Server](#kbu-biblegraduationexam-quizapp-api-server)
  - [`src` 폴더 구조](#src-폴더-구조)
  - [ERD](#erd)
  - [API 명세서](#api-명세서)
  - [Setup (dev)](#setup-dev)


## `src` 폴더 구조

```bash
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
+---middleware
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
