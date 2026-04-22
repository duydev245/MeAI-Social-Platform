param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$WranglerArgs
)

$ErrorActionPreference = 'Stop'

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$terraformVarsPath = Resolve-Path (Join-Path $projectRoot '..\MeAI-BE\terraform-var\common.auto.tfvars')

function Get-TerraformString {
  param(
    [string]$Content,
    [string]$Key
  )

  $match = [regex]::Match($Content, "(?m)^\s*$([regex]::Escape($Key))\s*=\s*""([^""]+)""")
  if (-not $match.Success) {
    throw "Missing `"$Key`" in $terraformVarsPath."
  }

  return $match.Groups[1].Value
}

$terraformVars = Get-Content -Raw $terraformVarsPath

if (-not $env:CLOUDFLARE_API_TOKEN) {
  $env:CLOUDFLARE_API_TOKEN = Get-TerraformString -Content $terraformVars -Key 'cloudflare_api_token'
}

if (-not $env:CLOUDFLARE_ACCOUNT_ID) {
  $env:CLOUDFLARE_ACCOUNT_ID = Get-TerraformString -Content $terraformVars -Key 'cloudflare_account_id'
}

Push-Location $projectRoot
try {
  & npx wrangler @WranglerArgs
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
} finally {
  Pop-Location
}
