#!/bin/sh
set -eu

umask 027

# Trap signals for graceful shutdown
trap 'echo "🔻 Script interrupted. Exiting..."; exit 1' INT TERM

echo "Starting secure entrypoint script..."

# Input validation functions
validate_url() {
    local url="$1"
    if echo "$url" | grep -qE '^https?://[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?(:[0-9]{1,5})?(/[a-zA-Z0-9._~:/?#[\]@!$&'"'"'()*+,;=-]*)?$'; then
        [ ${#url} -le 2048 ] && return 0
    fi
    return 1
}

validate_title() {
    local title="$1"
    echo "$title" | grep -qE '^[a-zA-Z0-9 ._-]{1,100}$'
}

escape_string() {
    printf '%s\n' "$1" | sed 's/[[\.*^$()+?{|\\]/\\&/g'
}

# Environment variables with defaults
VITE_API_URL=${VITE_API_URL:-"http://localhost:3000"}
VITE_APP_TITLE=${VITE_APP_TITLE:-"My App"}

echo "Validating environment variables..."

if ! validate_url "$VITE_API_URL"; then
    echo "❌ Invalid VITE_API_URL: '$VITE_API_URL'"
    exit 1
fi

if ! validate_title "$VITE_APP_TITLE"; then
    echo "❌ Invalid VITE_APP_TITLE: '$VITE_APP_TITLE'"
    exit 1
fi

echo "✅ VITE_API_URL: $VITE_API_URL"
echo "✅ VITE_APP_TITLE: $VITE_APP_TITLE"

# Escape strings for safe sed replacement
SAFE_API_URL=$(escape_string "$VITE_API_URL")
SAFE_APP_TITLE=$(escape_string "$VITE_APP_TITLE")

TARGET_DIR="/usr/share/nginx/html"

if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Error: '$TARGET_DIR' not found"
    exit 1
fi

real_target=$(realpath "$TARGET_DIR")

echo "Processing JavaScript files in $real_target..."

processed_count=0

# Process files
find "$TARGET_DIR" -type f -name "*.js" | while read -r file; do
    if [ -f "$file" ] && [ -r "$file" ] && [ -w "$file" ]; then
        real_file=$(realpath "$file")
        # Security check: ensure file is within target directory
        case "$real_file" in
            "$real_target"*)
                echo "🔧 Processing: $file"
                temp_file=$(mktemp -p "$(dirname "$file")" .tmp.XXXXXXXXXX)
                
                if grep -q "VITE_API_URL_PLACEHOLDER\|VITE_APP_TITLE_PLACEHOLDER" "$file"; then
                    if sed "s#VITE_API_URL_PLACEHOLDER#$SAFE_API_URL#g; s#VITE_APP_TITLE_PLACEHOLDER#$SAFE_APP_TITLE#g" "$file" > "$temp_file"; then
                        if [ -s "$temp_file" ]; then
                            chmod --reference="$file" "$temp_file" 2>/dev/null || true
                            chown --reference="$file" "$temp_file" 2>/dev/null || true
                            mv "$temp_file" "$file"
                            processed_count=$((processed_count + 1))
                            echo "  ✅ Replaced placeholders in $(basename "$file")"
                        else
                            echo "  ❌ Empty output file for $(basename "$file")"
                            rm -f "$temp_file"
                        fi
                    else
                        echo "  ❌ Failed to replace in $(basename "$file")"
                        rm -f "$temp_file"
                    fi
                else
                    echo "  ℹ️  No placeholders found in $(basename "$file")"
                    rm -f "$temp_file"
                fi
                ;;
            *)
                echo "⚠️  Skipping file outside target directory: $file"
                ;;
        esac
    else
        echo "  ⚠️  Inaccessible file: $file"
    fi
done

echo "✅ Replacement completed"

# Clean up any remaining temporary files
find "$TARGET_DIR" -name ".tmp.*" -type f -delete 2>/dev/null || true

# Validate nginx configuration
if [ -f "/etc/nginx/nginx.conf" ]; then
    echo "Checking nginx configuration..."
    if nginx -t; then
        echo "✅ Nginx configuration valid"
    else
        echo "❌ Nginx configuration error - Details:"
        nginx -t 2>&1
        echo "--- nginx.conf content ---"
        cat /etc/nginx/nginx.conf
        echo "--- default.conf content ---"
        cat /etc/nginx/conf.d/default.conf 2>/dev/null || echo "default.conf not found"
        exit 1
    fi
fi

echo "🚀 Starting nginx..."
exec "$@"
