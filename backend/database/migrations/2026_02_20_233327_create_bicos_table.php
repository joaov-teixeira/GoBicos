<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bicos', function (Blueprint $table) {
        $table->id();
        // Relacionamento com o usuário que criou a vaga (Empresa)
        $table->foreignId('empresa_id')->constrained('users')->onDelete('cascade');
        
        $table->string('titulo');
        $table->text('descricao');
        $table->decimal('valor', 8, 2); // PONTO FLU
        $table->dateTime('data_hora');
        $table->enum('status', ['aberta', 'fechada'])->default('aberta');
        
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bicos');
    }
};
