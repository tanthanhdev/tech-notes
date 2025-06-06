import { BlogPost } from "@/lib/types";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    description: "Learn the basics of Next.js and how to build a modern web application",
    content: `
# Getting Started with Next.js

Next.js is a React framework that enables server-side rendering and generating static websites. It's a great choice for building modern web applications.

## Features

- Server-side rendering
- Static site generation
- API routes
- File-based routing
- CSS-in-JS

## Installation

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Basic Routing

Next.js has a file-based routing system. Files in the \`pages\` directory automatically become routes.

\`\`\`jsx
// pages/index.js
export default function Home() {
  return <h1>Hello, Next.js!</h1>
}
\`\`\`

\`\`\`jsx
// pages/about.js
export default function About() {
  return <h1>About Page</h1>
}
\`\`\`
`,
    slug: "getting-started-with-nextjs",
    date: "2024-05-15",
    author: "John Doe",
    category: "Web Development",
    tags: ["Next.js", "React", "JavaScript"],
    coverImage: "/blog/nextjs.jpg"
  },
  {
    id: "2",
    title: "Understanding Docker Containers",
    description: "A comprehensive guide to Docker containers and containerization",
    content: `
# Understanding Docker Containers

Docker is a platform for developing, shipping, and running applications in containers. This guide will help you understand the basics of Docker containers.

## What are Containers?

Containers are lightweight, standalone, executable packages that include everything needed to run an application: code, runtime, system tools, libraries, and settings.

## Benefits of Containerization

- Consistency across environments
- Isolation of applications
- Efficient resource utilization
- Faster deployment
- Easier scaling

## Basic Docker Commands

\`\`\`bash
# Pull an image from Docker Hub
docker pull ubuntu

# Run a container
docker run -it ubuntu bash

# List running containers
docker ps

# Stop a container
docker stop container_id

# Remove a container
docker rm container_id
\`\`\`

## Creating a Dockerfile

\`\`\`dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`
`,
    slug: "understanding-docker-containers",
    date: "2024-05-10",
    author: "Jane Smith",
    category: "DevOps",
    tags: ["Docker", "Containerization", "DevOps"],
    coverImage: "/blog/docker.jpg"
  },
  {
    id: "3",
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of machine learning and its applications",
    content: `
# Introduction to Machine Learning

Machine learning is a field of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.

## Types of Machine Learning

### Supervised Learning

Supervised learning uses labeled datasets to train algorithms to classify data or predict outcomes.

Examples:
- Linear Regression
- Logistic Regression
- Support Vector Machines
- Neural Networks

### Unsupervised Learning

Unsupervised learning uses machine learning algorithms to analyze and cluster unlabeled datasets.

Examples:
- K-means Clustering
- Hierarchical Clustering
- Principal Component Analysis

### Reinforcement Learning

Reinforcement learning is about taking suitable actions to maximize reward in a particular situation.

Examples:
- Q-Learning
- Deep Q Network
- Policy Gradient Methods

## Common Libraries

\`\`\`python
# NumPy for numerical computing
import numpy as np

# Pandas for data manipulation
import pandas as pd

# Scikit-learn for machine learning
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# Example of training a model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
\`\`\`
`,
    slug: "introduction-to-machine-learning",
    date: "2024-05-05",
    author: "Alex Johnson",
    category: "Data Science",
    tags: ["Machine Learning", "AI", "Data Science"],
    coverImage: "/blog/ml.jpg"
  }
];
