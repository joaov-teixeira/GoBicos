<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidatura extends Model
{
    use HasFactory;

    // Libera as colunas para serem salvas
    protected $fillable = [
        'freelancer_id',
        'bico_id',
        'status'
    ];

    // Relacionamentos
    public function freelancer()
    {
        return $this->belongsTo(User::class, 'freelancer_id');
    }

    public function bico()
    {
        return $this->belongsTo(Bico::class, 'bico_id');
    }
}