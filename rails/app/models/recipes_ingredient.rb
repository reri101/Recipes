# == Schema Information
#
# Table name: recipes_ingredients
#
#  id            :bigint           not null, primary key
#  amount        :float
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  ingredient_id :bigint           not null
#  recipe_id     :bigint           not null
#
# Indexes
#
#  index_recipes_ingredients_on_ingredient_id  (ingredient_id)
#  index_recipes_ingredients_on_recipe_id      (recipe_id)
#
# Foreign Keys
#
#  fk_rails_...  (ingredient_id => ingredients.id) ON DELETE => cascade
#  fk_rails_...  (recipe_id => recipes.id) ON DELETE => cascade
#
class RecipesIngredient < ApplicationRecord
  belongs_to :recipe
  belongs_to :ingredient
end
