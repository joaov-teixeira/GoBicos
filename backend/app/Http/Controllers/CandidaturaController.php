<?php

namespace App\Http\Controllers;

use App\Models\Candidatura;
use App\Models\User;
use Illuminate\Http\Request;

class CandidaturaController extends Controller
{
    // Função para salvar uma nova candidatura
    public function store(Request $request)
    {
        // 1. Valida se vieram os IDs corretos
        $request->validate([
            'freelancer_id' => 'required|exists:users,id',
            'bico_id' => 'required|exists:bicos,id',
        ]);

        // 2. REGRA DE NEGÓCIO: Verifica se quem está tentando é uma Empresa
        $usuario = User::find($request->freelancer_id);
        if ($usuario->tipo === 'empresa') {
            return response()->json([
                'message' => 'Contas do tipo Empresa não podem se candidatar a vagas.'
            ], 403); // 403 = Proibido
        }

        // 3. Regra Extra: Evitar que o mesmo freelancer se candidate duas vezes na mesma vaga
        $jaCandidatou = Candidatura::where('freelancer_id', $request->freelancer_id)
                                   ->where('bico_id', $request->bico_id)
                                   ->first();

        if ($jaCandidatou) {
            return response()->json([
                'message' => 'Você já enviou uma candidatura para esta vaga.'
            ], 400); // 400 = Requisição inválida
        }

        // 4. Salva no banco de dados!
        $candidatura = Candidatura::create([
            'freelancer_id' => $request->freelancer_id,
            'bico_id' => $request->bico_id,
            'status' => 'pendente'
        ]);

        return response()->json($candidatura, 201); // 201 = Criado com sucesso
    }

    // Busca as candidaturas
    public function index()
    {
        //O 'bico.empresa' faz o Laravel puxar a Vaga e o Dono da Vaga junto!
        return Candidatura::with(['freelancer', 'bico.empresa'])->get();
    }
    // Atualiza o status da candidatura (Aprovar/Recusar)
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:aprovada,recusada,pendente'
        ]);

        $candidatura = Candidatura::find($id);
        
        if (!$candidatura) {
            return response()->json(['message' => 'Candidatura não encontrada'], 404);
        }

        $candidatura->update(['status' => $request->status]);

        return response()->json($candidatura);
    }
}