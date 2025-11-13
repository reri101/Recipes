# == Schema Information
#
# Table name: recipes_tags
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  recipe_id  :bigint           not null
#  tag_id     :bigint           not null
#
# Indexes
#
#  index_recipes_tags_on_recipe_id  (recipe_id)
#  index_recipes_tags_on_tag_id     (tag_id)
#
# Foreign Keys
#
#  fk_rails_...  (recipe_id => recipes.id)
#  fk_rails_...  (tag_id => tags.id)
#
class RecipesTag < ApplicationRecord
  belongs_to :recipe
  belongs_to :tag
end
