json.extract! @ingredient, :id, :name, :unit

if @ingredient.photo.present?
  json.photo do
    json.id @ingredient.photo.id
    json.name @ingredient.photo.file_data.filename.to_s
    if @ingredient.photo.file_data.attached?
      json.url @ingredient.photo.file_url
    end
  end
end
