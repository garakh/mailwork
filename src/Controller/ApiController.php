<?php
namespace PassworkTeam\Mailwork\Controller;
use PassworkTeam\Mailwork\Model\Response;

class ApiController
{
    public function init(\Slim\App $app)
    {
        $c = $app->getContainer();
        $metaMiddleware = new MetaMiddleware($c->get('config'));
        $app->group('/api', function () use ($app, $c) {
            $app->post('/findByEmail', function ($request, $response) use ($c) {
                $jsonData = $request->getBody();
                $data = json_decode($jsonData);
                $email = $data->email;
                $mailService = $c->get('mailService');
                $meta = $data->_meta;
                $messages = $mailService->findByEmail($email);
                $view = new Response($messages);
                return $response->withJson($view, 200, JSON_UNESCAPED_UNICODE);
            });
            
            $app->post('/sendEmail', function ($request, $response) use ($c) {
                $mailService = $c->get('mailService');
                $jsonData = $request->getBody();
                $data = json_decode($jsonData);
                $view = new Response($mailService->sendEmail($data->body, $data->subj, $data->to));
                return $response->withJson($view, 200, JSON_UNESCAPED_UNICODE);
            });
            
            $app->post('/getMailboxes', function ($request, $response) use ($c) {
                $mailService = $c->get('mailService');
                $messages = $mailService->getMailboxesNames();
                $view = new Response($messages);
                return $response->withJson($view, 200, JSON_UNESCAPED_UNICODE);
            });
        })->add($metaMiddleware);

    }
}