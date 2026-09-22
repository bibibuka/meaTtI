<?php

require __DIR__ . '/lib.php';

$cfg = bot_config();
$secret = $cfg['hmac_secret'] ?? '';
if (!bot_secret_ready($secret)) {
    json_out(['ok' => false, 'error' => 'config'], 500);
}

$c = captcha_issue($secret);
json_out(['ok' => true, 'q' => $c['q'], 'token' => $c['token']]);
