FROM python:3.11-slim

WORKDIR /app

# Install necessary Python packages
RUN pip install --no-cache-dir \
    pytest \
    numpy \
    pandas \
    matplotlib \
    scipy \
    scikit-learn

# Set up command to run Python scripts
ENTRYPOINT ["python"]
