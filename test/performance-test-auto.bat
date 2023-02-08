@REM clinic clean --path .clinic
@REM artillery run --dotenv ./.env ./test/scenarios/quiz.yml

FOR %%f IN (./test/scenarios/*) DO (   
  clinic doctor --on-port 'artillery run --dotenv ./.env ./test/scenarios/%%~nf.yml' -- node index.js
)