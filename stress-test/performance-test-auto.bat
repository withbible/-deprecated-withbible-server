@REM clinic clean --path .clinic
@REM artillery run --dotenv ./.env ./stress-test/scenarios/quiz.yml

clinic doctor --on-port 'artillery run --dotenv ./.env ./stress-test/scenarios/quiz.yml' -- node index.js