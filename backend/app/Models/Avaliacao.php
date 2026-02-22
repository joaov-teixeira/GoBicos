<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Avaliacao extends Model
{
    use HasFactory;
    
    protected $table = 'avaliacoes';
    protected $fillable = ['candidatura_id', 'avaliador_id', 'avaliado_id', 'nota', 'comentario'];
}