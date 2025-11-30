$file = 'D:\Lutem\LutemPrototype\frontend\css\layout_backup.css'
$content = Get-Content $file -Raw
$content = $content -replace 'padding: 48px 24px 40px;', 'padding: 12px 24px 12px;'
$content = $content -replace 'font-size: 3\.2em;', 'font-size: 2.4em;'
$content = $content -replace 'font-size: 1\.4em;\r?\n\s+margin-top: 8px;', "font-size: 1.1em;`n        margin-top: 4px;"
Set-Content $file $content -NoNewline
Write-Host "Done - backup modified"
