<?php

namespace App\Http\Controllers;

use App\Models\Mensagem;
use Illuminate\Http\Request;

class MensagemController extends Controller
{
    public function index($candidatura_id)
    {
        // Retorna as mensagens de um chat específico, ordenadas das mais antigas para as mais novas
        return Mensagem::where('candidatura_id', $candidatura_id)->orderBy('created_at', 'asc')->get();
    }

    public function store(Request $request, $candidatura_id)
    {
        $request->validate([
            'remetente_id' => 'required|exists:users,id',
            'conteudo' => 'required|string'
        ]);

        $mensagem = Mensagem::create([
            'candidatura_id' => $candidatura_id,
            'remetente_id' => $request->remetente_id,
            'conteudo' => $request->conteudo
        ]);

        return response()->json($mensagem, 201);
    }
}