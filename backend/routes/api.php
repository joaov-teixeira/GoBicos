<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BicoController;
use App\Http\Controllers\CandidaturaController;
use App\Http\Controllers\AuthController;

// Rota de teste para ver se a API está viva
Route::get('/ping', function () {
    return response()->json(['mensagem' => 'API do GoBicos rodando perfeitamente!']);
});
// Rota de Autenticação Aberta (Qualquer um pode tentar logar)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
// Rotas do sistema
Route::apiResource('bicos', BicoController::class);
Route::apiResource('candidaturas', CandidaturaController::class);

// Rota de Logout (Precisa estar logado para sair)
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
    });

// Rotas do sistema (CRUD automático)
Route::apiResource('bicos', BicoController::class);
Route::apiResource('candidaturas', CandidaturaController::class);

// Rota para pegar os dados do usuário logado (Protegida)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::put('/candidaturas/{id}', [App\Http\Controllers\CandidaturaController::class, 'update']);
Route::get('/candidaturas/{id}/mensagens', [App\Http\Controllers\MensagemController::class, 'index']);
Route::post('/candidaturas/{id}/mensagens', [App\Http\Controllers\MensagemController::class, 'store']);
Route::post('/avaliacoes', [App\Http\Controllers\AvaliacaoController::class, 'store']);
Route::put('/users/{id}', [App\Http\Controllers\UserController::class, 'update']);