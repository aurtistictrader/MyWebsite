<?php
 
if(isset($_POST['email'])) {
 
    $email_to = "cwpeng@uwaterloo.ca";
 
    $email_subject = "RE: Website Mail!";

    function died($error) {
 
        // your error code can go here
 
        echo "ERROR ";
 
        echo $error."<br /><br />";
 
        die();
 
    }
 
    // validation expected data exists
 
    if( !isset($_POST['contactName']) ||
 
        !isset($_POST['email']) ||
 
        !isset($_POST['comments'])) {
 
        died('Error!');       
 
    }
 
    $name = $_POST['contactName']; // required
 
    $email_from = $_POST['email']; // not required
 
    $message = $_POST['comments']; // required
 
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
 
    $email_message = "Form details below.\n\n";
 
    function clean_string($string) {
 
      $bad = array("content-type","bcc:","to:","cc:","href");
 
      return str_replace($bad,"",$string);
 
    }
 
    $email_message .= "Name: ".clean_string($name)."\n";
 
    $email_message .= "Email: ".clean_string($email_from)."\n";
 
    $email_message .= "Message: ".clean_string($message)."\n";
 
// create email headers
 
$headers = 'From: '.$email_from."\r\n".
 
'Reply-To: '.$email_from."\r\n" .
 
'X-Mailer: PHP/' . phpversion();
 
@mail($email_to, $email_subject, $email_message, $headers);  
 
?>
 
Thank you. I will respond ASAP!
 
<?php
 
}
 
?>