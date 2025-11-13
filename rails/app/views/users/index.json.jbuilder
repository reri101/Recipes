json.array! @users do |user|
  json.extract! user, :id, :name, :surname

  if user.photo.present?
    json.photo do
      json.id user.photo.id
      json.name user.photo.file_data.filename.to_s
      json.url user.photo.file_url if user.photo.file_data.attached?
    end
  end
end
