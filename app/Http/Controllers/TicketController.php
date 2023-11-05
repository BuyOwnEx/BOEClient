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
            $tickets = Zendesk::search()->find('type:ticket requester:'.Auth::user()->name);
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
            $comments = Zendesk::tickets($request->id)->comments()->sideload(['users'])->findAll();
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
            if($request->file)
            {
                $attachment = Zendesk::attachments()->upload([
                    'file' => $request->file,
                    'name' => $request->file('file')->getClientOriginalName()
                ]);
                if($attachment->upload->token)
                {
                    $ticket = Zendesk::tickets()->create([
                        'subject' => $request->subject,
                        'comment' => [
                            'body' => $request->body,
                            'uploads' => [$attachment->upload->token]
                        ],
                        'priority' => $request->priority,
                        'requester' => array(
                            'name' => Auth::user()->name,
                            'email' => Auth::user()->email,
                        ),
                    ]);
                    return ['success' => true, 'ticket' => $ticket];
                }
                else {
                    return ['success' => false, 'message' => 'File upload error'];
                }
            }
            $ticket = Zendesk::tickets()->create([
                'subject' => $request->subject,
                'comment' => [
                    'body' => $request->body
                ],
                'priority' => $request->priority,
                'requester' => array(
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                ),
            ]);
            return ['success' => true, 'ticket' => $ticket];
        }
        catch (\Exception $e)
        {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function addComment(Request $request)
    {
        try {
            if($request->file)
            {
                $attachment = Zendesk::attachments()->upload([
                    'file' => $request->file,
                    'name' => $request->file('file')->getClientOriginalName()
                ]);
                if($attachment->upload->token)
                {
                    $params = array('query' => 'email:'.Auth::user()->email.' name:'.Auth::user()->name);
                    $search = Zendesk::users()->search($params);
                    if (empty($search->users)) {
                        return ['success' => false, 'message' => 'User not found'];
                    } else {
                        $ticket = Zendesk::tickets()->update($request->id, [
                            'comment' => [
                                'body' => $request->body,
                                'author_id' => $search->users[0]->id,
                                'uploads' => [$attachment->upload->token]
                            ]
                        ]);
                        return ['success' => true, 'ticket' => $ticket];
                    }
                }
                else {
                    return ['success' => false, 'message' => 'File upload error'];
                }
            }
            $params = array('query' => 'email:'.Auth::user()->email.' name:'.Auth::user()->name);
            $search = Zendesk::users()->search($params);
            if (empty($search->users)) {
                return ['success' => false, 'message' => 'User not found'];
            } else {
                $ticket = Zendesk::tickets()->update($request->id, [
                    'comment' => [
                        'body' => $request->body,
                        'author_id' => $search->users[0]->id,
                    ]
                ]);
                return ['success' => true, 'ticket' => $ticket];
            }
        }
        catch (\Exception $e)
        {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function closeTicket(Request $request)
    {
        try {
            $ticket = Zendesk::tickets()->update($request->id, [
                'status' => 'closed',
            ]);
            return ['success' => true, 'ticket' => $ticket];
        }
        catch (\Exception $e)
        {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
