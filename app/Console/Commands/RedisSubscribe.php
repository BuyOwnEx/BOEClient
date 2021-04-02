<?php

namespace App\Console\Commands;

use Exception;
use Illuminate\Console\Command;
use Predis;

class RedisSubscribe extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'redis:subscribe';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Subscribe to a Redis channel';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        try {
            $client = new Predis\Client([
                'scheme' => 'tcp',
                'host'   => env('SUBSCRIPTION_REDIS_HOST', '127.0.0.1'),
                'port'   => env('SUBSCRIPTION_REDIS_PORT', '6379'),
                'username' => env('SUBSCRIPTION_REDIS_USERNAME', null),
                'password' => env('SUBSCRIPTION_REDIS_PASSWORD', null),
                'read_write_timeout' => -1,
            ]);

            $pubsub = $client->pubSubLoop();
            $pubsub->subscribe('client', 'control');
            foreach ($pubsub as $message) {
                switch ($message->kind) {
                    case 'subscribe':
                        echo "Subscribed to {$message->channel}", PHP_EOL;
                        break;

                    case 'message':
                        if ($message->channel === 'control') {
                            if ($message->payload === 'quit_loop') {
                                echo 'Aborting pubsub loop...', PHP_EOL;
                                $pubsub->unsubscribe();
                            } else {
                                echo "Received an unrecognized command: {$message->payload}.", PHP_EOL;
                            }
                        } else {
                            echo "Received the following message from {$message->channel}:",
                            PHP_EOL, "  {$message->payload}", PHP_EOL, PHP_EOL;
                        }
                        break;
                }
            }
        }
        catch (Exception $e)
        {
            echo "Error: {$e->getMessage()}", PHP_EOL;
        }
    }
}
