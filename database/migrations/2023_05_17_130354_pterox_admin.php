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
    public function up()
    {
        // Create table
        Schema::create('pterox_admin', function (Blueprint $table) {
            $table->id();
            $table->string('name');

            $table->string('pretty_name');

            $table->string('value');

            $table->string('type');
            $table->string('desc');
            $table->timestamps();
        });

        // Add default rows
        DB::table('pterox_admin')->insert([
            ['type' => 'link', 'name' => 'knowledge', 'pretty_name' => 'Knowledge Base Link', 'value' => 'https://pterox.webpool.tech/', 'desc' => 'Knowledge base button link'],
            ['type' => 'link', 'name' => 'discord', 'pretty_name' => 'Discord Link', 'value' => 'https://discord.webpool.tech/', 'desc' => 'Discord button link'],
            ['type' => 'link', 'name' => 'billing', 'pretty_name' => 'Billing Link', 'value' => 'https://pterox.webpool.tech/', 'desc' => 'Billing button link'],
            ['type' => 'link', 'name' => 'phpmyadmin', 'pretty_name' => 'PhpMyAdmin Link', 'value' => '/phpmyadmin', 'desc' => 'PhpMyAdmin button link'],
            ['type' => 'link', 'name' => 'status', 'pretty_name' => 'Status Link', 'value' => '/status', 'desc' => 'Status button link'],
            ['type' => 'console', 'name' => 'consoleuser', 'pretty_name' => 'Console User', 'value' => 'panel@pterox', 'desc' => 'Name That Shows in console'],
            ['type' => 'ipaddress', 'name' => 'iphider', 'pretty_name' => 'IP Hider', 'value' => 'Yes', 'desc' => 'Hide IP from server console'],
            ['type' => 'images', 'name' => 'logo', 'pretty_name' => 'Logo Image', 'value' => '/pterox/images/logo.png', 'desc' => 'Logo link or public directory from panel'],
            ['type' => 'images', 'name' => 'login', 'pretty_name' => 'Login Image', 'value' => '/pterox/images/login.png', 'desc' => 'Login link or public directory from panel'],
            ['type' => 'images', 'name' => 'avatar', 'pretty_name' => 'Avatar Image', 'value' => 'https://pterox.webpool.tech/pterox/images/avatar.png', 'desc' => 'Sidebar Avatar link'],
            ['type' => 'images', 'name' => 'loading', 'pretty_name' => 'Loading Gif', 'value' => 'https://pterox.webpool.tech/pterox/images/loading.gif', 'desc' => 'Loading Page Gif or image link']
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Drop the table
        Schema::dropIfExists('pterox_admin');
    }
};
