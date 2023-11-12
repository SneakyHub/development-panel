<?php

namespace Pterodactyl\Http\ViewComposers;
use Illuminate\Support\Facades\DB;

use Illuminate\View\View;
use Pterodactyl\Services\Helpers\AssetHashService;

class AssetComposer
{
    
    /**
     * AssetComposer constructor.
     */
    public function __construct(private AssetHashService $assetHashService)
    {
    }
    
    /**
     * Provide access to the asset service in the views.
     */
    public function compose(View $view): void
    {
        $pterox_settings = DB::table('pterox_admin')->get();
        $view->with('asset', $this->assetHashService);
        $view->with('siteConfiguration', [
            'name' => config('app.name') ?? 'Pterodactyl',
            'locale' => config('app.locale') ?? 'en',
            'recaptcha' => [
                'enabled' => config('recaptcha.enabled', false),
                'siteKey' => config('recaptcha.website_key') ?? '',
            ],
            'pterox_settings' => json_encode($pterox_settings),
        ]);
    }
}
