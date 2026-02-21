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
        Schema::create('candidaturas', function (Blueprint $table) {
        $table->id();
        
        // Relacionamentos
        $table->foreignId('bico_id')->constrained('bicos')->onDelete('cascade');
        $table->foreignId('freelancer_id')->constrained('users')->onDelete('cascade');
        
        $table->enum('status', ['pendente', 'aprovada', 'recusada'])->default('pendente');
        $table->timestamps();

        // Regra: Impede que o mesmo freelancer se candidate 2x na mesma vaga
        $table->unique(['bico_id', 'freelancer_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidaturas');
    }
};
