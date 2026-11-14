<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Check optional DB config
$hasHost = !empty(getenv('DB_HOST'));
$hasUser = !empty(getenv('DB_USER'));
$hasName = !empty(getenv('DB_NAME'));

echo json_encode([
    'status' => 'ok',
    'runtime' => 'PHP/Apache Shared Hosting (Node.js-free)',
    'timestamp' => gmdate('c'),
    'dbConfigured' => [
        'hasHost' => $hasHost,
        'hasUser' => $hasUser,
        'hasName' => $hasName,
        'isFullyConfigured' => ($hasHost && $hasUser && $hasName)
    ]
]);
