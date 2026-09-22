<?php

function bot_config(): array
{
    $path = __DIR__ . '/config.php';
    if (!is_file($path)) {
        return [];
    }
    $cfg = require $path;
    return is_array($cfg) ? $cfg : [];
}

function bot_len(string $s): int
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
}

function captcha_issue(string $secret): array
{
    $a = random_int(2, 9);
    $b = random_int(2, 9);
    $sum = $a + $b;
    $exp = time() + 600;
    $nonce = bin2hex(random_bytes(8));
    $mac = hash_hmac('sha256', $sum . '|' . $nonce . '|' . $exp, $secret);
    return [
        'a' => $a,
        'b' => $b,
        'q' => $a . ' + ' . $b,
        'token' => $nonce . '|' . $exp . '|' . $mac,
    ];
}

function captcha_verify(string $secret, string $token, string $answer): bool
{
    $parts = explode('|', $token);
    if (count($parts) !== 3) {
        return false;
    }
    [$nonce, $exp, $mac] = $parts;
    if (!ctype_digit($exp) || (int) $exp < time()) {
        return false;
    }
    $answer = trim($answer);
    if (!preg_match('/^-?\d+$/', $answer)) {
        return false;
    }
    $calc = hash_hmac('sha256', ((int) $answer) . '|' . $nonce . '|' . $exp, $secret);
    return hash_equals($mac, $calc);
}

// Гасит токен капчи после успешной проверки: один решённый пример больше не
// годится для повторных отправок. Метка живёт до истечения самого токена.
function captcha_consume(string $token): bool
{
    $parts = explode('|', $token);
    if (count($parts) !== 3 || !ctype_xdigit($parts[0]) || !ctype_digit($parts[1])) {
        return false;
    }
    [$nonce, $exp] = $parts;
    $dir = bot_data_dir();
    $now = time();
    foreach (glob($dir . '/c-*.txt') ?: [] as $old) {
        if ((int) @file_get_contents($old) < $now) {
            @unlink($old);
        }
    }
    // Режим 'x' создаёт файл, только если его ещё нет, — атомарно, без гонок
    $h = @fopen($dir . '/c-' . $nonce . '.txt', 'x');
    if ($h === false) {
        return false;
    }
    fwrite($h, $exp);
    fclose($h);
    return true;
}

// Секрет задан и не заглушка из config.example.php
function bot_secret_ready(string $secret): bool
{
    return $secret !== '' && $secret !== 'replace-with-long-random-string';
}

// Секрет для заголовка вебхука. Telegram принимает в secret_token только
// A-Z, a-z, 0-9, _ и -, а hmac_secret может быть любой строкой, поэтому
// отдаём производный hex.
function bot_webhook_secret(string $secret): string
{
    return hash_hmac('sha256', 'telegram-webhook', $secret);
}

function format_lead(array $lead): string
{
    $name = $lead['name'] ?? '';
    $contact = $lead['contact'] ?? '';
    $message = $lead['message'] ?? '';
    $via = $lead['via'] ?? 'сайт';
    $from = $lead['from'] ?? '';
    $lines = [
        'Новая заявка maeTtI (' . $via . ')',
        '',
        'Имя: ' . $name,
        'Контакт: ' . $contact,
    ];
    if ($from !== '') {
        $lines[] = 'Telegram: ' . $from;
    }
    $lines[] = '';
    $lines[] = $message;
    return implode("\n", $lines);
}

