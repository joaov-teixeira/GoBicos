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
        Schema::create('avaliacoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidatura_id')->constrained('candidaturas')->onDelete('cascade');
            $table->foreignId('avaliador_id')->constrained('users')->onDelete('cascade'); // Quem dá a nota
            $table->foreignId('avaliado_id')->constrained('users')->onDelete('cascade'); // Quem recebe a nota
            $table->integer('nota'); // De 1 a 5
            $table->text('comentario')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avaliacaos');
    }
};
