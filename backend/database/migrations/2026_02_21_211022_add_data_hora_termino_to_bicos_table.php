<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bicos', function (Blueprint $table) {
            // Adiciona a coluna de término logo após a coluna de início
            $table->dateTime('data_hora_termino')->nullable()->after('data_hora');
        });
    }

    public function down(): void
    {
        Schema::table('bicos', function (Blueprint $table) {
            $table->dropColumn('data_hora_termino');
        });
    }
};