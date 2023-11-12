@extends('layouts.admin')

@section('title')
PteroX Config
@endsection

@section('content-header')
<h1>PteroX Config<small>Set different config</small></h1>
<ol class="breadcrumb">
    <li><a href="{{ route('admin.index') }}">Admin</a></li>
    <li class="active">PteroX Config</li>
</ol>
@endsection

@section('content')
<div class="row">
    <!-- <div class="col-xs-12">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">Config</h3>
                    </div>
                    <div class="box-body table-responsive no-padding">
                        <table class="table table-hover">
                            <form method="POST" action="{{ route('admin.pterox.config.post') }}">
                                @csrf

                                @foreach($settings as $setting)
                                <tr>
                                    <td>
                                        <label for="{{ $setting->name }}" class="control-label">{{ $setting->pretty_name }} <code> {{ $setting->desc }} </code></label>
                                        <div>
                                            <input type="text" autocomplete="off" name="{{ $setting->name }}" class="form-control" value="{{ $setting->value }}" />
                                            <p class="text-muted"><small>Meant to be a link, trailing slash is only required if it is a directory on the webserver: <code>https://gbnodes.com/</code> or <code>https://gbnodes.com/client/plugin/support_manager/knowledgebase/</code>.</small></p>
                                        </div>
                                    </td>
                                </tr>
                                @endforeach
                                <tr><td>
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                                </td></tr>
                            </form>
                        </table>
                    </div>
                </div>
            </div>
        </div> -->
    <form method="POST" action="{{ route('admin.pterox.config.post') }}">
        @csrf

        @foreach($settings as $setting)
        <div class="col-sm-4">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">{{ $setting->pretty_name }}</h3>
                </div>
                <div class="box-body row">
                    <div class="form-group col-sm-12">
                     <code style="margin-bottom: 5px;"> {{ $setting->desc }} </code>
                        <div>
                            <input type="text" autocomplete="off" name="{{ $setting->name }}" class="form-control" value="{{ $setting->value }}" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        @endforeach
        <div class="col-xs-12">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">Submit</h3>
                </div>
                <div class="box-body row">
                    <div class="form-group col-sm-12">
                        <div>
                            <p>Meant to be config, a trailing slash is only required if it is a directory on the webserver: <code>https://gbnodes.com/</code> or <code>https://gbnodes.com/client/plugin/support_manager/knowledgebase/</code>.</p>
                        </div>
                    </div>
                </div>
                <div class="box-footer">
                    <button type="submit" class="btn btn-primary pull-right">Save Changes</button>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection