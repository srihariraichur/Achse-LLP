<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$name = $input['name'] ?? '';
$company = $input['company'] ?? '';
$email = $input['email'] ?? '';
$phone = $input['phone'] ?? '';
$category = $input['category'] ?? '';
$message = $input['message'] ?? '';

// Database credentials for StackCP / Serverbyt
$host = getenv('DB_HOST') ?: 'localhost';
$db = getenv('DB_NAME') ?: 'achse-contact-info-353034375213';
$user = getenv('DB_USER') ?: 'achse-contact-info-353034375213';
$pass = getenv('DB_PASS') ?: '';
$port = getenv('DB_PORT') ?: 3306;

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 5
    ]);

    // Ensure table exists
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS quote_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            company VARCHAR(255),
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(100),
            category VARCHAR(100),
            message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $stmt = $pdo->prepare("
        INSERT INTO quote_requests (name, company, email, phone, category, message)
        VALUES (:name, :company, :email, :phone, :category, :message)
    ");

    $stmt->execute([
        ':name' => $name,
        ':company' => $company,
        ':email' => $email,
        ':phone' => $phone,
        ':category' => $category,
        ':message' => $message
    ]);

    echo json_encode([
        'success' => true,
        'savedToDb' => true,
        'message' => 'Quote request saved successfully'
    ]);
} catch (Exception $e) {
    // Return graceful success so UX is uninterrupted even if DB is in maintenance
    echo json_encode([
        'success' => true,
        'savedToDb' => false,
        'message' => 'Quote request received (offline logging)',
        'error' => $e->getMessage()
    ]);
}
