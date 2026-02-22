<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bico extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo', 'descricao', 'valor', 'data_hora', 'data_hora_termino', 'status', 'empresa_id', 'localizacao', 'requisitos'
    ];

    // >>>> liga a vaga à empresa que a criou
    public function empresa()
    {
        return $this->belongsTo(User::class, 'empresa_id');
    }

    public function candidaturas()
    {
        return $this->hasMany(Candidatura::class, 'bico_id');
    }
}