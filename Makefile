.PHONY: install dev build lint format help

help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make dev      - Start development server"
	@echo "  make build    - Build for production"
	@echo "  make lint     - Run linter"
	@echo "  make format   - Run prettier format"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

format:
	npm run format
