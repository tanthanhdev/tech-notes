FROM php:8.2-cli

WORKDIR /app

# Install necessary PHP extensions and tools
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    git \
    && docker-php-ext-install zip \
    && php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && php -r "unlink('composer-setup.php');" \
    && rm -rf /var/lib/apt/lists/*

# Install PHPUnit and other common packages
RUN composer global require phpunit/phpunit

# Add composer's vendor bin to PATH
ENV PATH="/root/.composer/vendor/bin:${PATH}"

# Set up command to run PHP scripts
ENTRYPOINT ["php"]