function bot_next(array $state, string $text): array
{
    $text = trim($text);
    if ($text === '/cancel') {
        return ['state' => [], 'reply' => 'Заявка отменена. /start — начать заново.'];
    }
    if ($text === '/id') {
        return ['state' => $state, 'reply' => null, 'echo_id' => true];
    }
    if ($text === '/start' || empty($state['step'])) {
        return ['state' => ['step' => 'name'], 'reply' => "Заявка maeTtI.\nКак вас зовут?"];
    }
    if (($state['step'] ?? '') === 'name') {
        if (bot_len($text) < 2) {
            return ['state' => $state, 'reply' => 'Имя слишком короткое. Напишите ещё раз.'];
        }
        $state['name'] = $text;
        $state['step'] = 'contact';
        return ['state' => $state, 'reply' => 'Как с вами связаться? Telegram, телефон или email.'];
    }
    if (($state['step'] ?? '') === 'contact') {
        if (bot_len($text) < 3) {
            return ['state' => $state, 'reply' => 'Контакт слишком короткий. Напишите ещё раз.'];
        }
        $state['contact'] = $text;
        $state['step'] = 'message';
        return ['state' => $state, 'reply' => 'Опишите задачу.'];
    }
    if (($state['step'] ?? '') === 'message') {
        if (bot_len($text) < 3) {
            return ['state' => $state, 'reply' => 'Сообщение слишком короткое. Напишите ещё раз.'];
        }
        return [
            'state' => [],
            'reply' => 'Заявка отправлена. Напишем вам.',
            'lead' => [
                'name' => $state['name'] ?? '',
                'contact' => $state['contact'] ?? '',
                'message' => $text,
                'via' => 'бот',
            ],
        ];
    }
    return ['state' => [], 'reply' => 'Напишите /start'];
}

function bot_http_post(string $url, array $data): array
{
    $body = json_encode($data, JSON_UNESCAPED_UNICODE);
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
        ]);
        $res = curl_exec($ch);
        curl_close($ch);
        return json_decode($res ?: '[]', true) ?: [];
    }
    $ctx = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $body,
            'timeout' => 15,
        ],
    ]);
    $res = @file_get_contents($url, false, $ctx);
    return json_decode($res ?: '[]', true) ?: [];
}

function tg_api(string $method, array $params): array
{
    $token = bot_config()['bot_token'] ?? '';
    if ($token === '') {
        return ['ok' => false, 'description' => 'bot_token empty'];
    }
    return bot_http_post('https://api.telegram.org/bot' . $token . '/' . $method, $params);
}

function tg_send(string $chatId, string $text): array
{
    return tg_api('sendMessage', [
        'chat_id' => $chatId,
        'text' => $text,
        'disable_web_page_preview' => true,
    ]);
}

function bot_data_dir(): string
{
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) {
        mkdir($dir, 0700, true);
    }
    return $dir;
}

function bot_state_file(string $chatId): string
{
    return bot_data_dir() . '/s-' . hash('sha256', $chatId) . '.json';
}

function bot_state_load(string $chatId): array
{
    $file = bot_state_file($chatId);
    if (!is_file($file)) {
        return [];
    }
    $data = json_decode((string) file_get_contents($file), true);
    return is_array($data) ? $data : [];
}

function bot_state_save(string $chatId, array $state): void
{
    $file = bot_state_file($chatId);
    if ($state === []) {
        if (is_file($file)) {
            unlink($file);
        }
        return;
    }
    file_put_contents($file, json_encode($state, JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function bot_rate_ok(string $key, int $seconds = 20): bool
{
    $file = bot_data_dir() . '/r-' . hash('sha256', $key) . '.txt';
    $now = time();
    if (is_file($file) && $now - (int) file_get_contents($file) < $seconds) {
        return false;
    }
    file_put_contents($file, (string) $now, LOCK_EX);
    return true;
}

// Не больше $max попыток за $window секунд — против перебора капчи и спама.
// В отличие от bot_rate_ok не мешает исправить ошибку и сразу отправить снова.
function bot_attempts_ok(string $key, int $max, int $window): bool
{
    $file = bot_data_dir() . '/a-' . hash('sha256', $key) . '.json';
    $now = time();
    $h = @fopen($file, 'c+');
    if ($h === false) {
        return true;
    }
    flock($h, LOCK_EX);
    $hits = json_decode((string) stream_get_contents($h), true);
    $hits = array_values(array_filter(
        is_array($hits) ? $hits : [],
        fn($t) => is_int($t) && $now - $t < $window
    ));
    $ok = count($hits) < $max;
    if ($ok) {
        $hits[] = $now;
    }
    ftruncate($h, 0);
    rewind($h);
    fwrite($h, json_encode($hits));
    flock($h, LOCK_UN);
    fclose($h);
    return $ok;
}

function bot_public_url(string $file): string
{
    $cfg = bot_config();
    if (!empty($cfg['site_url'])) {
        return rtrim((string) $cfg['site_url'], '/') . '/bot/' . ltrim($file, '/');
    }
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $dir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/bot')), '/');
    return 'https://' . $host . $dir . '/' . ltrim($file, '/');
}

function json_out(array $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
