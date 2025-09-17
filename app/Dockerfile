# Use Python base image
FROM python:3.12-alpine

# Set working directory
WORKDIR /app

# Copy application files
COPY . /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements/run.txt

# Expose the application port
EXPOSE 5000

# Run the application
CMD ["gunicorn", "-k", "eventlet", "-w", "1", "--bind", "0.0.0.0:5000", "app:app"]