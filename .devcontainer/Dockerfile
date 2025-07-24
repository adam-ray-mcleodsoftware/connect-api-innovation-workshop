# Use Node.js 20 devcontainer base image
FROM mcr.microsoft.com/devcontainers/javascript-node:20

RUN id -u vscode &>/dev/null || useradd -m vscode

RUN apt-get update && apt-get install -y \
    curl \
    jq \
    unzip \
    openjdk-17-jre-headless

# yq (Go-based, better compatibility)
RUN curl -Lo /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 \
    && chmod +x /usr/local/bin/yq

# openapi-generator-cli
RUN curl -Lo /usr/local/bin/openapi-generator-cli.jar https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/7.3.0/openapi-generator-cli-7.3.0.jar && \
    echo -e '#!/bin/bash\nexec java -jar /usr/local/bin/openapi-generator-cli.jar "$@"' > /usr/local/bin/openapi-generator-cli && \
    chmod +x /usr/local/bin/openapi-generator-cli