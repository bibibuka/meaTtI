<?php

require __DIR__ . '/lib.php';

$secret = 'test-secret';
$c = captcha_issue($secret);
assert(captcha_verify($secret, $c['token'], (string) ($c['a'] + $c['b'])));
assert(!captcha_verify($secret, $c['token'], '0'));
// Решённая капча годится только на одну заявку
assert(captcha_consume($c['token']));
assert(!captcha_consume($c['token']));
@unlink(bot_data_dir() . '/c-' . explode('|', $c['token'])[0] . '.txt');

// Секрет вебхука — только символы, которые принимает Telegram
assert(preg_match('/^[A-Za-z0-9_-]{1,256}$/', bot_webhook_secret('любая строка +/= !')) === 1);
assert(!bot_secret_ready('replace-with-long-random-string'));

$r = bot_next([], '/start');
assert(($r['state']['step'] ?? '') === 'name');
$r = bot_next($r['state'], 'Иван');
assert(($r['state']['step'] ?? '') === 'contact');
$r = bot_next($r['state'], '@user');
assert(($r['state']['step'] ?? '') === 'message');
$r = bot_next($r['state'], 'Нужен сайт');
assert(isset($r['lead']));
assert(str_contains(format_lead($r['lead']), 'Иван'));
assert(str_contains(format_lead($r['lead']), 'Нужен сайт'));

$r = bot_next(['step' => 'name', 'name' => 'x'], '/cancel');
assert($r['state'] === []);

echo "ok\n";
