@extends('layouts.admin')

@section('title')
    PteroX Info
@endsection

@section('content-header')
    <h1>PteroX Info<small>A bunch of info about the theme in one place</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">PteroX Info</li>
    </ol>
@endsection

@section('content')
    <div class="row">
        <div class="col-xs-12">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">Links</h3>
                    </div>
                    <div class="box-body table-responsive no-padding">
                        <table class="table table-hover">
                            @foreach($settings as $setting)
                            <tr>
                                <td>{{ $setting->pretty_name }}</td>
                                <!-- <td><code data-attr="info-version"><i class="fa fa-refresh fa-fw fa-spin"></i></code></td> -->
                                <td><code data-attr="info-version">{{ $setting->value }}</code></td>
                            </tr>
                            @endforeach
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection