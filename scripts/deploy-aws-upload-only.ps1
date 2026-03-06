# Upload existing dist/ to AWS S3 (no build). Run after: npm install && npm run build
# Usage: .\scripts\deploy-aws-upload-only.ps1
# Env: AWS_BUCKET, AWS_REGION (optional)

$ErrorActionPreference = "Stop"
$Bucket = if ($env:AWS_BUCKET) { $env:AWS_BUCKET } else { "chordinator-app-454851816256" }
$Region = if ($env:AWS_REGION) { $env:AWS_REGION } else { "us-east-1" }
$Dist = Join-Path $PSScriptRoot ".." "dist"

if (-not (Test-Path $Dist)) {
    Write-Host "No dist/ folder. Run: npm install && npm run build" -ForegroundColor Red
    exit 1
}

Write-Host "Uploading dist/ to s3://$Bucket..." -ForegroundColor Cyan
aws s3 sync $Dist "s3://$Bucket/" --delete --region $Region
# Set Content-Type so the browser runs JS/CSS (S3 can serve .js as octet-stream and break the app)
Get-ChildItem $Dist -Recurse -File | ForEach-Object {
    $key = $_.FullName.Substring($Dist.Length + 1).Replace("\", "/")
    $ct = switch -Regex ($_.Extension) {
        "\.html$" { "text/html" }
        "\.(js|mjs)$" { "application/javascript" }
        "\.css$"  { "text/css" }
        "\.svg$"  { "image/svg+xml" }
        "\.ico$"  { "image/x-icon" }
        default { $null }
    }
    if ($ct) {
        aws s3 cp "s3://$Bucket/$key" "s3://$Bucket/$key" --content-type $ct --region $Region --metadata-directive REPLACE 2>$null
    }
}
Write-Host "Done. Open: http://$Bucket.s3-website-$Region.amazonaws.com" -ForegroundColor Green
