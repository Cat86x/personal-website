#!/usr/bin/env fish

set NGINX_WEBROOT /usr/share/nginx/html
echo "Using Nginx webroot: $NGINX_WEBROOT"

set SOURCE_DIR ./public

if test -d $SOURCE_DIR
    echo "Copying contents from $SOURCE_DIR to $NGINX_WEBROOT/"
    rsync -a --delete $SOURCE_DIR/ $NGINX_WEBROOT/

    if test $status -ne 0
        echo "Error: Failed to copy files." >&2
        exit 1
    else
        echo "Files copied successfully."
    end
else
    echo "Warning: Source directory '$SOURCE_DIR' not found. Skipping copy." >&2
end

echo "Starting nginx in the foreground..."
nginx -g 'daemon off;'

if test $status -ne 0
    echo "Error: nginx command failed to start." >&2
    exit 1
end

echo "Nginx stopped."

exit 0
