.PHONY: frontend-install frontend-start backend-install backend-start docker-up docker-down

frontend-install:
	cd qrninja && npm install

frontend-start:
	cd qrninja && npm run dev

backend-install:
	cd qrninja/backend && go mod tidy

backend-start:
	cd qrninja/backend && go run main.go

docker-up:
	cd qrninja/backend && docker-compose up -d

docker-down:
	cd qrninja/backend && docker-compose down

start:
	make frontend-start & make backend-start

install:
	make frontend-install & make backend-install
