<?php

require __DIR__ . '/lib.php';

$secret = 'test-secret';
$c = captcha_issue($secret);
assert(captcha_verify($secret, $c['token'], (string) ($c['a'] + $c['b'])));
assert(!captcha_verify($secret, $c['token'], '0'));

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
