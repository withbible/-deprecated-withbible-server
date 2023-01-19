set DEBUG=http
artillery run --dotenv ./.env --output ./load-test-report.json ./load-test.yml
artillery report ./load-test-report.json