# Clean a schema object deeply
def cleanSchema:
  if has("$ref") then .
  elif (.type == "object") and (.properties != null) then
    del(.required)
    | .properties |= (
        to_entries
        | map({
            key: .key,
            value: (
              .value
              | del(.readOnly)
              | cleanSchema
              | with_entries(select(.value != null))
            )
          })
        | from_entries
      )
  elif (.type == "array") and (.items != null) then
    .items |= cleanSchema
  else
    del(.required)
  end;

# Clean content blocks (e.g. requestBody or response content)
def cleanContent:
  .content |= with_entries(
    .value.schema |= cleanSchema
  );

# Clean parameter or header
def cleanParamOrHeader:
  .schema |= cleanSchema;

# Clean reusable response
def cleanResponse:
  if .content? then
    cleanContent
  else .
  end;

# Build the cleaned OpenAPI document
{
  openapi: .openapi,
  info: .info,
  servers: .servers,
  paths: (
    .paths
    | with_entries(
        .value |= with_entries(
        del(.value.tags)
        | if .value.requestBody? then
            .value.requestBody |= cleanContent
            else . end
        | .value.responses |= with_entries(
            if .value.content? then
                .value |= cleanContent
            else . end
            )
        )
    )
  ),
  components: {

    parameters: (
      (.components.parameters // {})
      | to_entries
      | map({
          key: .key,
          value: (.value | cleanParamOrHeader)
      })
      | from_entries
    ),
    headers: (
      (.components.headers // {})
      | to_entries
      | map({
          key: .key,
          value: (.value | cleanParamOrHeader)
      })
      | from_entries
    ),
    responses: (
      (.components.responses // {})
      | to_entries
      | map({
          key: .key,
          value: (.value | cleanResponse)
      })
      | from_entries
    ),
    schemas: (
      (.components.schemas // {})
      | to_entries
      | map({
          key: .key,
          value: (.value | cleanSchema)
      })
      | from_entries
    ),
  }
}
