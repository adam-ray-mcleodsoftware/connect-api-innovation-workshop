# Base image with Node.js 20
FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Install jq, yq, openapi-generator-cli
RUN apt-get update && apt-get install -y \
    jq \
    python3-pip \
    curl \
 && pip3 install yq \
 && curl -L https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/7.3.0/openapi-generator-cli-7.3.0.jar -o /usr/local/bin/openapi-generator-cli.jar \
 && echo -e '#!/bin/bash\nexec java -jar /usr/local/bin/openapi-generator-cli.jar "$@"' > /usr/local/bin/openapi-generator-cli \
 && chmod +x /usr/local/bin/openapi-generator-cli
