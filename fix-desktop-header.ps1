$file = 'D:\Lutem\LutemPrototype\frontend\css\layout.css'
$content = Get-Content $file -Raw

# Replace auth-header on desktop from margin-left to display:none
$content = $content -replace '(/\* Auth header offset \*/\s+\.auth-header \{\s+)margin-left: 110px;', '$1display: none;'

# Replace page-header padding 
$content = $content -replace 'padding: 12px 24px 12px;', 'padding: 8px 24px 8px;'

# Add body padding reset after auth-header rule - need to insert it
$insertAfter = '/* Auth header offset */
    .auth-header {
        display: none;
    }'
$insertText = '/* Auth header offset */
    .auth-header {
        display: none;
    }

    /* Remove body top padding on desktop since auth-header is hidden */
    body {
        padding-top: 0 !important;
    }'

$content = $content -replace [regex]::Escape($insertAfter), $insertText

Set-Content $file $content -NoNewline
Write-Host "Done"
