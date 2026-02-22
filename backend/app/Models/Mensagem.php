<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mensagem extends Model
{
    use HasFactory;
    
    // Tabela explícita para evitar erros de plural do Laravel em português
    protected $table = 'mensagens'; 
    protected $fillable = ['candidatura_id', 'remetente_id', 'conteudo'];
}