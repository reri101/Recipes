json.array! @categories do |category|
  json.extract! category, :id, :name

  if category.photo.present?
    json.photo do
      json.id category.photo.id
      json.name category.photo.file_data.filename.to_s
      if category.photo.file_data.attached?
        json.url category.photo.file_url
      end
    end
  end
end