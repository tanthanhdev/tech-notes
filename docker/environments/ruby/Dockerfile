FROM ruby:3.2-slim

WORKDIR /app

# Install necessary Ruby gems
RUN gem install \
    rspec \
    rubocop \
    pry \
    sinatra \
    rails

# Set up command to run Ruby scripts
ENTRYPOINT ["ruby"]
