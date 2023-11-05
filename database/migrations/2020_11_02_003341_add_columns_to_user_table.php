<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->integer('rate_limit')->default(60);
            $table->dateTime('last_login_at')->nullable();
            $table->string('invite_code',128)->nullable();
            $table->boolean('blocked')->default(false);
            $table->boolean('g2fa')->default(false);
            $table->string('g2fa_secret',255)->nullable();
            $table->string('language',5)->default('en');
            $table->string('last_ip',128)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('rate_limit');
            $table->dropColumn('last_login_at');
            $table->dropColumn('invite_code');
            $table->dropColumn('blocked');
            $table->dropColumn('g2fa');
            $table->dropColumn('g2fa_secret');
            $table->dropColumn('language');
            $table->dropColumn('last_ip');
        });
    }
};
