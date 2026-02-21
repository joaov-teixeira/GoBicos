<?php

namespace App\Http\Controllers;

use App\Models\Bico;
use Illuminate\Http\Request;

class BicoController extends Controller
{
    // 1. Retorna todas as vagas
    public function index()
    {
        return Bico::with('empresa')->get();
    }

    // 2. Salva uma nova vaga
    public function store(Request $request)
    {
        // localizacao e requisitos na validação:
        $request->validate([
            'titulo' => 'required|string',
            'descricao' => 'required|string',
            'valor' => 'required|numeric',
            'data_hora' => 'required|date',
            'empresa_id' => 'required|exists:users,id',
            'localizacao' => 'required|string', // campo obrigatório
            'requisitos' => 'nullable|string'   // campo opcional
        ]);

        $bico = Bico::create($request->all());

        return response()->json($bico, 201);
    }

    // 3. Mostra uma vaga específica
    public function show($id)
    {
        $bico = Bico::with('empresa')->find($id);
        if (!$bico) {
            return response()->json(['message' => 'Vaga não encontrada'], 404);
        }
        return response()->json($bico);
    }

    // 4. Edita uma vaga
    public function update(Request $request, $id)
    {
        $bico = Bico::find($id);
        if (!$bico) {
            return response()->json(['message' => 'Vaga não encontrada'], 404);
        }

        $request->validate([
            'titulo' => 'sometimes|required|string',
            'descricao' => 'sometimes|required|string',
            'valor' => 'sometimes|required|numeric',
            'data_hora' => 'sometimes|required|date',
            'status' => 'sometimes|required|in:aberta,fechada',
            'localizacao' => 'sometimes|required|string',
            'requisitos' => 'nullable|string'
        ]);

        $bico->update($request->all());

        return response()->json($bico);
    }

    // 5. Deleta uma vaga
    public function destroy($id)
    {
        $bico = Bico::find($id);
        if (!$bico) {
            return response()->json(['message' => 'Vaga não encontrada'], 404);
        }

        $bico->delete();

        return response()->json(['message' => 'Vaga deletada com sucesso']);
    }
}