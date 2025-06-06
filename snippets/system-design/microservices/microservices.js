/**
 * Microservices Architecture Example
 *
 * This file demonstrates a simple implementation of microservices
 * for an e-commerce application using Node.js and Express.
 */

// Product Service
const productServiceCode = `
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
mongoose.connect('mongodb://product-db:27017/productdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Product schema
const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  price: Number,
  category: String,
  inventory: Number
});

const Product = mongoose.model('Product', productSchema);

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    // Publish event to message broker (RabbitMQ)
    const amqp = require('amqplib');
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    const exchange = 'product-events';

    await channel.assertExchange(exchange, 'topic', { durable: true });
    channel.publish(
      exchange,
      'product.created',
      Buffer.from(JSON.stringify({
        event: 'PRODUCT_CREATED',
        data: product
      }))
    );

    await channel.close();
    await connection.close();

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product inventory
app.patch('/api/products/:id/inventory', async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findOne({ id: req.params.id });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.inventory += quantity;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(\`Product service running on port \${PORT}\`);
});
`;

// Order Service
const orderServiceCode = `
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3002;

// MongoDB connection
mongoose.connect('mongodb://order-db:27017/orderdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Order schema
const orderSchema = new mongoose.Schema({
  id: String,
  customerId: String,
  items: [{
    productId: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerId, items } = req.body;

    // Validate customer via Customer Service
    try {
      await axios.get(\`http://customer-service:3003/api/customers/\${customerId}\`);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }

    // Check product availability and calculate total
    let totalAmount = 0;
    for (const item of items) {
      try {
        const productResponse = await axios.get(
          \`http://product-service:3001/api/products/\${item.productId}\`
        );
        const product = productResponse.data;

        if (product.inventory < item.quantity) {
          return res.status(400).json({
            error: \`Insufficient inventory for product \${item.productId}\`
          });
        }

        item.price = product.price;
        totalAmount += product.price * item.quantity;
      } catch (error) {
        return res.status(400).json({
          error: \`Invalid product ID: \${item.productId}\`
        });
      }
    }

    // Create order
    const order = new Order({
      id: \`ORD-\${Date.now()}\`,
      customerId,
      items,
      totalAmount,
      status: 'PENDING'
    });

    await order.save();

    // Update inventory
    for (const item of items) {
      await axios.patch(
        \`http://product-service:3001/api/products/\${item.productId}/inventory\`,
        { quantity: -item.quantity }
      );
    }

    // Publish event to message broker (RabbitMQ)
    const amqp = require('amqplib');
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    const exchange = 'order-events';

    await channel.assertExchange(exchange, 'topic', { durable: true });
    channel.publish(
      exchange,
      'order.created',
      Buffer.from(JSON.stringify({
        event: 'ORDER_CREATED',
        data: order
      }))
    );

    await channel.close();
    await connection.close();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get customer orders
app.get('/api/orders/customer/:customerId', async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.customerId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(\`Order service running on port \${PORT}\`);
});
`;

// API Gateway
const apiGatewayCode = `
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 3000;

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  // In a real application, you would validate the token
  // For this example, we'll just check if it exists
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  // Add user info to request for downstream services
  req.user = { id: 'user-123' }; // This would come from token validation
  next();
};

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all requests
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Product Service routes
app.use(
  '/api/products',
  authenticate,
  createProxyMiddleware({
    target: 'http://product-service:3001',
    changeOrigin: true,
    pathRewrite: {
      '^/api/products': '/api/products'
    }
  })
);

// Order Service routes
app.use(
  '/api/orders',
  authenticate,
  createProxyMiddleware({
    target: 'http://order-service:3002',
    changeOrigin: true,
    pathRewrite: {
      '^/api/orders': '/api/orders'
    }
  })
);

// Customer Service routes
app.use(
  '/api/customers',
  authenticate,
  createProxyMiddleware({
    target: 'http://customer-service:3003',
    changeOrigin: true,
    pathRewrite: {
      '^/api/customers': '/api/customers'
    }
  })
);

app.listen(PORT, () => {
  console.log(\`API Gateway running on port \${PORT}\`);
});
`;

