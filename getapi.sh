#!/bin/bash

# URL of your OpenAPI JSON
API=$1
OAS_URL=$2

# Files
JSON_FILE="oas.json"
YAML_FILE="filtered.yaml"

# Step 1: Download
curl -s "$OAS_URL" -o "$JSON_FILE"


# Step 1a: make sure it's JSON, we have some jq to do that yq doesn't support
if head -n 1 "$JSON_FILE" | grep -qE '^\s*{'; then
    # File is JSON, do nothing
    :
else
    # File is YAML, convert to JSON
    mv "$JSON_FILE" oas.yaml
    yq -o=json oas.yaml > "$JSON_FILE"
    rm oas.yaml
fi

# Step 2: Extract readOnly and required flags from schemas (if present)
jq -f stripreadonly.jq oas.json > filtered.json

# Step 3: Convert to YAML
jq '.' filtered.json | yq -P > "$YAML_FILE"

# Step 4: Add codegen stub
openapi-generator-cli generate -i filtered.json -g typescript-fetch -o ./workshop-ui/src/api-clients/$API --skip-validate-spec 

rm filtered.json
rm oas.json
rm filtered.yaml
