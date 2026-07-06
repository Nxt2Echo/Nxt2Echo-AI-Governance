# init_db.ps1 - PowerShell script to create SQLite database using schema.sql

# Ensure sqlite3 is available in PATH
if (-not (Get-Command sqlite3 -ErrorAction SilentlyContinue)) {
    Write-Error "sqlite3 is not installed or not in PATH. Please install SQLite (https://www.sqlite.org/download.html) and ensure sqlite3.exe is accessible."
    exit 1
}

# Determine project root (directory containing this script)
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$schemaPath = Join-Path $projectRoot "database structure\schema.sql"
$dbPath = Join-Path $projectRoot "database.sqlite"

# Optional: remove existing DB for a fresh start
if (Test-Path $dbPath) {
    Write-Host "Existing database found at $dbPath. Deleting for fresh init..."
    Remove-Item $dbPath
}

# Create the database by feeding the schema into sqlite3
Write-Host "Creating SQLite database at $dbPath using schema $schemaPath..."
Get-Content $schemaPath | sqlite3 $dbPath

if (Test-Path $dbPath) {
    Write-Host "Database created successfully."
} else {
    Write-Error "Failed to create database."
}

# Optional: Verify tables
Write-Host "Listing tables in the new database:"
sqlite3 $dbPath ".tables"
