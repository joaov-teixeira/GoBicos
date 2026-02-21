<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Adiciona campos no Usuário
        Schema::table('users', function (Blueprint $table) {
            $table->string('localizacao')->nullable();
            $table->text('sobre')->nullable();
        });

        // Adiciona campos na Vaga (Bico)
        Schema::table('bicos', function (Blueprint $table) {
            $table->string('localizacao')->nullable();
            $table->text('requisitos')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['localizacao', 'sobre']);
        });
        Schema::table('bicos', function (Blueprint $table) {
            $table->dropColumn(['localizacao', 'requisitos']);
        });
    }
};