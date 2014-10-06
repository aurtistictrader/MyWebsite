<?php

require('../vendor/autoload.php');

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$app = new Silex\Application();

$app->register(new Silex\Provider\TwigServiceProvider(), array(
  'twig.path' => __DIR__.'/../views',
));

// Our web handlers
$app->get('/', function() use($app) {
  return $app['twig']->render('index.twig');
});
$app->post('/email', function(Request $request) {
	$sendgrid = new SendGrid('ENTER_USERNAME', 'ENTER_PASS');

	$message = new SendGrid\Email();
	$message->addTo('cwpeng@uwaterloo.ca')->
	          setFrom($request->get('email'))->
	          setFromName($request->get('contactName'))->
	          setSubject('RE: Website Email')->
	          setText($request->get('comments'));
	$response = $sendgrid->send($message);
	
    return new Response('Thank you for the contact!', 201);
});
$app->run();

?>
