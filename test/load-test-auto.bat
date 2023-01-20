set DEBUG=http
artillery run --dotenv ./.env --output ./test/load-test-report.json ./test/load-test.yml
artillery report ./test/load-test-report.json