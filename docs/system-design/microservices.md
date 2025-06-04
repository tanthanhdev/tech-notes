# Microservices Architecture

Microservices architecture is an architectural style that structures an application as a collection of small, loosely coupled services that can be developed, deployed, and scaled independently.

## What are Microservices?

Microservices are small, autonomous services that work together to form a complete application. Each microservice:

- Focuses on a single business capability
- Runs in its own process
- Communicates via well-defined APIs
- Can be deployed independently
- Can be written in different programming languages
- Can use different data storage technologies

## Monolithic vs. Microservices Architecture

| Aspect | Monolithic | Microservices |
|--------|------------|---------------|
| Structure | Single, unified codebase | Multiple, independent services |
| Development | Simpler to develop initially | More complex initial setup |
| Deployment | Deploy entire application | Deploy individual services |
| Scaling | Scale entire application | Scale individual services as needed |
| Technology | Single technology stack | Multiple technology stacks possible |
| Team Structure | Larger teams working on same codebase | Smaller teams working on individual services |
| Failure Impact | Single point of failure | Isolated failures |
| Data Management | Shared database | Database per service |

## Key Principles of Microservices

1. **Single Responsibility**: Each service is responsible for a specific business capability.
2. **Autonomy**: Services can be developed, deployed, and scaled independently.
3. **Resilience**: Failure in one service should not cascade to others.
4. **Decentralization**: Decentralized governance and data management.
5. **Continuous Delivery**: Frequent, automated deployment of individual services.
6. **Observability**: Comprehensive monitoring and logging.
7. **Domain-Driven Design**: Services are designed around business domains.

## Microservices Communication Patterns

### Synchronous Communication

#### REST API

```json
// Example REST API request
GET /api/products/123
Accept: application/json

// Example response
{
  "id": "123",
  "name": "Product Name",
  "price": 19.99,
  "category": "Electronics"
}
```

#### gRPC

```protobuf
// Example gRPC service definition
syntax = "proto3";

service ProductService {
  rpc GetProduct(ProductRequest) returns (Product);
}

message ProductRequest {
  string id = 1;
}

message Product {
  string id = 1;
  string name = 2;
  double price = 3;
  string category = 4;
}
```

### Asynchronous Communication

#### Message Queue

```javascript
// Example message producer (Node.js with RabbitMQ)
const amqp = require('amqplib');

async function sendOrderCreatedEvent(order) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'order_events';
  const message = JSON.stringify({
    type: 'ORDER_CREATED',
    data: order
  });

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(message));

  console.log(`Sent: ${message}`);

  setTimeout(() => {
    connection.close();
  }, 500);
}
```

```javascript
// Example message consumer (Node.js with RabbitMQ)
const amqp = require('amqplib');

async function processOrderEvents() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'order_events';

  await channel.assertQueue(queue, { durable: true });
  console.log(`Waiting for messages in ${queue}`);

  channel.consume(queue, (msg) => {
    const event = JSON.parse(msg.content.toString());
    console.log(`Received: ${event.type}`);

    if (event.type === 'ORDER_CREATED') {
      // Process the order
      processOrder(event.data);
    }

    channel.ack(msg);
  });
}
```

#### Event Streaming

```java
// Example Kafka producer (Java)
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

Producer<String, String> producer = new KafkaProducer<>(props);

String topic = "order-events";
String key = order.getId();
String value = objectMapper.writeValueAsString(order);

ProducerRecord<String, String> record = new ProducerRecord<>(topic, key, value);
producer.send(record);
producer.close();
```

```java
// Example Kafka consumer (Java)
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("group.id", "order-processing-group");
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

Consumer<String, String> consumer = new KafkaConsumer<>(props);
consumer.subscribe(Arrays.asList("order-events"));

while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
    for (ConsumerRecord<String, String> record : records) {
        String key = record.key();
        String value = record.value();

        Order order = objectMapper.readValue(value, Order.class);
        processOrder(order);
    }
}
```

## Service Discovery and API Gateway

### Service Discovery

```yaml
# Example Consul service registration
{
  "service": {
    "name": "product-service",
    "id": "product-service-1",
    "tags": ["api", "v1"],
    "address": "10.0.0.1",
    "port": 8080,
    "checks": [
      {
        "http": "http://10.0.0.1:8080/health",
        "interval": "10s"
      }
    ]
  }
}
```

### API Gateway

```yaml
# Example Kong API Gateway configuration
services:
  - name: product-service
    url: http://product-service:8080
    routes:
      - name: product-routes
        paths:
          - /api/products
        strip_path: true
    plugins:
      - name: rate-limiting
        config:
          minute: 100
      - name: jwt
```

