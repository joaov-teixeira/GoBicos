<?php

namespace App\Http\Controllers;

use App\Models\Bico;
use Illuminate\Http\Request;

class BicoController extends Controller
{
    // 1. Retorna as vagas aplicando algoritmo de String Matching se houver busca
    public function index(Request $request)
    {
        $query = Bico::with('empresa');
        $bicos = $query->get();

        // Se o frontend enviar um termo de busca, aplicamos a lógica de similaridade
        if ($request->has('search') && $request->search !== '') {
            $termo = strtolower(trim($request->search));
            $bicos = $bicos->filter(function($bico) use ($termo) {
                $titulo = strtolower($bico->titulo);
                $descricao = strtolower($bico->descricao);

                // 1. Match Exato (Substring): Se a palavra exata estiver lá, é match imediato
                if (str_contains($titulo, $termo) || str_contains($descricao, $termo)) {
                    return true;
                }

                // 2. Algoritmo de Similaridade de Strings
                // Calcula o percentual de semelhança entre o que foi digitado e o título/descrição
                similar_text($termo, $titulo, $percTitulo);
                similar_text($termo, $descricao, $percDesc);

                // Se houver 40% ou mais de similaridade, o algoritmo considera como match>> "faxina" x "faxineira"
                return $percTitulo >= 40 || $percDesc >= 40;
            })->values(); // Reorganiza os índices do array
        }

        return response()->json($bicos);
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
            'requisitos' => 'nullable|string',   // campo opcional
            'data_hora_termino' => 'required|date|after:data_hora',
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
            'requisitos' => 'nullable|string',
            'data_hora_termino' => 'sometimes|required|date|after:data_hora',
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