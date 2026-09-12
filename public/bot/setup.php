<?php

require __DIR__ . '/lib.php';

$cfg = bot_config();
$want = (string) ($cfg['setup_secret'] ?? '');
$got = (string) ($_GET['secret'] ?? '');
if ($want === '' || $want === 'replace-setup-secret' || !hash_equals($want, $got)) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "forbidden";
    exit;
}

$url = bot_public_url('webhook.php');
$res = tg_api('setWebhook', [
    'url' => $url,
    'secret_token' => (string) ($cfg['hmac_secret'] ?? ''),
    'drop_pending_updates' => true,
]);

header('Content-Type: application/json; charset=utf-8');
echo json_encode(['webhook' => $url, 'telegram' => $res], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
