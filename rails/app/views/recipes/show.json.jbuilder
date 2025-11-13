json.extract! @recipe, :id, :name, :description, :preparation_time

json.category do
  json.id @recipe.category.id
  json.name @recipe.category.name
end

if @recipe.photo.present?
  json.photo do
    json.id @recipe.photo.id
    json.name @recipe.photo.file_data.filename.to_s
    json.url @recipe.photo.file_url if @recipe.photo.file_data.attached?
  end
end

json.tags @recipe.tags.map { |tag| { id: tag.id, name: tag.name } }

json.ingredients @recipe.recipes_ingredients.map do |ri|
  json.id ri.id
  json.ingredient_id ri.ingredient.id
  json.name ri.ingredient.name
  json.unit ri.ingredient.unit
  json.amount ri.amount
  
  if ri.ingredient.photo.present?
    json.photo do
      json.id ri.ingredient.photo.id
      json.name ri.ingredient.photo.file_data.filename.to_s
      json.url ri.ingredient.photo.file_url if ri.ingredient.photo.file_data.attached?
    end
  end
end
