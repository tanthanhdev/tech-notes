.PHONY: build run-snippet help db-start db-stop db-run-snippet

help:
	@echo "Tech Notes Hub Docker Environment"
	@echo "================================="
	@echo ""
	@echo "Usage:"
	@echo "  make build                              Build all Docker environments"
	@echo "  make run-snippet FILE=path              Run a specific code snippet"
	@echo "  make db-start DB=type                   Start a specific database (mysql, postgres, mongodb, redis, sqlite)"
	@echo "  make db-stop DB=type                    Stop a specific database"
	@echo "  make db-run-snippet DB=type FILE=path   Run a code snippet with database connection"
	@echo "  make help                               Show this help message"

build:
	docker-compose build

run-snippet:
	@if [ -z "$(FILE)" ]; then \
		echo "Error: Please specify a file path. Example: make run-snippet FILE=snippets/algorithms/graph-traversal/graph_traversal.py"; \
		exit 1; \
	fi
	./docker/run-snippet.sh $(FILE)

db-start:
	@if [ -z "$(DB)" ]; then \
		echo "Error: Please specify a database type. Example: make db-start DB=mysql"; \
		exit 1; \
	fi
	docker-compose -f docker/environments/databases/docker-compose.yml up -d $(DB)

db-stop:
	@if [ -z "$(DB)" ]; then \
		echo "Error: Please specify a database type. Example: make db-stop DB=mysql"; \
		exit 1; \
	fi
	docker-compose -f docker/environments/databases/docker-compose.yml stop $(DB)

db-run-snippet:
	@if [ -z "$(DB)" ]; then \
		echo "Error: Please specify a database type. Example: make db-run-snippet DB=mysql FILE=path/to/file.py"; \
		exit 1; \
	fi
	@if [ -z "$(FILE)" ]; then \
		echo "Error: Please specify a file path. Example: make db-run-snippet DB=mysql FILE=path/to/file.py"; \
		exit 1; \
	fi
	./docker/run-db-snippet.sh $(DB) $(FILE)
