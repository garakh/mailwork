<?php
namespace PassworkTeam\Mailwork\Controller;
use PassworkTeam\Mailwork\Model\Response;

class IndexController
{
    public function init(\Slim\App $app)
    {
        $app->get('/', function ($request, $response) use($app){
    			
			$content = __DIR__ . '/../../public/landing.html';
			$response->getBody()->write(file_get_contents($content));
            return $response;
        });
		
        $app->get('/iframe/', function ($request, $response) use($app){
    			
			$content = __DIR__ . '/../../public/iframe.html';
			$response->getBody()->write(file_get_contents($content));
            return $response;
        });		
    }
}