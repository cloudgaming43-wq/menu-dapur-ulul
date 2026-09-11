param(
    [int]$IntervalSeconds = 5
)

$ErrorActionPreference = 'Stop'
$repoPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoPath

function Get-ChangeSignature {
    $status = git status --porcelain
    if ($LASTEXITCODE -ne 0) {
        throw 'Gagal membaca status Git.'
    }

    return ($status -join "`n")
}

function Sync-Changes {
    $status = git status --porcelain
    if (-not $status) {
        return
    }

    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    git add -A
    git commit -m "Auto-sync: $timestamp"
    if ($LASTEXITCODE -ne 0) {
        Write-Warning 'Commit gagal. Periksa output Git.'
        return
    }

    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[$timestamp] Perubahan berhasil di-push ke GitHub." -ForegroundColor Green
    } else {
        Write-Warning 'Push gagal. Jalankan git pull lalu periksa konflik.'
    }
}

Write-Host "Auto-sync aktif: $repoPath" -ForegroundColor Cyan
Write-Host "Pemeriksaan setiap $IntervalSeconds detik. Tekan Ctrl+C untuk berhenti." -ForegroundColor DarkGray

$lastSignature = Get-ChangeSignature

while ($true) {
    Start-Sleep -Seconds $IntervalSeconds
    $currentSignature = Get-ChangeSignature

    if ($currentSignature -ne $lastSignature) {
        Sync-Changes
        $lastSignature = Get-ChangeSignature
    }
}