## Data Management in Microservices

### Database per Service

```yaml
# Example docker-compose.yml for multiple databases
version: '3'
services:
  product-service:
    build: ./product-service
    depends_on:
      - product-db
    environment:
      - DB_HOST=product-db
      - DB_PORT=5432
      - DB_NAME=productdb

  product-db:
    image: postgres:13
    environment:
      - POSTGRES_DB=productdb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - product-db-data:/var/lib/postgresql/data

  order-service:
    build: ./order-service
    depends_on:
      - order-db
    environment:
      - DB_HOST=order-db
      - DB_PORT=27017
      - DB_NAME=orderdb

  order-db:
    image: mongo:4.4
    environment:
      - MONGO_INITDB_DATABASE=orderdb
    volumes:
      - order-db-data:/data/db

volumes:
  product-db-data:
  order-db-data:
```

### CQRS Pattern

```csharp
// Command side
public class CreateOrderCommand
{
    public string CustomerId { get; set; }
    public List<OrderItem> Items { get; set; }
}

public class OrderCommandHandler
{
    private readonly IOrderRepository _repository;
    private readonly IEventBus _eventBus;

    public OrderCommandHandler(IOrderRepository repository, IEventBus eventBus)
    {
        _repository = repository;
        _eventBus = eventBus;
    }

    public async Task Handle(CreateOrderCommand command)
    {
        var order = new Order(Guid.NewGuid(), command.CustomerId, command.Items);
        await _repository.SaveAsync(order);

        await _eventBus.PublishAsync(new OrderCreatedEvent
        {
            OrderId = order.Id,
            CustomerId = order.CustomerId,
            Items = order.Items
        });
    }
}

// Query side
public class OrderQueryService
{
    private readonly IOrderReadModel _readModel;

    public OrderQueryService(IOrderReadModel readModel)
    {
        _readModel = readModel;
    }

    public async Task<OrderDto> GetOrderAsync(Guid orderId)
    {
        return await _readModel.GetOrderAsync(orderId);
    }

    public async Task<IEnumerable<OrderDto>> GetCustomerOrdersAsync(string customerId)
    {
        return await _readModel.GetCustomerOrdersAsync(customerId);
    }
}
```

## Deploying Microservices

### Docker Containers

```dockerfile
# Example Dockerfile for a microservice
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
```

### Kubernetes

```yaml
# Example Kubernetes deployment for a microservice
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-service
  labels:
    app: product-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: product-service
  template:
    metadata:
      labels:
        app: product-service
    spec:
      containers:
      - name: product-service
        image: my-registry/product-service:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: DB_HOST
          value: product-db-service
        - name: DB_PORT
          value: "5432"
        - name: DB_NAME
          value: productdb
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: product-service
spec:
  selector:
    app: product-service
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

## Monitoring and Observability

### Distributed Tracing

```java
// Example using Spring Cloud Sleuth and Zipkin
@RestController
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products/{id}")
    public Product getProduct(@PathVariable String id) {
        // Tracing is automatically handled by Sleuth
        return productService.getProduct(id);
    }
}
```

### Metrics Collection

```yaml
# Example Prometheus configuration
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'product-service'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['product-service:8080']

  - job_name: 'order-service'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['order-service:8080']
```

## Challenges and Best Practices

### Challenges

1. **Distributed System Complexity**: Debugging and testing become more difficult.
2. **Data Consistency**: Maintaining consistency across services is challenging.
3. **Service Boundaries**: Defining the right service boundaries requires domain expertise.
4. **Operational Overhead**: More services mean more infrastructure to manage.
5. **Network Latency**: Communication between services adds latency.

### Best Practices

1. **Start Monolithic**: Begin with a monolith and extract microservices as needed.
2. **Design for Failure**: Implement circuit breakers, retries, and fallbacks.
3. **Automate Everything**: Use CI/CD pipelines for all services.
4. **Implement Monitoring**: Comprehensive logging, metrics, and tracing.
5. **Use Containers**: Containerize services for consistency across environments.
6. **API Versioning**: Implement proper API versioning to manage changes.
7. **Documentation**: Maintain clear documentation for all services and APIs.
8. **Testing**: Implement comprehensive testing strategies, including contract testing.

## References

- [Microservices.io](https://microservices.io/)
- [Martin Fowler on Microservices](https://martinfowler.com/articles/microservices.html)
- [Sam Newman - Building Microservices](https://samnewman.io/books/building_microservices/)
- [Chris Richardson - Microservices Patterns](https://microservices.io/book)
