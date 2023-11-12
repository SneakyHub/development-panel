<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonalSubdomainDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subdomain_manager_personal_details', function (Blueprint $table) {
            $table->id();
            $table->integer('server_id');
            $table->text('cloudflare_email');
            $table->text('cloudflare_apikey');
            $table->text('domain');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subdomain_manager_personal_details');
    }
}
