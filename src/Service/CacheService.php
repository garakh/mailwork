<?php
namespace PassworkTeam\Mailwork\Service;
use Slim\Container as Container;
use FileSystemCache;

class CacheService
{
    protected $ttl;

    public function __construct(Container $container)
    {
        $cfg = $container->get('config');
        $config = $cfg->get('cache-settings');
        $this->ttl = $config['ttl']? $config['ttl']: 300;
        $path = $config['path'] | '/../cache';
        FileSystemCache::$cacheDir = __DIR__ . $path;
    }

    public function store($email, $data)
    {
        $key = FileSystemCache::generateCacheKey($email);
        FileSystemCache::store($key, $data, $this->ttl);
    }

    public function delete($email){
        $key = FileSystemCache::generateCacheKey($email);
        FileSystemCache::invalidate($key);
    }

    public function retrieve($email)
    {
        $key = FileSystemCache::generateCacheKey($email);
        $data = FileSystemCache::retrieve($key);
        return $data;
    }
}