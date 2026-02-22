<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Função para atualizar os dados do Perfil
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string',
            'localizacao' => 'sometimes|required|string',
            'sobre' => 'nullable|string'
        ]);

        // Atualiza apenas os campos permitidos
        $user->update($request->only(['name', 'localizacao', 'sobre']));

        return response()->json($user);
    }
}