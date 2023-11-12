<?php

namespace Pterodactyl\Http\Controllers\Admin\PteroX;

use Illuminate\Http\Request;
use Pterodactyl\Http\Controllers\Controller;
use Illuminate\View\View;
use Illuminate\View\Factory as ViewFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Pterodactyl\Models\PteroX\Settings;

class ConfigController extends Controller
{
    /**
     * PteroX ConfigController constructor.
     */
    public function __construct(
        protected ViewFactory $view
    ) {
    }

    /**
     * Render PteroX Admin Config Index page.
     */
    public function index(): View
    {
        $settings = DB::table('pterox_admin')->get();

        return $this->view->make('admin.pterox.config.index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update PteroX config
     */
    public function post(Request $request)
    {
        $postData = $request->except('_token');

        foreach ($postData as $name => $value) {
            DB::table('pterox_admin')->where('name', $name)->update(['value' => $value]);
        }

        // Return the output for debugging
        return Redirect::route('admin.pterox.config.index');
    }
}
