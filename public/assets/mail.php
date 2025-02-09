<?php
require 'sendgrid/lib/SendGrid.php'; // Include SendGrid's library
use SendGrid\Mail\Mail;
use SendGrid as SendGridClient;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $name = str_replace(array("\r", "\n"), array(" ", " "), $name);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $number = trim($_POST["number"]);
    $company = trim($_POST["company"]);
    $message = trim($_POST["message"]);
    if (empty($name) || empty($number) || empty($company) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please complete the form and try again.";
        exit;
    }

    $recipient = "info@gtimecs.org"; // Replace with the desired recipient email
    $subject = "New contact from $name";
    $head = " /// GCS \\ ";

    $email_content = "$head\n\n";
    $email_content .= "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Number: $number\n";
    $email_content .= "Company: $company\n";
    $email_content .= "Message:\n$message\n";

    $sendgrid = new SendGrid("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"); // Use environment variable for API key
    $emailObj = new Mail();
     // Use a verified sender email
    $emailObj->setFrom("noreply@gtimecs.org", "Gtime Consultancy Services");
    $emailObj->setReplyTo($email, $name);
    $emailObj->setSubject($subject);
    $emailObj->addTo($recipient, "Recipient");
    $emailObj->addContent("text/plain", $email_content);

    try {
        $response = $sendgrid->send($emailObj);
        if ($response->statusCode() >= 200 && $response->statusCode() < 300) {
            http_response_code(200);
            echo "Thank You! Your message has been sent.";
        } else {
            http_response_code(500);
            echo "Oops! Something went wrong and we couldn't send your message.";
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo "Error: " . $e->getMessage();
    }
} else {
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>
