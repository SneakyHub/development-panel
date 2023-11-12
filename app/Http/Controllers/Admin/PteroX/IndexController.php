<?php

namespace Pterodactyl\Http\Controllers\Admin\PteroX;

use Illuminate\Http\Request;
use Pterodactyl\Http\Controllers\Controller;
use Illuminate\View\View;
use Illuminate\View\Factory as ViewFactory;
use Illuminate\Support\Facades\DB;
use Pterodactyl\Models\PteroX\Settings;

class IndexController extends Controller
{
    /**
     * PteroX IndexController constructor.
     */
    public function __construct(
        protected ViewFactory $view
    ) {
    }

    /**
     * Render PteroX Admin Index page.
     */
    public function index(): View
    {
        $settings = DB::table('pterox_admin')->get();

        return $this->view->make('admin.pterox.index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Return settings for ViewComposer
     */
    public function get_settings()
    {
        $settings = DB::table('pterox_admin')->get();

        return json_encode($settings);
    }
}
