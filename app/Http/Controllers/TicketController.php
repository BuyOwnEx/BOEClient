<?php

namespace App\Http\Controllers;

use Huddle\Zendesk\Facades\Zendesk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public $priorities = ["urgent", "high", "normal", "low"];
    public $statuses = ["new", "open", "pending", "hold", "solved", "closed"];
    public $tags = ["support", "finance", "tech"];

    public function getPriorities()
    {
        return ['success' => true, 'priorities' => $this->priorities];
    }
    public function getStatuses()
    {
        return ['success' => true, 'statuses' => $this->statuses];
    }
    public function getTags()
    {
        return ['success' => true, 'tags' => $this->tags];
    }


    public function getAllTickets(Request $request)
    {
        try {
            $tickets = Zendesk::users(Auth::id())->tickets()->requested();
            return ['success' => true, 'tickets' => $tickets];
        }
        catch (\Exception $e)
        {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getAllTicketComments(Request $request)
    {
        try {
            $comments = Zendesk::tickets($request->id)->comments()->findAll();
            return ['success' => true, 'comments' => $comments];
        }
        catch (\Exception $e)
        {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function createTicket(Request $request)
    {
        try {
            $ticket = Zendesk::tickets()->create([
                'subject' => $request->subject,
                'comment' => [
                    'body' => $request->body
                ],
                'priority' => $request->priority,
                'requester_id'=> Auth::id()
            ]);
            return ['success' => true, 'ticket' => $ticket];
        }
        catch (\Exception $e)
        {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
