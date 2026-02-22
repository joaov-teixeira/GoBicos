<?php

namespace App\Http\Controllers;

use App\Models\Avaliacao;
use Illuminate\Http\Request;

class AvaliacaoController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'candidatura_id' => 'required|exists:candidaturas,id',
            'avaliador_id' => 'required|exists:users,id',
            'avaliado_id' => 'required|exists:users,id',
            'nota' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string'
        ]);

        // Verifica se já avaliou essa candidatura antes
        $jaAvaliou = Avaliacao::where('candidatura_id', $request->candidatura_id)
                              ->where('avaliador_id', $request->avaliador_id)->first();

        if ($jaAvaliou) {
            return response()->json(['message' => 'Você já avaliou este serviço.'], 400);
        }

        $avaliacao = Avaliacao::create($request->all());

        return response()->json($avaliacao, 201);
    }
}