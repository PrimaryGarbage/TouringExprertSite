<?php
    function IsInjected($str)
    {
        $injections = array('(\n+)',
            '(\r+)',
            '(\t+)',
            '(%0A+)',
            '(%0D+)',
            '(%08+)',
            '(%09+)'
            );
                
        $inject = join('|', $injections);
        $inject = "/$inject/i";
        
        if(preg_match($inject,$str))
        {
        return true;
        }
        else
        {
        return false;
        }
    }

    if(IsInjected($visitor_email))
    {
        echo "Bad email value!";
        exit;
    }

    $name = $_POST['name'];
    $visitor_email = $_POST['email'];
    $message = $_POST['message'];

    $to = "artstudioexp@gmail.com";
    $from_email = "kv@artstudiopro.com";
    $subject = "New Touring Expert website visitor email.";
    $headers = "From: $from_email \r\n";
    $headers .= "Reply-To: $visitor_email \r\n";
    $email_body = "You have received a new message from the user $name.\n".
    "Here is the message:\n\n$message\n\n"."Reply to: $visitor_email";

    if(mail($to, $subject, $email_body, $headers))
    {
        include "./email_success.html";
    }
    else
    {
        include "./email_failure.html";
    }
?>