// Notification Service (Event Consumer)
const notificationServiceCode = `
const amqp = require('amqplib');
const nodemailer = require('nodemailer');

// Create a test SMTP service
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'testuser@ethereal.email',
    pass: 'testpassword'
  }
});

async function startConsumer() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    // Set up exchanges
    const orderExchange = 'order-events';
    const productExchange = 'product-events';

    await channel.assertExchange(orderExchange, 'topic', { durable: true });
    await channel.assertExchange(productExchange, 'topic', { durable: true });

    // Create queue for notification service
    const queue = 'notification-service';
    await channel.assertQueue(queue, { durable: true });

    // Bind queue to exchanges with routing keys
    await channel.bindQueue(queue, orderExchange, 'order.*');
    await channel.bindQueue(queue, productExchange, 'product.*');

    console.log('Notification service waiting for messages...');

    // Consume messages
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log(\`Received event: \${content.event}\`);

        switch (content.event) {
          case 'ORDER_CREATED':
            await sendOrderConfirmation(content.data);
            break;
          case 'PRODUCT_CREATED':
            await notifyAdminAboutNewProduct(content.data);
            break;
          default:
            console.log(\`Unknown event type: \${content.event}\`);
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Error in notification service:', error);
  }
}

async function sendOrderConfirmation(order) {
  try {
    const mailOptions = {
      from: 'noreply@example.com',
      to: \`customer-\${order.customerId}@example.com\`, // In a real app, get from customer service
      subject: \`Order Confirmation: \${order.id}\`,
      text: \`
        Thank you for your order!

        Order ID: \${order.id}
        Total Amount: $\${order.totalAmount.toFixed(2)}
        Status: \${order.status}

        Items:
        \${order.items.map(item => \`- Product \${item.productId}: \${item.quantity} x $\${item.price.toFixed(2)}\`).join('\\n')}

        Thank you for shopping with us!
      \`
    };

    await transporter.sendMail(mailOptions);
    console.log(\`Order confirmation email sent for order \${order.id}\`);
  } catch (error) {
    console.error('Error sending order confirmation:', error);
  }
}

async function notifyAdminAboutNewProduct(product) {
  try {
    const mailOptions = {
      from: 'noreply@example.com',
      to: 'admin@example.com',
      subject: 'New Product Added',
      text: \`
        A new product has been added to the catalog:

        ID: \${product.id}
        Name: \${product.name}
        Price: $\${product.price.toFixed(2)}
        Category: \${product.category}
        Initial Inventory: \${product.inventory}
      \`
    };

    await transporter.sendMail(mailOptions);
    console.log(\`Admin notification sent for new product \${product.id}\`);
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

// Start the consumer
startConsumer();
`;

// Docker Compose file for the microservices
const dockerComposeCode = `
version: '3'

services:
  # API Gateway
  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    depends_on:
      - product-service
      - order-service
      - customer-service
    environment:
      - PORT=3000
    networks:
      - microservices-network

  # Product Service
  product-service:
    build: ./product-service
    ports:
      - "3001:3001"
    depends_on:
      - product-db
      - rabbitmq
    environment:
      - PORT=3001
      - MONGODB_URI=mongodb://product-db:27017/productdb
      - RABBITMQ_URI=amqp://rabbitmq
    networks:
      - microservices-network

  # Order Service
  order-service:
    build: ./order-service
    ports:
      - "3002:3002"
    depends_on:
      - order-db
      - product-service
      - customer-service
      - rabbitmq
    environment:
      - PORT=3002
      - MONGODB_URI=mongodb://order-db:27017/orderdb
      - RABBITMQ_URI=amqp://rabbitmq
    networks:
      - microservices-network

  # Customer Service
  customer-service:
    build: ./customer-service
    ports:
      - "3003:3003"
    depends_on:
      - customer-db
    environment:
      - PORT=3003
      - MONGODB_URI=mongodb://customer-db:27017/customerdb
    networks:
      - microservices-network

  # Notification Service
  notification-service:
    build: ./notification-service
    depends_on:
      - rabbitmq
    environment:
      - RABBITMQ_URI=amqp://rabbitmq
      - SMTP_HOST=smtp.ethereal.email
      - SMTP_PORT=587
      - SMTP_USER=testuser@ethereal.email
      - SMTP_PASS=testpassword
    networks:
      - microservices-network

  # Databases
  product-db:
    image: mongo:4.4
    volumes:
      - product-db-data:/data/db
    networks:
      - microservices-network

  order-db:
    image: mongo:4.4
    volumes:
      - order-db-data:/data/db
    networks:
      - microservices-network

  customer-db:
    image: mongo:4.4
    volumes:
      - customer-db-data:/data/db
    networks:
      - microservices-network

  # Message Broker
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"  # AMQP port
      - "15672:15672"  # Management UI
    networks:
      - microservices-network

networks:
  microservices-network:
    driver: bridge

volumes:
  product-db-data:
  order-db-data:
  customer-db-data:
`;

// Export the code examples
module.exports = {
  productServiceCode,
  orderServiceCode,
  apiGatewayCode,
  notificationServiceCode,
  dockerComposeCode
};

// This file is just a demonstration of microservices code examples
// In a real project, each service would be in its own directory
