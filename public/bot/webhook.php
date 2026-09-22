<?php

require __DIR__ . '/lib.php';

$cfg = bot_config();
$token = $cfg['bot_token'] ?? '';
$admin = (string) ($cfg['admin_chat_id'] ?? '');
$secret = $cfg['hmac_secret'] ?? '';

if ($token === '' || $token === '000000000:REPLACE_ME') {
    http_response_code(500);
    exit;
}

// Без секрета любой мог бы слать сюда поддельные «апдейты» и заявки админу
if (!bot_secret_ready($secret)) {
    http_response_code(500);
    exit;
}
$headerSecret = (string) ($_SERVER['HTTP_X_TELEGRAM_BOT_API_SECRET_TOKEN'] ?? '');
if (!hash_equals(bot_webhook_secret($secret), $headerSecret)) {
    http_response_code(403);
    exit;
}

$update = json_decode(file_get_contents('php://input') ?: '[]', true);
$msg = is_array($update) ? ($update['message'] ?? null) : null;
if (!is_array($msg) || !isset($msg['chat']['id'])) {
    http_response_code(200);
    exit;
}

$chatId = (string) $msg['chat']['id'];
$text = trim((string) ($msg['text'] ?? ''));
if ($text === '') {
    http_response_code(200);
    exit;
}

$from = trim((string) ($msg['from']['username'] ?? ''));
$fromLabel = $from !== '' ? '@' . $from . ' (' . $chatId . ')' : $chatId;

$result = bot_next(bot_state_load($chatId), $text);
bot_state_save($chatId, $result['state'] ?? []);

if (!empty($result['echo_id'])) {
    tg_send($chatId, 'chat_id: ' . $chatId);
    http_response_code(200);
    exit;
}

if (!empty($result['lead']) && $admin !== '' && $admin !== '123456789') {
    $result['lead']['from'] = $fromLabel;
    $result['lead']['via'] = 'бот';
    tg_send($admin, format_lead($result['lead']));
}

if (!empty($result['reply'])) {
    tg_send($chatId, $result['reply']);
}

http_response_code(200);
