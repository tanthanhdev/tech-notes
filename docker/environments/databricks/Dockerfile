FROM python:3.9-slim

# Install Java
RUN apt-get update && \
    apt-get install -y openjdk-11-jdk && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set Java home
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# Install PySpark and Databricks libraries
RUN pip install --no-cache-dir \
    pyspark==3.3.0 \
    delta-spark==2.1.0 \
    databricks-connect==10.4.* \
    matplotlib \
    pandas \
    numpy \
    scikit-learn

# Install additional libraries for databricks
RUN pip install --no-cache-dir \
    mlflow \
    koalas \
    plotly \
    databricks-cli

# Set up working directory
WORKDIR /app

# Create PySpark configuration directory
RUN mkdir -p /root/.databricks-connect

# Set entrypoint to Python
ENTRYPOINT ["python"]
