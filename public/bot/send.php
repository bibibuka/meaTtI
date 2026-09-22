<?php

require __DIR__ . '/lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_out(['ok' => false, 'error' => 'method'], 405);
}

$cfg = bot_config();
$secret = $cfg['hmac_secret'] ?? '';
$admin = (string) ($cfg['admin_chat_id'] ?? '');
if (!bot_secret_ready($secret) || $admin === '' || $admin === '123456789') {
    json_out(['ok' => false, 'error' => 'config'], 500);
}

$raw = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);
if (!is_array($body)) {
    json_out(['ok' => false, 'error' => 'json'], 400);
}

// Раньше 20-секундный лимит срабатывал до проверок: ошибся в капче или в
// длине поля — и повторная отправка упиралась в «слишком часто». Теперь
// попытки ограничены мягко (10 в минуту), а 20 секунд отсчитываются только
// между заявками, прошедшими все проверки.
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
if (!bot_attempts_ok('try-' . $ip, 10, 60)) {
    json_out(['ok' => false, 'error' => 'rate'], 429);
}

$name = trim((string) ($body['name'] ?? ''));
$contact = trim((string) ($body['contact'] ?? ''));
$message = trim((string) ($body['message'] ?? ''));
$consent = !empty($body['consent']);
$token = (string) ($body['captcha_token'] ?? '');
$answer = (string) ($body['captcha_answer'] ?? '');

if (!$consent) {
    json_out(['ok' => false, 'error' => 'consent'], 400);
}
if (bot_len($name) < 2 || bot_len($name) > 80) {
    json_out(['ok' => false, 'error' => 'name'], 400);
}
if (bot_len($contact) < 3 || bot_len($contact) > 120) {
    json_out(['ok' => false, 'error' => 'contact'], 400);
}
if (bot_len($message) < 3 || bot_len($message) > 2000) {
    json_out(['ok' => false, 'error' => 'message'], 400);
}
if (!captcha_verify($secret, $token, $answer) || !captcha_consume($token)) {
    json_out(['ok' => false, 'error' => 'captcha'], 400);
}
if (!bot_rate_ok('form-' . $ip, 20)) {
    json_out(['ok' => false, 'error' => 'rate'], 429);
}

$text = format_lead([
    'name' => $name,
    'contact' => $contact,
    'message' => $message,
    'via' => 'сайт',
]);
$sent = tg_send($admin, $text);
if (empty($sent['ok'])) {
    json_out(['ok' => false, 'error' => 'telegram'], 502);
}

json_out(['ok' => true]);
