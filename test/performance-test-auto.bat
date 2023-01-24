@REM clinic clean --path .clinic

FOR %%f IN (./test/scenarios/*) DO (   
  clinic doctor --on-port 'artillery run --dotenv ./.env ./test/scenarios/%%~nf.yml' -- node index.js
)