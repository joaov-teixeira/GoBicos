<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'tipo', 'localizacao', 'sobre'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // ==========================================
    // AVALIAÇÕES
    // ==========================================
    
    // 1. "nota_media"
    protected $appends = ['nota_media']; 

    // 2. Busca todas as notas que este usuário RECEBEU
    public function avaliacoesRecebidas()
    {
        return $this->hasMany(Avaliacao::class, 'avaliado_id');
    }

    // 3. Calculando a média matemática das estrelas
    public function getNotaMediaAttribute()
    {
        $media = $this->avaliacoesRecebidas()->avg('nota');
        // Arredonda para 1 casa decimal ou retorna 0.
        return $media ? round($media, 1) : 0; 
    }
}