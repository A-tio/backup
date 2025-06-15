<?php

namespace App\Http\Controllers;
use App\Models\Sales;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{
   

    public function store(Request $request){
    try {
        $validated = $request->validate([
            'menu_id' => 'required|exists:menu_tb,menu_id',
            'quantity' => 'required|integer|min:1'
        ]);

        $sale = Sales::create($validated);

        return response()->json([
            'success' => true,
            'data' => $sale,
            'message' => 'Sale recorded successfully'
        ], 201);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
}

     public function index()
    {
        try {
            $data = DB::table('sales_tb')
                ->join('menu_tb', 'sales_tb.menu_id', '=', 'menu_tb.menu_id')
                ->select(
                    'sales_tb.sales_id',
                    'menu_tb.menu_name', 
                    'menu_tb.menu_price', 
                    'sales_tb.quantity',
                    DB::raw('menu_tb.menu_price * sales_tb.quantity as total_price'),
                    'sales_tb.created_at'
                )
                ->orderBy('sales_tb.created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $sale = Sales::findOrFail($id);
            $sale->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Sale deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete sale',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
