json.extract! @user, :id, :name, :surname, :email, :role

if @user.photo.present?
  json.photo do
    json.id @user.photo.id
    json.name @user.photo.file_data.filename.to_s
    json.url @user.photo.file_url if @user.photo.file_data.attached?
  end
end
