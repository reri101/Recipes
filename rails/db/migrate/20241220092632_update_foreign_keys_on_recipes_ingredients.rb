class UpdateForeignKeysOnRecipesIngredients < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :recipes_ingredients, :ingredients
    remove_foreign_key :recipes_ingredients, :recipes

    add_foreign_key :recipes_ingredients, :ingredients, on_delete: :cascade
    add_foreign_key :recipes_ingredients, :recipes, on_delete: :cascade
  end
end
