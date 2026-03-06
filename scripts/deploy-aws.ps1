# Deploy The Chordinator to AWS S3 (static website)
# Prerequisites: AWS CLI configured; Node/npm for build (or run deploy-aws-upload-only.ps1 after building elsewhere)
# Usage: .\scripts\deploy-aws.ps1
# Optional env: $env:AWS_BUCKET = "my-chordinator-bucket"; $env:AWS_REGION = "us-east-1"

$ErrorActionPreference = "Stop"
$Bucket = if ($env:AWS_BUCKET) { $env:AWS_BUCKET } else { "the-chordinator" }
$Region = if ($env:AWS_REGION) { $env:AWS_REGION } else { "us-east-1" }
$Dist = Join-Path $PSScriptRoot ".." "dist"

if (-not (Test-Path $Dist)) {
    Write-Host "Building..." -ForegroundColor Cyan
    Push-Location $PSScriptRoot\..
    try {
        npm run build
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    } finally {
        Pop-Location
    }
} else {
    Write-Host "Using existing dist/" -ForegroundColor Cyan
}

Write-Host "Creating S3 bucket if needed: $Bucket (region: $Region)" -ForegroundColor Cyan
aws s3api head-bucket --bucket $Bucket 2>$null
if ($LASTEXITCODE -ne 0) {
    if ($Region -eq "us-east-1") {
        aws s3api create-bucket --bucket $Bucket
    } else {
        $cfg = "{ `"LocationConstraint`": `"$Region`" }"
        aws s3api create-bucket --bucket $Bucket --create-bucket-configuration $cfg --region $Region
    }
    # Enable static website hosting
    aws s3 website s3://$Bucket/ --index-document index.html --error-document index.html
    # Optional: make objects public (for website endpoint). Prefer CloudFront + OAC for production.
    $policy = @"
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::$Bucket/*"
  }]
}
"@
    Set-Content -Path "$env:TEMP\chordinator-bucket-policy.json" -Value $policy
    aws s3api put-bucket-policy --bucket $Bucket --policy "file://$env:TEMP\chordinator-bucket-policy.json"
}

Write-Host "Uploading build to s3://$Bucket" -ForegroundColor Cyan
aws s3 sync dist/ "s3://$Bucket/" --delete --region $Region

$WebsiteUrl = "http://$Bucket.s3-website-$Region.amazonaws.com"
Write-Host "Done. App URL (S3 website): $WebsiteUrl" -ForegroundColor Green
Write-Host "Tip: For HTTPS and a custom domain, put CloudFront in front of this bucket."
