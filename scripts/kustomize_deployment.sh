#!/bin/bash

# Remove DEPLOYMENT_NS directory
rm -r "${DEPLOYMENT_NS}"

# Create directory
mkdir -p "${DEPLOYMENT_NS}"

# Build sed expression based on versions.conf content
SED_EXPR=""
while IFS= read -r line || [[ -n "$line" ]]; do
    VAR_NAME=$(echo $line | cut -d'=' -f1)
    VAR_VALUE=$(echo $line | cut -d'=' -f2 | tr -d ' ')
    
    SED_EXPR="${SED_EXPR} -e s#{{$VAR_NAME}}#${VAR_VALUE}#g"
done < versions.conf


# Adding hardcoded replacements to the sed expression
SED_EXPR="${SED_EXPR} -e s:{{NAMESPACE}}:${NAMESPACE}:g"
SED_EXPR="${SED_EXPR} -e s:{{SERVICE_ACCOUNT}}:${SERVICE_ACCOUNT}:g"
SED_EXPR="${SED_EXPR} -e s:{{REGISTRY}}:${REGISTRY}:g"
SED_EXPR="${SED_EXPR} -e s:{{REGISTRY_AUTH}}:${REGISTRY_AUTH}:g"
SED_EXPR="${SED_EXPR} -e s:{{TAG}}:${TAG}:g"
SED_EXPR="${SED_EXPR} -e s:{{USER}}:${SERVICE_ACCOUNT}:g"
SED_EXPR="${SED_EXPR} -e s:{{PUBLIC_DOMAIN_NAME}}:${PUBLIC_DOMAIN_NAME}:g"
SED_EXPR="${SED_EXPR} -e s:{{LAB_DOMAIN_NAME}}:${LAB_DOMAIN_NAME}:g"
SED_EXPR="${SED_EXPR} -e s:{{ROOT_PATH}}:${ROOT_PATH}:g"
# If you have additional hardcoded replacements, add them below using the same pattern.

# Process files
cd ${DEPLOYMENT_DIR}/kustomize
find . -type f | while read -r FILE; do
    TARGET_DIR="${DEPLOYMENT_NS}/$(dirname $FILE)"
    mkdir -p "$TARGET_DIR"
    
    eval sed $SED_EXPR "$FILE" > "$TARGET_DIR/$(basename $FILE)"
done
