aws s3 sync dist/ s3://tarragon-prod --delete

aws s3 sync dist/ s3://tarragon-prod --delete --cache-control "public, max-age=31536000" --exclude "index.html"

aws s3 cp dist/index.html s3://tarragon-prod/index.html --cache-control "no-cache, no-store, must-revalidate" --content-type "text/html"