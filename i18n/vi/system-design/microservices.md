---
author: Tech Notes Hub
tags: 'learning, technology, programming'
update: '2025-06-06'
date: '2025-06-06'
title: Microservices
description: Guide about Microservices
---
# Kiến Trúc Microservices

Kiến trúc microservices là một phong cách kiến trúc cấu trúc một ứng dụng như một tập hợp các dịch vụ nhỏ, liên kết lỏng lẻo có thể được phát triển, triển khai và mở rộng độc lập.

## Microservices là gì?

Microservices là các dịch vụ nhỏ, tự chủ hoạt động cùng nhau để tạo thành một ứng dụng hoàn chỉnh. Mỗi microservice:

- Tập trung vào một khả năng kinh doanh duy nhất
- Chạy trong quy trình riêng của nó
- Giao tiếp thông qua API được định nghĩa rõ ràng
- Có thể được triển khai độc lập
- Có thể được viết bằng các ngôn ngữ lập trình khác nhau
- Có thể sử dụng các công nghệ lưu trữ dữ liệu khác nhau

## Kiến Trúc Nguyên Khối vs. Microservices

| Khía cạnh | Nguyên khối | Microservices |
|--------|------------|---------------|
| Cấu trúc | Codebase thống nhất, đơn lẻ | Nhiều dịch vụ độc lập |
| Phát triển | Đơn giản hơn để phát triển ban đầu | Thiết lập ban đầu phức tạp hơn |
| Triển khai | Triển khai toàn bộ ứng dụng | Triển khai từng dịch vụ riêng biệt |
| Mở rộng | Mở rộng toàn bộ ứng dụng | Mở rộng các dịch vụ riêng lẻ khi cần |
| Công nghệ | Một ngăn xếp công nghệ duy nhất | Có thể sử dụng nhiều ngăn xếp công nghệ |
| Cấu trúc nhóm | Các nhóm lớn hơn làm việc trên cùng một codebase | Các nhóm nhỏ hơn làm việc trên các dịch vụ riêng lẻ |
| Tác động của lỗi | Điểm lỗi duy nhất | Lỗi cô lập |
| Quản lý dữ liệu | Cơ sở dữ liệu được chia sẻ | Cơ sở dữ liệu cho mỗi dịch vụ |

## Nguyên Tắc Chính của Microservices

1. **Trách Nhiệm Đơn Lẻ**: Mỗi dịch vụ chịu trách nhiệm cho một khả năng kinh doanh cụ thể.
2. **Tự Chủ**: Các dịch vụ có thể được phát triển, triển khai và mở rộng độc lập.
3. **Khả Năng Phục Hồi**: Lỗi trong một dịch vụ không nên lan truyền sang các dịch vụ khác.
4. **Phân Cấp**: Quản trị và quản lý dữ liệu phi tập trung.
5. **Phân Phối Liên Tục**: Triển khai tự động, thường xuyên của các dịch vụ riêng lẻ.
6. **Khả Năng Quan Sát**: Giám sát và ghi nhật ký toàn diện.
7. **Thiết Kế Hướng Miền**: Các dịch vụ được thiết kế xung quanh các miền kinh doanh.

## Mẫu Giao Tiếp Microservices

### Giao Tiếp Đồng Bộ

#### REST API

```json
// Ví dụ yêu cầu REST API
GET /api/products/123
Accept: application/json

// Ví dụ phản hồi
{
  "id": "123",
  "name": "Tên Sản Phẩm",
  "price": 19.99,
  "category": "Điện tử"
}
```

#### gRPC

```protobuf
// Ví dụ định nghĩa dịch vụ gRPC
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

### Giao Tiếp Bất Đồng Bộ

#### Hàng Đợi Thông Điệp

```javascript
// Ví dụ nhà sản xuất thông điệp (Node.js với RabbitMQ)
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

  console.log(`Đã gửi: ${message}`);

  setTimeout(() => {
    connection.close();
  }, 500);
}
```

```javascript
// Ví dụ người tiêu thụ thông điệp (Node.js với RabbitMQ)
const amqp = require('amqplib');

