@REM SET DEBUG=http
FOR %%f IN (./test/scenarios/*) DO ( 
  artillery run --dotenv ./.env --output ./test/reports/%%~nf.json ./test/scenarios/%%~nf.yml
  artillery report ./test/reports/%%~nf.json
)