<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $dados = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'tipo' => 'required|in:empresa,freelancer',
            'localizacao' => 'required|string',
            'sobre' => 'nullable|string'
        ]);

        $dados['password'] = bcrypt($dados['password']);
        
        $user = User::create($dados);
        $token = $user->createToken('token-gobicos')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user
        ], 201);
    }
    
    public function login(Request $request)
    {
        // 1. Valida se o e-mail e senha foram enviados
        $credenciais = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // 2. Tenta fazer o login
        if (Auth::attempt($credenciais)) {
            
            /** @var \App\Models\User $user */
            $user = Auth::user();
            
            // 3. Cria o Token de segurança (Sanctum)
            $token = $user->createToken('token-gobicos')->plainTextToken;

            // 4. Devolve o token e os dados do usuário para o React
            return response()->json([
                'token' => $token,
                'user' => $user
            ], 200);
        }

        // Se a senha estiver errada
        return response()->json(['message' => 'E-mail ou senha incorretos.'], 401);
    }

    public function logout(Request $request)
    {
        // Destrói o token atual
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout realizado com sucesso.']);
    }
}