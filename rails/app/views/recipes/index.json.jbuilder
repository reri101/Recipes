json.array! @recipes do |recipe|
  json.extract! recipe, :id, :name
  json.published_at recipe.created_at

  if recipe.photo.present?
    json.photo do
      json.id recipe.photo.id
      json.name recipe.photo.file_data.filename.to_s
      json.url recipe.photo.file_url if recipe.photo.file_data.attached?
    end
  end
end
