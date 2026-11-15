#!/bin/zsh
# Print directory structure (pds.sh)

echo "Project Structure:"

# Enable null glob to handle empty directories
setopt null_glob

find src -type d -o -type f ! -name "*.test.ts" ! -name "*.css" | sort | while read -r line; do
    # Count depth by counting slashes
    depth=$(($(echo "$line" | tr -cd '/' | wc -c) - 1))
    
    # Create indent based on depth
    indent=$(printf '%*s' "$((depth * 4))" '')
    
    # Get the basename of the path
    name=$(basename "$line")
    
    # Add trailing slash to directories
    if [ -d "$line" ]; then
        name="$name/"
    fi
    
    # Print the line
    echo "$indent$name"
done