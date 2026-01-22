<?php

namespace App\Http\Controllers;

use App\Library\BuyOwnExClientAPI;
use Exception;
use Huddle\Zendesk\Facades\Zendesk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TicketController extends Controller
{
    public function getAllTickets(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_tickets(Auth::id());
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getTicketInfo(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_ticket_info(Auth::id(), $request->ticket_id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getTicketFile(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            $res = $api->ticket_attachment(Auth::id(), $request->attachment_id);

            if($res->status() !== 200)
            {
                return ['success'=>false, 'message'=>'Unknown error'];
            }
            else
            {
                $result = json_decode($res->content(), true);
                if(!$result['success'])
                {
                    return ['success'=>false, 'message'=> $result['message']];
                }
                else
                {
                    switch ($result['attachment']['mime_type']) {
                        case 'doc':
                            $mime = 'application/vnd.ms-word';
                            break;
                        case 'docx':
                            $mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                            break;
                        case 'pdf':
                            $mime = 'application/pdf';
                            break;
                        case 'png':
                            $mime = 'image/png';
                            break;
                        case 'jpg':
                        case 'jpeg': // часто используют оба варианта расширения
                            $mime = 'image/jpeg';
                            break;
                        case 'zip':
                            $mime = 'application/zip';
                            break;
                        default:
                            $mime = 'application/octet-stream';
                            break;
                    }
                    if($result['attachment']['type'] === 'comment')
                    {
                        return Storage::download('tickets/'.config('app.client_id').'/'.Auth::id().'/ticket/'.$result['attachment']['ticket_id'].'/'.$result['attachment']['file_name'], basename($result['attachment']['file_name']), [
                            'Content-Description' => 'File Transfer',
                            'Content-Type' => $mime,
                        ]);
                    }
                    else if($result['attachment']['type'] === 'ticket')
                    {
                        return Storage::download('tickets/'.config('app.client_id').'/'.Auth::id().'/'.$result['attachment']['file_name'], basename($result['attachment']['file_name']), [
                            'Content-Description' => 'File Transfer',
                            'Content-Type' => $mime,
                        ]);
                    }
                    else return ['success'=>false, 'message'=>'Unimplemented'];
                }
            }
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getAllTicketAttachments(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_ticket_attachments(Auth::id(), $request->ticket_id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getAllTicketComments(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_ticket_comments(Auth::id(), $request->ticket_id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function createTicket(Request $request)
    {
        $validator=Validator::make($request->all(), [
            'title' => 'required|string|min:1|max:64',
            'message' => 'required|string|min:1|max:4096',
            'priority' => 'required|string|in:low,medium,high',
            'files.*' => 'nullable|mimes:jpg,png,pdf,doc,docx,zip|max:15360'
        ], [], [
            'title' => __('tickets.validation.title'),
            'message' => __('tickets.validation.message'),
            'priority' => __('tickets.validation.priority'),
            'files.*' => __('tickets.validation.files'),
        ]);
        if ($validator->fails())
        {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->getMessages(),
            ],422);
        }
        else
        {
            try
            {
                if ($request->hasFile('files'))
                {
                    foreach($request->file('files') as $key => $file)
                    {
                        if (!$file->isValid()) {
                            return ['success'=>false, 'message'=>'Error while uploading files'];
                        }
                    }

                    $paths = [];
                    foreach($request->file('files') as $key => $file)
                    {
                        $extension = $file->extension(); // получаем реальное расширение из MIME-типа
                        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                        $fileName = $originalName . '.' . $extension;
                        $sizeBytes = $file->getSize();
                        $sizeMb = round($sizeBytes / 1048576, 2, PHP_ROUND_HALF_DOWN);

                        $path = Storage::putFileAs(
                            'tickets/'.config('app.client_id').'/'.Auth::id(),
                            $file,
                            $fileName
                        );
                        $paths[] = [
                            'name' => $fileName,
                            'size_bytes' => $sizeBytes,
                            'size_mb' => $sizeMb,
                            'extension' => $extension,
                            'path' => $path
                        ];
                    }
                }

                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->ticket_create(
                    Auth::id(),
                    $request->title,
                    $request->message,
                    $request->priority,
                    $request->hasFile('files') ? $paths : null
                );
            }
            catch (Exception $e)
            {
                return ['success'=>false, 'message'=>$e->getMessage()];
            }
        }
    }
    public function closeTicket(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->ticket_close(
                Auth::id(),
                $request->id
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function addComment(Request $request)
    {
        $validator=Validator::make($request->all(), [
            'ticket_id' => 'required|integer|numeric',
            'message' => 'required|string|min:1|max:4096',
            'files.*' => 'nullable|mimes:jpg,png,pdf,doc,docx,zip|max:15360'
        ], [], [
            'ticket_id' => __('tickets.validation.ticket_id'),
            'message' => __('tickets.validation.message'),
            'files.*' => __('tickets.validation.files'),
        ]);
        if ($validator->fails())
        {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->getMessages(),
            ],422);
        }
        else
        {
            try
            {
                if ($request->hasFile('files'))
                {
                    foreach($request->file('files') as $key => $file)
                    {
                        if (!$file->isValid()) {
                            return ['success'=>false, 'message'=>'Error while uploading files'];
                        }
                    }

                    $paths = [];
                    foreach($request->file('files') as $key => $file)
                    {
                        $extension = $file->extension(); // получаем реальное расширение из MIME-типа
                        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                        $fileName = $originalName . '.' . $extension;
                        $sizeBytes = $file->getSize();
                        $sizeMb = round($sizeBytes / 1048576, 2, PHP_ROUND_HALF_DOWN);

                        $path = Storage::putFileAs(
                            'tickets/'.config('app.client_id').'/'.Auth::id().'/ticket/'.$request->ticket_id,
                            $file,
                            $fileName
                        );
                        $paths[] = [
                            'name' => $fileName,
                            'size_bytes' => $sizeBytes,
                            'size_mb' => $sizeMb,
                            'extension' => $extension,
                            'path' => $path
                        ];
                    }
                }

                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->ticket_add_comment(
                    Auth::id(),
                    $request->ticket_id,
                    $request->message,
                    $request->hasFile('files') ? $paths : null
                );
            }
            catch (Exception $e)
            {
                return ['success'=>false, 'message'=>$e->getMessage()];
            }
        }
    }
}
