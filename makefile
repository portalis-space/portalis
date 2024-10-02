.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
build: ## Build all service needed
	docker-compose build $(c)
up:	## Run service
	docker-compose up -d $(c)
start: ## Start
	docker-compose start $(c)
down: ## Down
	docker-compose down $(c)
destroy: ## Down and Remove volume
	docker-compose down -v $(c)
stop: ## Stop
	docker-compose stop $(c)
restart: ## Restart
	docker-compose stop $(c)
	docker-compose up -d $(c)
logs: ## Show logs
	docker-compose logs --tail=100 -f $(c)
dev: ## Run App local in watch mode
	pnpm start:dev