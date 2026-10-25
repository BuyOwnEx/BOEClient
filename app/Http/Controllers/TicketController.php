<?php

namespace App\Http\Controllers;

use App\Library\BuyOwnExClientAPI;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
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

    public function getAllTopics()
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_support_topics();
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
            'priority' => 'nullable|string|in:low,medium,high',
            'topic' => 'nullable|string|min:1|max:64',
            'files.*' => $this->ticket_file_validation_rule(),
        ], [], [
            'title' => __('tickets.validation.title'),
            'message' => __('tickets.validation.message'),
            'priority' => __('tickets.validation.priority'),
            'topic' => __('tickets.validation.topic'),
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
                $paths = null;
                if ($request->hasFile('files'))
                {
                    $stored = $this->store_ticket_files(
                        $request->file('files'),
                        'tickets/'.config('app.client_id').'/'.Auth::id()
                    );
                    if (isset($stored['error'])) {
                        return $stored['error'];
                    }
                    $paths = $stored['paths'];
                }

                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->ticket_create(
                    Auth::id(),
                    $request->title,
                    $request->message,
                    $request->priority,
                    $request->topic,
                    $paths
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
            'files.*' => $this->ticket_file_validation_rule(),
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
                $paths = null;
                if ($request->hasFile('files'))
                {
                    $stored = $this->store_ticket_files(
                        $request->file('files'),
                        'tickets/'.config('app.client_id').'/'.Auth::id().'/ticket/'.$request->ticket_id
                    );
                    if (isset($stored['error'])) {
                        return $stored['error'];
                    }
                    $paths = $stored['paths'];
                }

                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->ticket_add_comment(
                    Auth::id(),
                    $request->ticket_id,
                    $request->message,
                    $paths
                );
            }
            catch (Exception $e)
            {
                return ['success'=>false, 'message'=>$e->getMessage()];
            }
        }
    }

    private function ticket_file_validation_rule(): string
    {
        return 'nullable|file|max:15360'
            .'|mimetypes:image/jpeg,image/png,application/pdf,application/msword,'
            .'application/vnd.openxmlformats-officedocument.wordprocessingml.document,'
            .'application/zip,application/x-zip-compressed'
            .'|extensions:jpg,jpeg,png,pdf,doc,docx,zip';
    }

    /**
     * @param  array<int, UploadedFile>  $files
     * @return array{paths?: array<int, array<string, mixed>>, error?: mixed}
     */
    private function store_ticket_files(array $files, string $directory): array
    {
        foreach ($files as $key => $file) {
            if (!$file->isValid()) {
                return ['error' => ['success' => false, 'message' => 'Error while uploading files']];
            }
            $contentError = $this->validate_ticket_image_contents($file);
            if ($contentError !== null) {
                return [
                    'error' => response()->json([
                        'success' => false,
                        'errors' => ['files.'.$key => [$contentError]],
                    ], 422),
                ];
            }
        }

        $paths = [];
        foreach ($files as $file) {
            $extension = $file->extension();
            $fileName = $this->sanitize_ticket_file_name($file, $extension);
            $sizeBytes = $file->getSize();
            $sizeMb = round($sizeBytes / 1048576, 2, PHP_ROUND_HALF_DOWN);

            $path = Storage::putFileAs($directory, $file, $fileName);
            $paths[] = [
                'name' => $fileName,
                'size_bytes' => $sizeBytes,
                'size_mb' => $sizeMb,
                'extension' => $extension,
                'path' => $path,
            ];
        }

        return ['paths' => $paths];
    }

    private function sanitize_ticket_file_name(UploadedFile $file, string $extension): string
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $originalName = str_replace("\0", '', (string) $originalName);
        $originalName = preg_replace('/[^\p{L}\p{N}._-]+/u', '_', $originalName) ?? '';
        $originalName = trim($originalName, '._-');
        if ($originalName === '') {
            $originalName = 'file';
        }
        $originalName = mb_substr($originalName, 0, 100);

        return $originalName.'.'.$extension;
    }

    /**
     * Extra content checks for images: valid image structure + no embedded PHP/script.
     * Non-image allowed types rely on mimetypes/extensions rules.
     */
    private function validate_ticket_image_contents(UploadedFile $file): ?string
    {
        $mime = $file->getMimeType();
        if (!in_array($mime, ['image/jpeg', 'image/png'], true)) {
            return null;
        }

        $path = $file->getRealPath();
        if (!$path || !is_readable($path)) {
            return 'Error while uploading files';
        }

        if (@getimagesize($path) === false) {
            return 'Invalid image content';
        }

        $contents = file_get_contents($path);
        if ($contents === false) {
            return 'Error while uploading files';
        }

        if (preg_match('/<\?(?:php|=)|<script[\s>]/i', $contents)) {
            return 'Executable or script content is not allowed';
        }

        return null;
    }
}
