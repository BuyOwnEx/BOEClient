<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->integer('rate_limit')->default(60);
            $table->dateTime('lastLoginAt')->nullable();
            $table->string('inviteCode',128)->nullable();
            $table->boolean('blocked')->default(false);
            $table->boolean('g2fa')->default(false);
            $table->string('g2fa_secret',255)->nullable();
            $table->string('language',5)->default('en');
            $table->string('lastIP',128)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('rate_limit');
            $table->dropColumn('lastLoginAt');
            $table->dropColumn('inviteCode');
            $table->dropColumn('blocked');
            $table->dropColumn('g2fa');
            $table->dropColumn('g2fa_secret');
            $table->dropColumn('language');
            $table->dropColumn('lastIP');
        });
    }
}
