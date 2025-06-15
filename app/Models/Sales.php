<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sales extends Model
{
    protected $table = 'sales_tb';
    protected $primaryKey = 'sales_id';

    use HasFactory;
    public $timestamps = true;

    protected $fillable = [
        'menu_id',
        'quantity'
    ];
}
