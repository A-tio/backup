<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $table = 'menu_tb';
    protected $primaryKey = 'menu_id';

    use HasFactory;
    public $timestamps = true;

    protected $fillable = [
        'menu_name',
        'menu_price'
    ];

    // public function menu () {
    //     return $this->hasMany(Menu::class, 'menu_id');
    // }

}
