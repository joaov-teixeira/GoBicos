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
        Schema::create('mensagens', function (Blueprint $table) {
            $table->id();
            // Vincula a mensagem ao "Match" (Candidatura)
            $table->foreignId('candidatura_id')->constrained('candidaturas')->onDelete('cascade');
            // Quem enviou (Pode ser o id da empresa ou do freelancer)
            $table->foreignId('remetente_id')->constrained('users')->onDelete('cascade');
            $table->text('conteudo');
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mensagems');
    }
};
