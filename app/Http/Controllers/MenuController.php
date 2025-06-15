<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        return response()->json(Menu::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'menu_name' => 'required|string|max:255',
            'menu_price' => 'required|numeric'
        ]);

        try {
            $menu = Menu::create([
                'menu_name' => $request->menu_name,
                'menu_price' => $request->menu_price
            ]);

            return response()->json([
                'message' => 'Menu added successfully',
                'data' => $menu
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to add menu: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'menu_name' => 'required|string|max:255',
            'menu_price' => 'required|numeric|min:1'
        ]);

        try {
            $menu = Menu::findOrFail($id);
            
            $menu->update([
                'menu_name' => $request->menu_name,
                'menu_price' => $request->menu_price
            ]);

            return response()->json([
                'message' => 'Menu updated successfully',
                'data' => $menu
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update menu: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $menu = Menu::find($id);
            
            if (!$menu) {
                return response()->json([
                    'error' => 'Menu item not found'
                ], 404);
            }

            $menu->delete();

            return response()->json([
                'success' => true,
                'message' => 'Menu deleted successfully',
                'deleted_id' => $id
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete menu',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}