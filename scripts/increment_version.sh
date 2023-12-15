#!/bin/bash

version_file="versions.conf"

# Default values
part="BUILD"
suffix="_VERSION"

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -t|--target)
            target="${2}"
            shift 2  # Shift past the flag and its value
            ;;
        -p|--part)
            part=$2
            shift 2  # Shift past the flag and its value
            ;;
        *)
            echo "Unknown parameter passed: $1"
            exit 1
            ;;
    esac
done

target="${target}_${part}${suffix}"

# Source the version file to get current versions
source $version_file

# Dynamically fetch the target version using indirect variable referencing
build_ver=${!target}

# If the version for the target doesn't exist, initialize it to 0.0.0.0
if [ -z "$build_ver" ]; then
    build_ver="0.0.0.0"
    echo "${target}=0.0.0.0" >> $version_file
fi


# Extract components of the version
MAJOR=$(echo $build_ver | cut -d. -f1)
MINOR=$(echo $build_ver | cut -d. -f2)
PATCH=$(echo $build_ver | cut -d. -f3)
BUILD=$(echo $build_ver | cut -d. -f4)

# Increment the specified version component
case $part in
    MAJOR)
        new_version=$(($MAJOR + 1)).$MINOR.$PATCH.$BUILD
        ;;
    MINOR)
        new_version=$MAJOR.$(($MINOR + 1)).$PATCH.$BUILD
        ;;
    PATCH)
        new_version=$MAJOR.$MINOR.$(($PATCH + 1)).$BUILD
        ;;
    BUILD)
        new_version=$MAJOR.$MINOR.$PATCH.$(($BUILD + 1))
        ;;
    *)
        echo "Error: Invalid part specified. Supported values are: MAJOR, MINOR, PATCH, BUILD."
        exit 1
        ;;
esac

# Update the version file with the new version
sed -i "s/${target}=$build_ver/${target}=$new_version/" $version_file