async function processOrderEvents() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'order_events';

  await channel.assertQueue(queue, { durable: true });
  console.log(`Đang đợi thông điệp trong ${queue}`);

  channel.consume(queue, (msg) => {
    const event = JSON.parse(msg.content.toString());
    console.log(`Đã nhận: ${event.type}`);

    if (event.type === 'ORDER_CREATED') {
      // Xử lý đơn hàng
      processOrder(event.data);
    }

    channel.ack(msg);
  });
}
```

#### Luồng Sự Kiện

```java
// Ví dụ nhà sản xuất Kafka (Java)
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
// Ví dụ người tiêu thụ Kafka (Java)
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

## Khám Phá Dịch Vụ và API Gateway

### Khám Phá Dịch Vụ

```yaml
# Ví dụ đăng ký dịch vụ Consul
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
# Ví dụ cấu hình Kong API Gateway
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

## Quản Lý Dữ Liệu trong Microservices

### Cơ Sở Dữ Liệu cho Mỗi Dịch Vụ

```yaml
# Ví dụ docker-compose.yml cho nhiều cơ sở dữ liệu
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

### Mẫu CQRS

```csharp
// Phía lệnh
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

// Phía truy vấn
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

## Triển Khai Microservices

### Docker Containers

```dockerfile
# Ví dụ Dockerfile cho một microservice
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
# Ví dụ triển khai Kubernetes cho một microservice
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

## Giám Sát và Khả Năng Quan Sát

### Truy Vết Phân Tán

```java
// Ví dụ sử dụng Spring Cloud Sleuth và Zipkin
@RestController
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products/{id}")
    public Product getProduct(@PathVariable String id) {
        // Truy vết được tự động xử lý bởi Sleuth
        return productService.getProduct(id);
    }
}
```

### Thu Thập Số Liệu

```yaml
# Ví dụ cấu hình Prometheus
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

## Thách Thức và Phương Pháp Tốt Nhất

### Thách Thức

1. **Độ Phức Tạp của Hệ Thống Phân Tán**: Gỡ lỗi và kiểm tra trở nên khó khăn hơn.
2. **Tính Nhất Quán của Dữ Liệu**: Duy trì tính nhất quán giữa các dịch vụ là một thách thức.
3. **Ranh Giới Dịch Vụ**: Xác định ranh giới dịch vụ đúng đắn đòi hỏi chuyên môn về miền.
4. **Phụ Phí Vận Hành**: Nhiều dịch vụ hơn đồng nghĩa với nhiều cơ sở hạ tầng cần quản lý hơn.
5. **Độ Trễ Mạng**: Giao tiếp giữa các dịch vụ thêm độ trễ.

### Phương Pháp Tốt Nhất

1. **Bắt Đầu Nguyên Khối**: Bắt đầu với một ứng dụng nguyên khối và trích xuất microservices khi cần thiết.
2. **Thiết Kế cho Lỗi**: Triển khai các bộ ngắt mạch, thử lại và dự phòng.
3. **Tự Động Hóa Mọi Thứ**: Sử dụng đường ống CI/CD cho tất cả các dịch vụ.
4. **Triển Khai Giám Sát**: Ghi nhật ký, số liệu và truy vết toàn diện.
5. **Sử Dụng Container**: Containerize các dịch vụ để đảm bảo tính nhất quán giữa các môi trường.
6. **Phiên Bản API**: Triển khai phiên bản API thích hợp để quản lý các thay đổi.
7. **Tài Liệu**: Duy trì tài liệu rõ ràng cho tất cả các dịch vụ và API.
8. **Kiểm Tra**: Triển khai các chiến lược kiểm tra toàn diện, bao gồm kiểm tra hợp đồng.

## Tài Liệu Tham Khảo

- [Microservices.io](https://microservices.io/)
- [Martin Fowler về Microservices](https://martinfowler.com/articles/microservices.html)
- [Sam Newman - Xây Dựng Microservices](https://samnewman.io/books/building_microservices/)
- [Chris Richardson - Mẫu Microservices](https://microservices.io/book)
